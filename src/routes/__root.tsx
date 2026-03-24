import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { useEffect, useMemo, useState } from 'react'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

import { Footer } from '@/components/Footer'
import Loading from '@/components/Loading'
import NavBar from '@/components/NavBar'
import { getTheme, isClient } from '@/helpers'
import { Theme } from '@/constants'

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
  const [theme, setTheme] = useState<string | Theme>(Theme.DARK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!_isClient) return
    setTheme(getTheme())
    setLoading(false)
  }, [_isClient, theme])

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
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Lora:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`bg-background ${theme}`}>
        {loading ? (
          <Loading />
        ) : (
          <div className="mx-auto p-4 max-w-3xl">
            <NavBar setTheme={setTheme} />
            <main className="mt-10">{children}</main>
            <Footer />
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
