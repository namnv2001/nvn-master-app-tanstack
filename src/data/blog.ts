import { createServerFn } from '@tanstack/react-start'

import matter from 'gray-matter'

type Blog = {
  title: string
  date: string
  lastModified: string
  tags: Array<string>
  draft: boolean
  summary: string
  images: Array<string>
  authors?: Array<string>
  content?: string
}

// Import all markdown files at build time using Vite's glob
const blogModules = import.meta.glob<string>('../data/blogs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const buildBlog = (rawContent: string): Blog => {
  const { data: parsed, content } = matter(rawContent)

  const result: Blog = {
    title: parsed.title || '',
    date: parsed.date || '',
    lastModified: parsed.lastModified || parsed.date || '',
    tags: parsed.tags || [],
    draft: parsed.draft ?? false,
    summary: parsed.summary || '',
    images: parsed.images || [],
    authors: parsed.authors || [],
    content: content,
  }
  return result
}

export const getAllBlogs = createServerFn({
  method: 'GET',
}).handler((): Promise<Array<Blog>> => {
  const blogs: Array<Blog> = []

  for (const [, rawContent] of Object.entries(blogModules)) {
    const blog = buildBlog(rawContent)
    if (!blog.draft) blogs.push(blog)
  }

  // Sort by date (newest first)
  blogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return Promise.resolve(blogs)
})

export const getBlogBySlug = createServerFn({ method: 'POST' })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    const rawContent = blogModules[`./blogs/${data}.md`]
    if (!rawContent) {
      return Promise.reject(new Error(`Blog with slug "${data}" not found`))
    }
    return Promise.resolve(buildBlog(rawContent))
  })
