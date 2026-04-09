import { useEffect, useMemo, useState } from "react"
import { ZIP_WHITELIST } from "../data/zips"

const GEOJSON_URL =
  "https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/fl_florida_zip_codes_geo.min.json"

type GeoFeature = GeoJSON.Feature<GeoJSON.Geometry, Record<string, unknown>>
type GeoCollection = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  Record<string, unknown>
>

const ZIP_KEYS = ["ZCTA5CE10", "ZCTA5CE20", "ZCTA5CE", "zip", "ZIP", "GEOID10"]

function extractZip(feature: GeoFeature): string | null {
  const props = feature.properties ?? {}

  for (const key of ZIP_KEYS) {
    const candidate = props[key]
    if (typeof candidate === "string" && candidate.length >= 5) {
      return candidate.slice(0, 5)
    }
  }

  return null
}

export function useZipData() {
  const [geoJson, setGeoJson] = useState<GeoCollection | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const abortController = new AbortController()

    async function load() {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(GEOJSON_URL, {
          signal: abortController.signal,
        })
        if (!response.ok) {
          throw new Error(`GeoJSON fetch failed (${response.status})`)
        }

        const payload = (await response.json()) as GeoCollection

        const features = payload.features
          .map((feature) => {
            const zip = extractZip(feature)
            if (!zip) {
              return null
            }

            return {
              ...feature,
              properties: {
                ...(feature.properties ?? {}),
                zip,
              },
            } as GeoFeature
          })
          .filter(
            (feature): feature is GeoFeature =>
              !!feature && ZIP_WHITELIST.includes(feature.properties.zip as never),
          )

        setGeoJson({
          type: "FeatureCollection",
          features,
        })
      } catch (fetchError) {
        if (abortController.signal.aborted) {
          return
        }

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unknown error while loading GeoJSON.",
        )
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    load()
    return () => abortController.abort()
  }, [])

  const zipSet = useMemo(() => new Set(ZIP_WHITELIST), [])
  return { geoJson, isLoading, error, zipSet }
}
