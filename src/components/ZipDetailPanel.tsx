import { useMemo, useState } from "react"
import type { Permit, ZipRecord } from "../data/zips"
import { formatCurrency, getScoreMeta } from "./scoreUtils"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

type ZipDetailPanelProps = {
  zipRecord: ZipRecord | null
  permits: Permit[]
  onClose: () => void
}

const STATUS_COLORS: Record<string, string> = {
  Permitted: "#16a34a",
  Pending: "#f59e0b",
  "Under Review": "#6366f1",
}

const CATEGORY_LABELS: Record<string, string> = {
  "new-construction": "New Const",
  conversion: "Conversion",
  renovation: "Renovation",
}

type DetailTab = "overview" | "permits"

function makeRentTrendData(zr: ZipRecord) {
  const base = zr.rent
  const gm = Math.pow(1 + zr.rg / 100, 1 / 12) - 1
  const today = new Date("2026-04-01T00:00:00")
  return Array.from({ length: 24 }, (_, i) => {
    const d = new Date(today); d.setMonth(today.getMonth() - 23 + i)
    const v = Math.sin(i * 0.8) * (zr.rent * 0.012)
    return { month: d.toLocaleString("en-US", { month: "short" }), rent: Math.round(base * Math.pow(1 - gm, 23 - i) + v) }
  })
}

export function ZipDetailPanel({ zipRecord, permits, onClose }: ZipDetailPanelProps) {
  const [tab, setTab] = useState<DetailTab>("overview")
  const scoreMeta = zipRecord ? getScoreMeta(zipRecord.score) : null

  const rentData = useMemo(() => (zipRecord ? makeRentTrendData(zipRecord) : []), [zipRecord])

  const ncUnits = permits.filter((p) => p.category === "new-construction").reduce((s, p) => s + p.units, 0)
  const cvCount = permits.filter((p) => p.category === "conversion").length
  const rvCount = permits.filter((p) => p.category === "renovation").length

  if (!zipRecord || !scoreMeta) {
    return <aside className="pointer-events-none absolute bottom-2.5 right-2.5 top-2.5 z-[500] w-[376px] translate-x-[108%] rounded-[11px] border border-[#e2e8f0] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-transform duration-200 ease-out" />
  }

  return (
    <aside className="absolute bottom-2.5 right-2.5 top-2.5 z-[500] flex w-[376px] translate-x-0 flex-col rounded-[11px] border border-[#e2e8f0] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.08)] transition-transform duration-200 ease-out">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-[#0f172a]">{zipRecord.zip}</h3>
            <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white" style={{ backgroundColor: scoreMeta.color }}>{scoreMeta.label} · {zipRecord.score}</span>
          </div>
          <p className="text-xs text-[#64748b]">{zipRecord.name}</p>
        </div>
        <button type="button" onClick={onClose} className="rounded-md border border-[#e2e8f0] px-2 py-1 text-xs text-[#64748b] hover:bg-[#f8fafc]" aria-label="Close">×</button>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 text-[10px]">
        <div className="rounded-md bg-[#f8fafc] p-2"><div className="text-[#94a3b8]">Avg Rent</div><div className="font-semibold text-[#0f172a]">{formatCurrency(zipRecord.rent)}</div></div>
        <div className="rounded-md bg-[#f8fafc] p-2"><div className="text-[#94a3b8]">Pipeline</div><div className="font-semibold text-[#0f172a]">{ncUnits}</div></div>
        <div className="rounded-md bg-[#f8fafc] p-2"><div className="text-[#94a3b8]">Vacancy</div><div className="font-semibold text-[#0f172a]">{zipRecord.vac}%</div></div>
        <div className="rounded-md bg-[#f8fafc] p-2"><div className="text-[#94a3b8]">Permits</div><div className="font-semibold text-[#0f172a]">{permits.length}</div></div>
      </div>

      <div className="mt-2 flex gap-1.5 text-[10px]">
        {ncUnits > 0 && <span className="rounded bg-[#dbeafe] px-1.5 py-0.5 font-medium text-[#1e40af]">{ncUnits}u new const</span>}
        {cvCount > 0 && <span className="rounded bg-[#ede9fe] px-1.5 py-0.5 font-medium text-[#5b21b6]">{cvCount} conversions</span>}
        {rvCount > 0 && <span className="rounded bg-[#ffedd5] px-1.5 py-0.5 font-medium text-[#9a3412]">{rvCount} renovations</span>}
      </div>

      <div className="mt-3 grid grid-cols-2 rounded-lg bg-[#f8fafc] p-1 text-xs">
        {(["overview", "permits"] as DetailTab[]).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)}
            className={`rounded-md px-2 py-1.5 font-medium capitalize transition ${tab === t ? "bg-white text-[#2563eb] shadow-sm" : "text-[#64748b] hover:text-[#334155]"}`}>{t}</button>
        ))}
      </div>

      <div className="mt-3 flex-1 space-y-3 overflow-y-auto pr-1">
        {tab === "overview" && (
          <div className="space-y-3">
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(zipRecord.rbt).map(([label, value]) => (
                <div key={label} className="rounded-md border border-[#e2e8f0] p-2 text-[10px]"><div className="text-[#94a3b8]">{label}</div><div className="text-xs font-semibold text-[#0f172a]">{formatCurrency(value)}</div></div>
              ))}
            </div>
            <div className="rounded-lg border border-[#e2e8f0] p-2">
              <div className="mb-2 text-xs font-semibold text-[#334155]">24-Month Rent Trend</div>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={rentData}><defs><linearGradient id="rf" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.4} /><stop offset="95%" stopColor="#2563eb" stopOpacity={0.05} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} /><YAxis tick={{ fill: "#64748b", fontSize: 10 }} width={45} />
                    <Tooltip formatter={(v) => formatCurrency(Number(v ?? 0))} /><Area type="monotone" dataKey="rent" stroke="#2563eb" strokeWidth={2} fill="url(#rf)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] p-3"><p className="text-xs font-semibold text-[#1d4ed8]">Insight</p><p className="mt-1 text-xs leading-relaxed text-[#334155]">{zipRecord.insight}</p></div>
          </div>
        )}

        {tab === "permits" && (
          <div className="space-y-2">
            {permits.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-3 text-xs text-[#64748b]">No active permits for this ZIP.</div>
            ) : permits.map((p) => {
              const sc = STATUS_COLORS[p.status] ?? "#94a3b8"
              return (
                <div key={p.id} className="rounded-lg border border-[#e2e8f0] p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div><p className="text-[11px] font-semibold text-[#0f172a]">{p.addr}</p><p className="text-[10px] text-[#64748b]">{p.dev}</p></div>
                    <div className="flex items-center gap-1">
                      <span className="rounded bg-[#f1f5f9] px-1.5 py-0.5 text-[8px] font-medium text-[#475569]">{CATEGORY_LABELS[p.category]}</span>
                      <span className="flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-semibold text-white" style={{ backgroundColor: sc }}>{p.status}</span>
                    </div>
                  </div>
                  <div className="mt-1.5 flex gap-3 text-[10px] text-[#475569]">
                    <span><b>{p.units}</b>u</span><span>{p.type}</span><span>Est. {p.est}</span>
                  </div>
                  <div className="mt-1 text-[9px] text-[#94a3b8]">Filed {p.filed}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </aside>
  )
}
