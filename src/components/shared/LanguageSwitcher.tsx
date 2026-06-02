import { useEffect, useState } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/cn'

const STORAGE_KEY = 'ams-language'
type Lang = 'en' | 'ar'
const OPTIONS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
]

function applyLanguage(code: Lang) {
  document.documentElement.lang = code
  document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr'
  localStorage.setItem(STORAGE_KEY, code)
}

interface LanguageSwitcherProps {
  className?: string
  variant?: 'sidebar' | 'default'
}

export function LanguageSwitcher({ className, variant = 'default' }: LanguageSwitcherProps) {
  const [lang, setLang] = useState<Lang>(
    () => (localStorage.getItem(STORAGE_KEY) === 'ar' ? 'ar' : 'en'),
  )
  useEffect(() => applyLanguage(lang), [lang])
  const label = OPTIONS.find((o) => o.code === lang)?.label ?? 'English'
  const isSidebar = variant === 'sidebar'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'flex items-center gap-1.5 rounded px-3 py-1.5 text-sm',
            isSidebar
              ? 'bg-sidebar-accent text-sidebar-text-active hover:bg-sidebar-item-hover'
              : 'border bg-background hover:bg-muted',
            className,
          )}
        >
          <Globe className={cn('h-4 w-4', isSidebar && 'text-sidebar-primary')} />
          <span>{label}</span>
          <ChevronDown className="h-4 w-4 opacity-70" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {OPTIONS.map((opt) => (
          <DropdownMenuItem key={opt.code} onClick={() => setLang(opt.code)}>
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
