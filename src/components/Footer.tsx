import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border mt-16 py-8 text-center">
      <p className="font-playfair text-lg font-black text-gray-900 dark:text-white">
        LorePress
      </p>
      <p className="mt-1 text-sm text-muted">
        Fan translations · For readers, by readers
      </p>
      <div className="mt-4 flex justify-center gap-6 text-sm text-muted">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <Link href="/novels" className="hover:text-accent transition-colors">Browse</Link>
      </div>
    </footer>
  )
}
