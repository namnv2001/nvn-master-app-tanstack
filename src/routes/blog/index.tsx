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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {allBlogs.map((blog) => (
        <Card key={blog.title + blog.date}>
          <h2 className="text-lg font-bold">{blog.title}</h2>
        </Card>
      ))}
    </div>
  )
}
