import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import {
  ACCESS_CATEGORIES,
  ACCESS_COMPARISON,
  ACCESS_OFFERS,
  ACCESS_VERIFICATION,
  LAUNCH_OFFER,
  PLANS,
  SECTOR_LABEL,
  SECTOR_ORDER,
} from '@/data/catalog'
import { money } from '@/lib/format'
import { cn } from '@/lib/utils'
import { ComparisonTable, CtaBand } from '@/components/marketing'
import { AccordionList } from '@/components/MissionPage'
import { Alert, Badge, Button, Card, SectionHeading } from '@/components/ui'
import type { Sector } from '@/types'
import { useSelectedSector } from '@/lib/sector-filter'

const SECTORS: Sector[] = ['enseignement', 'sante', 'tourisme']

export const Route = createFileRoute('/_public/acces')({
  validateSearch: (search: Record<string, unknown>): { secteur?: Sector } => {
    const value = String(search.secteur ?? 'enseignement')
    return { secteur: (SECTORS.includes(value as Sector) ? value : 'enseignement') as Sector }
  },
  component: AccesPage,
  head: () => ({
    meta: [
      { title: 'ALLNEEDS ACCÈS — Réseau de prestataires vérifiés' },
      {
        name: 'description',
        content:
          'Un abonnement annuel qui trouve, vérifie et suit les prestataires dont votre établissement a besoin. Pool de besoins reportable sur 12 mois.',
      },
    ],
  }),
})

