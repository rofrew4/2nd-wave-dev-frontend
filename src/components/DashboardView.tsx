import { useMemo, useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { Permit, PermitCategory, ZipRecord } from "../data/zips"
import { formatCurrency, getScoreMeta } from "./scoreUtils"

type DashboardViewProps = {
  permits: Permit[]
  zips: ZipRecord[]
}

type CategoryFilter = "all" | PermitCategory

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

function monthLabel(key: string): string {
  const [y, m] = key.split("-")
  const d = new Date(Number(y), Number(m) - 1)
  return d.toLocaleString("en-US", { month: "short", year: "2-digit" })
}

function generateMonthRange(startDate: Date, endDate: Date): string[] {
  const keys: string[] = []
  const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1)
  while (cursor <= end) {
    keys.push(monthKey(cursor))
    cursor.setMonth(cursor.getMonth() + 1)
  }
  return keys
}

export function DashboardView({ permits, zips }: DashboardViewProps) {
  const [selectedZip, setSelectedZip] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all")

  const zipsByCode = useMemo(() => new Map(zips.map((z) => [z.zip, z])), [zips])

  const filtered = useMemo(() => {
    let result = permits
    if (selectedZip !== "all") result = result.filter((p) => p.zip === selectedZip)
    if (categoryFilter !== "all") result = result.filter((p) => p.category === categoryFilter)
    return result
  }, [permits, selectedZip, categoryFilter])

  const monthRange = useMemo(() => {
    if (filtered.length === 0) return []
    const dates = filtered.map((p) => new Date(p.filed))
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())))
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())))
    return generateMonthRange(minDate, maxDate)
  }, [filtered])

  // Per-ZIP trend data
  const zipTrends = useMemo(() => {
    const zipMap = new Map<string, Map<string, { filed: number; permitted: number }>>()

    for (const p of filtered) {
      const mk = monthKey(new Date(p.filed))
      if (!zipMap.has(p.zip)) zipMap.set(p.zip, new Map())
      const zipData = zipMap.get(p.zip)!
      if (!zipData.has(mk)) zipData.set(mk, { filed: 0, permitted: 0 })
      const entry = zipData.get(mk)!
      entry.filed++
      if (p.status === "Permitted") entry.permitted++
    }

    const results: { zip: string; name: string; data: { month: string; label: string; filed: number; permitted: number }[] }[] = []

    for (const [zip, monthData] of zipMap) {
      const zr = zipsByCode.get(zip)
      const data = monthRange.map((mk) => {
        const entry = monthData.get(mk)
        return { month: mk, label: monthLabel(mk), filed: entry?.filed ?? 0, permitted: entry?.permitted ?? 0 }
      })
      results.push({ zip, name: zr?.name ?? zip, data })
    }

    return results.sort((a, b) => {
      const aTotal = a.data.reduce((s, d) => s + d.filed, 0)
      const bTotal = b.data.reduce((s, d) => s + d.filed, 0)
      return bTotal - aTotal
    })
  }, [filtered, monthRange, zipsByCode])

  // Cold zones: ZIPs with zero or very few permits in the last 6 months
  const coldZones = useMemo(() => {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const recentByZip = new Map<string, number>()
    for (const z of zips) recentByZip.set(z.zip, 0)

    for (const p of permits) {
      if (categoryFilter !== "all" && p.category !== categoryFilter) continue
      if (new Date(p.filed) >= sixMonthsAgo) {
        recentByZip.set(p.zip, (recentByZip.get(p.zip) ?? 0) + 1)
      }
    }

    return zips
      .map((z) => ({ ...z, recentPermits: recentByZip.get(z.zip) ?? 0 }))
      .filter((z) => z.recentPermits <= 2)
      .sort((a, b) => a.recentPermits - b.recentPermits)
  }, [zips, permits, categoryFilter])

  // KPI stats
  const nc = filtered.filter((p) => p.category === "new-construction")
  const cv = filtered.filter((p) => p.category === "conversion")
  const rv = filtered.filter((p) => p.category === "renovation")
  const ncUnits = nc.reduce((s, p) => s + p.units, 0)
  const cvUnits = cv.reduce((s, p) => s + p.units, 0)
  const rvUnits = rv.reduce((s, p) => s + p.units, 0)

  return (
    <section className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#0f172a]">Dashboard</h2>
            <p className="text-sm text-[#64748b]">
              {selectedZip === "all"
                ? "Market-wide analysis across all focus ZIPs"
                : `Analysis for ${zipsByCode.get(selectedZip)?.zip} — ${zipsByCode.get(selectedZip)?.name}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-0.5 text-xs">
              {([
                { v: "all" as CategoryFilter, l: "All" },
                { v: "new-construction" as CategoryFilter, l: "New Const" },
                { v: "conversion" as CategoryFilter, l: "Conversion" },
                { v: "renovation" as CategoryFilter, l: "Renovation" },
              ]).map((o) => (
                <button key={o.v} type="button" onClick={() => setCategoryFilter(o.v)}
                  className={`rounded-md px-2.5 py-1 font-medium transition ${categoryFilter === o.v ? "bg-white text-[#2563eb] shadow-sm" : "text-[#64748b] hover:text-[#334155]"}`}>
                  {o.l}
                </button>
              ))}
            </div>
            <select value={selectedZip} onChange={(e) => setSelectedZip(e.target.value)}
              className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-sm text-[#334155] outline-none">
              <option value="all">All ZIPs</option>
              {zips.map((z) => <option key={z.zip} value={z.zip}>{z.zip} — {z.name}</option>)}
            </select>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
            <div className="text-[11px] text-[#94a3b8]">Total Permits</div>
            <div className="mt-1 text-2xl font-bold text-[#0f172a]">{filtered.length}</div>
          </div>
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
            <div className="text-[11px] text-[#94a3b8]">New Construction</div>
            <div className="mt-1 text-2xl font-bold text-[#1d4ed8]">{ncUnits}<span className="ml-1 text-sm font-normal text-[#64748b]">units</span></div>
            <div className="text-[10px] text-[#64748b]">{nc.length} permits</div>
          </div>
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
            <div className="text-[11px] text-[#94a3b8]">Conversions</div>
            <div className="mt-1 text-2xl font-bold text-[#0891b2]">{cvUnits}<span className="ml-1 text-sm font-normal text-[#64748b]">units</span></div>
            <div className="text-[10px] text-[#64748b]">{cv.length} permits</div>
          </div>
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
            <div className="text-[11px] text-[#94a3b8]">Renovations</div>
            <div className="mt-1 text-2xl font-bold text-[#64748b]">{rvUnits}<span className="ml-1 text-sm font-normal text-[#64748b]">units</span></div>
            <div className="text-[10px] text-[#64748b]">{rv.length} permits</div>
          </div>
        </div>

        {/* Permit Trends by ZIP */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
          <div className="text-sm font-semibold text-[#0f172a]">Permit Trends by ZIP</div>
          <p className="mt-0.5 text-[10px] text-[#64748b]">Monthly filed vs permitted count over selected range</p>

          {zipTrends.length === 0 ? (
            <div className="mt-4 text-xs text-[#94a3b8]">No permit data for current filters.</div>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {zipTrends.map((zt) => (
                <div key={zt.zip} className="rounded-lg border border-[#f1f5f9] p-3">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] font-semibold text-[#0f172a]">{zt.zip} — {zt.name}</div>
                    <div className="text-[10px] text-[#64748b]">{zt.data.reduce((s, d) => s + d.filed, 0)} total</div>
                  </div>
                  <div className="mt-2 h-[120px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={zt.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 9 }} interval="preserveStartEnd" />
                        <YAxis tick={{ fill: "#64748b", fontSize: 9 }} allowDecimals={false} width={24} />
                        <Tooltip />
                        <Line type="monotone" dataKey="filed" name="Filed" stroke="#1d4ed8" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="permitted" name="Permitted" stroke="#0f766e" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cold Zones */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
          <div className="text-sm font-semibold text-[#0f172a]">Cold Zones</div>
          <p className="mt-0.5 text-[10px] text-[#64748b]">ZIPs with zero or very few permits in the last 6 months — possible underserved markets or regulatory barriers</p>

          {coldZones.length === 0 ? (
            <div className="mt-4 text-xs text-[#94a3b8]">All ZIPs show recent permit activity.</div>
          ) : (
            <div className="mt-3 space-y-2">
              {coldZones.map((z) => {
                const sm = getScoreMeta(z.score)
                return (
                  <div key={z.zip} className="flex items-center justify-between rounded-lg border border-[#f1f5f9] p-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-[#0f172a]">{z.zip}</span>
                        <span className="rounded-full px-1.5 py-0.5 text-[8px] font-semibold text-white" style={{ backgroundColor: sm.color }}>{sm.label}</span>
                        <span className="rounded bg-[#fef2f2] px-1.5 py-0.5 text-[9px] font-medium text-[#b91c1c]">
                          {z.recentPermits === 0 ? "No permits (6mo)" : `${z.recentPermits} permit${z.recentPermits > 1 ? "s" : ""} (6mo)`}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[10px] text-[#64748b]">{z.name}</p>
                    </div>
                    <div className="text-right text-[10px]">
                      <div className="font-semibold text-[#0f172a]">{formatCurrency(z.rent)}</div>
                      <div className="text-[#64748b]">{z.rg}% YoY · {z.vac}% vacancy</div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Rental Context */}
        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
          <div className="text-sm font-semibold text-[#0f172a]">Rental Context</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(selectedZip === "all" ? zips : zips.filter((z) => z.zip === selectedZip)).map((z) => {
              const sm = getScoreMeta(z.score)
              return (
                <div key={z.zip} className="flex items-center justify-between rounded-lg border border-[#f1f5f9] p-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-[#0f172a]">{z.zip}</span>
                      <span className="rounded-full px-1.5 py-0.5 text-[8px] font-semibold text-white" style={{ backgroundColor: sm.color }}>{z.score}</span>
                    </div>
                    <p className="text-[10px] text-[#64748b]">{z.name}</p>
                  </div>
                  <div className="text-right text-[10px]">
                    <div className="font-semibold text-[#0f172a]">{formatCurrency(z.rent)}</div>
                    <div className="text-[#64748b]">{z.rg}% YoY · {z.vac}% vac</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
