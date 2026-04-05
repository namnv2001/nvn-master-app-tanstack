import Giscus from '@giscus/react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { s } from 'hastscript'
import { ArrowUp, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import rehypeSlug from 'rehype-slug'
import remarkBreaks from 'remark-breaks'
import remarkFlexibleToc from 'remark-flexible-toc'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

import type { TocItem } from 'remark-flexible-toc'

import { Image } from '@/components/Image'
import TableOfContents from '@/components/TableOfContents'
import { getAllArticles, getArticleBySlug } from '@/data/articles'
import {
  calculateReadingTime,
  formatDate,
  getTheme,
  markBlogAsRead,
} from '@/helpers'

export const Route = createFileRoute('/blog/$blogId')({
  component: RouteComponent,
  loader: async ({ params: { blogId } }) => {
    const blog = await getArticleBySlug({ data: blogId })
    const { blogs } = await getAllArticles()

    const related = blogs
      .filter((b) => b.slug !== blog.slug)
      .map((b) => {
        const sharedTags = b.tags.filter((tag) => blog.tags.includes(tag))
        return { article: b, score: sharedTags.length }
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((entry) => entry.article)

    const toc: Array<TocItem & { data: Record<string, {}> }> = []

    const processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkBreaks)
      .use(remarkFlexibleToc, { tocRef: toc })

    const tree = processor.parse(blog.content || '')
    await processor.run(tree)

    return { blog, toc, relatedBlogs: related }
  },
})

function RouteComponent() {
  const { blog, toc, relatedBlogs } = Route.useLoaderData()
  const { isClient } = Route.useRouteContext()
  const hasMarkedAsRead = useRef(false)
  const [progress, setProgress] = useState(0)

  const readingTime = blog.content ? calculateReadingTime(blog.content) : 0

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

      const total = scrollHeight - clientHeight
      setProgress(total > 0 ? (scrollTop / total) * 100 : 0)

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
    <div className="relative">
      {/* Reading progress bar */}
      <div className="fixed inset-x-0 top-0 z-30 h-0.5 bg-primary/10">
        <div
          className="h-full bg-primary transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid grid-cols-1 items-start gap-4">
        <header className="col-span-1 mb-10 xl:col-span-3">
          {/* Hero Image */}
          {blog.images.length > 0 && (
            <div className="relative mb-8 h-[200px] w-full overflow-hidden rounded-2xl bg-muted md:h-[260px]">
              <Image
                src={blog.images[0]}
                alt={blog.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />
            </div>
          )}

          {/* Title */}
          <h1 className="mb-4 font-serif font-bold text-[clamp(1.9rem,4vw,2.7rem)] leading-tight">
            {blog.title}
          </h1>

          {/* Summary */}
          {blog.summary && (
            <p className="mb-6 text-[16px] leading-relaxed text-muted">
              {blog.summary}
            </p>
          )}

          {/* Meta row */}
          <div className="border-y border-border py-4">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-sm font-medium text-primary">
                <User size={16} />
                {blog.authors && blog.authors.length > 0
                  ? blog.authors.join(', ')
                  : 'vawnnam'}
              </span>
              {readingTime > 0 && (
                <span className="font-mono text-[11px] text-muted">
                  {readingTime} min read
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-x-4 mt-2 flex-col md:flex-row w-1/2">
                <span className="font-mono text-[11px] text-muted">
                  <span className="inline-block mr-2">Published: </span>
                  {formatDate(blog.date)}
                </span>
                <span className="font-mono text-[11px] text-muted">
                  <span className="inline-block mr-2">Modified: </span>
                  {formatDate(blog.lastModified)}
                </span>
              </div>
              {/* Tags row */}
              {blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-x-4 mt-2 justify-end">
                  {blog.tags.map((tag) => (
                    <Link
                      to="/blog"
                      search={{ tag }}
                      key={tag}
                      className="text-[11px] font-mono uppercase tracking-widest transition-colors text-muted hover:text-primary cursor-pointer"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>
      </div>

      <div className="grid grid-cols-1 items-start gap-4">
        <article className="col-span-1 xl:col-span-3">
          {/* Content */}
          <div className="article-content prose max-w-none pb-6 text-[16px] leading-relaxed dark:prose-invert">
            <Markdown
              children={blog.content || ''}
              remarkPlugins={[remarkGfm, remarkBreaks]}
              rehypePlugins={[
                rehypeSlug,
                rehypeSanitize,
                [rehypeHighlight, { detect: true }],
                [
                  rehypeAutolinkHeadings,
                  {
                    behavior: 'append',
                    maxDepth: 4,
                    content: [
                      s(
                        'svg.autolink-svg',
                        {
                          xmlns: 'http://www.w3.org/2000/svg',
                          width: 16,
                          height: 16,
                          fill: 'currentColor',
                          viewBox: '0 0 24 24',
                        },
                        s('path', {
                          d: 'M9.199 13.599a5.99 5.99 0 0 0 3.949 2.345 5.987 5.987 0 0 0 5.105-1.702l2.995-2.994a5.992 5.992 0 0 0 1.695-4.285 5.976 5.976 0 0 0-1.831-4.211 5.99 5.99 0 0 0-6.431-1.242 6.003 6.003 0 0 0-1.905 1.24l-1.731 1.721a.999.999 0 1 0 1.41 1.418l1.709-1.699a3.985 3.985 0 0 1 2.761-1.123 3.975 3.975 0 0 1 2.799 1.122 3.997 3.997 0 0 1 .111 5.644l-3.005 3.006a3.982 3.982 0 0 1-3.395 1.126 3.987 3.987 0 0 1-2.632-1.563A1 1 0 0 0 9.201 13.6zm5.602-3.198a5.99 5.99 0 0 0-3.949-2.345 5.987 5.987 0 0 0-5.105 1.702l-2.995 2.994a5.992 5.992 0 0 0-1.695 4.285 5.976 5.976 0 0 0 1.831 4.211 5.99 5.99 0 0 0 6.431 1.242 6.003 6.003 0 0 0 1.905-1.24l1.723-1.723a.999.999 0 1 0-1.414-1.414L9.836 19.81a3.985 3.985 0 0 1-2.761 1.123 3.975 3.975 0 0 1-2.799-1.122 3.997 3.997 0 0 1-.111-5.644l3.005-3.006a3.982 3.982 0 0 1 3.395-1.126 3.987 3.987 0 0 1 2.632 1.563 1 1 0 0 0 1.602-1.198z',
                        }),
                      ),
                    ],
                  },
                ],
              ]}
            />
          </div>

          {/* Related posts */}
          {relatedBlogs.length > 0 && (
            <section className="mt-10 border-t border-border pt-8">
              <p className="section-label mb-5 font-mono text-[12px] uppercase tracking-widest text-muted">
                More reading
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {relatedBlogs.map((related) => (
                  <Link
                    key={related.slug}
                    to="/blog/$blogId"
                    params={{ blogId: related.slug }}
                    className="cursor-pointer rounded-xl border border-border bg-secondary-background p-4 transition-colors hover:bg-toggle-background"
                  >
                    {related.tags.length > 0 && (
                      <p className="post-tag mb-1 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
                        {related.tags.slice(0, 2).join(' • ')}
                      </p>
                    )}
                    <p className="post-title mb-1 text-sm font-medium">
                      {related.title}
                    </p>
                    <p className="post-meta font-mono text-[11px] text-muted mt-2">
                      {formatDate(related.date)}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Comment */}
          <div className="mt-10 border-t border-border pt-8">
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
              theme={getTheme()}
              lang="en"
              loading="lazy"
            />
          </div>
        </article>

        {/* TODO: Find a way to display the TOC section nicely */}
        {/* Table of Contents */}
        <aside className="sticky top-8 hidden">
          <TableOfContents toc={toc} />
        </aside>

        <button
          type="button"
          onClick={() => {
            if (isClient) window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="fixed bottom-18 right-4 inline-flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-primary/20 text-background shadow-lg hover:bg-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-se"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      </div>
    </div>
  )
}
