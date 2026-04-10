import { useCallback, useEffect, useMemo, useRef } from "react"
import { MapContainer, TileLayer, ZoomControl, useMap } from "react-leaflet"
import L from "leaflet"
import type { GeoJsonObject } from "geojson"
import type { Permit, ZipRecord } from "../data/zips"
import { useZipData } from "../hooks/useZipData"
import { ZipDetailPanel } from "./ZipDetailPanel"
import { ZipList } from "./ZipList"
import { formatCurrency, getScoreMeta } from "./scoreUtils"

type MapViewProps = {
  zips: ZipRecord[]
  permits: Permit[]
  selectedZip: string | null
  onSelectZip: (zip: string) => void
  onCloseDetail: () => void
  savedZips: Set<string>
  onToggleSaved: (zip: string) => void
}

function getBaseStyle(zipRecord: ZipRecord | undefined, isSelected: boolean): L.PathOptions {
  const scoreMeta = getScoreMeta(zipRecord?.score ?? 0)
  return {
    color: scoreMeta.color,
    weight: isSelected ? 3.5 : 2,
    fillColor: scoreMeta.color,
    fillOpacity: isSelected ? 0.72 : 0.35,
  }
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
  const selectedRef = useRef(selectedZip)
  const selectZipRef = useRef(onSelectZip)

  useEffect(() => { selectedRef.current = selectedZip }, [selectedZip])
  useEffect(() => { selectZipRef.current = onSelectZip }, [onSelectZip])

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
        const scoreMeta = getScoreMeta(zipRecord?.score ?? 0)

        layer.bindTooltip(`<div style="min-width:180px">
          <div style="display:flex;align-items:center;gap:6px">
            <span style="font-size:14px;font-weight:700">${zip}</span>
            <span style="background:${scoreMeta.color};color:#fff;border-radius:9999px;padding:2px 7px;font-size:9px;font-weight:600">${scoreMeta.label}</span>
          </div>
          <div style="font-size:11px;color:#64748b;margin-top:1px">${zipRecord?.name ?? ""}</div>
          <div style="margin-top:6px;font-size:10px;color:#334155">
            Avg rent ${formatCurrency(zipRecord?.rent ?? 0)} · Vacancy ${zipRecord?.vac ?? 0}% · Cap ${zipRecord?.cap ?? 0}%
          </div>
        </div>`, { sticky: true, direction: "top", offset: [0, -4], opacity: 1, className: "zip-tooltip" })

        layer.on({
          mouseover: (e) => {
            if (zip === selectedRef.current) return
            const t = e.target as L.Path
            t.setStyle({ color: scoreMeta.color, weight: 3, fillColor: scoreMeta.color, fillOpacity: 0.6 })
            t.bringToFront()
          },
          mouseout: (e) => {
            (e.target as L.Path).setStyle(getBaseStyle(zipRecord, zip === selectedRef.current))
          },
          click: () => { if (zip) selectZipRef.current(zip) },
        })
      },
    }).addTo(map)

    polygonLayerRef.current = polygons
    return () => { map.removeLayer(polygons); polygonLayerRef.current = null }
  }, [geoJson, zipsByCode, map])

  useEffect(() => {
    if (!polygonLayerRef.current) return
    polygonLayerRef.current.eachLayer((layer) => {
      const feature = (layer as L.GeoJSON & { feature?: GeoJSON.Feature }).feature
      const zip = feature?.properties?.zip as string | undefined
      const zipRecord = zip ? zipsByCode.get(zip) : undefined
      const isSelected = zip === selectedZip
      ;(layer as L.Path).setStyle(getBaseStyle(zipRecord, isSelected))
      if (isSelected) (layer as L.Path).bringToFront()
    })
  }, [selectedZip, zipsByCode])

  return null
}

export function MapView({
  zips,
  permits,
  selectedZip,
  onSelectZip,
  onCloseDetail,
  savedZips,
  onToggleSaved,
}: MapViewProps) {
  const { geoJson, isLoading, error } = useZipData()
  const zipsByCode = useMemo(() => new Map(zips.map((z) => [z.zip, z])), [zips])
  const selectedRecord = selectedZip ? zipsByCode.get(selectedZip) ?? null : null

  const zipPermits = useMemo(
    () => permits.filter((p) => p.zip === selectedRecord?.zip),
    [permits, selectedRecord?.zip],
  )

  const handleSelectZip = useCallback((zip: string) => onSelectZip(zip), [onSelectZip])

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#f1f5f9]">
      <MapContainer center={[25.82, -80.19]} zoom={12} zoomControl={false} preferCanvas className="h-full w-full">
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap &copy; CARTO' />
        <ZoomControl position="bottomright" />
        <ImperativeMap geoJson={geoJson} zipsByCode={zipsByCode} selectedZip={selectedZip} onSelectZip={handleSelectZip} />
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

      <ZipDetailPanel
        zipRecord={selectedRecord}
        permits={zipPermits}
        isSaved={selectedRecord ? savedZips.has(selectedRecord.zip) : false}
        onClose={onCloseDetail}
        onToggleSaved={onToggleSaved}
      />
    </div>
  )
}
