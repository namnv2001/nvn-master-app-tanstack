import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'

import { BlogCard } from '@/components/BlogCard'
import { getAllArticles } from '@/data/articles'
import { calculateReadingTime, formatDate } from '@/helpers'

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => await getAllArticles(),
})

function App() {
  const { blogs, gears } = Route.useLoaderData()

  const [featured, recent] = useMemo(() => {
    if (blogs.length === 0) return [null, []] as const
    const [first, ...rest] = blogs
    return [first, rest.slice(0, 3)] as const
  }, [blogs])

  return (
    <div>
      <section className="mb-12">
        <p className="mb-3 font-mono text-[15px] uppercase tracking-[0.12em] text-muted">
          Software engineer
        </p>
        <h1 className="mb-4 font-serif text-[clamp(2rem,5vw,3.2rem)] leading-[1.15] font-bold">
          Thoughts on code,
          <br />
          systems &amp; life.
        </h1>
        <p className="max-w-[520px] text-[15px] leading-[1.7] text-muted font-light">
          Software engineering, developer tools, and the art of building things
          with love.
          <br />
          <i className="font-light text-[13px]">
            Hope you find something interesting here!
          </i>
        </p>
      </section>

      {featured && (
        <Link
          to="/blog/$blogId"
          params={{ blogId: featured.slug }}
          className="mb-10 block cursor-pointer rounded-xl border border-border/60 bg-secondary-background p-6 transition-colors hover:bg-toggle-background"
        >
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-muted">
            Latest post
          </p>
          <p className="mb-2 font-serif font-medium text-2xl leading-[1.2]">
            {featured.title}
          </p>
          {featured.summary && (
            <p className="mb-4 text-sm leading-[1.65] text-muted font-light">
              {featured.summary}
            </p>
          )}
          <div className="flex items-center justify-between text-[11px] font-mono text-muted">
            <span>
              {formatDate(featured.date)} ·{' '}
              {calculateReadingTime(featured.content || '')} min read
            </span>
            <span className="border-b border-foreground pb-px text-foreground">
              read →
            </span>
          </div>
        </Link>
      )}

      {recent.length > 0 && (
        <section>
          <p className="mb-5 border-b border-border/60 pb-2 font-mono text-[12px] uppercase tracking-widest text-muted">
            Recent writing
          </p>
          <div className="grid gap-0">
            {recent.map((article) => (
              <BlogCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {gears.length > 0 && (
        <section className="mt-12">
          <p className="mb-5 border-b border-border/60 pb-2 font-mono text-[12px] uppercase tracking-widest text-muted">
            Gear review
          </p>
          <div className="grid gap-0">
            {gears.map((gear) => (
              <BlogCard key={gear.slug} article={gear} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
