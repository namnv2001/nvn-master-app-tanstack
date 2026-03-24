import { Link } from '@tanstack/react-router'
import { CheckCircleIcon } from 'lucide-react'

import type { Article } from '@/types'
import { formatDate, isBlogRead } from '@/helpers'

export const BlogCard = ({ article }: { article: Article }) => {
  const isRead = isBlogRead(article.slug)

  return (
    <Link
      to="/blog/$blogId"
      params={{ blogId: article.slug }}
      className="grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border/60 py-5 last:border-b-0 hover:text-muted transition-colors"
    >
      <div>
        {article.tags.length > 0 && (
          <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            {article.tags.slice(0, 3).join(' • ')}
          </p>
        )}
        <div className="flex items-center gap-2 mb-1">
          {isRead ? <CheckCircleIcon className="w-4 h-4 text-muted" /> : null}
          <p
            className="text-[15px] font-medium leading-snug"
            dangerouslySetInnerHTML={{ __html: article.title }}
          />
        </div>
        {article.summary.length > 0 && (
          <p
            className="text-[13px] leading-relaxed text-muted font-light"
            dangerouslySetInnerHTML={{ __html: article.summary }}
          />
        )}
      </div>
      <p className="mt-1 whitespace-nowrap font-mono text-[11px] text-muted">
        {formatDate(article.date)}
      </p>
    </Link>
  )
}
