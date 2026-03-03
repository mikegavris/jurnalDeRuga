type Props = {
  searchQuery: string
  onSearchChange: (v: string) => void

  selectedMonth: number | null
  onMonthSelect: (m: number | null) => void

  activeTag: string | null
  onTagSelect: (t: string | null) => void

  allTags: string[]
  onResetFilters: () => void
  
  onCloseSidebar?: () => void
}

const months = [
  "Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie",
  "Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie"
]

export default function JournalSidebar({
  searchQuery,
  onSearchChange,
  selectedMonth,
  onMonthSelect,
  activeTag,
  onTagSelect,
  allTags,
  onResetFilters,
  onCloseSidebar
}: Props) {
  
  function handleSearchChange(value: string) {
    onSearchChange(value)
  }

  function handleMonthSelect(month: number) {
    onMonthSelect(selectedMonth === month ? null : month)
    onCloseSidebar?.()
  }

  function handleTagSelect(tag: string) {
    onTagSelect(activeTag === tag ? null : tag)
    onCloseSidebar?.()
  }

  function handleResetFilters() {
    onResetFilters()
    onCloseSidebar?.()
  }

  return (
<aside className="w-44 h-full overflow-y-auto px-2 pt-2 pb-4 border-r bg-background">

  <a href="/" className="flex items-center py-1">
    <img
      src="/logo.png"
      alt="Voia Ta"
      className="w-46 h-46 rounded-full object-contain"
    />
  </a>

  <input
    value={searchQuery}
    onChange={e => handleSearchChange(e.target.value)}
    onKeyDown={e => {
      if (e.key === 'Enter') {
        onCloseSidebar?.()
      }
    }}
    placeholder="Caută..."
    className="w-full border p-2 rounded text-sm bg-white mb-3"
  />

      <div>
        <h3 className="font-semibold mb-2 text-sm">Luni</h3>
        {months.map((m, i) => (
          <div
            key={m}
            className={`cursor-pointer px-2 py-1 rounded text-sm transition-colors ${
              selectedMonth === i
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleMonthSelect(i)}
          >
            {m}
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-semibold mb-2 text-sm">Etichete</h3>
        <div className="flex gap-1.5 flex-wrap">
          {allTags.map(tag => (
            <span
              key={tag}
              onClick={() => handleTagSelect(tag)}
              className={`px-2 py-0.5 rounded cursor-pointer text-xs transition-colors ${
                activeTag === tag
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={handleResetFilters}
        className="text-xs text-blue-600 underline"
      >
        Resetează filtrele
      </button>
    </aside>
  )
}