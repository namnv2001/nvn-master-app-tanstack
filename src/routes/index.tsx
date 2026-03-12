import { createFileRoute } from '@tanstack/react-router'
import React from 'react'

import { ArticleLink } from '@/components/ArticleLink'
import { Image } from '@/components/Image'
import { getAllArticles } from '@/data/articles'

export const Route = createFileRoute('/')({
  component: App,
  loader: async () => await getAllArticles(),
})

function App() {
  const { blogs, gears } = Route.useLoaderData()

  return (
    <React.Fragment>
      <div className="xl:flex items-start gap-4">
        <div className="md:flex-1/2">
          <h1 className="text-5xl font-bold">Hey, I'm Nam!</h1>
          <p className="text-lg my-6">
            I'm a junior frontend software engineer.
            <br />
            I've been working in the industry for nearly <strong>4</strong>{' '}
            years and still happy with my job.
            <br />
            I'm currently working at{' '}
            <a
              href="https://career.teko.vn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link hover:underline"
            >
              Teko Solution
            </a>
            , as a <strong>L2</strong> Software Engineer, delivering
            high-quality products to our clients.
          </p>
        </div>
        <div className="md:flex-1/2 overflow-hidden object-contain rounded-md">
          <Image
            src="static/images/avatar.jpg"
            alt="Nam Nguyen"
            className="h-auto"
          />
        </div>
      </div>
      {/* Blog Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold">Blogs</h2>
        <p className="text-muted-foreground mt-2 text-md">
          Articles, Insights, Tips, Life, and more...
        </p>
        <div className="mt-4">
          {blogs.slice(0, 5).map((blog) => (
            <ArticleLink key={blog.slug} article={blog} showYear />
          ))}
        </div>
      </div>
      {/* Gear Section */}
      <div className="mt-12">
        <h2 className="text-3xl font-bold">Gears</h2>
        <p className="text-muted-foreground mt-2 text-md">
          What I'm using and my honest opinion
        </p>
        <div className="mt-4">
          {gears.map((gear) => (
            <ArticleLink key={gear.slug} article={gear} showYear />
          ))}
        </div>
      </div>
    </React.Fragment>
  )
}
