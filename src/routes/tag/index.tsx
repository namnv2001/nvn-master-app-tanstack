import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

import { Search } from 'lucide-react'

import { BlogCard } from '@/components/BlogCard'
import { Badge } from '@/components/ui/badge'
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import { getArticlesByTag, getTags, searchTag } from '@/data/articles'
import { isBlogRead } from '@/helpers'

export const Route = createFileRoute('/tag/')({
  component: RouteComponent,
  loader: () => getTags(),
  validateSearch: (search: Record<string, unknown>) => {
    return {
      selected: (search.selected as string) || undefined,
    }
  },
})

function RouteComponent() {
  const allTags = Route.useLoaderData()
  const searchParams = useSearch({ strict: false })
  const selected = (searchParams as { selected?: string }).selected
  const { isClient } = Route.useRouteContext()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [filteredTags, setFilteredTags] = useState<Array<string>>(allTags)
  const [selectedBlogs, setSelectedBlogs] = useState<
    Awaited<ReturnType<typeof getArticlesByTag>>
  >([])
  const [readStatuses, setReadStatuses] = useState<Record<string, boolean>>({})
  const [isSearching, setIsSearching] = useState(false)

  const searchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Handle tag search with debouncing
  useEffect(() => {
    if (!isClient) return

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    if (searchQuery.trim() === '') {
      setFilteredTags(allTags)
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchTag({ data: searchQuery.trim() })
        setFilteredTags(results)
      } catch (error) {
        console.error('Failed to search tags:', error)
        setFilteredTags([])
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [searchQuery, allTags, isClient])

  // Fetch blogs when tag is selected
  useEffect(() => {
    if (!isClient || !selected) return

    getArticlesByTag({ data: selected })
      .then(setSelectedBlogs)
      .catch((error) => {
        console.error('Failed to fetch blogs by tag:', error)
        setSelectedBlogs([])
      })
  }, [selected, isClient])

  // Track read statuses for displayed blogs
  useEffect(() => {
    if (!isClient || selectedBlogs.length === 0) return

    const statuses: Record<string, boolean> = {}
    selectedBlogs.forEach((blog) => {
      statuses[blog.slug] = isBlogRead(blog.slug)
    })
    setReadStatuses(statuses)
  }, [selectedBlogs, isClient])

  const handleTagClick = (tag: string) => {
    navigate({
      to: '/tag',
      search: { selected: tag },
      replace: false,
    })
  }

  const handleClearSelection = () => {
    navigate({
      to: '/tag',
      search: (prev) => ({ ...prev, selected: undefined }),
      replace: false,
    })
    setSearchQuery('')
  }

  const displayTags = searchQuery.trim() === '' ? allTags : filteredTags

  return (
    <>
      {/* Header Section */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Tags
        </h1>
        <p className="text-muted-foreground text-lg">
          {selected
            ? `Blogs tagged with "${selected}"`
            : 'Browse and search tags to discover content'}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            type="text"
            placeholder="Search tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Selected Tag Header with Clear Button */}
      {selected && (
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Selected:</span>
            <Badge variant="secondary" className="text-base px-3 py-1">
              {selected}
            </Badge>
          </div>
          <button
            onClick={handleClearSelection}
            className="text-link hover:underline underline-offset-4 text-sm transition-colors cursor-pointer"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* Content: Tags or Blogs */}
      {selected ? (
        // Show blogs for selected tag
        selectedBlogs.length === 0 ? (
          <div className="text-center py-16">
            <Empty>
              <EmptyTitle>No blogs found</EmptyTitle>
              <EmptyDescription>
                No blog posts found for the tag &quot;{selected}&quot;. Try
                selecting a different tag.
              </EmptyDescription>
            </Empty>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
            {selectedBlogs.map((blog) => (
              <BlogCard
                key={blog.slug}
                blog={blog}
                isRead={readStatuses[blog.slug]}
              />
            ))}
          </div>
        )
      ) : // Show tags
      displayTags.length === 0 ? (
        <div className="text-center py-16">
          <Empty>
            <EmptyTitle>No tags found</EmptyTitle>
            <EmptyDescription>
              {isSearching
                ? 'Searching...'
                : 'No tags match your search. Try a different query.'}
            </EmptyDescription>
          </Empty>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {displayTags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="hover:scale-110 transition-all duration-300 cursor-pointer text-base px-3 py-1"
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </>
  )
}
