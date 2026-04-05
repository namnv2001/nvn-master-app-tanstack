import { Link } from '@tanstack/react-router'
import { List, ListXIcon } from 'lucide-react'
import React, { useState } from 'react'

import { Image } from '@/components/Image'
import { ThemeToggle } from '@/components/ThemeToggle'
import { NAV_ITEMS } from '@/constants'
import { useGlobalStore } from '@/store'
import { cn } from '@/lib/utils'

type NavBarProps = {
  setTheme: (theme: string) => void
}

const NavBar = ({ setTheme }: NavBarProps) => {
  const { isMobile } = useGlobalStore()

  return (
    <header className="pb-8 pt-8 border-b border-border/60 sticky top-0 z-10 bg-background">
      <nav className="flex items-center justify-between gap-4 relative">
        <div
          className={cn(
            'flex items-center gap-8',
            isMobile && 'justify-between flex-1',
          )}
        >
          <Link
            to="/"
            className="font-mono text-[16px] font-bold flex items-center gap-2"
          >
            <Image
              src="/static/images/favicon.svg"
              alt="vawnnam.blog"
              width={24}
              height={24}
            />
            <span className="text-primary transition-colors">vawnnam.blog</span>
          </Link>
          <div className="flex gap-6 text-xs">{<NavItems />}</div>
        </div>
        <ThemeToggle setTheme={setTheme} />
      </nav>
    </header>
  )
}

const NavItems: React.FC = () => {
  const { isMobile } = useGlobalStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleToggleMenu = () => setIsOpen((prev) => !prev)

  if (isMobile) {
    return (
      <React.Fragment>
        <button
          type="button"
          onClick={handleToggleMenu}
          className="transition-colors"
        >
          {isOpen ? (
            <ListXIcon className="size-7" />
          ) : (
            <List className="size-7" />
          )}
        </button>
        {isOpen && (
          <div className="absolute top-16 z-50 inset-x-0 h-screen w-full bg-background p-4 flex flex-col gap-4">
            {NAV_ITEMS.map((item) => (
              <Link
                to={item.to}
                key={item.label}
                className="py-4 text-base"
                onClick={handleToggleMenu}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </React.Fragment>
    )
  }

  return NAV_ITEMS.map((item) => (
    <Link
      key={item.label}
      to={item.to}
      className={`cursor-pointer text-[13px] transition-colors hover:text-primary ${
        location.pathname === item.to ? 'text-primary' : 'text-muted'
      }`}
    >
      {item.label}
    </Link>
  ))
}

export default NavBar
