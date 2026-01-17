import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { BlogLink } from '@/components/BlogLink'
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { getAllBlogs } from '@/data/blog'
import { groupBlogsByYear, isBlogRead } from '@/helpers'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/blog/')({
  ssr: 'data-only',
  component: BlogList,
  loader: async () => await getAllBlogs(),
})

function BlogList() {
  const allBlogs = Route.useLoaderData()
  const { isClient } = Route.useRouteContext()
  const [readStatuses, setReadStatuses] = useState<Record<string, boolean>>({})

  const groupedBlogs = groupBlogsByYear(allBlogs)

  useEffect(() => {
    if (isClient) {
      const statuses: Record<string, boolean> = {}
      allBlogs.forEach((blog) => {
        statuses[blog.slug] = isBlogRead(blog.slug)
      })
      setReadStatuses(statuses)
    }
  }, [allBlogs, isClient])

  return (
    <>
      {allBlogs.length > 0 && (
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Blog
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover my latest articles and insights
          </p>
        </div>
      )}

      {allBlogs.length === 0 ? (
        <div className="text-center py-16">
          <Empty>
            <EmptyTitle>No blog posts found</EmptyTitle>
            <EmptyDescription>
              Oh no! The author is too lazy to write any blog posts yet. Please
              come back later.
            </EmptyDescription>
          </Empty>
        </div>
      ) : (
        <div className="flex flex-col">
          {Object.entries(groupedBlogs)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .map(([year, blogs]) => (
              <div key={year} className="last:mb-0 mb-4">
                <div className='flex items-center mb-4 gap-4'>
                  <h1 className="text-3xl font-black">{year}</h1>
                  <p className='text-sm text-muted-foreground font-bold'>{blogs.length} {blogs.length > 1 ? 'posts' : 'post'}</p>
                </div>
                {blogs.map((blog) => (
                  <BlogLink
                    blog={blog}
                    key={blog.slug}
                    isRead={readStatuses[blog.slug]}
                  />
                ))}
              </div>
            ))}
        </div>
      )}
    </>
  )
}
