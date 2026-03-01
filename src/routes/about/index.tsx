import { createFileRoute } from '@tanstack/react-router'
import Markdown from 'react-markdown'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

import { getAboutContent } from '@/data/articles'

export const Route = createFileRoute('/about/')({
  component: RouteComponent,
  loader: async () => await getAboutContent(),
})

function RouteComponent() {
  const aboutContent = Route.useLoaderData()

  return (
    <div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
        About Me
      </h1>
      <p className="text-muted-foreground text-lg">
        Who am I, what am I doing.
      </p>
      <article className="article-content mt-8">
        <Markdown
          children={aboutContent.content || ''}
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'prepend', maxDepth: 4 }],
          ]}
        />
      </article>
    </div>
  )
}
