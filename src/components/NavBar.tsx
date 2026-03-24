import { Link } from '@tanstack/react-router'

import { ThemeToggle } from '@/components/ThemeToggle'
import { NAV_ITEMS } from '@/constants'

type NavBarProps = {
  setTheme: (theme: string) => void
}

const NavBar = ({ setTheme }: NavBarProps) => {
  const renderNavItems = () => {
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

  return (
    <header className="pb-8 pt-4 border-b border-border/60">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-mono text-[16px] font-bold">
            vawnnam.blog
          </Link>
          <div className="flex gap-6 text-xs">{renderNavItems()}</div>
        </div>
        <ThemeToggle setTheme={setTheme} />
      </nav>
    </header>
  )
}

export default NavBar
