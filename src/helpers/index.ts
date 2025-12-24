export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
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
