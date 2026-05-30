import { ReactNode } from 'react'
import { AnimatePresence } from 'motion/react'
import { Package } from 'lucide-react'
import chorusLogo from '@/assets/c41ddd9636ba0cf84d17b65494aee06fd1254e8a.png'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-page-bg dark:bg-page-bg-dark">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-[650px] relative overflow-hidden bg-brand-navy flex-col justify-between p-12">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1624927637280-f033784c1279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3YXJlaG91c2UlMjBpbnZlbnRvcnklMjBtYW5hZ2VtZW50JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzI0NjIxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/60 to-brand-navy/95" />

        {/* Logo */}
        <div className="relative z-10">
          <img src={chorusLogo} alt="Chorus" className="h-18 w-auto" />
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-5">
          <h2 className="text-[36px] font-medium text-white leading-tight">
            Asset Management System
          </h2>
          <p className="text-white/60 text-17 leading-relaxed max-w-md">
            Track and manage assets with real-time inspection updates and reporting
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-13 text-white/30">
          &copy; 2026 Chorus AMS. All rights reserved.
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[460px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand-navy flex items-center justify-center">
                <Package className="h-[22px] w-[22px] text-white" />
              </div>
              <div>
                <p className="text-[16px] font-bold text-brand-navy dark:text-white">Chorus AMS</p>
                <p className="text-[12px] text-muted-foreground">Asset Management System</p>
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-card-dark rounded-2xl shadow-xl border border-divider dark:border-brand-navy-border p-8 sm:p-10">
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
