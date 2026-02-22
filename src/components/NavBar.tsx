import { Link } from '@tanstack/react-router'
import { List, ListXIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { NAV_ITEMS } from '@/constants'

const NavBar = () => {
  const MOBILE_WIDTH = 550
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_WIDTH)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const renderNavItems = () => {
    return NAV_ITEMS.map((item) => (
      <Link
        key={item.label}
        to={item.to}
        className={cn(isMobile && 'my-4')}
        {...(isMobile ? { onClick: () => setIsOpen(false) } : {})}
      >
        {item.label}
      </Link>
    ))
  }

  return (
    <div className="sticky top-0 z-50">
      <div className="px-4 py-4 flex items-center justify-between relative">
        <Link to="/" className="font-semibold text-lg">
          Nam Nguyen
        </Link>
        <div className={cn('flex justify-between gap-4', isMobile && 'hidden')}>
          {renderNavItems()}
        </div>

        <div className={cn('ml-auto', !isMobile && 'hidden')}>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 focus:outline-none focus:ring-2"
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
          <div className="absolute inset-x-0 top-full h-screen shadow-lg bg-background/80 backdrop-blur list-none">
            <div className="flex flex-col gap-2 px-4 py-4">
              {renderNavItems()}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NavBar
