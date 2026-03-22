import { SOCIAL_LINKS } from '@/constants'

export const Footer = () => {
  const renderSocial = (link: { to: string; label: string }) => {
    return (
      <a
        href={link.to}
        target="_blank"
        className="text-muted hover:text-primary transition-colors underline underline-offset-4 decoration-toggle-background"
      >
        {link.label}
      </a>
    )
  }

  return (
    <footer className="mt-8 mb-2 block font-mono text-[12px] text-muted">
      <p className="uppercase tracking-widest border-b border-toggle-background pb-2 mb-5">
        Find me
      </p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map(renderSocial)}
        </div>
        <p> {new Date().getFullYear()} &copy; vawnnam</p>
      </div>
    </footer>
  )
}
