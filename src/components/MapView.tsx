import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet"
import L from "leaflet"
import type { GeoJsonObject } from "geojson"
import type { Permit, ZipRecord } from "../data/zips"
import { useZipData } from "../hooks/useZipData"
import { ZipDetailPanel } from "./ZipDetailPanel"
import { formatCurrency, getScoreMeta } from "./scoreUtils"

type MapViewProps = {
  zips: ZipRecord[]
  permits: Permit[]
  selectedZip: string | null
  onSelectZip: (zip: string) => void
  onCloseDetail: () => void
}

const STATUS_COLORS: Record<string, string> = {
  Permitted: "#0f766e",
  Pending: "#2563eb",
  "Under Review": "#94a3b8",
}

const STATUS_ICONS: Record<string, string> = {
  Permitted: "\u2713",
  Pending: "\u25CF",
  "Under Review": "\u25CE",
}

const CATEGORY_COLORS: Record<string, string> = {
  "new-construction": "#1d4ed8",
  conversion: "#0891b2",
  renovation: "#64748b",
}

const CATEGORY_LABELS: Record<string, string> = {
  "new-construction": "New Construction",
  conversion: "Conversion",
  renovation: "Renovation",
}

function scaleRadius(units: number): number {
  if (units >= 100) return 16
  if (units >= 60) return 13
  if (units >= 30) return 10
  return 8
}

function isRecent(filed: string, days: number): boolean {
  if (days <= 0) return true
  const d = new Date(filed)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return d >= cutoff
}

function getBaseStyle(zr: ZipRecord | undefined, isSelected: boolean): L.PathOptions {
  const sm = getScoreMeta(zr?.score ?? 0)
  return { color: sm.color, weight: isSelected ? 3.5 : 2, fillColor: sm.color, fillOpacity: isSelected ? 0.72 : 0.35 }
}

