'use client'

const GRADIENTS: Record<string, string> = {
  'slime-reincarnation': 'linear-gradient(160deg, #3d1c02, #8b4513 60%, #5c2d0a)',
  default: 'linear-gradient(160deg, #1a1a2e, #16213e 60%, #0f3460)',
}

interface Props {
  src: string
  slug: string
  alt: string
  className?: string
}

export function CoverImage({ src, slug, alt, className = '' }: Props) {
  const gradient = GRADIENTS[slug] ?? GRADIENTS.default
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: gradient }}
      aria-label={alt}
    >
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
        />
      )}
    </div>
  )
}
