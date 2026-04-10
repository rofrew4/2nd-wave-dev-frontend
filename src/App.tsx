import { useState } from "react"
import { AlertsView } from "./components/AlertsView"
import { DashboardView } from "./components/DashboardView"
import { MapView } from "./components/MapView"
import { Sidebar } from "./components/Sidebar"
import { TopBar } from "./components/TopBar"
import { PERMITS, ZIPS } from "./data/zips"
import type { ActiveView } from "./types"

function App() {
  const [activeView, setActiveView] = useState<ActiveView>("map")
  const [selectedZip, setSelectedZip] = useState<string | null>(null)

  return (
    <div className="h-full min-w-[1280px] bg-[#f1f5f9] text-[#0f172a]">
      <div className="flex h-full">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        <main className="flex flex-1 flex-col">
          <TopBar zips={ZIPS} permits={PERMITS} />

          <div className="relative flex-1">
            {activeView === "map" && (
              <MapView
                zips={ZIPS}
                permits={PERMITS}
                selectedZip={selectedZip}
                onSelectZip={setSelectedZip}
                onCloseDetail={() => setSelectedZip(null)}
              />
            )}

            {activeView === "dashboard" && (
              <DashboardView permits={PERMITS} zips={ZIPS} />
            )}

            {activeView === "alerts" && (
              <AlertsView permits={PERMITS} zips={ZIPS} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
