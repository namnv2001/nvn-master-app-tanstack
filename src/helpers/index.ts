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
