import { useMemo, useState } from "react"
import { MapView } from "./components/MapView"
import { SettingsView } from "./components/SettingsView"
import { Sidebar } from "./components/Sidebar"
import { SignalsView } from "./components/SignalsView"
import { TopBar } from "./components/TopBar"
import { WatchlistView } from "./components/WatchlistView"
import { SIGNALS, ZIPS } from "./data/zips"
import type { ActiveView } from "./types"

function App() {
  const [activeView, setActiveView] = useState<ActiveView>("map")
  const [selectedZip, setSelectedZip] = useState<string | null>(null)
  const [savedZips, setSavedZips] = useState<Set<string>>(new Set())

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
          <TopBar zips={ZIPS} />

          <div className="relative flex-1">
            {activeView === "map" && (
              <MapView
                zips={ZIPS}
                selectedZip={selectedZip}
                onSelectZip={setSelectedZip}
                onCloseDetail={() => setSelectedZip(null)}
                savedZips={savedZips}
                onToggleSaved={toggleSaved}
                signals={SIGNALS}
              />
            )}

            {activeView === "signals" && <SignalsView signals={SIGNALS} />}

            {activeView === "watchlist" && (
              <WatchlistView
                items={watchlistItems}
                onOpenZip={(zip) => {
                  setSelectedZip(zip)
                  setActiveView("map")
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
