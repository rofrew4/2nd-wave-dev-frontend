import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { Permit, ZipRecord } from "../data/zips"

type MomentumViewProps = {
  permits: Permit[]
  zips: ZipRecord[]
  dateFilter: number
}

function isRecent(filed: string, days: number): boolean {
  const filedDate = new Date(filed)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return filedDate >= cutoff
}

export function MomentumView({ permits, zips, dateFilter }: MomentumViewProps) {
  const zipsByCode = useMemo(() => new Map(zips.map((z) => [z.zip, z])), [zips])

  const renovations = useMemo(() => {
    let filtered = permits.filter((p) => p.category === "renovation")
    if (dateFilter > 0) filtered = filtered.filter((p) => isRecent(p.filed, dateFilter))
    return filtered.sort((a, b) => b.filed.localeCompare(a.filed))
  }, [permits, dateFilter])

  const totalUnits = renovations.reduce((s, p) => s + p.units, 0)

  const monthlyData = useMemo(() => {
    const allRenos = permits.filter((p) => p.category === "renovation")
    const months = new Map<string, { count: number; units: number }>()
    const today = new Date("2026-04-10")
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today)
      d.setMonth(d.getMonth() - i)
      const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" })
      months.set(key, { count: 0, units: 0 })
    }
    for (const p of allRenos) {
      const d = new Date(p.filed)
      const key = d.toLocaleString("en-US", { month: "short", year: "2-digit" })
      const existing = months.get(key)
      if (existing) {
        existing.count++
        existing.units += p.units
      }
    }
    return Array.from(months.entries()).map(([month, data]) => ({ month, ...data }))
  }, [permits])

  const byZip = useMemo(() => {
    const m = new Map<string, { count: number; units: number }>()
    for (const r of renovations) {
      const e = m.get(r.zip) ?? { count: 0, units: 0 }
      e.count++
      e.units += r.units
      m.set(r.zip, e)
    }
    return Array.from(m.entries())
      .map(([zip, data]) => ({ zip, name: zipsByCode.get(zip)?.name ?? zip, ...data }))
      .sort((a, b) => b.units - a.units)
  }, [renovations, zipsByCode])

  const trendDirection = useMemo(() => {
    if (monthlyData.length < 2) return "flat"
    const recent = monthlyData.slice(-2)
    const older = monthlyData.slice(0, 2)
    const recentAvg = recent.reduce((s, d) => s + d.count, 0) / recent.length
    const olderAvg = older.reduce((s, d) => s + d.count, 0) / Math.max(older.length, 1)
    if (recentAvg > olderAvg * 1.2) return "up"
    if (recentAvg < olderAvg * 0.8) return "down"
    return "flat"
  }, [monthlyData])

  const trendEmoji = trendDirection === "up" ? "🟢" : trendDirection === "down" ? "🔴" : "🟡"
  const trendText = trendDirection === "up" ? "Rising — smart money is improving existing stock"
    : trendDirection === "down" ? "Declining — renovation activity slowing"
    : "Steady — stable renovation volume"

  const STATUS_COLORS: Record<string, string> = {
    Permitted: "#16a34a",
    Pending: "#f59e0b",
  }

  return (
    <section className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <div>
          <h2 className="text-xl font-semibold text-[#0f172a]">Neighborhood Momentum</h2>
          <p className="text-sm text-[#64748b]">Major renovation permits as a volume trend. Rising volume = neighborhood trajectory is up.</p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
            <div className="text-[11px] text-[#94a3b8]">Active Reno Permits</div>
            <div className="mt-1 text-2xl font-bold text-[#0f172a]">{renovations.length}</div>
          </div>
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
            <div className="text-[11px] text-[#94a3b8]">Units Under Renovation</div>
            <div className="mt-1 text-2xl font-bold text-[#0f172a]">{totalUnits.toLocaleString()}</div>
          </div>
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
            <div className="text-[11px] text-[#94a3b8]">ZIPs with Activity</div>
            <div className="mt-1 text-2xl font-bold text-[#0f172a]">{byZip.length}</div>
          </div>
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
            <div className="text-[11px] text-[#94a3b8]">Trend</div>
            <div className="mt-1 text-lg font-bold text-[#0f172a]">{trendEmoji} {trendDirection === "up" ? "Rising" : trendDirection === "down" ? "Declining" : "Steady"}</div>
          </div>
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
          <div className="text-sm font-semibold text-[#0f172a]">Renovation Permit Volume — Last 6 Months</div>
          <p className="mt-0.5 text-[11px] text-[#64748b]">{trendEmoji} {trendText}</p>
          <div className="mt-3 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} allowDecimals={false} width={30} />
                <Tooltip
                  formatter={(value, name) => [String(value), name === "count" ? "Permits" : "Units"]}
                  labelStyle={{ color: "#334155" }}
                />
                <Bar dataKey="count" name="Permits" radius={[4, 4, 0, 0]}>
                  {monthlyData.map((entry, idx) => (
                    <Cell key={entry.month} fill={idx >= monthlyData.length - 2 ? "#2563eb" : "#93c5fd"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
            <div className="text-sm font-semibold text-[#0f172a]">Activity by ZIP</div>
            <div className="mt-3 space-y-2">
              {byZip.map((z) => {
                const maxUnits = byZip[0]?.units ?? 1
                const pct = Math.round((z.units / maxUnits) * 100)
                return (
                  <div key={z.zip}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#0f172a]">{z.zip} · {z.name}</span>
                      <span className="text-[#64748b]">{z.count} permits · {z.units} units</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-[#f1f5f9]">
                      <div className="h-full rounded-full bg-[#2563eb]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
            <div className="text-sm font-semibold text-[#0f172a]">Recent Renovation Permits</div>
            <div className="mt-3 space-y-2">
              {renovations.slice(0, 8).map((p) => {
                const sc = STATUS_COLORS[p.status] ?? "#94a3b8"
                return (
                  <div key={p.id} className="flex items-start justify-between rounded-lg border border-[#f1f5f9] p-2">
                    <div>
                      <p className="text-[11px] font-semibold text-[#0f172a]">{p.addr}</p>
                      <p className="text-[10px] text-[#64748b]">{p.type} · {p.dev} · {p.units} units</p>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="flex items-center gap-1 text-[9px]">
                        <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: sc }} />
                        {p.status}
                      </span>
                      <span className="text-[9px] text-[#94a3b8]">{p.filed}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
