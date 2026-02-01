import { createFileRoute } from '@tanstack/react-router'

import { getArticlesByTag } from '@/data/articles'
import { groupArticlesByYear } from '@/helpers'
import { ArticleLink } from '@/components/ArticleLink'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export const Route = createFileRoute('/tag/$tagId')({
  component: RouteComponent,
  loader: ({ params }) => getArticlesByTag({ data: params.tagId }),
})

function RouteComponent() {
  const { tagId } = Route.useParams()
  const articlesByTag = Route.useLoaderData()

  const groupedArticles = groupArticlesByYear(articlesByTag)

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/tag">Tag</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/tag/${tagId}`}>{tagId}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
          {tagId}
        </h1>
      </div>

      {/* Content */}
      <div className="flex flex-col">
        {Object.entries(groupedArticles)
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
  )
}
