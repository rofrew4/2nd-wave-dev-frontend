import { useMemo, useState } from "react"
import type { SignalRecord, ZipRecord } from "../data/zips"
import type { DetailTab } from "../types"
import { formatCurrency, getScoreMeta } from "./scoreUtils"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type ZipDetailPanelProps = {
  zipRecord: ZipRecord | null
  signals: SignalRecord[]
  isSaved: boolean
  onClose: () => void
  onToggleSaved: (zip: string) => void
}

function makeRentTrendData(zipRecord: ZipRecord) {
  const base = zipRecord.rent
  const growthMonthly = Math.pow(1 + zipRecord.rg / 100, 1 / 12) - 1
  const today = new Date("2026-04-01T00:00:00")

  return Array.from({ length: 24 }, (_, idx) => {
    const date = new Date(today)
    date.setMonth(today.getMonth() - 23 + idx)
    const variance = Math.sin(idx * 0.8) * (zipRecord.rent * 0.012)
    const rent = Math.round(base * Math.pow(1 - growthMonthly, 23 - idx) + variance)

    return {
      month: date.toLocaleString("en-US", { month: "short" }),
      rent,
    }
  })
}

function makePermitData(zipRecord: ZipRecord) {
  const today = new Date("2026-04-01T00:00:00")
  return Array.from({ length: 12 }, (_, idx) => {
    const date = new Date(today)
    date.setMonth(today.getMonth() - 11 + idx)

    const baseline = Math.max(1, zipRecord.permits - 2)
    const noise = Math.round(Math.abs(Math.sin(idx * 1.4)) * 4)

    return {
      month: date.toLocaleString("en-US", { month: "short" }),
      permits: baseline + noise,
    }
  })
}

function warningStyle(units: number) {
  if (units >= 160) {
    return {
      box: "border-[#fecaca] bg-[#fef2f2] text-[#991b1b]",
      text: "Heavy pipeline pressure. Rent growth could soften for 12-18 months.",
    }
  }
  if (units >= 90) {
    return {
      box: "border-[#fed7aa] bg-[#fffbeb] text-[#9a3412]",
      text: "Moderate supply risk. Underwrite with conservative lease-up assumptions.",
    }
  }

  return {
    box: "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]",
    text: "Pipeline remains manageable versus current absorption trends.",
  }
}

