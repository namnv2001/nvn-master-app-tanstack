import { Link } from '@tanstack/react-router'
import type { Blog } from '@/types'
import { cn } from '@/lib/utils'
import { formatDate } from '@/helpers'

export const BlogLink = ({
  blog,
  isRead = false,
}: {
  blog: Blog
  isRead: boolean
}) => {
  return (
    <Link
      to="/blog/$blogId"
      params={{ blogId: blog.slug }}
      className={cn(
        'border-b border-accent last:border-b-0 p-2 hover:bg-accent flex md:items-center flex-col md:flex-row',
      )}
    >
      <p className={cn('w-32 text-sm', isRead && 'text-muted-foreground')}>
        {formatDate(blog.date, {
          options: { month: 'long', day: '2-digit', year: undefined },
        })}
      </p>
      <h1
        className={cn('flex-1 text-link font-black', isRead && 'text-link/70')}
      >
        {blog.title}
      </h1>
    </Link>
  )
}
