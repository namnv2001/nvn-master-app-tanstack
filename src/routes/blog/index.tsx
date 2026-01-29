import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'

import { ArticleLink } from '@/components/ArticleLink'
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { getAllArticles } from '@/data/articles'
import { debounce, groupBlogsByYear } from '@/helpers'
import { Input } from '@/components/ui/input'

export const Route = createFileRoute('/blog/')({
  ssr: 'data-only',
  component: BlogList,
  loader: async () => await getAllArticles(),
})

function BlogList() {
  const { blogs } = Route.useLoaderData()
  const [filteredBlogs, setFilteredBlogs] = useState(blogs)

  const groupedBlogs = useMemo(
    () => groupBlogsByYear(filteredBlogs),
    [filteredBlogs],
  )

  const onFilterBlogs = (query: string) => {
    const newBlogs = blogs.filter((blog) =>
      blog.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
    )
    setFilteredBlogs(newBlogs)
  }

  const debouncedOnFilterBlogs = debounce(onFilterBlogs)

  return (
    <>
      {blogs.length > 0 && (
        <div className="mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
            Blogs
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover my latest articles and insights
          </p>
        </div>
      )}

      {blogs.length === 0 ? (
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
        <>
          <Input
            className="mb-6 max-w-md"
            placeholder={`Search ${blogs.length} posts...`}
            onChange={(e) => debouncedOnFilterBlogs(e.target.value)}
          />
          <div className="flex flex-col">
            {Object.entries(groupedBlogs)
              .sort((a, b) => b[0].localeCompare(a[0]))
              .map(([year, articles]) => (
                <div key={year} className="last:mb-0 mb-4">
                  <div className="flex items-center mb-4 gap-4">
                    <h1 className="text-3xl font-black">{year}</h1>
                    <p className="text-sm text-muted-foreground font-bold">
                      {articles.length} {articles.length > 1 ? 'posts' : 'post'}
                    </p>
                  </div>
                  {articles.map((article) => (
                    <ArticleLink article={article} key={article.slug} />
                  ))}
                </div>
              ))}
          </div>
        </>
      )}
    </>
  )
}