export function ZipDetailPanel({
  zipRecord,
  signals,
  isSaved,
  onClose,
  onToggleSaved,
}: ZipDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview")

  const scoreMeta = zipRecord ? getScoreMeta(zipRecord.score) : null
  const filteredSignals = useMemo(
    () => signals.filter((signal) => signal.zip === zipRecord?.zip),
    [signals, zipRecord?.zip],
  )

  const rentTrendData = useMemo(
    () => (zipRecord ? makeRentTrendData(zipRecord) : []),
    [zipRecord],
  )
  const permitData = useMemo(
    () => (zipRecord ? makePermitData(zipRecord) : []),
    [zipRecord],
  )

  if (!zipRecord || !scoreMeta) {
    return (
      <aside className="pointer-events-none absolute bottom-2.5 right-2.5 top-2.5 z-[500] w-[376px] translate-x-[108%] rounded-[11px] border border-[#e2e8f0] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-transform duration-200 ease-out" />
    )
  }

  const warning = warningStyle(zipRecord.pipeline)

  return (
    <aside className="absolute bottom-2.5 right-2.5 top-2.5 z-[500] flex w-[376px] translate-x-0 flex-col rounded-[11px] border border-[#e2e8f0] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-transform duration-200 ease-out">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-[#0f172a]">{zipRecord.zip}</h3>
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
              style={{ backgroundColor: scoreMeta.color }}
            >
              {scoreMeta.label} · {zipRecord.score}
            </span>
          </div>
          <p className="text-xs text-[#64748b]">{zipRecord.name}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleSaved(zipRecord.zip)}
            className={`rounded-md border px-2 py-1 text-xs font-medium transition ${
              isSaved
                ? "border-[#fde68a] bg-[#fffbeb] text-[#92400e]"
                : "border-[#e2e8f0] bg-white text-[#334155] hover:border-[#cbd5e1]"
            }`}
          >
            {isSaved ? "★ Saved" : "☆ Save"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-[#e2e8f0] px-2 py-1 text-xs text-[#64748b] hover:bg-[#f8fafc]"
            aria-label="Close ZIP panel"
          >
            ×
          </button>
        </div>
      </div>

      <div className="mt-3 h-2 rounded-full bg-[#e2e8f0]">
        <div
          className="h-full rounded-full"
          style={{ width: `${zipRecord.score}%`, backgroundColor: scoreMeta.color }}
        />
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 text-[10px]">
        <div className="rounded-md bg-[#f8fafc] p-2">
          <div className="text-[#94a3b8]">Avg Rent</div>
          <div className="font-semibold text-[#0f172a]">{formatCurrency(zipRecord.rent)}</div>
        </div>
        <div className="rounded-md bg-[#f8fafc] p-2">
          <div className="text-[#94a3b8]">Pipeline</div>
          <div className="font-semibold text-[#0f172a]">{zipRecord.pipeline}</div>
        </div>
        <div className="rounded-md bg-[#f8fafc] p-2">
          <div className="text-[#94a3b8]">Vacancy</div>
          <div className="font-semibold text-[#0f172a]">{zipRecord.vac}%</div>
        </div>
        <div className="rounded-md bg-[#f8fafc] p-2">
          <div className="text-[#94a3b8]">Cap Rate</div>
          <div className="font-semibold text-[#0f172a]">{zipRecord.cap}%</div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 rounded-lg bg-[#f8fafc] p-1 text-xs">
        {(["overview", "pipeline", "signals"] as DetailTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-2 py-1.5 font-medium capitalize transition ${
              activeTab === tab
                ? "bg-white text-[#2563eb] shadow-sm"
                : "text-[#64748b] hover:text-[#334155]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-1">
        {activeTab === "overview" && (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(zipRecord.rbt).map(([label, value]) => (
                <div key={label} className="rounded-md border border-[#e2e8f0] p-2 text-[10px]">
                  <div className="text-[#94a3b8]">{label}</div>
                  <div className="text-xs font-semibold text-[#0f172a]">
                    {formatCurrency(value)}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-[#e2e8f0] p-2">
              <div className="mb-2 text-xs font-semibold text-[#334155]">24-Month Rent Trend</div>
              <div className="h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart key={`rent-trend-${zipRecord.zip}`} data={rentTrendData}>
                    <defs>
                      <linearGradient id="rentFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} width={45} />
                    <Tooltip
                      formatter={(value) => formatCurrency(Number(value ?? 0))}
                      labelStyle={{ color: "#334155" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="rent"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fill="url(#rentFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg border border-[#e2e8f0] p-2">
              <div className="mb-2 text-xs font-semibold text-[#334155]">Monthly Permit Volume</div>
              <div className="h-[135px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart key={`permit-trend-${zipRecord.zip}`} data={permitData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 10 }} width={30} />
                    <Tooltip />
                    <Bar dataKey="permits" fill="#1d4ed8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] p-3">
              <p className="text-xs font-semibold text-[#1d4ed8]">Intelligence Insight</p>
              <p className="mt-1 text-xs leading-relaxed text-[#334155]">{zipRecord.insight}</p>
            </div>
          </div>
        )}

        {activeTab === "pipeline" && (
          <div className="space-y-3">
            <div className={`rounded-lg border p-2 text-xs ${warning.box}`}>
              <p className="font-semibold">Pipeline Risk Signal</p>
              <p className="mt-0.5">{warning.text}</p>
            </div>

            {zipRecord.projects.map((project) => (
              <div key={`${zipRecord.zip}-${project.addr}`} className="rounded-lg border border-[#e2e8f0] p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-[#0f172a]">{project.addr}</p>
                    <p className="text-[11px] text-[#64748b]">{project.dev}</p>
                  </div>
                  <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[10px] text-[#334155]">
                    {project.status}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <div className="text-[#94a3b8]">Units</div>
                    <div className="font-medium text-[#0f172a]">{project.units}</div>
                  </div>
                  <div>
                    <div className="text-[#94a3b8]">Type</div>
                    <div className="font-medium text-[#0f172a]">{project.type}</div>
                  </div>
                  <div>
                    <div className="text-[#94a3b8]">Est. Delivery</div>
                    <div className="font-medium text-[#0f172a]">{project.est}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "signals" && (
          <div className="space-y-3">
            {filteredSignals.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-3 text-xs text-[#64748b]">
                No active signals for this ZIP this week.
              </div>
            ) : (
              filteredSignals.map((signal) => (
                <div key={signal.id} className="rounded-lg border border-[#e2e8f0] p-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                      style={{ backgroundColor: signal.tagColor }}
                    >
                      {signal.tag}
                    </span>
                    <span className="text-[10px] text-[#94a3b8]">{signal.date}</span>
                  </div>
                  <p className="mt-2 text-xs font-semibold text-[#0f172a]">{signal.headline}</p>
                  <p className="mt-1 text-[11px] text-[#64748b]">{signal.detail}</p>
                  <div
                    className={`mt-2 rounded-md border p-2 text-[11px] ${
                      signal.type === "opportunity"
                        ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
                        : "border-[#fed7aa] bg-[#fffbeb] text-[#9a3412]"
                    }`}
                  >
                    <p className="font-semibold">Recommended Action</p>
                    <p className="mt-0.5">{signal.action}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
