import { Link, useLocation } from '@tanstack/react-router'
import { List, ListXIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './ui/navigation-menu'

import { cn } from '@/lib/utils'

const MOBILE_WIDTH = 950

export default function Header() {
  const { pathname } = useLocation()

  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_WIDTH)
  const [activeItem, setActiveItem] = useState('')

  const navItems = [
    {
      label: 'Home',
      to: '/',
    },
    {
      label: 'About',
      to: '/about',
    },
    {
      label: 'Blog',
      to: '/blog',
    },
  ]

  useEffect(() => {
    setActiveItem(pathname)
  }, [pathname])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_WIDTH)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const renderNavItems = () => {
    return navItems.map((item) => (
      <NavigationMenuItem key={item.label}>
        <NavigationMenuLink asChild>
          <Link
            to={item.to}
            className={cn(
              'text-neutral-200 transition-colors',
              activeItem === item.to && 'font-bold',
            )}
          >
            {item.label}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    ))
  }

  return (
    <NavigationMenu
      className={cn(
        'sticky top-0 z-50 w-full bg-nav-background',
        isOpen && 'bg-nav-background-open',
      )}
    >
      <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-end">
        <NavigationMenuList
          className={cn('flex justify-between gap-4', isMobile && 'hidden')}
        >
          {renderNavItems()}
        </NavigationMenuList>

        {/* Mobile menu trigger */}
        <div
          className={cn(
            'text-neutral-200 cursor-pointer',
            !isMobile && 'hidden',
            isOpen && 'h-screen',
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <ListXIcon className="size-8" />
          ) : (
            <List className="size-8" />
          )}

          {/* Mobile menu content */}
          {isOpen && (
            <div className="bg-amber-400 list-none">{renderNavItems()}</div>
          )}
        </div>
      </div>
    </NavigationMenu>
  )
}
