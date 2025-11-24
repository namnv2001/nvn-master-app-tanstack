import { createFileRoute } from '@tanstack/react-router'

import Card from '@/components/Card'
import { getAllBlogs } from '@/data/blog'

export const Route = createFileRoute('/blog/')({
  ssr: 'data-only',
  component: BlogList,
  loader: async () => await getAllBlogs(),
})

function BlogList() {
  const allBlogs = Route.useLoaderData()
  console.log('allBlogs', allBlogs)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {allBlogs.map((blog) => (
        <Card key={blog.title + blog.date}>
          <img
            src={blog.images[0]}
            alt={blog.title}
            className="w-full h-40 object-cover rounded-lg"
          />
          <h2 className="text-lg font-bold">{blog.title}</h2>
          <p className="text-sm text-gray-500">{blog.summary}</p>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag) => (
              <span key={tag} className="text-sm text-gray-500">
                {tag}
              </span>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
