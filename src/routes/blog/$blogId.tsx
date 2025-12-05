import { Link, createFileRoute } from '@tanstack/react-router'

import Markdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

import { Image } from '@/components/Image'
import { getBlogBySlug } from '@/data/blog'

export const Route = createFileRoute('/blog/$blogId')({
  component: RouteComponent,
  loader: ({ params: { blogId } }) => getBlogBySlug({ data: blogId }),
})

function RouteComponent() {
  const blog = Route.useLoaderData()

  return (
    <Markdown
      children={blog.content}
      remarkPlugins={[remarkGfm, remarkBreaks]}
      components={{
        img: ({ node, ...props }) => <Image {...props} />,
        a: ({ node, ...props }) => <Link to={props.href} {...props} />,
        h1: ({ node, ...props }) => (
          <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-2xl font-bold mt-5 mb-2" {...props} />
        ),
        h4: ({ node, ...props }) => (
          <h4 className="text-xl font-bold mt-4 mb-2" {...props} />
        ),
        h5: ({ node, ...props }) => (
          <h5 className="text-lg font-bold mt-3 mb-2" {...props} />
        ),
        h6: ({ node, ...props }) => (
          <h6 className="text-base font-bold mt-3 mb-2" {...props} />
        ),
        p: ({ node, ...props }) => <p className="mb-4 leading-7" {...props} />,
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
        ),
        li: ({ node, ...props }) => <li className="ml-4" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-gray-300 pl-4 italic my-4"
            {...props}
          />
        ),
        code: ({ node, ...props }) => (
          <code
            className="inline-block bg-gray-100 dark:bg-gray-800 px-2 m-0 -mb-2 rounded"
            {...props}
          />
        ),
        pre: ({ node, ...props }) => (
          <pre
            className="bg-gray-100 dark:bg-gray-800 p-4 rounded my-4 overflow-x-auto"
            {...props}
          />
        ),
        hr: ({ node, ...props }) => (
          <hr className="my-6 border-gray-300" {...props} />
        ),
        table: ({ node, ...props }) => (
          <table
            className="w-full border-collapse border border-gray-300 my-4"
            {...props}
          />
        ),
        thead: ({ node, ...props }) => (
          <thead className="bg-gray-100 dark:bg-gray-800" {...props} />
        ),
        tbody: ({ node, ...props }) => <tbody {...props} />,
        tr: ({ node, ...props }) => (
          <tr className="border-b border-gray-300" {...props} />
        ),
        th: ({ node, ...props }) => (
          <th
            className="border border-gray-300 px-4 py-2 text-left font-bold"
            {...props}
          />
        ),
        td: ({ node, ...props }) => (
          <td className="border border-gray-300 px-4 py-2" {...props} />
        ),
        strong: ({ node, ...props }) => (
          <strong className="font-bold" {...props} />
        ),
        em: ({ node, ...props }) => <em className="italic" {...props} />,
      }}
    />
  )
}
