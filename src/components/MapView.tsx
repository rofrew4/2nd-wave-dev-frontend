import { useEffect, useMemo, useState } from "react"
import { GeoJSON, MapContainer, TileLayer, Tooltip, ZoomControl, useMap } from "react-leaflet"
import L, { type PathOptions } from "leaflet"
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

function FitBounds({ geoJson }: { geoJson: GeoJSON.FeatureCollection }) {
  const map = useMap()

  useEffect(() => {
    if (!geoJson.features.length) {
      return
    }

    const bounds = L.geoJSON(geoJson as GeoJsonObject).getBounds()
    map.fitBounds(bounds, { padding: [60, 60] })
  }, [geoJson, map])

  return null
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
  const [hoveredZip, setHoveredZip] = useState<string | null>(null)
  const { geoJson, isLoading, error } = useZipData()

  const zipsByCode = useMemo(
    () => new Map(zips.map((zipRecord) => [zipRecord.zip, zipRecord])),
    [zips],
  )

  const selectedRecord = selectedZip ? zipsByCode.get(selectedZip) ?? null : null

  function styleForZip(zip: string | null): PathOptions {
    const zipRecord = zip ? zipsByCode.get(zip) : undefined
    const scoreMeta = getScoreMeta(zipRecord?.score ?? 0)
    const isSelected = zip === selectedZip
    const isHovered = zip === hoveredZip

    return {
      color: scoreMeta.color,
      weight: isSelected ? 3.5 : isHovered ? 3 : 2,
      fillColor: scoreMeta.color,
      fillOpacity: isSelected ? 0.82 : isHovered ? 0.72 : 0.42,
      className: "zip-polygon",
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden rounded-none bg-[#f1f5f9]">
      <MapContainer
        center={[25.82, -80.19]}
        zoom={12}
        zoomControl={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO'
        />
        <ZoomControl position="bottomright" />

        {geoJson && <FitBounds geoJson={geoJson} />}

        {geoJson?.features.map((feature) => {
          const zip = (feature.properties?.zip as string | undefined) ?? null
          const zipRecord = zip ? zipsByCode.get(zip) : undefined
          const scoreMeta = getScoreMeta(zipRecord?.score ?? 0)

          return (
            <GeoJSON
              key={`${zip}-${JSON.stringify(feature.geometry).slice(0, 40)}`}
              data={feature as GeoJsonObject}
              style={() => styleForZip(zip)}
              eventHandlers={{
                mouseover: (event) => {
                  setHoveredZip(zip)
                  event.target.bringToFront()
                },
                mouseout: () => {
                  setHoveredZip((current) => (current === zip ? null : current))
                },
                click: () => {
                  if (zip) {
                    onSelectZip(zip)
                  }
                },
              }}
            >
              <Tooltip
                sticky
                className="zip-tooltip"
                direction="top"
                offset={[0, -2]}
                opacity={1}
              >
                <div className="space-y-0.5">
                  <div className="text-[13px] font-bold text-[#0f172a]">{zip}</div>
                  <div className="text-[11px] text-[#64748b]">{zipRecord?.name ?? "Unknown"}</div>
                  <div style={{ color: scoreMeta.color }} className="text-[11px] font-semibold">
                    {scoreMeta.label} · {zipRecord?.score ?? "N/A"}
                  </div>
                  <div className="text-[10px] text-[#64748b]">
                    Avg rent {formatCurrency(zipRecord?.rent ?? 0)} · Pipeline{" "}
                    {zipRecord?.pipeline ?? 0}
                  </div>
                </div>
              </Tooltip>
            </GeoJSON>
          )
        })}
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
        key={selectedRecord?.zip ?? "no-zip-selected"}
        zipRecord={selectedRecord}
        signals={signals}
        isSaved={selectedRecord ? savedZips.has(selectedRecord.zip) : false}
        onClose={onCloseDetail}
        onToggleSaved={onToggleSaved}
      />
    </div>
  )
}
