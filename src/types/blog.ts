export type Blog = {
  title: string
  date: string
  lastModified: string
  tags: Array<string>
  draft: boolean
  summary: string
  images: Array<string>
  slug: string
  authors?: Array<string>
  content?: string
}
