import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border mt-20 py-10">
      <div className="mx-auto max-w-7xl px-6 flex flex-col items-center gap-4">
        <p className="font-playfair text-[22px] font-black tracking-tight text-gray-900 dark:text-white">
          Lore<span className="text-accent">Press</span>
        </p>
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-muted font-bold">
          <span>Fan Translations</span>
          <span className="text-border">·</span>
          <span>For readers, by readers</span>
        </div>
        <div className="mt-2 flex gap-6 text-[11px] uppercase tracking-widest font-bold text-muted">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <Link href="/novels" className="hover:text-accent transition-colors">Browse</Link>
        </div>
      </div>
    </footer>
  )
}
