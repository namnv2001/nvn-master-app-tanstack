import { Theme } from '@/constants'
import { getTheme, setTheme as setLocalStorageTheme } from '@/helpers'
import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  setTheme: (theme: string) => void
}

export const ThemeToggle = ({ setTheme }: ThemeToggleProps) => {
  const theme = getTheme()
  const isDark = theme === Theme.DARK

  const onToggle = () => {
    setLocalStorageTheme(isDark ? Theme.LIGHT : Theme.DARK)
    setTheme(getTheme())
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className="relative inline-flex h-[22px] w-10 cursor-pointer items-center rounded-full border border-border/60 bg-toggle-background px-[3px] transition-colors"
      aria-label="Toggle dark mode"
    >
      <span
        className={`inline-flex h-[14px] w-[14px] transform rounded-full bg-primary transition-transform ${
          isDark ? 'translate-x-[18px]' : 'translate-x-0'
        }`}
      />
      <span
        className={cn(
          'pointer-events-none absolute inset-y-0 right-1 flex items-center text-[11px]',
          isDark ? 'translate-x-[-20px]' : 'translate-x-0',
        )}
      >
        {isDark ? '☀' : '☽'}
      </span>
    </button>
  )
}
