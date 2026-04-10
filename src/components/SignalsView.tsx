import { useMemo, useState } from "react"
import type { SignalRecord } from "../data/zips"

type SignalsViewProps = {
  signals: SignalRecord[]
}

type SignalFilter = "all" | "permit" | "rental"

const FILTERS: { id: SignalFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "permit", label: "Permits" },
  { id: "rental", label: "Rental" },
]

export function SignalsView({ signals }: SignalsViewProps) {
  const [filter, setFilter] = useState<SignalFilter>("all")

  const filteredSignals = useMemo(
    () =>
      signals.filter((signal) => {
        if (filter === "all") {
          return true
        }
        return signal.type === filter
      }),
    [filter, signals],
  )

  return (
    <section className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#0f172a]">Signals Feed</h2>
            <p className="text-sm text-[#64748b]">
              Permit activity and rental market signals across focus ZIP codes.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-1 rounded-lg border border-[#e2e8f0] bg-white p-1 text-xs">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`rounded-md px-2 py-1.5 font-medium transition ${
                  filter === item.id
                    ? "bg-[#eff6ff] text-[#1d4ed8]"
                    : "text-[#64748b] hover:bg-[#f8fafc]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {filteredSignals.map((signal) => (
            <article key={signal.id} className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                  style={{ backgroundColor: signal.tagColor }}
                >
                  {signal.tag}
                </span>
                <span className="rounded-full bg-[#f1f5f9] px-2 py-0.5 text-[10px] font-medium text-[#334155]">
                  ZIP {signal.zip}
                </span>
                <span className="text-[11px] text-[#94a3b8]">{signal.date}</span>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-[#0f172a]">{signal.headline}</h3>
              <p className="mt-1 text-sm text-[#64748b]">{signal.detail}</p>
              <div
                className={`mt-3 rounded-md border p-3 text-sm ${
                  signal.type === "permit"
                    ? "border-[#bbf7d0] bg-[#f0fdf4] text-[#166534]"
                    : "border-[#bfdbfe] bg-[#eff6ff] text-[#1e40af]"
                }`}
              >
                <div className="text-xs font-semibold uppercase tracking-wide">
                  Recommended Action
                </div>
                <p className="mt-1">{signal.action}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
