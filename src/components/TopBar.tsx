import { useEffect, useMemo, useState } from "react"
import type { Permit, ZipRecord } from "../data/zips"

type TopBarProps = {
  zips: ZipRecord[]
  permits: Permit[]
}

function asCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
}

export function TopBar({ zips, permits }: TopBarProps) {
  const [now, setNow] = useState(() =>
    new Date().toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }),
  )

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date().toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }))
    }, 60_000)
    return () => window.clearInterval(timer)
  }, [])

  const kpis = useMemo(() => {
    const t = zips.length || 1
    const avgRent = zips.reduce((s, z) => s + z.rent, 0) / t
    const avgYoY = zips.reduce((s, z) => s + z.rg, 0) / t
    return [
      ["Market", "Miami Beach + North Miami"],
      ["Avg Rent", `${asCurrency(avgRent)} (${avgYoY.toFixed(1)}% YoY)`],
      ["Permits", String(permits.length)],
    ] as const
  }, [zips, permits])

  return (
    <header className="flex h-[50px] items-center justify-between border-b border-[#e2e8f0] bg-white px-4">
      <div className="flex items-center gap-4">
        <input type="search" placeholder="Search ZIP, address, developer..."
          className="h-8 w-[240px] rounded-md border border-transparent bg-[#f8fafc] px-3 text-xs text-[#0f172a] outline-none ring-0 placeholder:text-[#94a3b8] focus:border-[#cbd5e1]" />
        <div className="hidden items-center gap-4 text-[11px] text-[#64748b] xl:flex">
          {kpis.map(([k, v]) => (<div key={k} className="flex items-center gap-1"><span className="font-medium text-[#94a3b8]">{k}</span><span className="text-[#0f172a]">{v}</span></div>))}
        </div>
      </div>
      <span className="text-xs text-[#64748b]">{now}</span>
    </header>
  )
}
