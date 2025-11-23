import { createFileRoute } from '@tanstack/react-router'

import { getBlogBySlug } from '@/data/blog'

export const Route = createFileRoute('/blog/$blogId')({
  component: RouteComponent,
  loader: ({ params: { blogId } }) => getBlogBySlug({ data: blogId }),
})

function RouteComponent() {
  const blog = Route.useLoaderData()
  console.log('blog', blog)
  return <div>Hello "/blog/$blogId/$blogId"!</div>
}
