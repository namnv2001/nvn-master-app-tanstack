import { useEffect, useState } from 'react'

import type { TocItem } from 'remark-flexible-toc'
import { cn } from '@/lib/utils'

type TableOfContentsProps = {
  toc: Array<TocItem>
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ toc }) => {
  const [activeId, setActiveId] = useState('')
  const filteredToc = toc.map((i) => ({
    ...i,
    numbering: i.numbering.slice(1), // remove the first level (h1) from numbering
  }))

  // Scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id')
            setActiveId(id || '')
          }
        })
      },
      { rootMargin: '0px 0px -85% 0px' },
    )

    filteredToc.forEach((item) => {
      const element = document.getElementById(item.href.slice(1)) // remove the '#' from href
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  // Scroll to section when clicking on TOC item
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    const targetId = hash.slice(1) // remove the '#' from hash
    const targetElement = document.getElementById(targetId)
    if (targetElement) {
      setActiveId(targetId)
      targetElement.scrollIntoView({ behavior: 'instant' })
    }
  }, [window.location.hash])

  if (!filteredToc.length) return null

  return (
    <div>
      <h4 className="font-black mb-2">Table of Contents</h4>
      <nav>
        <ul className="list-none p-0 m-0">
          {filteredToc.map((item) => (
            <li
              key={item.href}
              style={{ marginLeft: `${(item.depth - 1) * 1}rem` }}
              className={cn(
                'hover:bg-secondary/50 rounded-sm px-3 font-medium cursor-pointer',
                activeId === item.href.slice(1)
                  ? 'bg-secondary text-link'
                  : 'text-muted-foreground',
              )}
            >
              <a href={item.href} className="text-sm w-full block py-0.5">
                {item.value}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default TableOfContents
