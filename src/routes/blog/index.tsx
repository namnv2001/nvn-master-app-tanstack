import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import z from 'zod'

import { BlogCard } from '@/components/BlogCard'
import { Input } from '@/components/ui/input'
import { getAllArticles } from '@/data/articles'
import { debounce } from '@/helpers'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/blog/')({
  ssr: 'data-only',
  component: BlogList,
  loader: async () => await getAllArticles(),
  validateSearch: z.object({
    tag: z.string().optional(),
  }),
})

function BlogList() {
  const { blogs, gears } = Route.useLoaderData()
  const { tag: searchParamTag } = Route.useSearch()
  const navigate = useNavigate()

  const searchRef = useRef<HTMLInputElement>(null)
  const [activeTag, setActiveTag] = useState(searchParamTag ?? 'all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredArticles, setFilteredArticles] = useState([...blogs, ...gears])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    ;[...blogs, ...gears].forEach((article) => {
      article.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort((a, b) => a.localeCompare(b))
  }, [blogs, gears])

  const queryLabel = searchQuery.trim()
    ? `${filteredArticles.length} result${
        filteredArticles.length !== 1 ? 's' : ''
      } for "${searchQuery.trim()}"`
    : ''

  const onFilterBlogs = (query: string) => {
    const trimmedQuery = query.trim().toLowerCase()
    setSearchQuery(trimmedQuery)
    const newArticles = [...blogs, ...gears].filter((a) => {
      const matchesTag =
        activeTag === 'all' || a.tags.some((tag) => tag === activeTag)

      if (!matchesTag) return false

      if (!query) return true

      const filterStack = [a.title, a.summary, a.tags.join(' ')]
        .join(' ')
        .toLowerCase()
      return filterStack.includes(trimmedQuery)
    })
    setFilteredArticles(newArticles)
  }

  const debouncedOnFilterBlogs = debounce(onFilterBlogs)

  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus()
    }
  }, [])

  useEffect(() => {
    navigate({
      to: '/blog',
      search: { tag: activeTag },
    })
    onFilterBlogs(searchQuery)
  }, [activeTag])

  return (
    <div>
      <p className="mb-5 border-b border-border/60 pb-2 font-mono text-[12px] uppercase tracking-widest text-muted">
        All writing
      </p>

      <div className="mb-4">
        <div className="relative mb-2 text-muted">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            ref={searchRef}
            placeholder="Search posts by title, summary or tags..."
            className="h-9 pl-9 font-mono text-[13px]"
            onChange={(event) => debouncedOnFilterBlogs(event.target.value)}
          />
        </div>

        <div className="my-4 flex flex-wrap gap-2">
          {['all', ...allTags].map((tag) => (
            <button
              key={tag}
              type="button"
              className={cn(
                'rounded-full border px-4 py-1 text-[11px] font-mono lowercase transition-colors cursor-pointer',
                activeTag === tag
                  ? 'border-accent bg-accent text-background'
                  : 'border-border text-muted hover:border-accent hover:text-accent',
              )}
              onClick={() => setActiveTag(tag)}
            >
              {tag.toLowerCase()}
            </button>
          ))}
        </div>

        <p className="min-h-[1.2em] font-mono text-[11px] text-muted">
          {queryLabel}
        </p>
      </div>

      {filteredArticles.length === 0 ? (
        <p className="py-10 text-center font-mono text-sm text-muted">
          No posts found.
        </p>
      ) : (
        <div className="flex flex-col">
          {filteredArticles.map((article) => (
            <BlogCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