function AccesPage() {
  const { secteur: rawSector } = Route.useSearch()
  const selectedSector = useSelectedSector()
  const sector = selectedSector ?? rawSector ?? 'enseignement'

  return (
    <>
      <section className="border-b border-ink-100 bg-ink-950 text-white">
        <div className="container-page py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand-300">ALLNEEDS ACCÈS</p>
              <h1 className="mt-4 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                L’abonnement qui trouve, vérifie et suit les prestataires dont votre établissement a besoin.
              </h1>
              <p className="mt-5 max-w-xl leading-relaxed text-ink-200">
                Vous exprimez un besoin. Nous le comprenons, sélectionnons et vérifions les prestataires adaptés, vous
                les présentons et suivons la mise en relation. Vous disposez d’un pool de besoins pour l’année : vous
                l’utilisez au rythme de votre activité, sans perdre ce que vous n’avez pas encore consommé.
              </p>
              <p className="mt-4 text-sm font-semibold text-sand-300">
                Pool de besoins annuel, reportable sur les
                12 mois
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/inscription">
                  <Button size="lg" className="bg-sand-400 text-ink-950 hover:bg-sand-300">
                    Choisir un niveau
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

              </div>
            </div>

            <Card className="border-white/10 bg-white/[0.04] p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-wider text-sand-300">Votre accompagnement</p>
              <p className="mt-4 text-sm leading-relaxed text-ink-200">Recherche, vérification, comparaison et suivi des prestataires. Chaque formule précise le nombre de besoins, les délais de réponse et les livrables inclus.</p>
            </Card>
          </div>
        </div>
      </section>

      <div className="border-b border-ink-100 bg-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-4 py-5">
          <p className="text-sm font-medium text-ink-500">Exemples de besoins et missions par secteur</p>
        </div>
      </div>

      <section className="container-page py-20">
        <SectionHeading
          eyebrow="Choisissez votre niveau"
          title="Trois niveaux, un même réseau"
          description="Le niveau se choisit selon votre volume de besoins et votre besoin de réactivité."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {ACCESS_OFFERS.map((offer) => (
            <Card
              key={offer.tier}
              className={cn(
                'relative flex flex-col p-6',
                offer.featured && 'border-brand-300 shadow-lift lg:-mt-4 lg:mb-4',
              )}
            >
              {offer.featured ? (
                <span className="absolute -top-3 left-6 rounded-full bg-brand-700 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-white">
                  Le plus choisi
                </span>
              ) : null}

              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-ink-950">{offer.name}</p>
                <Badge tone={offer.featured ? 'brand' : 'neutral'}>{offer.audience}</Badge>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-ink-600">{offer.tagline}</p>

              <div className="mt-6 border-t border-ink-100 pt-6">


              </div>

              <ul className="mt-6 flex-1 space-y-3">
                <li className="flex items-start gap-2.5 text-sm text-ink-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    <strong>{offer.needsPerYear} besoins</strong> par an (pool reportable sur 12 mois)
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-ink-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    <strong>{offer.providersPerNeed} prestataires</strong> vérifiés par besoin
                  </span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-ink-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>Vérification {offer.verification === 'approfondie' ? 'approfondie' : 'de base'}</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-ink-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>Première proposition sous {offer.firstProposal}</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-ink-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>{offer.quoteComparison}</span>
                </li>
                <li className="flex items-start gap-2.5 text-sm text-ink-800">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <span>Réponse sous {offer.responseTime} · {offer.contact}</span>
                </li>
                {offer.missionDiscount > 0 ? (
                  <li className="flex items-start gap-2.5 text-sm text-ink-800">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>
                      Accompagnement complémentaire sur les missions PRO et PERFORMANCE
                    </span>
                  </li>
                ) : null}
                {offer.starterDiagnostic !== '—' ? (
                  <li className="flex items-start gap-2.5 text-sm text-ink-800">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{offer.starterDiagnostic} diagnostic STARTER inclus</span>
                  </li>
                ) : null}
              </ul>

              <Link to="/inscription" search={{ offre: offer.tier }} className="mt-7">
                <Button size="md" fullWidth variant={offer.featured ? 'primary' : 'outline'}>
                  Choisir {offer.name}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-ink-500">
          Annuel ou mensuel · TVA 20 % en sus · Abonnement d’un an, non-reconduction possible avec un préavis de 30 jours
          avant l’échéance.
        </p>
      </section>

      <section className="border-y border-ink-100 bg-ink-50 py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Qu’est-ce qu’un besoin ?" title="Une catégorie de prestation, pas un ticket dAssistance." />
          <p className="mx-auto mt-4 max-w-2xl text-center leading-relaxed text-ink-600">
            Un besoin correspond à une catégorie de prestation. Une demande complexe qui couvre plusieurs prestations
            compte pour 2 besoins. Les besoins non utilisés restent valables pendant toute la durée de l’abonnement.
          </p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ACCESS_CATEGORIES[sector].map((category) => (
              <Card key={category.title} className="p-5">
                <p className="text-sm font-semibold text-ink-950">{category.title}</p>
                <ul className="mt-3 space-y-2">
                  {category.items.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-ink-600">
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-ink-400">Exemples non exhaustifs.</p>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionHeading eyebrow="Comparatif des niveaux" title="Ligne par ligne" />
        <div className="mt-12 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead>
                <tr className="bg-ink-50">
                  <th className="w-[34%] border-b border-ink-100 px-5 py-4 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-ink-500">
                    Comparatif des niveaux
                  </th>
                  {ACCESS_OFFERS.map((offer) => (
                    <th key={offer.tier} className="border-b border-ink-100 px-5 py-4 text-center text-xs font-bold text-ink-900">
                      {offer.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ACCESS_COMPARISON.filter((row) => !row.key.startsWith('price') && row.key !== 'missionDiscount').map((row) => (
                  <tr key={row.label} className="transition hover:bg-ink-50/60">
                    <td className="border-b border-ink-50 px-5 py-3 text-ink-700">{row.label}</td>
                    {ACCESS_OFFERS.map((offer) => {
                      const value = offer[row.key]
                      return (
                        <td
                          key={offer.tier}
                          className={cn(
                            'border-b border-ink-50 px-5 py-3 text-center',
                            offer.featured && 'bg-brand-50/40',
                          )}
                        >
                          {typeof value === 'boolean' ? (
                            value ? (
                              <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-600" />
                            ) : (
                              <span className="text-ink-300">—</span>
                            )
                          ) : typeof value === 'number' && row.key.startsWith('price') ? (
                            money(value)
                          ) : (
                            <span className="text-ink-800">{String(value)}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Alert tone="info" title="Vérification de base" icon={<ShieldCheck className="h-4 w-4" />}>
            {ACCESS_VERIFICATION[sector].base}
          </Alert>
          <Alert tone="info" title="Vérification approfondie" icon={<ShieldCheck className="h-4 w-4" />}>
            {ACCESS_VERIFICATION[sector].approfondie}
          </Alert>
        </div>
      </section>

      <section className="border-y border-ink-100 bg-ink-50 py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Un parcours complet</p>
            <h2 className="display-2 mt-3">Accès et missions ne s’opposent pas : ils se complètent.</h2>

            <div className="mt-8 space-y-4">
              <Card className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">ALLNEEDS ACCÈS</p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  Vous savez ce dont vous avez besoin : nous trouvons, vérifions et suivons les bons prestataires, tout
                  au long de l’année.
                </p>
              </Card>
              <Card className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
                  Missions STARTER, PRO, PERFORMANCE
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  Vous devez d’abord clarifier vos priorités, structurer votre établissement ou être accompagné pendant
                  30 jours.
                </p>
              </Card>
            </div>
          </div>

          <div>
            <p className="eyebrow">Avantages membres</p>
            <h2 className="display-2 mt-3">Ce que l’abonnement change pour vous.</h2>
            <ul className="mt-8 space-y-3">
              {[
                `Avantage abonné (PLUS ou PRIORITÉ) sur les missions PRO et PERFORMANCE au prix normal. Non cumulable avec l’offre de lancement.`,
                'Après une mission PRO ou PERFORMANCE, la première année d’abonnement PLUS bénéficie d’un accompagnement complémentaire.',
                'Le niveau PRIORITÉ inclut 1 diagnostic STARTER par an.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 rounded-xl border border-ink-100 bg-white p-4 text-sm text-ink-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <AccordionList
                items={[
                  {
                    q: 'Le contrat est-il conclu avec ALLNEEDS ?',
                    a: 'Non pour la prestation elle-même : le contrat est conclu directement entre vous et le prestataire, qui reste responsable de sa prestation. Le prix du prestataire n’est pas inclus dans l’abonnement.',
                  },
                  {
                    q: 'ALLNEEDS prend-il une commission ?',
                    a: 'Nous vous informons de toute commission éventuellement perçue auprès d’un prestataire.',
                  },
                  {
                    q: 'Puis-je arrêter l’abonnement ?',
                    a: 'Oui. Abonnement d’un an, non-reconduction possible avec un préavis de 30 jours avant l’échéance.',
                  },
                  {
                    q: 'ALLNEEDS négocie-t-il pour moi ?',
                    a: 'Non. ALLNEEDS ne fournit pas de conseil juridique, fiscal ou comptable, et ne négocie pas pour le compte du membre. Nous comparons et vous aidons à décider.',
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionHeading eyebrow="Missions" title="Les missions restent accessibles aux membres ACCÈS." />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {PLANS[sector].map((plan) => (
            <Card key={plan.code} className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-ink-950">{plan.name}</p>
                <Badge tone="brand">{plan.verb}</Badge>
              </div>



              <Link
                to="/missions/$code"
                params={{ code: plan.code.toLowerCase() }}
                search={{ secteur: sector }}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700"
              >
                Voir la fiche
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <CtaBand
        title="Souscrivez ACCÈS, ou commencez par le diagnostic"
        description="Le diagnostic STARTER identifie vos priorités. L’abonnement est sans reconduction tacite, et vous ne payez jamais un prestataire par notre intermédiaire."
        secondary={{ label: 'Réserver le diagnostic', to: '/diagnostic' }}
      />
    </>
  )
}