function ImperativeLayer({
  geoJson,
  zipsByCode,
  permits,
  showRental,
  showPermits,
  selectedZip,
  onSelectZip,
}: {
  geoJson: GeoJSON.FeatureCollection | null
  zipsByCode: Map<string, ZipRecord>
  permits: Permit[]
  showRental: boolean
  showPermits: boolean
  selectedZip: string | null
  onSelectZip: (zip: string) => void
}) {
  const map = useMap()
  const polyRef = useRef<L.GeoJSON | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)
  const selectedRef = useRef(selectedZip)
  const selectRef = useRef(onSelectZip)
  const hasFitBounds = useRef(false)

  useEffect(() => { selectedRef.current = selectedZip }, [selectedZip])
  useEffect(() => { selectRef.current = onSelectZip }, [onSelectZip])

  // Initial fitBounds — only once
  useEffect(() => {
    if (!geoJson || !geoJson.features.length || hasFitBounds.current) return
    const tempLayer = L.geoJSON(geoJson as GeoJsonObject)
    map.fitBounds(tempLayer.getBounds(), { padding: [60, 60] })
    hasFitBounds.current = true
  }, [geoJson, map])

  // Polygon layer — depends on geoJson, showRental, zipsByCode
  useEffect(() => {
    if (polyRef.current) { map.removeLayer(polyRef.current); polyRef.current = null }
    if (!geoJson || !geoJson.features.length) return

    if (showRental) {
      const poly = L.geoJSON(geoJson as GeoJsonObject, {
        style: (f) => {
          const zip = f?.properties?.zip as string | undefined
          const zr = zip ? zipsByCode.get(zip) : undefined
          return getBaseStyle(zr, zip === selectedRef.current)
        },
        onEachFeature: (f, layer) => {
          const zip = f.properties?.zip as string
          const zr = zip ? zipsByCode.get(zip) : undefined
          const sm = getScoreMeta(zr?.score ?? 0)
          layer.bindTooltip(`<div style="min-width:180px">
            <div style="display:flex;align-items:center;gap:6px"><span style="font-size:14px;font-weight:700">${zip}</span><span style="background:${sm.color};color:#fff;border-radius:9999px;padding:2px 7px;font-size:9px;font-weight:600">${sm.label}</span></div>
            <div style="font-size:11px;color:#64748b;margin-top:1px">${zr?.name ?? ""}</div>
            <div style="margin-top:6px;font-size:10px;color:#334155">Avg rent ${formatCurrency(zr?.rent ?? 0)} · Vacancy ${zr?.vac ?? 0}% · Cap ${zr?.cap ?? 0}%</div>
          </div>`, { sticky: true, direction: "top", offset: [0, -4], opacity: 1, className: "zip-tooltip" })
          layer.on({
            mouseover: (e) => { if (zip !== selectedRef.current) { const t = e.target as L.Path; t.setStyle({ color: sm.color, weight: 3, fillColor: sm.color, fillOpacity: 0.6 }); t.bringToFront() } },
            mouseout: (e) => { (e.target as L.Path).setStyle(getBaseStyle(zr, zip === selectedRef.current)) },
            click: () => { if (zip) selectRef.current(zip) },
          })
        },
      }).addTo(map)
      polyRef.current = poly
    } else {
      const poly = L.geoJSON(geoJson as GeoJsonObject, {
        style: () => ({ color: "#94a3b8", weight: 1, fillColor: "#e2e8f0", fillOpacity: 0.12 }),
        onEachFeature: (f, layer) => {
          const zip = f.properties?.zip as string
          layer.on("click", () => { if (zip) selectRef.current(zip) })
        },
      }).addTo(map)
      polyRef.current = poly
    }

    return () => {
      if (polyRef.current) { map.removeLayer(polyRef.current); polyRef.current = null }
    }
  }, [geoJson, zipsByCode, showRental, map])

  // Marker layer — depends on permits, showPermits
  useEffect(() => {
    if (markersRef.current) { map.removeLayer(markersRef.current); markersRef.current = null }

    if (showPermits && permits.length > 0) {
      const markers = L.layerGroup()
      for (const p of permits) {
        const catColor = CATEGORY_COLORS[p.category] ?? "#94a3b8"
        const sc = STATUS_COLORS[p.status] ?? "#94a3b8"
        const si = STATUS_ICONS[p.status] ?? "?"
        const r = scaleRadius(p.units)
        const size = r * 2
        const zr = zipsByCode.get(p.zip)

        const divIcon = L.divIcon({
          className: "permit-marker",
          html: `<div class="permit-pin" style="width:${size}px;height:${size}px;background:${catColor};border-color:${sc}"><span class="permit-icon">${si}</span></div><div class="permit-label">${p.units}</div>`,
          iconSize: [size, size + 14],
          iconAnchor: [r, r],
        })

        const marker = L.marker([p.lat, p.lng], { icon: divIcon, interactive: true, zIndexOffset: p.units })
        marker.bindTooltip(`<div style="min-width:210px">
          <div style="font-size:13px;font-weight:700">${p.addr}</div>
          <div style="font-size:11px;color:#64748b">ZIP ${p.zip} · ${zr?.name ?? ""}</div>
          <div style="margin-top:5px;display:flex;align-items:center;gap:5px">
            <span style="background:${catColor};color:#fff;border-radius:4px;padding:2px 6px;font-size:9px;font-weight:700">${CATEGORY_LABELS[p.category]}</span>
            <span style="display:flex;align-items:center;gap:3px"><span style="width:7px;height:7px;border-radius:50%;background:${sc};display:inline-block"></span><span style="font-size:10px;font-weight:600">${p.status}</span></span>
          </div>
          <div style="margin-top:5px;display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:10px">
            <div><span style="color:#94a3b8">Units</span><br/><b>${p.units}</b></div>
            <div><span style="color:#94a3b8">Type</span><br/><b>${p.type}</b></div>
            <div><span style="color:#94a3b8">Developer</span><br/><b>${p.dev}</b></div>
            <div><span style="color:#94a3b8">Est.</span><br/><b>${p.est}</b></div>
          </div>
          <div style="margin-top:4px;font-size:9px;color:#94a3b8">Filed ${p.filed}</div>
        </div>`, { direction: "top", offset: [0, -r - 4], opacity: 1, className: "zip-tooltip" })
        marker.on("click", () => selectRef.current(p.zip))
        marker.addTo(markers)
      }
      markers.addTo(map)
      markersRef.current = markers
    }

    return () => {
      if (markersRef.current) { map.removeLayer(markersRef.current); markersRef.current = null }
    }
  }, [permits, showPermits, zipsByCode, map])

  useEffect(() => {
    if (!polyRef.current || !showRental) return
    polyRef.current.eachLayer((layer) => {
      const f = (layer as L.GeoJSON & { feature?: GeoJSON.Feature }).feature
      const zip = f?.properties?.zip as string | undefined
      const zr = zip ? zipsByCode.get(zip) : undefined
      const sel = zip === selectedZip
      ;(layer as L.Path).setStyle(getBaseStyle(zr, sel))
      if (sel) (layer as L.Path).bringToFront()
    })
  }, [selectedZip, zipsByCode, showRental])

  return null
}

