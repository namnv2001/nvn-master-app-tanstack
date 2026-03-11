import { Link } from '@tanstack/react-router'
import type { Article } from '@/types'
import { cn } from '@/lib/utils'
import { formatDate, isBlogRead } from '@/helpers'

type ArticleLinkProps = {
  article: Article
  showYear?: boolean
}

export const ArticleLink: React.FC<ArticleLinkProps> = ({
  article,
  showYear = false,
}) => {
  const isRead = isBlogRead(article.slug)

  return (
    <Link
      to="/blog/$blogId"
      params={{ blogId: article.slug }}
      className={cn(
        'border-b border-secondary last:border-b-0 p-2 hover:bg-secondary flex md:items-center flex-col md:flex-row',
      )}
    >
      <p
        className={cn(
          'w-32 text-sm',
          isRead && 'text-muted-foreground',
          showYear && 'w-38',
        )}
      >
        {formatDate(article.date, {
          options: {
            month: 'long',
            day: '2-digit',
            year: showYear ? 'numeric' : undefined,
          },
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
