export function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-dark/10 rounded ${className}`} />
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-dark/10 rounded animate-pulse mb-2" style={{ width: i === lines - 1 ? '60%' : '100%' }} />
      ))}
    </div>
  )
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-background border border-dark/10 rounded-[2rem] p-8 animate-pulse ${className}`}>
      <div className="h-14 w-14 rounded-2xl bg-dark/10 mb-6" />
      <div className="h-8 w-3/4 bg-dark/10 rounded mb-3" />
      <div className="h-6 w-1/2 bg-dark/10 rounded mb-6" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-dark/10 rounded" />
        <div className="h-4 w-full bg-dark/10 rounded" />
        <div className="h-4 w-5/6 bg-dark/10 rounded" />
      </div>
      <div className="h-12 w-full bg-dark/10 rounded mt-8" />
    </div>
  )
}

export function SkeletonHero({ className = '' }) {
  return (
    <div className={`min-h-screen flex items-end ${className}`}>
      <div className="w-full max-w-7xl mx-auto px-6 pb-24 md:pb-32 animate-pulse">
        <div className="max-w-3xl">
          <div className="h-4 w-48 bg-dark/10 rounded mb-6" />
          <div className="h-16 w-full bg-dark/10 rounded mb-4" />
          <div className="h-16 w-5/6 bg-dark/10 rounded mb-4" />
          <div className="h-6 w-3/4 bg-dark/10 rounded mb-8" />
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="h-14 w-48 bg-dark/10 rounded-full" />
            <div className="h-14 w-48 bg-dark/10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonSection({ className = '' }) {
  return (
    <section className={`pt-32 pb-24 md:pt-40 md:pb-32 px-6 animate-pulse ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="h-4 w-32 bg-dark/10 rounded mx-auto mb-4" />
          <div className="h-10 w-3/4 bg-dark/10 rounded mx-auto mb-4" />
          <div className="h-6 w-1/2 bg-dark/10 rounded mx-auto" />
        </div>
        <div className="grid lg:grid-cols-2 gap-12">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </section>
  )
}

export function SkeletonServiceBlock({ className = '' }) {
  return (
    <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center animate-pulse ${className}`}>
      <div className="space-y-4">
        <div className="h-14 w-14 rounded-2xl bg-dark/10" />
        <div className="h-10 w-3/4 bg-dark/10 rounded" />
        <div className="h-6 w-1/2 bg-dark/10 rounded" />
        <div className="h-6 w-full bg-dark/10 rounded" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-dark/10 rounded" />
          <div className="h-4 w-full bg-dark/10 rounded" />
          <div className="h-4 w-5/6 bg-dark/10 rounded" />
        </div>
        <div className="h-12 w-40 bg-dark/10 rounded-full mt-4" />
      </div>
      <div className="space-y-6">
        <div className="rounded-[2rem] overflow-hidden">
          <div className="w-full h-64 md:h-80 bg-dark/10" />
        </div>
        <div className="bg-ivory rounded-[2rem] p-6 border border-dark/5">
          <div className="space-y-3">
            <div className="h-16 w-full bg-dark/10 rounded-xl" />
            <div className="h-16 w-full bg-dark/10 rounded-xl" />
            <div className="h-16 w-full bg-dark/10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  )
}