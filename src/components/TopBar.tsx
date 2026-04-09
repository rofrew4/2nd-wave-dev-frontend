import { useEffect, useMemo, useState } from "react"
import type { ZipRecord } from "../data/zips"

type TopBarProps = {
  zips: ZipRecord[]
}

function asCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

function asCompact(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value)
}

export function TopBar({ zips }: TopBarProps) {
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
    const activePermits = zips.reduce((sum, zip) => sum + zip.permits, 0)
    const pipelineUnits = zips.reduce((sum, zip) => sum + zip.pipeline, 0)
    const avgVacancy = zips.reduce((sum, zip) => sum + zip.vac, 0) / total

    return [
      ["Market", "Miami Beach + North Miami"],
      ["Avg Rent", `${asCurrency(avgRent)} (${avgYoY.toFixed(1)}% YoY)`],
      ["Active Permits", String(activePermits)],
      ["Pipeline Units", asCompact(pipelineUnits)],
      ["Avg Vacancy", `${avgVacancy.toFixed(1)}%`],
    ] as const
  }, [zips])

  return (
    <header className="flex h-[50px] items-center justify-between border-b border-[#e2e8f0] bg-white px-4">
      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search ZIP, neighborhood, project..."
          className="h-8 w-[240px] rounded-md border border-transparent bg-[#f8fafc] px-3 text-xs text-[#0f172a] outline-none ring-0 placeholder:text-[#94a3b8] focus:border-[#cbd5e1]"
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

      <div className="flex items-center gap-3 text-xs text-[#64748b]">
        <span>{now}</span>
        <button
          type="button"
          className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[#e2e8f0] text-[14px]"
          aria-label="Notifications"
        >
          🔔
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#dc2626]" />
        </button>
      </div>
    </header>
  )
}
