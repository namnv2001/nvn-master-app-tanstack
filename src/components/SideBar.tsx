import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

import { NAV_ITEMS } from '@/constants'

const SideBar = () => {
  const location = useLocation()

  const renderNavItems = () => {
    return NAV_ITEMS.map((item) => (
      <Link
        key={item.label}
        to={item.to}
        className={cn(
          'hover:bg-secondary rounded-sm p-2',
          location.pathname === item.to && 'bg-secondary',
        )}
      >
        {item.label}
      </Link>
    ))
  }

  const Section = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="py-4 border-b border-secondary last:border-b-0">
        {children}
      </div>
    )
  }

  return (
    <div className="p-4 border-r border-secondary h-screen sticky top-0 bottom-0 shrink-0 max-w-2xs">
      <Section>
        <Link to="/" className="font-semibold text-lg">
          🫆 Nam Nguyen
        </Link>
      </Section>
      <Section>
        <h2 className="font-semibold text-lg">About Me</h2>
        <div className="text-sm mt-2">
          <p>
            I'm{' '}
            <Link className="link" to="/about">
              Nam Nguyen
            </Link>
            , a software engineer.
          </p>
          <p className="mt-1">
            This is my personal space to share my thoughts 💬
          </p>
        </div>
      </Section>
      <Section>
        <div className="flex flex-col gap-1">{renderNavItems()}</div>
      </Section>
    </div>
  )
}

export default SideBar
