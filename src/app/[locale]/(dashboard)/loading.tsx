export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="h-7 w-48 rounded-lg bg-bg-tertiary animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-bg-secondary animate-pulse" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-64 rounded-xl bg-bg-secondary animate-pulse" />
        <div className="h-64 rounded-xl bg-bg-secondary animate-pulse" />
      </div>
    </div>
  );
}
