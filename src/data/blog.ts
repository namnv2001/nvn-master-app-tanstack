import { createServerFn } from '@tanstack/react-start'

type Blog = {
  title: string
  date: string
  lastModified: string
  tags: Array<string>
  draft: boolean
  summary: string
  images: Array<string>
  authors?: Array<string>
}

export const getAllBlogs = createServerFn({
  method: 'GET',
}).handler(async (): Promise<Array<Blog>> => {
  // TODO: do something to get data from md files

  return Promise.resolve([])
})
