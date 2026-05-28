// Shared style constants for auth components.
// All colors reference @theme tokens defined in src/styles/globals.css

/** Standard text input */
export const inputBase =
  'w-full h-[52px] px-4 text-15 bg-white dark:bg-brand-navy-mid text-brand-navy dark:text-white ' +
  'placeholder:text-input-placeholder placeholder:text-[14px] ' +
  'border border-input-border dark:border-brand-navy-border rounded-xl ' +
  'focus:outline-none focus:bg-white dark:focus:bg-brand-navy-mid ' +
  'focus:border-brand-navy dark:focus:border-brand-teal ' +
  'focus:ring-2 focus:ring-brand-navy/10 dark:focus:ring-brand-teal/20 ' +
  'transition-all'

/** Password input (extra right padding for eye toggle) */
export const inputPassword = inputBase + ' pr-12'

/** Primary CTA button (dark navy) */
export const btnPrimary =
  'w-full h-[52px] text-15 font-medium rounded-xl ' +
  'bg-brand-navy hover:bg-brand-navy-mid text-white transition-all ' +
  'disabled:bg-brand-navy/60 disabled:text-white/70 ' +
  'disabled:cursor-not-allowed disabled:hover:bg-brand-navy/60'

/** Secondary/outline button (Google SSO, etc.) */
export const btnSecondary =
  'w-full h-[52px] flex items-center justify-center gap-3 text-15 font-medium ' +
  'border-2 border-divider dark:border-brand-navy-border rounded-xl ' +
  'bg-white dark:bg-brand-navy-mid text-brand-navy dark:text-white ' +
  'hover:bg-hover-light dark:hover:bg-hover-dark transition-all'

/** Form label */
export const labelClass =
  'block text-15 font-medium text-brand-navy dark:text-white mb-2'

/** Error message container */
export const errorBox =
  'flex items-center gap-2.5 p-3.5 rounded-xl ' +
  'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'

/** Icon circle (used in forgot/otp/reset headers) */
export const iconBox =
  'w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4'

/** Page transition variants for Framer Motion */
export const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
}

/** Loading spinner (inline in buttons) */
export const spinnerClass =
  'w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block'
