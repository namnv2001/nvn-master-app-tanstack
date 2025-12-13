import { Link } from '@tanstack/react-router'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from './ui/navigation-menu'

export default function Header() {
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

  const renderNavItems = () => {
    return navItems.map((item) => (
      <NavigationMenuItem key={item.label}>
        <NavigationMenuLink asChild>
          <Link
            to={item.to}
            className="text-neutral-200 hover:text-foreground transition-colors font-bold"
          >
            {item.label}
          </Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    ))
  }

  return (
    <NavigationMenu className="sticky top-0 z-50 w-full bg-nav-background">
      <div className="container max-w-5xl mx-auto px-4 py-2 md:py-4 flex items-center justify-end">
        <NavigationMenuList className="flex justify-between gap-4">
          {renderNavItems()}
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  )
}
