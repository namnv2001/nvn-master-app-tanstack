import { createServerFn } from '@tanstack/react-start'

import matter from 'gray-matter'

import * as z from 'zod'
import type { Blog } from '@/types'

// Import all markdown files at build time using Vite's glob
const blogModules = import.meta.glob<string>('../data/blogs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const buildBlog = (rawContent: string, slug: string): Blog => {
  const { data: parsed, content } = matter(rawContent)

  const result: Blog = {
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

export const getAllBlogs = createServerFn({
  method: 'GET',
}).handler((): Promise<Array<Blog>> => {
  const blogs: Array<Blog> = []

  for (const [key, rawContent] of Object.entries(blogModules)) {
    const slug = key.replace('./blogs/', '').replace('.md', '')
    const blog = buildBlog(rawContent, slug)
    if (!blog.draft) blogs.push(blog)
  }

  // Sort by date (newest first)
  blogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return Promise.resolve(blogs)
})

export const getBlogBySlug = createServerFn({ method: 'GET' })
  .inputValidator(z.string().min(1))
  .handler(async ({ data }): Promise<Blog> => {
    const rawContent = blogModules[`./blogs/${data}.md`]
    if (!rawContent) {
      return Promise.reject(new Error(`Blog with slug "${data}" not found`))
    }
    return Promise.resolve(buildBlog(rawContent, data))
  })

export const getTags = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<string>> => {
    const blogs = await getAllBlogs()
    return Array.from(new Set(blogs.map((blog) => blog.tags).flat()))
  },
)

export const getBlogsByTag = createServerFn({ method: 'GET' })
  .inputValidator(z.string().min(1))
  .handler(async ({ data }): Promise<Array<Blog>> => {
    const blogs = await getAllBlogs()
    return blogs.filter((blog) =>
      blog.tags.some((tag) => tag.toLowerCase() === data.toLowerCase()),
    )
  })

export const searchTag = createServerFn({ method: 'GET' })
  .inputValidator(z.string().min(1))
  .handler(async ({ data }): Promise<Array<string>> => {
    const tags = await getTags()
    return tags.filter((tag) => tag.toLowerCase().includes(data.toLowerCase()))
  })