function FilterBar({
  showPermits,
  setShowPermits,
  showRental,
  setShowRental,
  dateFilter,
  setDateFilter,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  areaFilter,
  setAreaFilter,
  zips,
}: {
  showPermits: boolean
  setShowPermits: (v: boolean) => void
  showRental: boolean
  setShowRental: (v: boolean) => void
  dateFilter: number
  setDateFilter: (v: number) => void
  categoryFilter: string
  setCategoryFilter: (v: string) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
  areaFilter: string
  setAreaFilter: (v: string) => void
  zips: ZipRecord[]
}) {
  return (
    <div className="absolute left-[10px] right-[10px] top-[10px] z-[600] flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm">
      <div className="flex items-center gap-1.5 border-r border-[#e2e8f0] pr-3">
        <button type="button" onClick={() => setShowPermits(!showPermits)}
          className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${showPermits ? "bg-[#2563eb] text-white" : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"}`}>
          Permits
        </button>
        <button type="button" onClick={() => setShowRental(!showRental)}
          className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${showRental ? "bg-[#0f766e] text-white" : "bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]"}`}>
          Rental Data
        </button>
      </div>

      {showPermits && (
        <>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#94a3b8]">Date:</span>
            {[{ v: 0, l: "All" }, { v: 30, l: "30d" }, { v: 180, l: "6mo" }, { v: 365, l: "1yr" }, { v: 730, l: "2yr" }].map((o) => (
              <button key={o.v} type="button" onClick={() => setDateFilter(o.v)}
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${dateFilter === o.v ? "bg-[#eff6ff] text-[#2563eb]" : "text-[#64748b] hover:bg-[#f8fafc]"}`}>
                {o.l}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#94a3b8]">Type:</span>
            {[{ v: "all", l: "All" }, { v: "new-construction", l: "New Const" }, { v: "conversion", l: "Convert" }, { v: "renovation", l: "Reno" }].map((o) => (
              <button key={o.v} type="button" onClick={() => setCategoryFilter(o.v)}
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${categoryFilter === o.v ? "bg-[#eff6ff] text-[#2563eb]" : "text-[#64748b] hover:bg-[#f8fafc]"}`}>
                {o.l}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#94a3b8]">Status:</span>
            {["all", "Permitted", "Pending", "Under Review"].map((s) => (
              <button key={s} type="button" onClick={() => setStatusFilter(s)}
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${statusFilter === s ? "bg-[#eff6ff] text-[#2563eb]" : "text-[#64748b] hover:bg-[#f8fafc]"}`}>
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[#94a3b8]">Area:</span>
            <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)}
              className="rounded border border-[#e2e8f0] bg-white px-1.5 py-0.5 text-[10px] text-[#334155] outline-none">
              <option value="all">All ZIPs</option>
              {zips.map((z) => <option key={z.zip} value={z.zip}>{z.zip} — {z.name}</option>)}
            </select>
          </div>
        </>
      )}
    </div>
  )
}

