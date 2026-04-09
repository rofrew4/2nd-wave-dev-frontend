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

function buildTooltipHtml(
  zip: string,
  zipRecord: ZipRecord | undefined,
): string {
  if (!zipRecord) {
    return `<div style="font-size:13px;font-weight:700">${zip}</div>`
  }

  const scoreMeta = getScoreMeta(zipRecord.score)

  let projectsHtml = ""
  for (const p of zipRecord.projects) {
    const sc = STATUS_COLORS[p.status] ?? "#94a3b8"
    projectsHtml += `<div style="display:flex;align-items:center;gap:4px;margin-top:3px">
      <span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:${sc};flex-shrink:0"></span>
      <span>${p.units} units &middot; ${p.type} &middot; <b>${p.status}</b></span>
    </div>`
  }

  const permitted = zipRecord.projects.filter(
    (p) => p.status === "Permitted",
  ).length
  const pending = zipRecord.projects.filter(
    (p) => p.status === "Pending",
  ).length
  const underReview = zipRecord.projects.filter(
    (p) => p.status === "Under Review",
  ).length

  let statusSummary = ""
  if (permitted) statusSummary += `${permitted} Permitted`
  if (pending)
    statusSummary += `${statusSummary ? " · " : ""}${pending} Pending`
  if (underReview)
    statusSummary += `${statusSummary ? " · " : ""}${underReview} Under Review`

  return `<div style="min-width:220px;max-width:300px">
    <div style="display:flex;align-items:center;gap:6px">
      <span style="font-size:14px;font-weight:700;color:#0f172a">${zip}</span>
      <span style="background:${scoreMeta.color};color:#fff;border-radius:9999px;padding:2px 7px;font-size:9px;font-weight:600">${scoreMeta.label} &middot; ${zipRecord.score}</span>
    </div>
    <div style="font-size:11px;color:#64748b;margin-top:1px">${zipRecord.name}</div>

    <div style="margin-top:7px;padding-top:7px;border-top:1px solid #e2e8f0">
      <div style="display:flex;align-items:center;gap:5px;font-size:12px;font-weight:700;color:#0f172a">
        <span style="font-size:14px">🏗</span>
        ${zipRecord.pipeline} units in pipeline
      </div>
      <div style="font-size:10px;color:#64748b;margin-top:2px">
        ${zipRecord.permits} active permits &middot; ${statusSummary}
      </div>
      <div style="font-size:10px;color:#475569;margin-top:4px">${projectsHtml}</div>
    </div>

    <div style="margin-top:7px;padding-top:6px;border-top:1px solid #e2e8f0;font-size:10px;color:#64748b">
      Avg rent ${formatCurrency(zipRecord.rent)} &middot; Vacancy ${zipRecord.vac}% &middot; Cap ${zipRecord.cap}%
    </div>
  </div>`
}

function scalePipelineRadius(
  pipeline: number,
  min: number,
  max: number,
): number {
  if (max === min) return 20
  const t = (pipeline - min) / (max - min)
  return 14 + t * 14
}

function getPipelineColor(pipeline: number): string {
  if (pipeline >= 150) return "#dc2626"
  if (pipeline >= 80) return "#f59e0b"
  return "#3b82f6"
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
  const bubblesLayerRef = useRef<L.LayerGroup | null>(null)
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

        layer.bindTooltip(buildTooltipHtml(zip, zipRecord), {
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

    const pipelines = Array.from(zipsByCode.values()).map((z) => z.pipeline)
    const minPipeline = Math.min(...pipelines)
    const maxPipeline = Math.max(...pipelines)

    const bubbles = L.layerGroup()

    geoJson.features.forEach((feature) => {
      const zip = feature.properties?.zip as string
      const zipRecord = zip ? zipsByCode.get(zip) : undefined
      if (!zipRecord) return

      const featureBounds = L.geoJSON(feature as GeoJsonObject).getBounds()
      const center = featureBounds.getCenter()
      const radius = scalePipelineRadius(
        zipRecord.pipeline,
        minPipeline,
        maxPipeline,
      )
      const color = getPipelineColor(zipRecord.pipeline)
      const size = radius * 2
      const fontSize = Math.round(9 + ((radius - 14) / 14) * 4)

      let dotsHtml = ""
      for (const p of zipRecord.projects) {
        const sc = STATUS_COLORS[p.status] ?? "#94a3b8"
        dotsHtml += `<span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${sc};border:1px solid rgba(255,255,255,0.8)"></span>`
      }

      const isHeavy = zipRecord.pipeline >= 150
      const pulseClass = isHeavy ? " pipeline-pulse" : ""

      const icon = L.divIcon({
        className: "pipeline-marker",
        html: `<div class="pipeline-bubble${pulseClass}" style="width:${size}px;height:${size}px;background:${color}">
          <span class="pipeline-units" style="font-size:${fontSize}px">${zipRecord.pipeline}</span>
          <div class="pipeline-dots">${dotsHtml}</div>
        </div>`,
        iconSize: [size, size],
        iconAnchor: [radius, radius],
      })

      const marker = L.marker(center, {
        icon,
        interactive: true,
        zIndexOffset: 1000 - zipRecord.pipeline,
      })

      marker.bindTooltip(buildTooltipHtml(zip, zipRecord), {
        direction: "top",
        offset: [0, -radius - 2],
        opacity: 1,
        className: "zip-tooltip",
      })

      marker.on("click", () => selectZipRef.current(zip))
      marker.addTo(bubbles)
    })

    bubbles.addTo(map)
    bubblesLayerRef.current = bubbles

    return () => {
      map.removeLayer(polygons)
      map.removeLayer(bubbles)
      polygonLayerRef.current = null
      bubblesLayerRef.current = null
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

function PipelineLegend() {
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
      style={{ width: 210 }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[11px] font-semibold text-[#0f172a]">
          Pipeline Activity
        </div>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          className="text-xs text-[#94a3b8] hover:text-[#64748b]"
        >
          ×
        </button>
      </div>

      <div className="mt-2 flex items-end gap-1.5">
        <div className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#94a3b8]">
          <span className="text-[6px] font-bold text-white">S</span>
        </div>
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#94a3b8]">
          <span className="text-[7px] font-bold text-white">M</span>
        </div>
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#94a3b8]">
          <span className="text-[8px] font-bold text-white">L</span>
        </div>
        <span className="ml-1 text-[10px] text-[#64748b]">
          Bubble size = units in pipeline
        </span>
      </div>

      <div className="mt-2.5 space-y-1">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#dc2626]" />
          <span className="text-[10px] text-[#64748b]">Heavy (150+ units)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
          <span className="text-[10px] text-[#64748b]">
            Moderate (80–149)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]" />
          <span className="text-[10px] text-[#64748b]">
            Light (&lt;80 units)
          </span>
        </div>
      </div>

      <div className="mt-2.5 border-t border-[#e2e8f0] pt-2">
        <div className="text-[10px] font-medium text-[#334155]">
          Permit Status
        </div>
        <div className="mt-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
            <span className="text-[10px] text-[#64748b]">Permitted</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
            <span className="text-[10px] text-[#64748b]">Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#6366f1]" />
            <span className="text-[10px] text-[#64748b]">Under Review</span>
          </div>
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
      <PipelineLegend />

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
