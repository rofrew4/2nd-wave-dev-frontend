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
import type { Permit, ZipRecord } from "../data/zips"
import { AI_SUMMARIES, ZIP_TRENDS } from "../data/zips"
import { formatCurrency, getScoreMeta } from "./scoreUtils"

type DashboardViewProps = {
  permits: Permit[]
  zips: ZipRecord[]
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

  const trendsToShow = useMemo(() => {
    if (selectedZip !== "all") {
      const data = ZIP_TRENDS[selectedZip]
      if (!data) return []
      const zr = zipsByCode.get(selectedZip)
      return [{ zip: selectedZip, name: zr?.name ?? selectedZip, data }]
    }
    return Object.entries(ZIP_TRENDS)
      .map(([zip, data]) => ({ zip, name: zipsByCode.get(zip)?.name ?? zip, data }))
      .sort((a, b) => {
        const aLast = a.data[a.data.length - 1]?.filed ?? 0
        const bLast = b.data[b.data.length - 1]?.filed ?? 0
        return bLast - aLast
      })
  }, [selectedZip, zipsByCode])

  const coldZones = useMemo(() => {
    return zips
      .map((z) => {
        const trend = ZIP_TRENDS[z.zip]
        const lastQ = trend?.[trend.length - 1]?.filed ?? 0
        const prevQ = trend?.[trend.length - 2]?.filed ?? 0
        return { ...z, lastQ, prevQ, delta: lastQ - prevQ }
      })
      .filter((z) => z.lastQ <= 5 || z.delta < -5)
      .sort((a, b) => a.lastQ - b.lastQ)
  }, [zips])

  const aiSummary = selectedZip === "all" ? AI_SUMMARIES.all : AI_SUMMARIES[selectedZip] ?? null

  return (
    <section className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#0f172a]">Dashboard</h2>
            <p className="text-sm text-[#64748b]">
              {selectedZip === "all"
                ? "Market-wide analysis across all focus ZIPs"
                : `Analysis for ${zipsByCode.get(selectedZip)?.zip} — ${zipsByCode.get(selectedZip)?.name}`}
            </p>
          </div>
          <select value={selectedZip} onChange={(e) => setSelectedZip(e.target.value)}
            className="rounded-lg border border-[#e2e8f0] bg-white px-3 py-1.5 text-sm text-[#334155] outline-none">
            <option value="all">All ZIPs</option>
            {zips.map((z) => <option key={z.zip} value={z.zip}>{z.zip} — {z.name}</option>)}
          </select>
        </div>

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

        {aiSummary && (
          <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#94a3b8]">AI Analysis</div>
            <p className="mt-2 text-sm leading-relaxed text-[#334155]">{aiSummary}</p>
          </div>
        )}

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
          <div className="text-sm font-semibold text-[#0f172a]">Permit Trends by ZIP</div>
          <p className="mt-0.5 text-[10px] text-[#64748b]">Quarterly filed vs permitted — Q2 2024 through Q2 2026</p>

          {trendsToShow.length === 0 ? (
            <div className="mt-4 text-xs text-[#94a3b8]">No trend data for this selection.</div>
          ) : (
            <div className={`mt-4 grid gap-4 ${selectedZip === "all" ? "grid-cols-2" : "grid-cols-1"}`}>
              {trendsToShow.map((zt) => {
                const lastFiled = zt.data[zt.data.length - 1]?.filed ?? 0
                const prevFiled = zt.data[zt.data.length - 2]?.filed ?? 0
                const delta = lastFiled - prevFiled
                const trendLabel = delta > 3 ? "Rising" : delta < -3 ? "Declining" : "Steady"
                const trendColor = delta > 3 ? "#0f766e" : delta < -3 ? "#b91c1c" : "#64748b"

                return (
                  <div key={zt.zip} className="rounded-lg border border-[#f1f5f9] p-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] font-semibold text-[#0f172a]">{zt.zip} — {zt.name}</div>
                      <span className="text-[10px] font-semibold" style={{ color: trendColor }}>{trendLabel}</span>
                    </div>
                    <div className={selectedZip === "all" ? "mt-2 h-[120px]" : "mt-2 h-[200px]"}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={zt.data}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="quarter" tick={{ fill: "#64748b", fontSize: 9 }} interval="preserveStartEnd" />
                          <YAxis tick={{ fill: "#64748b", fontSize: 9 }} allowDecimals={false} width={28} />
                          <Tooltip />
                          <Line type="monotone" dataKey="filed" name="Filed" stroke="#1d4ed8" strokeWidth={2} dot={{ r: 2 }} />
                          <Line type="monotone" dataKey="permitted" name="Permitted" stroke="#0f766e" strokeWidth={2} dot={{ r: 2 }} strokeDasharray="4 2" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#e2e8f0] bg-white p-4">
          <div className="text-sm font-semibold text-[#0f172a]">Cold Zones</div>
          <p className="mt-0.5 text-[10px] text-[#64748b]">ZIPs with low or declining permit activity — underserved markets or regulatory barriers</p>

          {coldZones.length === 0 ? (
            <div className="mt-4 text-xs text-[#94a3b8]">All ZIPs show healthy permit activity.</div>
          ) : (
            <div className="mt-3 space-y-2">
              {coldZones.map((z) => {
                const sm = getScoreMeta(z.score)
                return (
                  <button key={z.zip} type="button" onClick={() => setSelectedZip(z.zip)}
                    className="flex w-full items-center justify-between rounded-lg border border-[#f1f5f9] p-3 text-left hover:bg-[#f8fafc]">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-[#0f172a]">{z.zip}</span>
                        <span className="rounded-full px-1.5 py-0.5 text-[8px] font-semibold text-white" style={{ backgroundColor: sm.color }}>{sm.label}</span>
                        <span className="rounded bg-[#fef2f2] px-1.5 py-0.5 text-[9px] font-medium text-[#b91c1c]">
                          {z.lastQ <= 5 ? `Only ${z.lastQ} permits/qtr` : `${z.delta > 0 ? "+" : ""}${z.delta} QoQ`}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[10px] text-[#64748b]">{z.name}</p>
                    </div>
                    <div className="text-right text-[10px]">
                      <div className="font-semibold text-[#0f172a]">{formatCurrency(z.rent)}</div>
                      <div className="text-[#64748b]">{z.rg}% YoY · {z.vac}% vacancy</div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

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
