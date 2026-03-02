import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowUp, Calendar, Clock, User } from 'lucide-react'
import { useEffect, useRef } from 'react'
import Markdown from 'react-markdown'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkBreaks from 'remark-breaks'
import remarkFlexibleToc from 'remark-flexible-toc'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import Giscus from '@giscus/react'

import type { TocItem } from 'remark-flexible-toc'

import { Image } from '@/components/Image'
import TableOfContents from '@/components/TableOfContents'
import { Badge } from '@/components/ui/badge'
import { getArticleBySlug } from '@/data/articles'
import { calculateReadingTime, formatDate, markBlogAsRead } from '@/helpers'

export const Route = createFileRoute('/blog/$blogId')({
  component: RouteComponent,
  loader: async ({ params: { blogId } }) => {
    const blog = await getArticleBySlug({ data: blogId })
    const toc: Array<TocItem & { data: Record<string, {}> }> = []

    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkBreaks)
      .use(remarkFlexibleToc, { tocRef: toc })

    const tree = processor.parse(blog.content || '')
    await processor.run(tree)

    return { blog, toc }
  },
})

function RouteComponent() {
  const { blog, toc } = Route.useLoaderData()
  const { isClient } = Route.useRouteContext()
  const hasMarkedAsRead = useRef(false)

  const readingTime = blog.content ? calculateReadingTime(blog.content) : 0

  // Read status tracking
  useEffect(() => {
    if (!isClient || hasMarkedAsRead.current) return

    // Mark as read after 30 seconds
    const timer = setTimeout(() => {
      if (!hasMarkedAsRead.current) {
        markBlogAsRead(blog.slug)
        hasMarkedAsRead.current = true
      }
    }, 30000)

    // Mark as read when user scrolls to bottom
    const scrollHandler = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = document.documentElement.clientHeight
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100

      if (isAtBottom && !hasMarkedAsRead.current) {
        markBlogAsRead(blog.slug)
        hasMarkedAsRead.current = true
      }
    }

    window.addEventListener('scroll', scrollHandler, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [blog.slug, isClient])

  return (
    <div>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-start">
        {/* Header Section */}
        <header className="mb-12 col-span-1 xl:col-span-3">
          {/* Hero Image */}
          {blog.images.length > 0 && (
            <div className="relative w-full h-[200px] md:h-[300px] rounded-2xl overflow-hidden mb-8 bg-muted">
              <Image
                src={blog.images[0]}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight text-center">
            {blog.title}
          </h1>

          {/* Summary */}
          {blog.summary && (
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              {blog.summary}
            </p>
          )}

          <div className="flex flex-col gap-4 border-b border-border pb-6">
            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <time dateTime={blog.date}>{formatDate(blog.date)}</time>
              </div>
              {readingTime > 0 && (
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{readingTime} min read</span>
                </div>
              )}
              {blog.authors && blog.authors.length > 0 && (
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{blog.authors.join(', ')}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {blog.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Link to="/tag/$tagId" params={{ tagId: tag }} key={tag}>
                    <Badge variant="secondary" className="cursor-pointer">
                      {tag}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </header>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 items-start">
        <article className="article-content col-span-1 xl:col-span-3">
          {/* Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none pb-6">
            <Markdown
              children={blog.content || ''}
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: 'prepend', maxDepth: 4 }],
              ]}
            />
          </div>
          {/* Comment */}
          <Giscus
            id="comments"
            repo="namnv2001/nvn-master-app-tanstack"
            repoId="R_kgDOQY5PMw="
            category="Announcements"
            categoryId="DIC_kwDOQY5PM84C3iWz"
            mapping="pathname"
            term="Welcome to @giscus/react component!"
            reactionsEnabled="1"
            emitMetadata="0"
            inputPosition="top"
            theme="light"
            lang="en"
            loading="lazy"
          />
        </article>
        {/* Table of Contents */}
        <aside className="hidden xl:block xl:col-span-1 sticky top-8">
          <TableOfContents toc={toc} />
        </aside>
        <button
          type="button"
          onClick={() => {
            if (isClient) window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="fixed right-4 bottom-4 z-40 inline-flex items-center justify-center rounded-full bg-primary/70 text-primary-foreground shadow-lg hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background h-12 w-12 cursor-pointer"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </div>
  )
}
