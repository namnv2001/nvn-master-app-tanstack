import { Link } from '@tanstack/react-router'

import { Image } from '@/components/Image'
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
            <span className="text-primary">vawnnam.blog</span>
          </Link>
          <div className="flex gap-6 text-xs">{renderNavItems()}</div>
        </div>
        <ThemeToggle setTheme={setTheme} />
      </nav>
    </header>
  )
}

export default NavBar
