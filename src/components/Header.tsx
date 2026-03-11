import { Link, useLocation } from '@tanstack/react-router'
import { List, ListXIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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
  const [isMobile, setIsMobile] = useState(false)
  const [activeItem, setActiveItem] = useState('')
  const mobileMenuRef = useRef<HTMLDivElement | null>(null)

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
    {
      label: 'Tag',
      to: '/tag',
    },
  ]

  useEffect(() => {
    setActiveItem(pathname)
  }, [pathname])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_WIDTH)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!isMobile || !isOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobile, isOpen])

  const renderNavItems = (onItemClick?: () => void) => {
    return navItems.map((item) => (
      <NavigationMenuItem key={item.label}>
        <NavigationMenuLink asChild onClick={onItemClick}>
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
    <NavigationMenu className={cn('sticky top-0 z-50 w-full bg-background')}>
      <div className="container max-w-5xl mx-auto px-4 py-4 flex items-center justify-end relative">
        <NavigationMenuList
          className={cn('flex justify-between gap-4', isMobile && 'hidden')}
        >
          {renderNavItems()}
        </NavigationMenuList>

        {/* Mobile menu trigger */}
        <div className={cn('ml-auto text-neutral-200', !isMobile && 'hidden')}>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-500"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <ListXIcon className="size-7" />
            ) : (
              <List className="size-7" />
            )}
          </button>
        </div>

        {/* Mobile menu content */}
        {isMobile && isOpen && (
          <div
            ref={mobileMenuRef}
            className="absolute inset-x-0 top-full bg-background/95 shadow-lg backdrop-blur list-none"
          >
            <div className="flex flex-col gap-2 px-4 py-4">
              {renderNavItems(() => setIsOpen(false))}
            </div>
          </div>
        )}
      </div>
    </NavigationMenu>
  )
}
