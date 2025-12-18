import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

import { Footer } from '@/components/Footer'
import Header from '@/components/Header'
import { isClient } from '@/helpers'

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
        title: 'namnv2001',
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

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen bg-background">
        <div className="w-full">
          <Header />
          <div className="container max-w-5xl mx-auto px-4 py-8">
            {children}
          </div>
          <Footer />
        </div>
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
