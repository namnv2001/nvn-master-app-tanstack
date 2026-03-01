import { createServerFn } from '@tanstack/react-start'
import * as z from 'zod'

import type { Article } from '@/types'
import { buildMarkdownContent } from '@/helpers'

// Import all markdown files at build time using Vite's glob
const blogModules = import.meta.glob<string>('../data/blogs/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const gearModules = import.meta.glob<string>('../data/gears/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const aboutModules = import.meta.glob<string>('../data/about/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export const getAllArticles = createServerFn({
  method: 'GET',
}).handler(
  (): Promise<{
    blogs: Array<Article>
    gears: Array<Article>
  }> => {
    const blogs: Array<Article> = []
    const gears: Array<Article> = []

    for (const [key, rawContent] of Object.entries(blogModules)) {
      const slug = key.replace('./blogs/', '').replace('.md', '')
      const blog = buildMarkdownContent(rawContent, slug)
      if (!blog.draft) blogs.push(blog)
    }

    for (const [key, rawContent] of Object.entries(gearModules)) {
      const slug = key.replace('./gears/', '').replace('.md', '')
      const gear = buildMarkdownContent(rawContent, slug)
      if (!gear.draft) gears.push(gear)
    }

    // Sort by date (newest first)
    const sortByDateDesc = (articles: Array<Article>) =>
      articles.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
    sortByDateDesc(blogs)
    sortByDateDesc(gears)

    return Promise.resolve({ blogs, gears })
  },
)

export const getAboutContent = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Article> => {
    const rawContent = aboutModules['./about/about-me.md']
    return Promise.resolve(buildMarkdownContent(rawContent, 'about-me'))
  },
)

export const getArticleBySlug = createServerFn({ method: 'GET' })
  .inputValidator(z.string().min(1))
  .handler(async ({ data }): Promise<Article> => {
    const rawContent =
      blogModules[`./blogs/${data}.md`] || gearModules[`./gears/${data}.md`]
    if (!rawContent) {
      return Promise.reject(new Error(`Article with slug "${data}" not found`))
    }
    return Promise.resolve(buildMarkdownContent(rawContent, data))
  })

export const getTags = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<string>> => {
    const { blogs, gears } = await getAllArticles()
    return Array.from(
      new Set(
        [
          ...blogs.map((blog) => blog.tags),
          ...gears.map((gear) => gear.tags),
        ].flat(),
      ),
    )
  },
)

export const getArticlesByTag = createServerFn({ method: 'GET' })
  .inputValidator(z.string().min(1))
  .handler(async ({ data }): Promise<Array<Article>> => {
    const { blogs, gears } = await getAllArticles()
    return [...blogs, ...gears].filter((article) =>
      article.tags.some((tag) => tag.toLowerCase() === data.toLowerCase()),
    )
  })

export const searchTag = createServerFn({ method: 'GET' })
  .inputValidator(z.string().min(1))
  .handler(async ({ data }): Promise<Array<string>> => {
    const tags = await getTags()
    return tags.filter((tag) => tag.toLowerCase().includes(data.toLowerCase()))
  })
