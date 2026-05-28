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
import { MOBILE_WIDTH, Theme } from '@/constants'
import { getTheme, isClient } from '@/helpers'
import { useGlobalStore } from '@/store'

interface MyRouterContext {
  queryClient: QueryClient
  isClient: boolean
}

/**
 * Runs synchronously as the very first thing in <body> — before any content
 * element is painted — so the correct theme class is on <html> before the
 * browser renders a single pixel of page content.
 *
 * It must be an immediately-invoked function so it cannot be deferred or
 * reordered by the browser.  We set `document.documentElement.className`
 * (the <html> element) rather than <body> so the CSS variables in
 * `:root.dark` / `.dark` cascade to every child element.
 */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme')||'dark';document.documentElement.className=t}catch(e){document.documentElement.className='dark'}})();`

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
        title: 'vawnnam.blog',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/static/images/favicon.svg',
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
  const { setIsMobile } = useGlobalStore()

  // On mount, sync state with whatever the inline script already applied.
  useEffect(() => {
    setTheme(getTheme())
  }, [])

  // Keep <html> class in sync whenever the theme state changes (e.g. toggle).
  // We manage the class directly on documentElement rather than via a React
  // className prop so that it never conflicts with React's reconciler.
  useEffect(() => {
    if (theme) {
      document.documentElement.classList.remove(Theme.DARK, Theme.LIGHT)
      document.documentElement.classList.add(theme)
    }
  }, [theme])

  useEffect(() => {
    if (!_isClient) return
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_WIDTH)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [_isClient])

  return (
    // suppressHydrationWarning: the inline script sets a class on <html> before
    // React hydrates, so the SSR attribute and the live DOM will differ.
    // suppressHydrationWarning tells React to accept the DOM as-is rather than
    // warn or attempt to "correct" an attribute it doesn't own.
    <html lang="en" suppressHydrationWarning>
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
      <body className="bg-background">
        {/*
          This script tag is intentionally the very first child of <body>.
          The browser parses HTML top-to-bottom; because this script appears
          before any content element, it executes (and sets the theme class)
          before the browser lays out or paints a single content node.
          Result: zero visible theme flash, even on a cold cache.
        */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <div className="mx-auto p-4 pt-0 max-w-3xl">
          <NavBar setTheme={setTheme} />
          <main className="mt-10">{children}</main>
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
