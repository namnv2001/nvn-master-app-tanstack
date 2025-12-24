import { Link } from '@tanstack/react-router'

import { CheckCircle2 } from 'lucide-react'

import { Image } from './Image'
import { Badge } from './ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

import type { Blog } from '@/types'
import { formatDate } from '@/helpers'

export const BlogCard = ({
  blog,
  isRead = false,
}: {
  blog: Blog
  isRead: boolean
}) => {
  return (
    <Link
      key={blog.slug}
      to="/blog/$blogId"
      params={{ blogId: blog.slug }}
      className="group"
    >
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 hover:border-border pt-4! relative">
        {isRead && (
          <div className="absolute top-6 right-6 z-10 bg-primary/90 rounded-full p-1.5 shadow-lg">
            <CheckCircle2 size={20} className="text-primary-foreground" />
          </div>
        )}
        <CardHeader className="mx-4 p-0">
          <div className="relative rounded-xl overflow-hidden aspect-video bg-muted">
            <Image
              src={blog.images[0]}
              alt={blog.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="px-6 pt-2 -mx-4">
            <CardTitle className="text-2xl mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {blog.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-6 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3 mt-auto">
            <div className="text-xs text-muted-foreground">
              <time dateTime={blog.date}>{formatDate(blog.date)}</time>
            </div>
            {blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {blog.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <CardDescription className="line-clamp-3 text-sm leading-relaxed">
            {blog.summary}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}
