import { createFileRoute } from '@tanstack/react-router'
import Markdown from 'react-markdown'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'
import { Suspense, lazy, useEffect, useState } from 'react'

import { getAboutContent } from '@/data/articles'

const PdfViewer = lazy(() =>
  import('@/components/pdf-viewer').then((m) => ({ default: m.PdfViewer })),
)

const RESUME_URL = '/static/others/NguyenVanNam_SoftwareEngineer_CV.pdf'

export const Route = createFileRoute('/about/')({
  component: RouteComponent,
  loader: async () => await getAboutContent(),
})

function downloadPdf() {
  fetch(RESUME_URL)
    .then((r) => r.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'NguyenVanNam_SoftwareEngineer_CV.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
}

function RouteComponent() {
  const aboutContent = Route.useLoaderData()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div>
      <h1 className="text-4xl font-serif font-bold md:text-5xl tracking-tight mb-3">
        About Me
      </h1>
      <p className="text-muted tracking-wide">Who am I, what am I doing.</p>
      <article className="article-content mt-8">
        <Markdown
          children={aboutContent.content || ''}
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'prepend', maxDepth: 4 }],
          ]}
        />
      </article>
      <section className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-serif font-bold tracking-tight">
            Resume
          </h2>
          <button
            onClick={downloadPdf}
            className="text-sm text-muted hover:text-foreground underline underline-offset-4 transition-colors cursor-pointer"
          >
            Download PDF
          </button>
        </div>
        {mounted && (
          <Suspense
            fallback={
              <div className="w-full rounded-lg border border-border flex items-center justify-center text-sm text-muted" style={{ minHeight: '600px' }}>
                Loading PDF viewer…
              </div>
            }
          >
            <PdfViewer url={RESUME_URL} />
          </Suspense>
        )}
      </section>
    </div>
  )
}
