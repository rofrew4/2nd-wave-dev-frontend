import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet"
import L from "leaflet"
import type { GeoJsonObject } from "geojson"
import type { SignalRecord, ZipRecord } from "../data/zips"
import { useZipData } from "../hooks/useZipData"
import { ZipDetailPanel } from "./ZipDetailPanel"
import { ZipList } from "./ZipList"
import { formatCurrency, getScoreMeta } from "./scoreUtils"

type MapViewProps = {
  zips: ZipRecord[]
  selectedZip: string | null
  onSelectZip: (zip: string) => void
  onCloseDetail: () => void
  savedZips: Set<string>
  onToggleSaved: (zip: string) => void
  signals: SignalRecord[]
}

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

function getBaseStyle(
  zipRecord: ZipRecord | undefined,
  isSelected: boolean,
): L.PathOptions {
  const scoreMeta = getScoreMeta(zipRecord?.score ?? 0)
  return {
    color: scoreMeta.color,
    weight: isSelected ? 3.5 : 2,
    fillColor: scoreMeta.color,
    fillOpacity: isSelected ? 0.72 : 0.35,
  }
}

function buildZipTooltipHtml(
  zip: string,
  zipRecord: ZipRecord | undefined,
): string {
  if (!zipRecord) {
    return `<div style="font-size:13px;font-weight:700">${zip}</div>`
  }
  const scoreMeta = getScoreMeta(zipRecord.score)
  return `<div style="min-width:180px">
    <div style="display:flex;align-items:center;gap:6px">
      <span style="font-size:14px;font-weight:700;color:#0f172a">${zip}</span>
      <span style="background:${scoreMeta.color};color:#fff;border-radius:9999px;padding:2px 7px;font-size:9px;font-weight:600">${scoreMeta.label}</span>
    </div>
    <div style="font-size:11px;color:#64748b;margin-top:1px">${zipRecord.name}</div>
    <div style="margin-top:6px;font-size:10px;color:#334155">
      Avg rent ${formatCurrency(zipRecord.rent)} · Vacancy ${zipRecord.vac}% · ${zipRecord.pipeline} units in pipeline
    </div>
  </div>`
}

function scalePermitRadius(units: number): number {
  if (units >= 100) return 16
  if (units >= 60) return 13
  if (units >= 30) return 10
  return 8
}

function ImperativeMap({
  geoJson,
  zipsByCode,
  selectedZip,
  onSelectZip,
}: {
  geoJson: GeoJSON.FeatureCollection | null
  zipsByCode: Map<string, ZipRecord>
  selectedZip: string | null
  onSelectZip: (zip: string) => void
}) {
  const map = useMap()
  const polygonLayerRef = useRef<L.GeoJSON | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const selectedRef = useRef(selectedZip)
  const selectZipRef = useRef(onSelectZip)

  useEffect(() => {
    selectedRef.current = selectedZip
  }, [selectedZip])

  useEffect(() => {
    selectZipRef.current = onSelectZip
  }, [onSelectZip])

  useEffect(() => {
    if (!geoJson || !geoJson.features.length) return

    const tempLayer = L.geoJSON(geoJson as GeoJsonObject)
    map.fitBounds(tempLayer.getBounds(), { padding: [60, 60] })

    const polygons = L.geoJSON(geoJson as GeoJsonObject, {
      style: (feature) => {
        const zip = feature?.properties?.zip as string | undefined
        const zipRecord = zip ? zipsByCode.get(zip) : undefined
        return getBaseStyle(zipRecord, zip === selectedRef.current)
      },
      onEachFeature: (feature, layer) => {
        const zip = feature.properties?.zip as string
        const zipRecord = zip ? zipsByCode.get(zip) : undefined

        layer.bindTooltip(buildZipTooltipHtml(zip, zipRecord), {
          sticky: true,
          direction: "top",
          offset: [0, -4],
          opacity: 1,
          className: "zip-tooltip",
        })

        layer.on({
          mouseover: (e) => {
            if (zip === selectedRef.current) return
            const t = e.target as L.Path
            const scoreMeta = getScoreMeta(zipRecord?.score ?? 0)
            t.setStyle({
              color: scoreMeta.color,
              weight: 3,
              fillColor: scoreMeta.color,
              fillOpacity: 0.6,
            })
            t.bringToFront()
          },
          mouseout: (e) => {
            const t = e.target as L.Path
            t.setStyle(
              getBaseStyle(zipRecord, zip === selectedRef.current),
            )
          },
          click: () => {
            if (zip) selectZipRef.current(zip)
          },
        })
      },
    }).addTo(map)

    polygonLayerRef.current = polygons

    const markers = L.layerGroup()

    for (const [zip, zipRecord] of zipsByCode) {
      for (const project of zipRecord.projects) {
        const color = STATUS_COLORS[project.status] ?? "#94a3b8"
        const icon = STATUS_ICONS[project.status] ?? "?"
        const radius = scalePermitRadius(project.units)
        const size = radius * 2

        const divIcon = L.divIcon({
          className: "permit-marker",
          html: `<div class="permit-pin" style="width:${size}px;height:${size}px;background:${color}">
            <span class="permit-icon">${icon}</span>
          </div>
          <div class="permit-label">${project.units}</div>`,
          iconSize: [size, size + 14],
          iconAnchor: [radius, radius],
        })

        const tooltipHtml = `<div style="min-width:200px">
          <div style="font-size:13px;font-weight:700;color:#0f172a">${project.addr}</div>
          <div style="font-size:11px;color:#64748b">ZIP ${zip} · ${zipRecord.name}</div>
          <div style="margin-top:6px;display:flex;align-items:center;gap:5px">
            <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color}"></span>
            <span style="font-size:11px;font-weight:600;color:#0f172a">${project.status}</span>
          </div>
          <div style="margin-top:5px;display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:10px">
            <div><span style="color:#94a3b8">Units</span><br/><b style="color:#0f172a">${project.units}</b></div>
            <div><span style="color:#94a3b8">Type</span><br/><b style="color:#0f172a">${project.type}</b></div>
            <div><span style="color:#94a3b8">Developer</span><br/><b style="color:#0f172a">${project.dev}</b></div>
            <div><span style="color:#94a3b8">Est. Delivery</span><br/><b style="color:#0f172a">${project.est}</b></div>
          </div>
        </div>`

        const marker = L.marker([project.lat, project.lng], {
          icon: divIcon,
          interactive: true,
          zIndexOffset: project.units,
        })

        marker.bindTooltip(tooltipHtml, {
          direction: "top",
          offset: [0, -radius - 4],
          opacity: 1,
          className: "zip-tooltip",
        })

        marker.on("click", () => selectZipRef.current(zip))
        marker.addTo(markers)
      }
    }

    markers.addTo(map)
    markersLayerRef.current = markers

    return () => {
      map.removeLayer(polygons)
      map.removeLayer(markers)
      polygonLayerRef.current = null
      markersLayerRef.current = null
    }
  }, [geoJson, zipsByCode, map])

  useEffect(() => {
    if (!polygonLayerRef.current) return
    polygonLayerRef.current.eachLayer((layer) => {
      const feature = (layer as L.GeoJSON & { feature?: GeoJSON.Feature })
        .feature
      const zip = feature?.properties?.zip as string | undefined
      const zipRecord = zip ? zipsByCode.get(zip) : undefined
      const isSelected = zip === selectedZip
      ;(layer as L.Path).setStyle(getBaseStyle(zipRecord, isSelected))
      if (isSelected) {
        ;(layer as L.Path).bringToFront()
      }
    })
  }, [selectedZip, zipsByCode])

  return null
}

