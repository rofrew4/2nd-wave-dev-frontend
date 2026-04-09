export function SettingsView() {
  return (
    <section className="h-full overflow-y-auto p-6">
      <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-3">
        <article className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[#0f172a]">Alert Preferences</h3>
          <p className="mt-2 text-sm text-[#64748b]">
            Configure ZIP-level push alerts for permits, zoning, and regulatory changes.
          </p>
        </article>
        <article className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[#0f172a]">Coverage</h3>
          <p className="mt-2 text-sm text-[#64748b]">
            Current demo coverage includes Miami Beach and North Miami target ZIPs.
          </p>
        </article>
        <article className="rounded-xl border border-[#e2e8f0] bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-[#0f172a]">Account</h3>
          <p className="mt-2 text-sm text-[#64748b]">
            Gerhardt profile with watchlist-only persistence for demo walkthroughs.
          </p>
        </article>
      </div>
    </section>
  )
}
