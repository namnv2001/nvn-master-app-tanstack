import { createFileRoute } from '@tanstack/react-router'

import { getAllBlogs } from '@/data/blog'

export const Route = createFileRoute('/blog/')({
  ssr: 'data-only',
  component: RouteComponent,
  loader: async () => await getAllBlogs(),
})

function RouteComponent() {
  const allBlogs = Route.useLoaderData()
  console.log('allBlogs', allBlogs)

  return <div>Hello "/blog/all-blogs/"!</div>
}
