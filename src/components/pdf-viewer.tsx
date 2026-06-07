import { useCallback, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfViewerProps {
  url: string
}

const MIN_SCALE = 0.5
const MAX_SCALE = 2.0
const SCALE_STEP = 0.25

export function PdfViewer({ url }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)
  const containerRef = useRef<HTMLDivElement>(null)

  const onDocumentLoadSuccess = useCallback(
    ({ numPages: page }: { numPages: number }) => {
      setNumPages(page)
      setPageNumber(1)
    },
    [],
  )

  const prevPage = useCallback(() => {
    setPageNumber((p) => Math.max(1, p - 1))
  }, [])

  const nextPage = useCallback(() => {
    setPageNumber((p) => Math.min(numPages ?? 1, p + 1))
  }, [numPages])

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(MAX_SCALE, +(s + SCALE_STEP).toFixed(2)))
  }, [])

  const zoomOut = useCallback(() => {
    setScale((s) => Math.max(MIN_SCALE, +(s - SCALE_STEP).toFixed(2)))
  }, [])

  const resetZoom = useCallback(() => setScale(1.0), [])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 text-sm text-muted">
        <div className="flex items-center gap-1">
          <button
            onClick={prevPage}
            disabled={pageNumber <= 1}
            className="px-2 py-1 rounded border border-border hover:bg-muted/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Previous page"
          >
            ←
          </button>
          <span className="px-2 tabular-nums">
            {pageNumber} / {numPages ?? '-'}
          </span>
          <button
            onClick={nextPage}
            disabled={!numPages || pageNumber >= numPages}
            className="px-2 py-1 rounded border border-border hover:bg-muted/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Next page"
          >
            →
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={scale <= MIN_SCALE}
            className="px-2 py-1 rounded border border-border hover:bg-muted/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Zoom out"
          >
            -
          </button>
          <button
            onClick={resetZoom}
            className="px-2 py-1 rounded border border-border hover:bg-muted/20 transition-colors cursor-pointer tabular-nums min-w-14 text-center"
            aria-label="Reset zoom"
          >
            {Math.round(scale * 100)}%
          </button>
          <button
            onClick={zoomIn}
            disabled={scale >= MAX_SCALE}
            className="px-2 py-1 rounded border border-border hover:bg-muted/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full rounded-lg overflow-auto border border-border bg-muted/10 flex justify-center"
        style={{ minHeight: '600px', maxHeight: '80vh' }}
      >
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-[600px] text-muted text-sm">
              Loading PDF…
            </div>
          }
          error={
            <div className="flex items-center justify-center h-[600px] text-muted text-sm">
              Failed to load PDF.
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer
            renderAnnotationLayer
            className="shadow-md"
          />
        </Document>
      </div>
    </div>
  )
}
