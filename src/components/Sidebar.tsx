import type { ActiveView } from "../types"

type SidebarProps = {
  activeView: ActiveView
  onViewChange: (view: ActiveView) => void
}

type NavItem = {
  id: ActiveView
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { id: "map", label: "Map", icon: "M" },
  { id: "signals", label: "Signals", icon: "⚡" },
  { id: "watchlist", label: "Watchlist", icon: "🔖" },
  { id: "settings", label: "Settings", icon: "⚙" },
]

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="flex w-[58px] shrink-0 flex-col items-center justify-between border-r border-[#e2e8f0] bg-white py-3">
      <div className="space-y-4">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#3b82f6] to-[#7c3aed] text-sm font-bold text-white shadow">
          Z
        </div>

        <nav className="flex flex-col items-center gap-2">
          {NAV_ITEMS.map((item) => {
            const active = activeView === item.id

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onViewChange(item.id)}
                title={item.label}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-[16px] transition ${
                  active
                    ? "bg-[#eff6ff] text-[#2563eb]"
                    : "text-[#64748b] hover:bg-[#f8fafc]"
                }`}
                aria-label={item.label}
              >
                {item.icon}
              </button>
            )
          })}
        </nav>
      </div>

      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e2e8f0] text-xs font-semibold text-[#334155]">
        G
      </div>
    </aside>
  )
}
