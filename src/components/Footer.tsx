import { Facebook, Github, Linkedin } from 'lucide-react'

export const Footer = () => {
  const renderSocial = (url: string, icon: React.ReactNode) => {
    return (
      <a
        href={url}
        target="_blank"
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {icon}
      </a>
    )
  }
  return (
    <footer className="border-t border-secondary mt-8 block">
      <div className="px-4 py-8">
        <p className="text-sm text-muted-foreground pt-8 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center gap-8">
            {renderSocial('https://facebook.com/vn.120901', <Facebook />)}
            {renderSocial('https://github.com/namnv2001', <Github />)}
            {renderSocial('https://linkedin.com/in/namnv2001', <Linkedin />)}
          </div>
          <span>Made with ❤️ by Nam Nguyen</span>
        </p>
      </div>
    </footer>
  )
}
