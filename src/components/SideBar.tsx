import { Link, useLocation } from '@tanstack/react-router'
import { cn } from '@/lib/utils'

const SideBar = () => {
  const location = useLocation()
  const navItems = [
    {
      label: 'About Me',
      to: '/about',
    },
    {
      label: 'My Blogs',
      to: '/blog',
    },
    {
      label: 'Tag',
      to: '/tag',
    },
  ]

  const renderNavItems = () => {
    return navItems.map((item) => (
      <Link
        key={item.label}
        to={item.to}
        className={cn(
          'hover:bg-accent rounded-sm p-2',
          location.pathname === item.to && 'bg-accent',
        )}
      >
        {item.label}
      </Link>
    ))
  }

  const Section = ({ children }: { children: React.ReactNode }) => {
    return (
      <div className="py-4 border-b border-accent last:border-b-0">
        {children}
      </div>
    )
  }

  return (
    <div className="py-4 px-4 border-r border-accent h-screen sticky top-0 bottom-0 shrink-0 max-w-2xs">
      <Section>
        <Link to="/" className="font-semibold text-lg">
          Nam Nguyen
        </Link>
      </Section>
      <Section>
        <h2 className="font-semibold text-lg">About Me</h2>
        <p className="text-sm">
          I'm Nam, software engineer.
          <br />
          This is my personal space to share my thoughts.
        </p>
      </Section>
      <Section>
        <div className="flex flex-col gap-1">{renderNavItems()}</div>
      </Section>
    </div>
  )
}

export default SideBar
