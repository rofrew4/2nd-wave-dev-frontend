import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet"
import L from "leaflet"
import type { GeoJsonObject } from "geojson"
import type { Permit, ZipRecord } from "../data/zips"
import { useZipData } from "../hooks/useZipData"
import { getScoreMeta } from "./scoreUtils"

const STATUS_COLORS: Record<string, string> = {
  Permitted: "#16a34a",
  Pending: "#f59e0b",
  "Under Review": "#6366f1",
}

const STATUS_ICONS: Record<string, string> = {
  Permitted: "✓",
  Pending: "●",
  "Under Review": "◎",
}

function scaleRadius(units: number): number {
  if (units >= 100) return 16
  if (units >= 60) return 13
  if (units >= 30) return 10
  return 8
}

function isRecent(filed: string, days: number): boolean {
  const filedDate = new Date(filed)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return filedDate >= cutoff
}

function ImperativeLayer({
  geoJson,
  zipsByCode,
  permits,
}: {
  geoJson: GeoJSON.FeatureCollection | null
  zipsByCode: Map<string, ZipRecord>
  permits: Permit[]
}) {
  const map = useMap()
  const layersRef = useRef<L.LayerGroup[]>([])

  useEffect(() => {
    layersRef.current.forEach((l) => map.removeLayer(l))
    layersRef.current = []
    if (!geoJson || !geoJson.features.length) return

    const tempLayer = L.geoJSON(geoJson as GeoJsonObject)
    map.fitBounds(tempLayer.getBounds(), { padding: [60, 60] })

    const polygons = L.geoJSON(geoJson as GeoJsonObject, {
      style: (feature) => {
        const zip = feature?.properties?.zip as string | undefined
        const zr = zip ? zipsByCode.get(zip) : undefined
        const sm = getScoreMeta(zr?.score ?? 0)
        return { color: sm.color, weight: 1.5, fillColor: sm.color, fillOpacity: 0.18 }
      },
    }).addTo(map)

    const markers = L.layerGroup()
    for (const p of permits) {
      const color = STATUS_COLORS[p.status] ?? "#94a3b8"
      const icon = STATUS_ICONS[p.status] ?? "?"
      const r = scaleRadius(p.units)
      const size = r * 2

      const divIcon = L.divIcon({
        className: "permit-marker",
        html: `<div class="permit-pin" style="width:${size}px;height:${size}px;background:${color}"><span class="permit-icon">${icon}</span></div><div class="permit-label">${p.units}</div>`,
        iconSize: [size, size + 14],
        iconAnchor: [r, r],
      })

      const zr = zipsByCode.get(p.zip)
      const marker = L.marker([p.lat, p.lng], { icon: divIcon, interactive: true, zIndexOffset: p.units })
      marker.bindTooltip(`<div style="min-width:200px">
        <div style="font-size:13px;font-weight:700">${p.addr}</div>
        <div style="font-size:11px;color:#64748b">ZIP ${p.zip} · ${zr?.name ?? ""}</div>
        <div style="margin-top:5px;display:flex;align-items:center;gap:5px">
          <span style="width:8px;height:8px;border-radius:50%;background:${color};display:inline-block"></span>
          <span style="font-size:11px;font-weight:600">${p.status}</span>
        </div>
        <div style="margin-top:5px;display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:10px">
          <div><span style="color:#94a3b8">Units</span><br/><b>${p.units}</b></div>
          <div><span style="color:#94a3b8">Type</span><br/><b>${p.type}</b></div>
          <div><span style="color:#94a3b8">Developer</span><br/><b>${p.dev}</b></div>
          <div><span style="color:#94a3b8">Est. Delivery</span><br/><b>${p.est}</b></div>
        </div>
        <div style="margin-top:5px;font-size:10px;color:#94a3b8">Filed ${p.filed}</div>
      </div>`, { direction: "top", offset: [0, -r - 4], opacity: 1, className: "zip-tooltip" })
      marker.addTo(markers)
    }
    markers.addTo(map)

    layersRef.current = [polygons as unknown as L.LayerGroup, markers]
    return () => {
      layersRef.current.forEach((l) => map.removeLayer(l))
      layersRef.current = []
    }
  }, [geoJson, zipsByCode, permits, map])
  return null
}

