import { useEffect, useMemo, useState } from "react"
import type { ZipRecord } from "../data/zips"

type TopBarProps = {
  zips: ZipRecord[]
  dateFilter: number
  onDateFilterChange: (days: number) => void
}

function asCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

const DATE_OPTIONS = [
  { value: 0, label: "All time" },
  { value: 7, label: "7 days" },
  { value: 30, label: "30 days" },
  { value: 90, label: "90 days" },
]

export function TopBar({ zips, dateFilter, onDateFilterChange }: TopBarProps) {
  const [now, setNow] = useState(() =>
    new Date().toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
  )

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(
        new Date().toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
      )
    }, 60_000)

    return () => window.clearInterval(timer)
  }, [])

  const kpis = useMemo(() => {
    const total = zips.length || 1
    const avgRent = zips.reduce((sum, zip) => sum + zip.rent, 0) / total
    const avgYoY = zips.reduce((sum, zip) => sum + zip.rg, 0) / total
    const avgVacancy = zips.reduce((sum, zip) => sum + zip.vac, 0) / total

    return [
      ["Market", "Miami Beach + North Miami"],
      ["Avg Rent", `${asCurrency(avgRent)} (${avgYoY.toFixed(1)}% YoY)`],
      ["Avg Vacancy", `${avgVacancy.toFixed(1)}%`],
    ] as const
  }, [zips])

  return (
    <header className="flex h-[50px] items-center justify-between border-b border-[#e2e8f0] bg-white px-4">
      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search ZIP, neighborhood, project..."
          className="h-8 w-[220px] rounded-md border border-transparent bg-[#f8fafc] px-3 text-xs text-[#0f172a] outline-none ring-0 placeholder:text-[#94a3b8] focus:border-[#cbd5e1]"
        />

        <div className="hidden items-center gap-4 text-[11px] text-[#64748b] xl:flex">
          {kpis.map(([key, value]) => (
            <div key={key} className="flex items-center gap-1">
              <span className="font-medium text-[#94a3b8]">{key}</span>
              <span className="text-[#0f172a]">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-0.5">
          {DATE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onDateFilterChange(opt.value)}
              className={`rounded-md px-2 py-1 text-[10px] font-medium transition ${
                dateFilter === opt.value
                  ? "bg-white text-[#2563eb] shadow-sm"
                  : "text-[#64748b] hover:text-[#334155]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <span className="text-[#64748b]">{now}</span>
      </div>
    </header>
  )
}