function MapLegend({ showPermits, showRental }: { showPermits: boolean; showRental: boolean }) {
  if (!showPermits && !showRental) return null
  return (
    <div className="absolute bottom-16 right-3 z-[500] rounded-lg border border-[#e2e8f0] bg-white/95 p-2.5 shadow-md backdrop-blur-sm" style={{ width: 195 }}>
      {showPermits && (
        <div>
          <div className="text-[10px] font-semibold text-[#0f172a]">Permit Type</div>
          <div className="mt-1 space-y-0.5">
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#1d4ed8]" /><span className="text-[10px] text-[#64748b]">New Construction</span></div>
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#0891b2]" /><span className="text-[10px] text-[#64748b]">Conversion</span></div>
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#64748b]" /><span className="text-[10px] text-[#64748b]">Renovation</span></div>
          </div>
          <div className="mt-2 text-[10px] font-semibold text-[#0f172a]">Status (border)</div>
          <div className="mt-1 space-y-0.5">
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full border-2 border-[#0f766e]" /><span className="text-[10px] text-[#64748b]">Permitted</span></div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full border-2 border-[#2563eb]" /><span className="text-[10px] text-[#64748b]">Pending</span></div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full border-2 border-[#94a3b8]" /><span className="text-[10px] text-[#64748b]">Under Review</span></div>
          </div>
        </div>
      )}
      {showPermits && showRental && <div className="my-2 border-t border-[#e2e8f0]" />}
      {showRental && (
        <div>
          <div className="text-[10px] font-semibold text-[#0f172a]">Rental Score</div>
          <div className="mt-1 space-y-0.5">
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#1d4ed8]" /><span className="text-[10px] text-[#64748b]">Strong Buy</span></div>
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]" /><span className="text-[10px] text-[#64748b]">Opportunity</span></div>
            <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-[#64748b]" /><span className="text-[10px] text-[#64748b]">Neutral</span></div>
          </div>
        </div>
      )}
    </div>
  )
}

export function MapView({ zips, permits, selectedZip, onSelectZip, onCloseDetail }: MapViewProps) {
  const { geoJson, isLoading, error } = useZipData()
  const zipsByCode = useMemo(() => new Map(zips.map((z) => [z.zip, z])), [zips])
  const selectedRecord = selectedZip ? zipsByCode.get(selectedZip) ?? null : null

  const [showPermits, setShowPermits] = useState(true)
  const [showRental, setShowRental] = useState(true)
  const [dateFilter, setDateFilter] = useState(0)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [areaFilter, setAreaFilter] = useState("all")

  const filteredPermits = useMemo(() => {
    if (!showPermits) return []
    return permits.filter((p) => {
      if (dateFilter > 0 && !isRecent(p.filed, dateFilter)) return false
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false
      if (statusFilter !== "all" && p.status !== statusFilter) return false
      if (areaFilter !== "all" && p.zip !== areaFilter) return false
      return true
    })
  }, [permits, showPermits, dateFilter, categoryFilter, statusFilter, areaFilter])

  const zipPermits = useMemo(
    () => permits.filter((p) => p.zip === selectedRecord?.zip),
    [permits, selectedRecord?.zip],
  )

  const handleSelectZip = useCallback((zip: string) => onSelectZip(zip), [onSelectZip])

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f1f5f9]">
      <MapContainer center={[25.86, -80.16]} zoom={12} zoomControl={false} preferCanvas className="h-full w-full">
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap &copy; CARTO' />
        <ZoomControl position="bottomright" />
        <ImperativeLayer geoJson={geoJson} zipsByCode={zipsByCode} permits={filteredPermits} showRental={showRental} showPermits={showPermits} selectedZip={selectedZip} onSelectZip={handleSelectZip} />
      </MapContainer>

      {isLoading && <div className="pointer-events-none absolute inset-0 z-[700] flex items-center justify-center bg-[#f1f5f9]/65"><div className="h-12 w-12 animate-spin rounded-full border-4 border-[#cbd5e1] border-t-[#2563eb]" /></div>}
      {error && <div className="absolute left-1/2 top-6 z-[800] -translate-x-1/2 rounded-md border border-[#fecaca] bg-[#fef2f2] px-3 py-1.5 text-xs text-[#b91c1c]">GeoJSON loading issue: {error}</div>}

      <FilterBar showPermits={showPermits} setShowPermits={setShowPermits} showRental={showRental} setShowRental={setShowRental}
        dateFilter={dateFilter} setDateFilter={setDateFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter} areaFilter={areaFilter} setAreaFilter={setAreaFilter} zips={zips} />

      <MapLegend showPermits={showPermits} showRental={showRental} />

      {showPermits && (
        <div className="absolute bottom-3 left-3 z-[500] rounded-lg border border-[#e2e8f0] bg-white/95 px-3 py-2 text-[11px] shadow-md backdrop-blur-sm">
          <b>{filteredPermits.length}</b> permits · <b>{filteredPermits.reduce((s, p) => s + p.units, 0).toLocaleString()}</b> units
        </div>
      )}

      <ZipDetailPanel zipRecord={selectedRecord} permits={zipPermits} onClose={onCloseDetail} />
    </div>
  )
}
