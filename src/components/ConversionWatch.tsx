import { useEffect, useMemo, useRef } from "react"
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

const TYPE_LABELS: Record<string, { short: string; color: string }> = {
  "Hotel-to-Resi": { short: "H→R", color: "#7c3aed" },
  "Hotel-to-Condo": { short: "H→C", color: "#dc2626" },
  "Retail-to-Resi": { short: "R→R", color: "#2563eb" },
  "Office-to-Resi": { short: "O→R", color: "#0891b2" },
  "Warehouse-to-Resi": { short: "W→R", color: "#ea580c" },
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
      const sc = STATUS_COLORS[p.status] ?? "#94a3b8"
      const tl = TYPE_LABELS[p.type] ?? { short: "CV", color: "#475569" }
      const size = 34

      const divIcon = L.divIcon({
        className: "permit-marker",
        html: `<div style="width:${size}px;height:${size}px;border-radius:6px;background:${tl.color};display:flex;flex-direction:column;align-items:center;justify-content:center;border:2px solid rgba(255,255,255,0.9);box-shadow:0 2px 6px rgba(0,0,0,0.25);cursor:pointer">
          <span style="font-size:10px;font-weight:800;color:#fff;line-height:1">${tl.short}</span>
          <span style="font-size:8px;color:rgba(255,255,255,0.8);line-height:1;margin-top:1px">${p.units}u</span>
        </div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      })

      const zr = zipsByCode.get(p.zip)
      const marker = L.marker([p.lat, p.lng], { icon: divIcon, interactive: true })
      marker.bindTooltip(`<div style="min-width:220px">
        <div style="font-size:13px;font-weight:700">${p.addr}</div>
        <div style="font-size:11px;color:#64748b">ZIP ${p.zip} · ${zr?.name ?? ""}</div>
        <div style="margin-top:6px;display:flex;align-items:center;gap:6px">
          <span style="background:${tl.color};color:#fff;border-radius:4px;padding:2px 6px;font-size:10px;font-weight:700">${p.type}</span>
          <span style="display:flex;align-items:center;gap:3px"><span style="width:7px;height:7px;border-radius:50%;background:${sc};display:inline-block"></span><span style="font-size:10px;font-weight:600">${p.status}</span></span>
        </div>
        <div style="margin-top:5px;display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:10px">
          <div><span style="color:#94a3b8">Units</span><br/><b>${p.units}</b></div>
          <div><span style="color:#94a3b8">Developer</span><br/><b>${p.dev}</b></div>
          <div><span style="color:#94a3b8">Est. Delivery</span><br/><b>${p.est}</b></div>
          <div><span style="color:#94a3b8">Filed</span><br/><b>${p.filed}</b></div>
        </div>
      </div>`, { direction: "top", offset: [0, -20], opacity: 1, className: "zip-tooltip" })
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

type ConversionWatchProps = {
  permits: Permit[]
  zips: ZipRecord[]
  dateFilter: number
}

export function ConversionWatch({ permits, zips, dateFilter }: ConversionWatchProps) {
  const { geoJson, isLoading } = useZipData()
  const zipsByCode = useMemo(() => new Map(zips.map((z) => [z.zip, z])), [zips])

  const conversions = useMemo(() => {
    let filtered = permits.filter((p) => p.category === "conversion")
    if (dateFilter > 0) filtered = filtered.filter((p) => isRecent(p.filed, dateFilter))
    return filtered.sort((a, b) => b.filed.localeCompare(a.filed))
  }, [permits, dateFilter])

  const totalUnits = conversions.reduce((s, p) => s + p.units, 0)
  const byType = (() => {
    const m = new Map<string, number>()
    for (const c of conversions) m.set(c.type, (m.get(c.type) ?? 0) + 1)
    return Array.from(m.entries()).sort((a, b) => b[1] - a[1])
  })()

  return (
    <div className="flex h-full">
      <div className="flex w-[380px] shrink-0 flex-col border-r border-[#e2e8f0] bg-white">
        <div className="border-b border-[#e2e8f0] p-3">
          <h2 className="text-sm font-semibold text-[#0f172a]">Conversion Watch</h2>
          <p className="mt-0.5 text-[11px] text-[#64748b]">Change-of-use permits — hotel, retail, office, warehouse to residential</p>
          <div className="mt-2 flex gap-2 text-[10px]">
            <span className="rounded-md bg-[#f1f5f9] px-2 py-1 font-semibold text-[#334155]">{conversions.length} permits</span>
            <span className="rounded-md bg-[#f1f5f9] px-2 py-1 font-semibold text-[#334155]">{totalUnits.toLocaleString()} units</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {byType.map(([type, count]) => {
              const tl = TYPE_LABELS[type] ?? { short: "?", color: "#475569" }
              return (
                <span key={type} className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[9px] font-semibold text-white" style={{ backgroundColor: tl.color }}>
                  {tl.short} {count}
                </span>
              )
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversions.map((p) => {
            const sc = STATUS_COLORS[p.status] ?? "#94a3b8"
            const tl = TYPE_LABELS[p.type] ?? { short: "CV", color: "#475569" }
            const recent = isRecent(p.filed, 30)
            return (
              <div key={p.id} className={`border-b border-[#f1f5f9] px-3 py-2.5 hover:bg-[#f8fafc] ${recent ? "border-l-2 border-l-[#7c3aed]" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-[#0f172a]">{p.addr}</p>
                    <p className="text-[10px] text-[#64748b]">ZIP {p.zip} · {p.dev}</p>
                  </div>
                  <span className="rounded px-1.5 py-0.5 text-[9px] font-bold text-white" style={{ backgroundColor: tl.color }}>{tl.short}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[10px]">
                    <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: sc }} />
                    {p.status}
                  </span>
                  <span className="text-[10px] text-[#475569]"><b>{p.units}</b> units</span>
                  <span className="text-[10px] text-[#475569]">Est. {p.est}</span>
                </div>
                <div className="mt-1 text-[9px] text-[#94a3b8]">Filed {p.filed}{recent ? " · 🟣 Last 30 days" : ""}</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="relative flex-1">
        <MapContainer center={[25.82, -80.14]} zoom={13} zoomControl={false} preferCanvas className="h-full w-full">
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap &copy; CARTO' />
          <ZoomControl position="bottomright" />
          <ImperativeLayer geoJson={geoJson} zipsByCode={zipsByCode} permits={conversions} />
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
