/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { useTranslation } from 'react-i18next'

import { LanguageSwitcher } from '@/components/language-switcher'
import { Skeleton } from '@/components/ui/skeleton'
import { useSystemConfig } from '@/hooks/use-system-config'

type AuthLayoutProps = {
  children: React.ReactNode
}

/* Brand canvas shown beside the form on wide screens. Palette is fixed ink
 * (brushllm.com hero canvas) and intentionally independent of the active
 * theme preset so the first screen always lands the brand. */
function BrandCanvas() {
  const { t } = useTranslation()
  const chips = [
    'GPT-5.2',
    'Claude Opus 4.6',
    'Gemini 3 Pro',
    'DeepSeek V4',
    'Qwen-Max',
  ]
  const stats = [
    { value: '200+', key: 'auth.brand.stat.models' },
    { value: '99.9%', key: 'auth.brand.stat.uptime' },
    { value: '<80ms', key: 'auth.brand.stat.latency' },
  ]
  return (
    <aside className='bg-[#1a1b25] relative hidden overflow-hidden p-12 text-white lg:flex lg:flex-col xl:p-14'>
      {/* graph-paper grid */}
      <div
        aria-hidden='true'
        className='absolute inset-0'
        style={{
          backgroundImage:
            'linear-gradient(rgba(137,60,237,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(137,60,237,0.08) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />
      {/* aurora glows */}
      <div
        aria-hidden='true'
        className='absolute -top-32 right-[-120px] h-[420px] w-[420px] rounded-full bg-[#893ced]/40 blur-[90px]'
      />
      <div
        aria-hidden='true'
        className='absolute bottom-[-120px] left-[-100px] h-[340px] w-[340px] rounded-full bg-[#2aefc8]/25 blur-[90px]'
      />

      <div className='relative flex items-center gap-2.5'>
        <BrandMark />
      </div>

      <div className='relative mt-20 max-w-[520px] xl:mt-24'>
        <div className='text-[#2aefc8] font-mono text-[11px] tracking-[0.22em] uppercase'>
          {t('auth.brand.eyebrow')}
        </div>
        <h1 className='font-display text-5xl leading-[1.08] font-bold tracking-[-0.03em] xl:text-[56px]'>
          {t('auth.brand.headlineLead')}{' '}
          <span className='brush-band-mint'>{t('auth.brand.headlineBand')}</span>
          {t('auth.brand.headlineTail')}
        </h1>
        <p className='mt-5 max-w-[420px] text-[15px] leading-relaxed text-white/60'>
          {t('auth.brand.sub')}
        </p>
      </div>

      <div className='relative mt-9'>
        <div className='text-white/50 mb-3 text-[11px] tracking-[0.14em] uppercase'>
          {t('auth.brand.providersLabel')}
        </div>
        <div className='flex flex-wrap gap-2'>
          {chips.map((chip, i) => (
            <span
              key={chip}
              className={
                i === 0
                  ? 'rounded-full border border-transparent bg-[#893ced] px-3 py-1.5 font-mono text-[11.5px] text-white shadow-[0_2px_10px_rgba(137,60,237,0.35)]'
                  : 'rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[11.5px] text-white/80'
              }
            >
              {chip}
            </span>
          ))}
          <span className='rounded-full border border-white/15 bg-white/5 px-3 py-1.5 font-mono text-[11.5px] text-white/80'>
            + 32 more
          </span>
        </div>
      </div>

      {/* hand-drawn strokes, bottom right */}
      <svg
        aria-hidden='true'
        className='absolute right-[-30px] bottom-[70px] h-[200px] w-[260px]'
        viewBox='0 0 260 200'
        fill='none'
      >
        <path
          d='M40 150 C 90 60, 180 40, 230 90'
          stroke='#893ced'
          strokeWidth='14'
          strokeLinecap='round'
          opacity='0.55'
        />
        <path
          d='M60 170 C 110 100, 170 80, 215 120'
          stroke='#2aefc8'
          strokeWidth='9'
          strokeLinecap='round'
          opacity='0.5'
        />
        <path
          d='M30 120 C 70 40, 160 20, 225 60'
          stroke='#f4ea2a'
          strokeWidth='5'
          strokeLinecap='round'
          opacity='0.45'
        />
      </svg>

      <div className='relative mt-auto flex border-t border-white/10 pt-6'>
        {stats.map((stat, i) => (
          <div
            key={stat.key}
            className={i > 0 ? 'ml-6 border-l border-white/10 pl-6' : ''}
          >
            <div className='font-display text-[22px] font-bold tracking-[-0.02em]'>
              {stat.value}
            </div>
            <div className='text-white/50 text-xs'>{t(stat.key)}</div>
          </div>
        ))}
      </div>
    </aside>
  )
}

function BrandMark() {
  const { t } = useTranslation()
  const { systemName, logo, loading } = useSystemConfig()
  return (
    <>
      {loading ? (
        <Skeleton className='h-9 w-9 rounded-xl' />
      ) : (
        <img src={logo} alt={t('Logo')} className='h-9 w-9 rounded-xl' />
      )}
      <span className='font-display text-xl font-bold tracking-[-0.02em]'>
        {systemName || 'BrushLLM'}
      </span>
    </>
  )
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()
  const { logo, loading } = useSystemConfig()

  return (
    <div className='relative grid min-h-svh w-full lg:grid-cols-[1.15fr_1fr]'>
      <BrandCanvas />

      {/* Brand mark for the form side (mobile only — the canvas is hidden
          below lg). Non-interactive: `/` now redirects back to /sign-in, so
          a link here would be a no-op loop. */}
      <div className='absolute top-6 left-6 z-20 flex items-center gap-2 lg:hidden'>
        {loading ? (
          <Skeleton className='h-8 w-8 rounded-xl' />
        ) : (
          <img
            src={logo}
            alt={t('Logo')}
            className='h-8 w-8 rounded-xl object-cover'
          />
        )}
      </div>

      <div className='relative flex items-center justify-center px-4 py-16 sm:px-8 lg:py-0'>
        {/* soft violet glow on the form side, echoing the canvas */}
        <div
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_100%_0%,rgba(137,60,237,0.07),transparent_70%)]'
        />
        {/* language switcher — the sign-in page is the public homepage, so
            visitors must be able to pick their language before signing in */}
        <div className='absolute top-4 right-4 z-20 sm:top-6 sm:right-6'>
          <LanguageSwitcher />
        </div>
        {/* AGPLv3 attribution — the official upstream copyright notice. The
            retired marketing home was the only Footer host, so the sign-in
            page (now the public homepage) carries the attribution instead.
            Key is assembled obfuscated, mirroring footer.tsx, to survive
            naive brand-replacement sweeps. */}
        <div className='text-muted-foreground/55 absolute inset-x-0 bottom-3 z-10 px-4 text-center text-[11px] leading-relaxed sm:bottom-5'>
          &copy; {new Date().getFullYear()}{' '}
          <a
            href='https://github.com/QuantumNous/new-api'
            target='_blank'
            rel='noopener noreferrer'
            className='text-muted-foreground/80 hover:text-foreground transition-colors'
          >
            New API
          </a>
          . {t(['footer', 'new' + 'api', 'projectAttributionSuffix'].join('.'))}
        </div>
        <div className='relative mx-auto flex w-full max-w-[400px] flex-col justify-center space-y-2'>
          {children}
        </div>
      </div>
    </div>
  )
}
