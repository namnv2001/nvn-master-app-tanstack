import matter from 'gray-matter'

import type { Article } from '@/types'

export const formatDate = (
  date: string,
  config?: {
    locale?: string
    options?: Intl.DateTimeFormatOptions
  },
) => {
  return new Date(date).toLocaleDateString(
    config?.locale || 'en-US',
    config?.options || {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  )
}

export const buildMarkdownContent = (
  rawContent: string,
  slug: string,
): Article => {
  const { data: parsed, content } = matter(rawContent)

  const result: Article = {
    title: parsed.title || '',
    date: parsed.date || '',
    lastModified: parsed.lastModified || parsed.date || '',
    tags: parsed.tags || [],
    draft: parsed.draft ?? false,
    summary: parsed.summary || '',
    images: parsed.images || [],
    slug,
    authors: parsed.authors || [],
    content: content,
  }
  return result
}

export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200
  const text = content.replace(/<[^>]*>/g, '')
  const wordCount = text.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

export const isClient = () => typeof window !== 'undefined'

const READ_STATUS_KEY = 'blog-read-status'

export const markBlogAsRead = (slug: string): void => {
  if (!isClient()) return

  try {
    const readStatus = getReadBlogs()
    readStatus[slug] = Date.now()
    localStorage.setItem(READ_STATUS_KEY, JSON.stringify(readStatus))
  } catch (error) {
    console.error('Failed to mark blog as read:', error)
  }
}

export const isBlogRead = (slug: string): boolean => {
  if (!isClient()) return false

  try {
    const readStatus = getReadBlogs()
    return slug in readStatus
  } catch (error) {
    console.error('Failed to check blog read status:', error)
    return false
  }
}

export const getReadBlogs = (): Record<string, number> => {
  if (!isClient()) return {}

  try {
    const stored = localStorage.getItem(READ_STATUS_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Failed to get read blogs:', error)
    return {}
  }
}

export const groupBlogsByYear = (
  blogs: Array<Article>,
): Record<string, Array<Article>> => {
  return blogs.reduce(
    (acc, blog) => {
      const year = new Date(blog.date).getFullYear()
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      acc[year] = [...(acc[year] || []), blog]
      return acc
    },
    {} as Record<string, Array<Article>>,
  )
}

export const debounce = (
  func: (...args: Array<any>) => void,
  wait: number = 300,
) => {
  let timer: ReturnType<typeof setTimeout> | null = null

  return (...args: Array<any>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func(...args)
    }, wait)
  }
}