function PermitLegend() {
  const [collapsed, setCollapsed] = useState(false)

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        className="absolute bottom-16 right-3 z-[500] rounded-lg border border-[#e2e8f0] bg-white/95 px-2.5 py-1.5 text-[10px] font-medium text-[#334155] shadow-md backdrop-blur-sm hover:bg-white"
      >
        🏗 Legend
      </button>
    )
  }

  return (
    <div
      className="absolute bottom-16 right-3 z-[500] rounded-lg border border-[#e2e8f0] bg-white/95 p-3 shadow-md backdrop-blur-sm"
      style={{ width: 200 }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold text-[#0f172a]">
          Permit Markers
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="text-xs text-[#94a3b8] hover:text-[#64748b]"
        >
          ×
        </button>
      </div>

      <div className="mt-2 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#16a34a] text-[8px] font-bold text-white">✓</span>
          <span className="text-[10px] text-[#64748b]">Permitted</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f59e0b] text-[8px] font-bold text-white">●</span>
          <span className="text-[10px] text-[#64748b]">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#6366f1] text-[8px] font-bold text-white">◎</span>
          <span className="text-[10px] text-[#64748b]">Under Review</span>
        </div>
      </div>

      <div className="mt-2.5 border-t border-[#e2e8f0] pt-2">
        <div className="text-[10px] font-medium text-[#334155]">
          Marker Size
        </div>
        <div className="mt-1 flex items-end gap-2">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#94a3b8]">
            <span className="text-[6px] font-bold text-white">S</span>
          </div>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#94a3b8]">
            <span className="text-[7px] font-bold text-white">M</span>
          </div>
          <div className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#94a3b8]">
            <span className="text-[8px] font-bold text-white">L</span>
          </div>
          <span className="ml-0.5 text-[10px] text-[#64748b]">= unit count</span>
        </div>
      </div>
    </div>
  )
}

export function MapView({
  zips,
  selectedZip,
  onSelectZip,
  onCloseDetail,
  savedZips,
  onToggleSaved,
  signals,
}: MapViewProps) {
  const { geoJson, isLoading, error } = useZipData()

  const zipsByCode = useMemo(
    () => new Map(zips.map((z) => [z.zip, z])),
    [zips],
  )

  const selectedRecord = selectedZip
    ? zipsByCode.get(selectedZip) ?? null
    : null

  const handleSelectZip = useCallback(
    (zip: string) => onSelectZip(zip),
    [onSelectZip],
  )

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f1f5f9]">
      <MapContainer
        center={[25.82, -80.19]}
        zoom={12}
        zoomControl={false}
        preferCanvas
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO'
        />
        <ZoomControl position="bottomright" />
        <ImperativeMap
          geoJson={geoJson}
          zipsByCode={zipsByCode}
          selectedZip={selectedZip}
          onSelectZip={handleSelectZip}
        />
      </MapContainer>

      {isLoading && (
        <div className="pointer-events-none absolute inset-0 z-[700] flex items-center justify-center bg-[#f1f5f9]/65">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#cbd5e1] border-t-[#2563eb]" />
        </div>
      )}

      {error && (
        <div className="absolute left-1/2 top-6 z-[800] -translate-x-1/2 rounded-md border border-[#fecaca] bg-[#fef2f2] px-3 py-1.5 text-xs text-[#b91c1c]">
          GeoJSON loading issue: {error}
        </div>
      )}

      <ZipList zips={zips} selectedZip={selectedZip} onSelectZip={onSelectZip} />
      <PermitLegend />

      <ZipDetailPanel
        zipRecord={selectedRecord}
        signals={signals}
        isSaved={selectedRecord ? savedZips.has(selectedRecord.zip) : false}
        onClose={onCloseDetail}
        onToggleSaved={onToggleSaved}
      />
    </div>
  )
}
