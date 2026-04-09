import type { ZipRecord } from "../data/zips"
import { formatCurrency, getScoreMeta } from "./scoreUtils"

type WatchlistViewProps = {
  items: ZipRecord[]
  onOpenZip: (zip: string) => void
  onRemoveZip: (zip: string) => void
}

export function WatchlistView({ items, onOpenZip, onRemoveZip }: WatchlistViewProps) {
  if (!items.length) {
    return (
      <section className="flex h-full items-center justify-center p-6">
        <div className="rounded-xl border border-dashed border-[#cbd5e1] bg-white px-10 py-14 text-center">
          <p className="text-lg font-semibold text-[#0f172a]">No ZIPs saved yet</p>
          <p className="mt-1 text-sm text-[#64748b]">
            Save markets from the map detail panel to build your watchlist.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-6xl rounded-xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="border-b border-[#e2e8f0] px-4 py-3">
          <h2 className="text-lg font-semibold text-[#0f172a]">Watchlist</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left">
            <thead className="bg-[#f8fafc] text-xs uppercase text-[#64748b]">
              <tr>
                <th className="px-4 py-3 font-medium">ZIP</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Rent</th>
                <th className="px-4 py-3 font-medium">YoY</th>
                <th className="px-4 py-3 font-medium">Pipeline</th>
                <th className="px-4 py-3 font-medium">Vacancy</th>
                <th className="px-4 py-3 font-medium">Cap</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] text-sm">
              {items.map((zip) => {
                const scoreMeta = getScoreMeta(zip.score)
                return (
                  <tr
                    key={zip.zip}
                    className="cursor-pointer hover:bg-[#f8fafc]"
                    onClick={() => onOpenZip(zip.zip)}
                  >
                    <td className="px-4 py-3 font-semibold text-[#0f172a]">{zip.zip}</td>
                    <td className="px-4 py-3 text-[#475569]">{zip.name}</td>
                    <td className="px-4 py-3">
                      <span
                        className="rounded-full px-2 py-0.5 text-xs font-semibold text-white"
                        style={{ backgroundColor: scoreMeta.color }}
                      >
                        {zip.score}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#475569]">{formatCurrency(zip.rent)}</td>
                    <td className="px-4 py-3 text-[#475569]">{zip.rg}%</td>
                    <td className="px-4 py-3 text-[#475569]">{zip.pipeline}</td>
                    <td className="px-4 py-3 text-[#475569]">{zip.vac}%</td>
                    <td className="px-4 py-3 text-[#475569]">{zip.cap}%</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation()
                          onRemoveZip(zip.zip)
                        }}
                        className="rounded-md border border-[#fecaca] px-2 py-1 text-xs text-[#b91c1c] hover:bg-[#fef2f2]"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
