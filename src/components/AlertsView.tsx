import { useMemo, useState } from "react"
import type { Permit, ZipRecord } from "../data/zips"
import { ALERTS_SUMMARY } from "../data/zips"

type AlertsViewProps = {
  permits: Permit[]
  zips: ZipRecord[]
}

type AlertFilter = "all" | "new-construction" | "conversion" | "renovation"

const CATEGORY_LABELS: Record<string, string> = {
  "new-construction": "New Construction",
  conversion: "Conversion",
  renovation: "Renovation",
}

const CATEGORY_COLORS: Record<string, string> = {
  "new-construction": "#1d4ed8",
  conversion: "#0891b2",
  renovation: "#64748b",
}

const STATUS_COLORS: Record<string, string> = {
  Permitted: "#0f766e",
  Pending: "#2563eb",
  "Under Review": "#94a3b8",
}

function daysSince(filed: string): number {
  return Math.max(0, Math.round((Date.now() - new Date(filed).getTime()) / 86400000))
}

export function AlertsView({ permits, zips }: AlertsViewProps) {
  const [filter, setFilter] = useState<AlertFilter>("all")
  const zipsByCode = useMemo(() => new Map(zips.map((z) => [z.zip, z])), [zips])

  const sorted = useMemo(() => {
    const filtered = filter === "all" ? permits : permits.filter((p) => p.category === filter)
    return [...filtered].sort((a, b) => b.filed.localeCompare(a.filed))
  }, [permits, filter])

  const recentCount = sorted.filter((p) => daysSince(p.filed) <= 30).length

  return (
    <section className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#0f172a]">Alerts</h2>
            <p className="text-sm text-[#64748b]">
              Recent permit filings sorted by date. <span className="font-medium text-[#2563eb]">{recentCount} in the last 30 days.</span>
            </p>
          </div>
          <div className="flex gap-1 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-0.5 text-xs">
            {([{ v: "all" as AlertFilter, l: "All" }, { v: "new-construction" as AlertFilter, l: "New Const" }, { v: "conversion" as AlertFilter, l: "Conversion" }, { v: "renovation" as AlertFilter, l: "Renovation" }]).map((o) => (
              <button key={o.v} type="button" onClick={() => setFilter(o.v)}
                className={`rounded-md px-2.5 py-1 font-medium transition ${filter === o.v ? "bg-white text-[#2563eb] shadow-sm" : "text-[#64748b] hover:text-[#334155]"}`}>
                {o.l}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex gap-5">
          {/* Left column: permit feed (70%) */}
          <div className="w-[70%] space-y-2">
            {sorted.map((p) => {
              const catColor = CATEGORY_COLORS[p.category] ?? "#94a3b8"
              const sc = STATUS_COLORS[p.status] ?? "#94a3b8"
              const zr = zipsByCode.get(p.zip)
              const days = daysSince(p.filed)
              const isNew = days <= 7
              const isRecentFiling = days <= 30

              return (
                <article key={p.id} className={`rounded-xl border bg-white p-4 shadow-sm ${isNew ? "border-[#93c5fd] bg-[#eff6ff]/50" : "border-[#e2e8f0]"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: catColor }}>{CATEGORY_LABELS[p.category]}</span>
                        <span className="flex items-center gap-1 text-[10px]">
                          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: sc }} />
                          <span className="font-medium text-[#334155]">{p.status}</span>
                        </span>
                        <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-medium text-[#334155]">ZIP {p.zip}</span>
                        {isNew && <span className="rounded-full bg-[#dbeafe] px-2 py-0.5 text-[10px] font-semibold text-[#1d4ed8]">NEW</span>}
                        {!isNew && isRecentFiling && <span className="text-[10px] text-[#2563eb]">Last 30d</span>}
                      </div>
                      <h3 className="mt-2 text-sm font-semibold text-[#0f172a]">
                        {p.units}-unit {p.type.toLowerCase()} at {p.addr}
                      </h3>
                      <p className="mt-0.5 text-sm text-[#64748b]">
                        {p.dev} · Est. delivery {p.est} · {zr?.name ?? p.zip}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-xs font-semibold text-[#0f172a]">{p.filed}</div>
                      <div className="text-[10px] text-[#94a3b8]">{days === 0 ? "Today" : `${days}d ago`}</div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {/* Right column: AI summary sidebar (30%) */}
          <div className="w-[30%]">
            <div className="sticky top-6 space-y-4">
              <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                <div className="text-xs font-semibold text-[#0f172a]">Market Summary</div>
                <p className="mt-2 text-[12px] leading-relaxed text-[#475569]">{ALERTS_SUMMARY.current}</p>
              </div>

              <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                <div className="text-xs font-semibold text-[#0f172a]">This Week</div>
                <p className="mt-2 text-[12px] leading-relaxed text-[#475569]">{ALERTS_SUMMARY.thisWeek}</p>
              </div>

              <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] p-4">
                <div className="text-xs font-semibold text-[#0f172a]">This Month</div>
                <p className="mt-2 text-[12px] leading-relaxed text-[#475569]">{ALERTS_SUMMARY.thisMonth}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
