import { Link, createFileRoute } from '@tanstack/react-router'

import { ArrowLeft, Calendar, Clock, User } from 'lucide-react'
import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

import { Image } from '@/components/Image'
import { Badge } from '@/components/ui/badge'
import { getBlogBySlug } from '@/data/blog'
import { calculateReadingTime, formatDate } from '@/helpers'

export const Route = createFileRoute('/blog/$blogId')({
  component: RouteComponent,
  loader: ({ params: { blogId } }) => getBlogBySlug({ data: blogId }),
})

function RouteComponent() {
  const blog = Route.useLoaderData()
  const readingTime = blog.content ? calculateReadingTime(blog.content) : 0

  return (
    <article className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Navigation */}
      <nav className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Blog</span>
          </Link>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-foreground transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-foreground">{blog.title}</span>
        </div>
      </nav>

      {/* Header Section */}
      <header className="mb-12">
        {/* Hero Image */}
        {blog.images.length > 0 && (
          <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-8 bg-muted">
            <Image
              src={blog.images[0]}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0" />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
          {blog.title}
        </h1>

        {/* Summary */}
        {blog.summary && (
          <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
            {blog.summary}
          </p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-muted-foreground border-b border-border pb-6">
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
          <div className="flex flex-wrap gap-2 mt-6">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}
      </header>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <Markdown
          children={blog.content || ''}
          remarkPlugins={[remarkGfm, remarkBreaks]}
          components={{
            img: ({ node, ...props }) => (
              <div className="my-8 rounded-xl overflow-hidden">
                <Image {...props} className="w-full h-auto" />
              </div>
            ),
            a: ({ node, ...props }) => (
              <Link
                to={props.href}
                target="_blank"
                className="text-link hover:underline underline-offset-4"
                {...props}
              />
            ),
            h1: ({ node, ...props }) => (
              <h1
                className="text-4xl font-bold mt-12 mb-6 first:mt-0"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-3xl font-bold mt-10 mb-4 border-b border-border pb-2"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-2xl font-bold mt-8 mb-3" {...props} />
            ),
            h4: ({ node, ...props }) => (
              <h4 className="text-xl font-bold mt-6 mb-2" {...props} />
            ),
            h5: ({ node, ...props }) => (
              <h5 className="text-lg font-bold mt-5 mb-2" {...props} />
            ),
            h6: ({ node, ...props }) => (
              <h6 className="text-base font-bold mt-4 mb-2" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="mb-6 leading-8 text-foreground" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul
                className="list-disc list-outside mb-6 space-y-2 ml-6"
                {...props}
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="list-decimal list-outside mb-6 space-y-2 ml-6"
                {...props}
              />
            ),
            li: ({ node, ...props }) => <li className="leading-7" {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-primary pl-6 italic my-6 text-muted-foreground bg-muted/50 py-4 rounded-r-lg"
                {...props}
              />
            ),
            code: ({ node, ...props }) => {
              const isInline = !props.className
              return isInline ? (
                <code
                  className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground before:content-[''] after:content-['']"
                  {...props}
                />
              ) : (
                <code {...props} />
              )
            },
            pre: ({ node, ...props }) => (
              <pre
                className="bg-muted p-6 rounded-xl my-6 overflow-x-auto border border-border"
                {...props}
              />
            ),
            hr: ({ node, ...props }) => (
              <hr className="my-8 border-border" {...props} />
            ),
            table: ({ node, ...props }) => (
              <div className="overflow-x-auto my-6">
                <table
                  className="w-full border-collapse border border-border rounded-lg"
                  {...props}
                />
              </div>
            ),
            thead: ({ node, ...props }) => (
              <thead className="bg-muted" {...props} />
            ),
            tbody: ({ node, ...props }) => <tbody {...props} />,
            tr: ({ node, ...props }) => (
              <tr
                className="border-b border-border hover:bg-muted/50 transition-colors"
                {...props}
              />
            ),
            th: ({ node, ...props }) => (
              <th
                className="border border-border px-4 py-3 text-left font-bold"
                {...props}
              />
            ),
            td: ({ node, ...props }) => (
              <td className="border border-border px-4 py-3" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="font-bold text-foreground" {...props} />
            ),
            em: ({ node, ...props }) => <em className="italic" {...props} />,
          }}
        />
      </div>
    </article>
  )
}
