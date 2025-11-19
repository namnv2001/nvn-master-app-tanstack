import { createFileRoute } from '@tanstack/react-router'

import { getAllBlogs } from '@/data/blogs/blogs'

export const Route = createFileRoute('/blog/all-blogs/')({
  ssr: 'data-only',
  component: RouteComponent,
  loader: async () => await getAllBlogs(),
})

function RouteComponent() {
  const allBlogs = Route.useLoaderData()
  console.log('allBlogs', allBlogs)

  return <div>Hello "/blog/all-blocks/"!</div>
}
