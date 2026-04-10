import { useEffect, useState } from "react"
import { ZIP_WHITELIST } from "../data/zips"

const GEOJSON_URL =
  "https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/fl_florida_zip_codes_geo.min.json"

type GeoFeature = GeoJSON.Feature<GeoJSON.Geometry, Record<string, unknown>>
type GeoCollection = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  Record<string, unknown>
>

const ZIP_KEYS = ["ZCTA5CE10", "ZCTA5CE20", "ZCTA5CE", "zip", "ZIP", "GEOID10"]
const ZIP_SET = new Set<string>(ZIP_WHITELIST)

let cachedGeoJson: GeoCollection | null = null
let cachePromise: Promise<GeoCollection> | null = null

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

function fetchAndFilter(): Promise<GeoCollection> {
  if (cachePromise) return cachePromise

  cachePromise = fetch(GEOJSON_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`GeoJSON fetch failed (${response.status})`)
      }
      return response.json() as Promise<GeoCollection>
    })
    .then((payload) => {
      const features = payload.features
        .map((feature) => {
          const zip = extractZip(feature)
          if (!zip) return null
          return {
            ...feature,
            properties: { ...(feature.properties ?? {}), zip },
          } as GeoFeature
        })
        .filter(
          (feature): feature is GeoFeature =>
            !!feature && ZIP_SET.has(String(feature.properties.zip)),
        )

      const result: GeoCollection = { type: "FeatureCollection", features }
      cachedGeoJson = result
      return result
    })
    .catch((err) => {
      cachePromise = null
      throw err
    })

  return cachePromise
}

export function useZipData() {
  const [geoJson, setGeoJson] = useState<GeoCollection | null>(cachedGeoJson)
  const [isLoading, setIsLoading] = useState(!cachedGeoJson)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cachedGeoJson) return

    let cancelled = false

    fetchAndFilter()
      .then((data) => {
        if (!cancelled) {
          setGeoJson(data)
          setIsLoading(false)
        }
      })
      .catch((fetchError) => {
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Unknown error while loading GeoJSON.",
          )
          setIsLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [])

  return { geoJson, isLoading, error }
}
