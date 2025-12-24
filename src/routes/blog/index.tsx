import { Link, createFileRoute } from '@tanstack/react-router'

import { Image } from '@/components/Image'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Empty, EmptyDescription, EmptyTitle } from '@/components/ui/empty'
import { getAllBlogs } from '@/data/blog'
import { formatDate } from '@/helpers'

export const Route = createFileRoute('/blog/')({
  ssr: 'data-only',
  component: BlogList,
  loader: async () => await getAllBlogs(),
})

// TODO: lazy load off screen things
function BlogList() {
  const allBlogs = Route.useLoaderData()

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
          {allBlogs.map((blog) => (
            <Link
              key={blog.title + blog.date}
              to="/blog/$blogId"
              params={{ blogId: blog.slug }}
              className="group"
            >
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 hover:border-border pt-4!">
                <CardHeader className="mx-4 p-0">
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-muted">
                    <Image
                      src={blog.images[0]}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="px-6 pt-2 -mx-4">
                    <CardTitle className="text-2xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {blog.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="px-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3 mt-auto">
                    <div className="text-xs text-muted-foreground">
                      <time dateTime={blog.date}>{formatDate(blog.date)}</time>
                    </div>
                    <>
                      {blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {blog.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </>
                  </div>
                  <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                    {blog.summary}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
