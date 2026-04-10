import type { ActiveView } from "../types"

type SidebarProps = {
  activeView: ActiveView
  onViewChange: (view: ActiveView) => void
}

const MapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
)

const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
)

const AlertsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)

const NAV_ITEMS: { id: ActiveView; label: string; Icon: React.FC }[] = [
  { id: "map", label: "Map", Icon: MapIcon },
  { id: "dashboard", label: "Dashboard", Icon: DashboardIcon },
  { id: "alerts", label: "Alerts", Icon: AlertsIcon },
]

export function Sidebar({ activeView, onViewChange }: SidebarProps) {
  return (
    <aside className="flex w-[58px] shrink-0 flex-col items-center justify-between bg-[#1e293b] py-3">
      <div className="space-y-4">
        <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-[#1d4ed8] text-sm font-bold text-white shadow">
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
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
                  active
                    ? "bg-[#334155] text-white"
                    : "text-[#94a3b8] hover:bg-[#334155] hover:text-white"
                }`}
                aria-label={item.label}
              >
                <item.Icon />
              </button>
            )
          })}
        </nav>
      </div>

      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#334155] text-xs font-semibold text-[#94a3b8]">
        G
      </div>
    </aside>
  )
}
