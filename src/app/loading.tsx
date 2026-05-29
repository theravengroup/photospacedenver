/**
 * Branded skeleton shown while a route segment loads — instant feedback on
 * navigation so the site never feels like it's hanging. Mirrors the common
 * page shape: a dark hero block over a light content grid.
 */
export default function Loading() {
  return (
    <div role="status" aria-busy="true" aria-label="Loading">
      {/* Hero skeleton */}
      <section className="surface-dark grain pt-36 pb-20 sm:pt-44 sm:pb-28">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
          <div className="skeleton-dark h-3 w-28 rounded-full" />
          <div className="skeleton-dark mt-7 h-12 w-4/5 max-w-3xl rounded-lg sm:h-16" />
          <div className="skeleton-dark mt-4 h-12 w-3/5 max-w-2xl rounded-lg sm:h-16" />
          <div className="skeleton-dark mt-8 h-5 w-full max-w-xl rounded" />
          <div className="skeleton-dark mt-3 h-5 w-2/3 max-w-md rounded" />
          <div className="mt-10 flex gap-3">
            <div className="skeleton-dark h-12 w-44 rounded-full" />
            <div className="skeleton-dark h-12 w-36 rounded-full" />
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <section className="surface-light py-[var(--spacing-section)]">
        <div className="mx-auto max-w-[88rem] px-5 sm:px-8">
          <div className="skeleton h-4 w-40 rounded-full" />
          <div className="skeleton mt-6 h-9 w-2/3 max-w-lg rounded-lg" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-44 rounded-card" />
            ))}
          </div>
        </div>
      </section>

      <span className="sr-only">Loading…</span>
    </div>
  );
}