type SupplyTrackerProps = {
  permits: Permit[]
  zips: ZipRecord[]
  dateFilter: number
}

export function SupplyTracker({ permits, zips, dateFilter }: SupplyTrackerProps) {
  const { geoJson, isLoading } = useZipData()
  const zipsByCode = useMemo(() => new Map(zips.map((z) => [z.zip, z])), [zips])
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const supplyPermits = useMemo(() => {
    let filtered = permits.filter((p) => p.category === "new-construction")
    if (dateFilter > 0) filtered = filtered.filter((p) => isRecent(p.filed, dateFilter))
    if (statusFilter !== "all") filtered = filtered.filter((p) => p.status === statusFilter)
    return filtered.sort((a, b) => b.filed.localeCompare(a.filed))
  }, [permits, dateFilter, statusFilter])

  const totalUnits = supplyPermits.reduce((s, p) => s + p.units, 0)

  const handleStatusFilter = useCallback((s: string) => setStatusFilter(s), [])

  return (
    <div className="flex h-full">
      <div className="flex w-[380px] shrink-0 flex-col border-r border-[#e2e8f0] bg-white">
        <div className="border-b border-[#e2e8f0] p-3">
          <h2 className="text-sm font-semibold text-[#0f172a]">Supply Tracker</h2>
          <p className="mt-0.5 text-[11px] text-[#64748b]">New construction + foundation permits</p>
          <div className="mt-2 flex gap-2 text-[10px]">
            <span className="rounded-md bg-[#f1f5f9] px-2 py-1 font-semibold text-[#334155]">{supplyPermits.length} permits</span>
            <span className="rounded-md bg-[#f1f5f9] px-2 py-1 font-semibold text-[#334155]">{totalUnits.toLocaleString()} units</span>
          </div>
          <div className="mt-2 flex gap-1">
            {["all", "Permitted", "Pending", "Under Review"].map((s) => (
              <button key={s} type="button" onClick={() => handleStatusFilter(s)}
                className={`rounded-md px-2 py-1 text-[10px] font-medium transition ${statusFilter === s ? "bg-[#eff6ff] text-[#2563eb]" : "text-[#64748b] hover:bg-[#f8fafc]"}`}>
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {supplyPermits.map((p) => {
            const color = STATUS_COLORS[p.status] ?? "#94a3b8"
            const recent = isRecent(p.filed, 30)
            return (
              <div key={p.id} className={`border-b border-[#f1f5f9] px-3 py-2.5 hover:bg-[#f8fafc] ${recent ? "border-l-2 border-l-[#2563eb]" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-[#0f172a]">{p.addr}</p>
                    <p className="text-[10px] text-[#64748b]">ZIP {p.zip} · {p.dev}</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold text-white" style={{ backgroundColor: color }}>
                    {p.status}
                  </span>
                </div>
                <div className="mt-1.5 flex gap-3 text-[10px] text-[#475569]">
                  <span><b>{p.units}</b> units</span>
                  <span>{p.type}</span>
                  <span>Est. {p.est}</span>
                </div>
                <div className="mt-1 text-[9px] text-[#94a3b8]">Filed {p.filed}{recent ? " · 🔵 Last 30 days" : ""}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="relative flex-1">
        <MapContainer center={[25.86, -80.16]} zoom={12} zoomControl={false} preferCanvas className="h-full w-full">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap &copy; CARTO' />
          <ZoomControl position="bottomright" />
          <ImperativeLayer geoJson={geoJson} zipsByCode={zipsByCode} permits={supplyPermits} />
        </MapContainer>
        {isLoading && (
          <div className="pointer-events-none absolute inset-0 z-[700] flex items-center justify-center bg-[#f1f5f9]/65">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#cbd5e1] border-t-[#2563eb]" />
          </div>
        )}
      </div>
    </div>
  )
}
