'use client'
import { useState, useEffect } from 'react'

type Preset = 'compact' | 'default' | 'relaxed'
const PRESETS: Preset[] = ['compact', 'default', 'relaxed']
const STORAGE_KEY = 'reader:font-size'

export function FontControls() {
  const [preset, setPreset] = useState<Preset>('default')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Preset | null
    if (stored && PRESETS.includes(stored)) setPreset(stored)
  }, [])

  useEffect(() => {
    document.querySelector('[data-font-size]')?.setAttribute('data-font-size', preset)
    localStorage.setItem(STORAGE_KEY, preset)
  }, [preset])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex h-8 items-center gap-1 rounded-lg border border-border px-3 text-xs font-medium text-muted hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        Aa
      </button>
      {open && (
        <div className="absolute right-0 top-10 z-50 flex flex-col gap-1 rounded-lg border border-border bg-white dark:bg-gray-900 p-2 shadow-xl min-w-[120px]">
          {PRESETS.map(p => (
            <button
              key={p}
              onClick={() => { setPreset(p); setOpen(false) }}
              className={`rounded px-3 py-1.5 text-left text-xs capitalize transition-colors ${
                preset === p
                  ? 'bg-accent text-white'
                  : 'text-muted hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
