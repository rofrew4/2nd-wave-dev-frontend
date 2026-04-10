import { useMemo, useState } from "react"
import { ConversionWatch } from "./components/ConversionWatch"
import { MapView } from "./components/MapView"
import { MomentumView } from "./components/MomentumView"
import { SettingsView } from "./components/SettingsView"
import { Sidebar } from "./components/Sidebar"
import { SupplyTracker } from "./components/SupplyTracker"
import { TopBar } from "./components/TopBar"
import { WatchlistView } from "./components/WatchlistView"
import { PERMITS, ZIPS } from "./data/zips"
import type { ActiveView } from "./types"

function App() {
  const [activeView, setActiveView] = useState<ActiveView>("supply")
  const [selectedZip, setSelectedZip] = useState<string | null>(null)
  const [savedZips, setSavedZips] = useState<Set<string>>(new Set())
  const [dateFilter, setDateFilter] = useState(0)

  const watchlistItems = useMemo(
    () => ZIPS.filter((zip) => savedZips.has(zip.zip)),
    [savedZips],
  )

  function toggleSaved(zip: string) {
    setSavedZips((prev) => {
      const next = new Set(prev)
      if (next.has(zip)) {
        next.delete(zip)
      } else {
        next.add(zip)
      }
      return next
    })
  }

  return (
    <div className="h-full min-w-[1280px] bg-[#f1f5f9] text-[#0f172a]">
      <div className="flex h-full">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        <main className="flex flex-1 flex-col">
          <TopBar zips={ZIPS} dateFilter={dateFilter} onDateFilterChange={setDateFilter} />

          <div className="relative flex-1">
            {activeView === "supply" && (
              <SupplyTracker permits={PERMITS} zips={ZIPS} dateFilter={dateFilter} />
            )}

            {activeView === "conversions" && (
              <ConversionWatch permits={PERMITS} zips={ZIPS} dateFilter={dateFilter} />
            )}

            {activeView === "momentum" && (
              <MomentumView permits={PERMITS} zips={ZIPS} dateFilter={dateFilter} />
            )}

            {activeView === "rental" && (
              <MapView
                zips={ZIPS}
                permits={PERMITS}
                selectedZip={selectedZip}
                onSelectZip={setSelectedZip}
                onCloseDetail={() => setSelectedZip(null)}
                savedZips={savedZips}
                onToggleSaved={toggleSaved}
              />
            )}

            {activeView === "watchlist" && (
              <WatchlistView
                items={watchlistItems}
                onOpenZip={(zip) => {
                  setSelectedZip(zip)
                  setActiveView("rental")
                }}
                onRemoveZip={(zip) => {
                  setSavedZips((prev) => {
                    const next = new Set(prev)
                    next.delete(zip)
                    return next
                  })
                }}
              />
            )}

            {activeView === "settings" && <SettingsView />}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
