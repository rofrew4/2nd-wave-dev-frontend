import { useMemo, useState } from "react"
import type { ZipRecord } from "../data/zips"
import type { ListSort } from "../types"
import { formatCurrency, getScoreMeta } from "./scoreUtils"

type ZipListProps = {
  zips: ZipRecord[]
  selectedZip: string | null
  onSelectZip: (zip: string) => void
}

const SORT_TABS: { id: ListSort; label: string }[] = [
  { id: "score", label: "Score" },
  { id: "rent", label: "Rent" },
  { id: "pipeline", label: "Pipeline" },
  { id: "vacancy", label: "Vacancy" },
]

export function ZipList({ zips, selectedZip, onSelectZip }: ZipListProps) {
  const [sortBy, setSortBy] = useState<ListSort>("score")

  const sorted = useMemo(() => {
    return [...zips].sort((a, b) => {
      if (sortBy === "vacancy") {
        return a.vac - b.vac
      }

      return b[sortBy] - a[sortBy]
    })
  }, [sortBy, zips])

  return (
    <div className="absolute bottom-2.5 left-2.5 top-2.5 z-[500] flex w-[248px] flex-col rounded-[11px] border border-[#e2e8f0] bg-white p-3 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
      <h2 className="text-sm font-semibold text-[#0f172a]">ZIP Code Rankings</h2>

      <div className="mt-3 grid grid-cols-4 gap-1 rounded-lg bg-[#f8fafc] p-1">
        {SORT_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setSortBy(tab.id)}
            className={`rounded-md px-2 py-1 text-[11px] font-medium transition ${
              sortBy === tab.id
                ? "bg-white text-[#2563eb] shadow-sm"
                : "text-[#64748b] hover:text-[#334155]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-2 text-[10px] text-[#64748b]">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#16a34a]" />
          Strong
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#2563eb]" />
          Opp.
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#d97706]" />
          Neutral
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[#dc2626]" />
          Risk
        </span>
      </div>

      <div className="mt-3 flex-1 space-y-2 overflow-y-auto pr-1">
        {sorted.map((zip) => {
          const scoreMeta = getScoreMeta(zip.score)
          const selected = selectedZip === zip.zip

          return (
            <button
              key={zip.zip}
              type="button"
              onClick={() => onSelectZip(zip.zip)}
              className={`w-full rounded-lg border p-2 text-left transition ${
                selected
                  ? "border-[#93c5fd] bg-[#eff6ff]"
                  : "border-[#e2e8f0] bg-white hover:border-[#cbd5e1]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold text-[#0f172a]">
                    {zip.zip}
                  </div>
                  <div className="text-[11px] text-[#64748b]">{zip.name}</div>
                </div>
                <div
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                  style={{ backgroundColor: scoreMeta.color }}
                >
                  {zip.score}
                </div>
              </div>

              <div className="mt-2 grid grid-cols-3 gap-1.5 text-[10px]">
                <div className="rounded-md bg-[#f8fafc] p-1.5">
                  <div className="text-[#94a3b8]">Rent</div>
                  <div className="font-medium text-[#0f172a]">
                    {formatCurrency(zip.rent)}
                  </div>
                </div>
                <div className="rounded-md bg-[#f8fafc] p-1.5">
                  <div className="text-[#94a3b8]">YoY</div>
                  <div className="font-medium text-[#0f172a]">{zip.rg}%</div>
                </div>
                <div className="rounded-md bg-[#f8fafc] p-1.5">
                  <div className="text-[#94a3b8]">Pipeline</div>
                  <div className="font-medium text-[#0f172a]">{zip.pipeline}</div>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
