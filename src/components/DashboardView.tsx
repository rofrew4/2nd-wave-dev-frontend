import { useMemo, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { Permit, ZipRecord } from "../data/zips"
import { formatCurrency, getScoreMeta } from "./scoreUtils"

type DashboardViewProps = {
  permits: Permit[]
  zips: ZipRecord[]
}

const STATUS_COLORS: Record<string, string> = {
  Permitted: "#16a34a",
  Pending: "#f59e0b",
  "Under Review": "#6366f1",
}

export function DashboardView({ permits, zips }: DashboardViewProps) {
  const [selectedZip, setSelectedZip] = useState("all")
  const zipsByCode = useMemo(() => new Map(zips.map((z) => [z.zip, z])), [zips])

  const filtered = useMemo(() =>
    selectedZip === "all" ? permits : permits.filter((p) => p.zip === selectedZip)
  , [permits, selectedZip])

  const nc = filtered.filter((p) => p.category === "new-construction")
  const cv = filtered.filter((p) => p.category === "conversion")
  const rv = filtered.filter((p) => p.category === "renovation")
  const ncUnits = nc.reduce((s, p) => s + p.units, 0)
  const cvUnits = cv.reduce((s, p) => s + p.units, 0)
  const rvUnits = rv.reduce((s, p) => s + p.units, 0)

  const monthlyData = useMemo(() => {
    const months = new Map<string, { nc: number; cv: number; rv: number }>()
    const today = new Date("2026-04-10")
    for (let i = 5; i >= 0; i--) { const d = new Date(today); d.setMonth(d.getMonth() - i); months.set(d.toLocaleString("en-US", { month: "short", year: "2-digit" }), { nc: 0, cv: 0, rv: 0 }) }
    for (const p of filtered) {
      const d = new Date(p.filed); const k = d.toLocaleString("en-US", { month: "short", year: "2-digit" })
      const e = months.get(k); if (!e) continue
      if (p.category === "new-construction") e.nc++; else if (p.category === "conversion") e.cv++; else e.rv++
    }
    return Array.from(months.entries()).map(([month, d]) => ({ month, ...d, total: d.nc + d.cv + d.rv }))
  }, [filtered])

  const byZip = useMemo(() => {
    const m = new Map<string, { nc: number; cv: number; rv: number; total: number }>()
    for (const p of permits) {
      const e = m.get(p.zip) ?? { nc: 0, cv: 0, rv: 0, total: 0 }
      if (p.category === "new-construction") e.nc += p.units; else if (p.category === "conversion") e.cv += p.units; else e.rv += p.units
      e.total += p.units; m.set(p.zip, e)
    }
    return Array.from(m.entries())
      .map(([zip, d]) => ({ zip, name: zipsByCode.get(zip)?.name ?? zip, ...d }))
      .sort((a, b) => b.total - a.total)
  }, [permits, zipsByCode])

  const recentConversions = cv.sort((a, b) => b.filed.localeCompare(a.filed)).slice(0, 5)

  const recentTrend = (() => {
    if (monthlyData.length < 2) return "flat"
    const last2 = monthlyData.slice(-2).reduce((s, d) => s + d.total, 0) / 2
    const first2 = monthlyData.slice(0, 2).reduce((s, d) => s + d.total, 0) / Math.max(monthlyData.slice(0, 2).length, 1)
    if (last2 > first2 * 1.2) return "up"
    if (last2 < first2 * 0.8) return "down"
    return "flat"
  })()

  const selectedZipRecord = selectedZip !== "all" ? zipsByCode.get(selectedZip) : null

  return (
    <section className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#0f172a]">Dashboard</h2>
            <p className="text-sm text-[#64748b]">{selectedZip === "all" ? "Market-wide analysis across all focus ZIPs" : `Analysis for ${selectedZipRecord?.zip} — ${selectedZipRecord?.name}`}</p>
          </div>
          <select value={selectedZip} onChange={(e) => setSelectedZip(e.target.value)}
            className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-sm text-[#334155] outline-none">
            <option value="all">All ZIPs</option>
            {zips.map((z) => <option key={z.zip} value={z.zip}>{z.zip} — {z.name}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-5 gap-3">
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4"><div className="text-[11px] text-[#94a3b8]">Total Permits</div><div className="mt-1 text-2xl font-bold text-[#0f172a]">{filtered.length}</div></div>
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4"><div className="text-[11px] text-[#94a3b8]">New Construction</div><div className="mt-1 text-2xl font-bold text-[#2563eb]">{ncUnits}<span className="ml-1 text-sm font-normal text-[#64748b]">units</span></div><div className="text-[10px] text-[#64748b]">{nc.length} permits</div></div>
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4"><div className="text-[11px] text-[#94a3b8]">Conversions</div><div className="mt-1 text-2xl font-bold text-[#7c3aed]">{cvUnits}<span className="ml-1 text-sm font-normal text-[#64748b]">units</span></div><div className="text-[10px] text-[#64748b]">{cv.length} permits</div></div>
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4"><div className="text-[11px] text-[#94a3b8]">Renovations</div><div className="mt-1 text-2xl font-bold text-[#ea580c]">{rvUnits}<span className="ml-1 text-sm font-normal text-[#64748b]">units</span></div><div className="text-[10px] text-[#64748b]">{rv.length} permits</div></div>
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4"><div className="text-[11px] text-[#94a3b8]">Momentum</div><div className="mt-1 text-lg font-bold text-[#0f172a]">{recentTrend === "up" ? "🟢 Rising" : recentTrend === "down" ? "🔴 Declining" : "🟡 Steady"}</div><div className="text-[10px] text-[#64748b]">{recentTrend === "up" ? "Permit volume increasing" : recentTrend === "down" ? "Activity slowing" : "Stable volume"}</div></div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 rounded-xl border border-[#e2e8f0] bg-white p-4">
            <div className="text-sm font-semibold text-[#0f172a]">Permit Volume — Last 6 Months</div>
            <div className="mt-3 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#64748b", fontSize: 11 }} allowDecimals={false} width={30} />
                  <Tooltip />
                  <Bar dataKey="nc" name="New Construction" stackId="a" fill="#2563eb" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="cv" name="Conversion" stackId="a" fill="#7c3aed" />
                  <Bar dataKey="rv" name="Renovation" stackId="a" fill="#ea580c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
            <div className="text-sm font-semibold text-[#0f172a]">Conversion Watch</div>
            <p className="mt-0.5 text-[10px] text-[#64748b]">Hotel, retail, office → residential</p>
            {recentConversions.length === 0 ? (
              <div className="mt-4 text-xs text-[#94a3b8]">No conversions in selection.</div>
            ) : (
              <div className="mt-3 space-y-2">
                {recentConversions.map((p) => (
                  <div key={p.id} className="rounded-lg border border-[#f1f5f9] p-2">
                    <p className="text-[11px] font-semibold text-[#0f172a]">{p.addr}</p>
                    <p className="text-[10px] text-[#64748b]">{p.type} · {p.units}u · {p.dev}</p>
                    <div className="mt-1 flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[p.status] }} /><span className="text-[9px] text-[#64748b]">{p.status} · Filed {p.filed}</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
            <div className="text-sm font-semibold text-[#0f172a]">Activity by ZIP</div>
            <div className="mt-3 space-y-2.5">
              {byZip.map((z) => {
                const max = byZip[0]?.total ?? 1
                const ncPct = Math.round((z.nc / max) * 100)
                const cvPct = Math.round((z.cv / max) * 100)
                const rvPct = Math.round((z.rv / max) * 100)
                const sm = getScoreMeta(zipsByCode.get(z.zip)?.score ?? 0)
                return (
                  <button key={z.zip} type="button" onClick={() => setSelectedZip(z.zip)} className="block w-full text-left">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#0f172a]"><span className="mr-1 inline-block h-2 w-2 rounded-full" style={{ backgroundColor: sm.color }} />{z.zip} · {z.name}</span>
                      <span className="text-[#64748b]">{z.total} units</span>
                    </div>
                    <div className="mt-1 flex h-2 overflow-hidden rounded-full bg-[#f1f5f9]">
                      {ncPct > 0 && <div className="bg-[#2563eb]" style={{ width: `${ncPct}%` }} />}
                      {cvPct > 0 && <div className="bg-[#7c3aed]" style={{ width: `${cvPct}%` }} />}
                      {rvPct > 0 && <div className="bg-[#ea580c]" style={{ width: `${rvPct}%` }} />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
            <div className="text-sm font-semibold text-[#0f172a]">Rental Context</div>
            <div className="mt-3 space-y-2">
              {(selectedZip === "all" ? zips.slice(0, 6) : zips.filter((z) => z.zip === selectedZip)).map((z) => {
                const sm = getScoreMeta(z.score)
                return (
                  <div key={z.zip} className="flex items-center justify-between rounded-lg border border-[#f1f5f9] p-2.5">
                    <div>
                      <div className="flex items-center gap-2"><span className="text-[11px] font-semibold text-[#0f172a]">{z.zip}</span><span className="rounded-full px-1.5 py-0.5 text-[8px] font-semibold text-white" style={{ backgroundColor: sm.color }}>{z.score}</span></div>
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
      </div>
    </section>
  )
}
