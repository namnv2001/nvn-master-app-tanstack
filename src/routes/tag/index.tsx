import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'

import { EmptyContent } from '@/components/ui/empty'
import { getAllArticles } from '@/data/articles'
import { getArticlesByTag, groupTopicsByAlphabet } from '@/helpers'

export const Route = createFileRoute('/tag/')({
  component: RouteComponent,
  loader: () => getAllArticles(),
})

function RouteComponent() {
  const allArticles = Route.useLoaderData()
  const flattenedArticles = useMemo(() => {
    return Object.values(allArticles).reduce((acc, val) => acc.concat(val), [])
  }, [allArticles])

  const allTagsSet = new Set<string>(
    flattenedArticles.flatMap((article) => article.tags),
  )
  const allTags = Array.from(allTagsSet).sort((a, b) => a.localeCompare(b))
  const groupedTags = useMemo(() => groupTopicsByAlphabet(allTags), [allTags])

  const { isClient } = Route.useRouteContext()
  const navigate = useNavigate()

  const onClickTag = (tag: string) => {
    navigate({
      to: '/tag/$tagId',
      params: { tagId: tag },
    })
  }

  const renderGroupedTags = (key: string, tags: Array<string>) => {
    if (!isClient) return <EmptyContent />
    return (
      <div className="mt-4">
        <h3 className="text-2xl mb-2">{key}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tags.map((tag) => (
            <div
              className="border rounded-md p-6 hover:border-accent-foreground cursor-pointer flex justify-between items-center"
              onClick={() => onClickTag(tag)}
            >
              <span className="text-link">{tag}</span>
              <span>
                {getArticlesByTag(tag, flattenedArticles).length} posts
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header Section */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          Tags
        </h1>
        <p className="text-muted-foreground text-lg">
          All the topics I've written about so far.
        </p>
      </div>
      {/* Content */}
      {Object.entries(groupedTags).map(([key, topics]) =>
        renderGroupedTags(key, topics),
      )}
    </>
  )
}
