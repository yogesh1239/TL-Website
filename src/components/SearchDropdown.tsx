'use client'
export function SearchDropdown({ searchIndex }: { searchIndex: any[] }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-gray-50 dark:bg-gray-800 px-3 py-1.5 w-48">
      <span className="text-xs text-muted">🔍</span>
      <span className="text-xs text-muted">Search...</span>
    </div>
  )
}
