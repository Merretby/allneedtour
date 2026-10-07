import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { LaunchBanner } from '@/components/marketing'

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <>
      <LaunchBanner />
      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col justify-center px-4 py-14 sm:px-8 lg:px-14">
          <div className="mx-auto w-full max-w-md">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-ink-950 font-display text-lg text-sand-300">
                A
              </span>
              <span className="text-[0.95rem] font-extrabold tracking-tight text-ink-950">ALLNEEDS</span>
            </Link>

            <h1 className="display-2 mt-10">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{subtitle}</p>

            <div className="mt-8">{children}</div>

            {footer ? <div className="mt-8 text-center text-sm text-ink-500">{footer}</div> : null}

            <Link
              to="/"
              className="mt-10 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-400 transition hover:text-ink-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour au site
            </Link>
          </div>
        </div>

        <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
          <div className="grid-fade pointer-events-none absolute inset-0 opacity-20" />
          <div className="relative flex h-full flex-col justify-center px-14 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand-300">Espace ALLNEEDS</p>
            <p className="mt-6 font-display text-4xl leading-tight tracking-tight">
              Vos besoins, vos prestataires, vos devis, vos livrables — au même endroit.
            </p>
            <ul className="mt-10 space-y-5">
              {[
                'Besoins suivis de bout en bout, avec un interlocuteur unique',
                'Prestataires vérifiés, comparatif de devis, suivi jusqu’à la signature',
                'Diagnostics publiés, missions, livrables, rendez-vous et documents',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink-200">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sand-300" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm italic text-ink-200">
                « Nous avions 300 demandes sur papier. En six semaines, nous avions un parcours d’inscription écrit, une
                page en ligne et une équipe qui sait exactement quoi faire. »
              </p>
              <p className="mt-3 text-xs text-ink-400">Amina Bennani — École Al Amal, Casablanca</p>
            </div>

            <p className="mt-10 text-xs text-ink-500">
              Données de démonstration. Aucun accès réel à un compte client.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
