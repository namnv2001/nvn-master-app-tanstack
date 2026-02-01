import { Link } from '@tanstack/react-router'
import type { Article } from '@/types'
import { cn } from '@/lib/utils'
import { formatDate, isBlogRead } from '@/helpers'

export const ArticleLink = ({
  article,
}: {
  article: Article
  }) => {
  const isRead = isBlogRead(article.slug)

  return (
    <Link
      to="/blog/$blogId"
      params={{ blogId: article.slug }}
      className={cn(
        'border-b border-accent last:border-b-0 p-2 hover:bg-accent flex md:items-center flex-col md:flex-row',
      )}
    >
      <p className={cn('w-32 text-sm', isRead && 'text-muted-foreground')}>
        {formatDate(article.date, {
          options: { month: 'long', day: '2-digit', year: undefined },
        })}
      </p>
      <h1
        className={cn('flex-1 text-link font-black', isRead && 'text-link/70')}
      >
        {article.title}
      </h1>
    </Link>
  )
}
