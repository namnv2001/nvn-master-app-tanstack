import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { useEffect, useState } from 'react'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

import { Footer } from '@/components/Footer'
import NavBar from '@/components/NavBar'
import SideBar from '@/components/SideBar'
import { isClient } from '@/helpers'
import { cn } from '@/lib/utils'
import Loading from '@/components/Loading'

interface MyRouterContext {
  queryClient: QueryClient
  isClient: boolean
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Vawnnam Dev',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  context: (ctx) => ({
    ...ctx,
    isClient: isClient(),
  }),
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const { isClient: _isClient } = Route.useRouteContext()
  const location = useLocation()

  const [showSideBar, setShowSideBar] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!_isClient) return

    const resizeHandler = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect
        if (width < 1024) {
          setShowSideBar(false)
        } else {
          setShowSideBar(true)
        }
      }
    })
    resizeHandler.observe(document.body)

    return () => resizeHandler.disconnect()
  }, [_isClient])

  useEffect(() => {
    if (!_isClient) return
    setLoading(false)
  }, [_isClient])

  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background">
        {loading ? (
          <Loading />
        ) : (
          <div className={cn(showSideBar && 'flex container mx-auto')}>
            {showSideBar ? <SideBar /> : <NavBar />}
            <div className="py-8 w-full">
              <div className="px-4 xl:pl-16">{children}</div>
              <Footer />
            </div>
          </div>
        )}
        <TanStackDevtools
          config={{
            position: 'bottom-left',
            triggerHidden: !_isClient || !location.url.includes('localhost'),
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
