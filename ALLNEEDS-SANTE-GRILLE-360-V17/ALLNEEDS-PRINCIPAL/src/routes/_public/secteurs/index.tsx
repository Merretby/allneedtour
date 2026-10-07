import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { SECTORS, SECTOR_LABEL, SECTOR_ORDER } from '@/data/catalog'
import { CtaBand } from '@/components/marketing'
import { Card } from '@/components/ui'
import { selectSector, useSelectedSector } from '@/lib/sector-filter'

export const Route = createFileRoute('/_public/secteurs/')({
  component: SecteursPage,
  head: () => ({
    meta: [
      { title: 'Nos secteurs — ALLNEEDS' },
      { name: 'description', content: 'Enseignement, Santé, Tourisme : un même cadre, des leviers adaptés à votre établissement.' },
    ],
  }),
})

const EXTRA: Record<string, { volume: string; example: string }> = {
  enseignement: { volume: '300 demandes / an', example: 'école privée, 240 élèves' },
  sante: { volume: '22 % de no-shows', example: 'centre de soins, 6 praticiens' },
  tourisme: { volume: '71 % via plateformes', example: 'riad, 18 chambres' },
}

function SecteursPage() {
  const selectedSector = useSelectedSector()
  const navigate = useNavigate()
  useEffect(() => {
    if (selectedSector) navigate({ to: '/secteurs/$sector', params: { sector: selectedSector }, replace: true })
  }, [selectedSector, navigate])
  if (selectedSector) return <main className="container-page py-24 text-center text-sm text-ink-500">Ouverture de votre secteur…</main>
  return (
    <>
      <section className="border-b border-ink-100 bg-ink-50">
        <div className="container-page py-16">
          <p className="eyebrow">Nos secteurs</p>
          <h1 className="display-1 mt-4 max-w-3xl">Un même cadre, trois sectors d’activité.</h1>
          <p className="lede mt-5 max-w-2xl">
            La méthode ne change pas : comprendre, structurer, agir. Ce qui change, ce sont les leviers, les
            indicateurs et le calendrier de votre établissement.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {SECTOR_ORDER.map((sector) => {
            const content = SECTORS[sector]
            const extra = EXTRA[sector]
            return (
              <Card key={sector} className="flex flex-col p-7 transition hover:-translate-y-0.5 hover:shadow-lift">
                <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-brand-700">{content.name}</p>
                <h2 className="mt-3 font-display text-2xl leading-snug tracking-tight text-ink-950">
                  {content.tagline}
                </h2>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">{content.promise}</p>

                <dl className="mt-6 space-y-3 border-t border-ink-100 pt-5">
                  <div>
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-400">Pour qui</dt>
                    <dd className="mt-1 text-sm text-ink-700">{content.audience}</dd>
                  </div>
                  <div className="flex gap-6">
                    <div>
                      <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-400">Point de douleur</dt>
                      <dd className="mt-1 text-sm font-semibold text-ink-900">{extra.volume}</dd>
                    </div>
                    <div>
                      <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-400">Exemple</dt>
                      <dd className="mt-1 text-sm text-ink-700">{extra.example}</dd>
                    </div>
                  </div>
                  <div>
                    <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-400">Leviers</dt>
                    <dd className="mt-1 text-sm text-ink-700">{content.levers.map((l) => l.name).join(' · ')}</dd>
                  </div>
                </dl>

                <Link to="/secteurs/$sector" params={{ sector }} className="mt-7" onClick={() => selectSector(sector)}>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                    Voir le détail {SECTOR_LABEL[sector]}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </Card>
            )
          })}
        </div>
      </section>

      <CtaBand
        title="Vous hésitez entre deux secteurs ?"
        description="Décrivez-nous votre établissement : nous vous disons en 24 h si ALLNEEDS est pertinent, et sinon qui appeler."
        secondary={{ label: 'Nous contacter', to: '/contact' }}
      />
    </>
  )
}
