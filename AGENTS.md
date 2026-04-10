# AGENTS.md

## Cursor Cloud specific instructions

### Overview

ZoneIQ is a single-page React/TypeScript frontend application (no backend, no database). It is a Miami real estate intelligence dashboard built with Vite 8, React 19, Tailwind CSS 4, Leaflet maps, and Recharts.

### Key commands

All standard commands are in `package.json` scripts:

- **Dev server:** `npm run dev` (Vite with HMR, serves on port 5173)
- **Lint:** `npm run lint` (ESLint 9 with TypeScript and React plugins)
- **Build:** `npm run build` (runs `tsc -b` then `vite build`, outputs to `dist/`)
- **Preview prod build:** `npm run preview`

### Notes

- The app fetches GeoJSON boundaries from `raw.githubusercontent.com` and map tiles from `basemaps.cartocdn.com` at runtime, so internet access is required for the map to render.
- All real estate data is hardcoded in `src/data/zips.ts` — there are no API keys or environment variables needed.
- Use `--host 0.0.0.0` flag with `npm run dev` when accessing the dev server from a browser outside the local machine (e.g. `npm run dev -- --host 0.0.0.0`).
