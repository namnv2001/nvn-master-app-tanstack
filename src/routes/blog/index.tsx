import { Link, createFileRoute } from '@tanstack/react-router'

import { Image } from '@/components/Image'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {allBlogs.map((blog) => (
        <Card key={blog.title + blog.date}>
          <Link to="/blog/$blogId" params={{ blogId: blog.slug }}>
            <CardHeader>
              <Image
                src={blog.images[0]}
                alt={blog.title}
                className="w-full h-40 object-cover rounded-lg"
              />
              <CardTitle>{blog.title}</CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {formatDate(blog.date)} •
                </span>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span key={tag} className="text-sm text-gray-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <CardDescription>{blog.summary}</CardDescription>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  )
}
