import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AlertTriangle, ArrowRight, CheckCircle2, Info, Minus, Plus } from 'lucide-react'
import { LAUNCH_OFFER, PLANS, SECTORS } from '@/data/catalog'
import { money } from '@/lib/format'
import { cn } from '@/lib/utils'
import { ComparisonTable, CtaBand, MissionTabs } from '@/components/marketing'
import { Alert, Badge, Button, Card, KeyValue } from '@/components/ui'
import type { MissionCode, Sector } from '@/types'

export function MissionPage({ code, sector }: { code: MissionCode; sector: Sector }) {
  const plans = PLANS[sector]
  const plan = plans.find((p) => p.code === code) ?? plans[0]
  const content = SECTORS[sector]
  const others = plans.filter((p) => p.code !== code)

  return (
    <>
      <section className="border-b border-ink-100 bg-ink-50">
        <div className="container-page py-12">
          <div className="mb-6">
            <MissionTabs active={code} sector={sector} />
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink-400">{plan.step}</span>
                <Badge tone="brand">{plan.verb}</Badge>
                {plan.launchLabel ? <Badge tone="warning">{plan.launchLabel}</Badge> : null}
              </div>

              <h1 className="display-1 mt-4">{plan.name}</h1>
              <p className="lede mt-5 max-w-xl">{plan.tagline}</p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-700">{plan.intro}</p>

              <div className="mt-6 flex items-end gap-3">
                <span className="text-sm text-ink-400 line-through">{money(plan.priceNormal)} HT</span>
                <strong className="font-display text-3xl text-ink-950">{plan.priceLaunch == null ? 'OFFERT' : `${money(plan.priceLaunch)} HT`}</strong>
                <Badge tone="warning">Prix de lancement</Badge>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/diagnostic">
                  <Button size="lg">
                    Réserver un diagnostic
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/demande">
                  <Button size="lg" variant="outline">
                    Demander un devis
                  </Button>
                </Link>
              </div>
            </div>

            <Card className="overflow-hidden p-0">
              <div className="bg-ink-950 px-6 py-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-sand-300">Contenu de la formule</p>
                <p className="mt-3 font-display text-3xl">{plan.name}</p>
                <p className="mt-3 text-sm text-ink-200">{plan.tagline}</p>
              </div>
              <div className="px-6 py-4">
                <KeyValue label="Délai">{plan.delay}</KeyValue>
                <KeyValue label="Engagement">{plan.commitment}</KeyValue>

              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <p className="eyebrow">Idéal si</p>
            <p className="mt-4 text-lg leading-relaxed text-ink-800">{plan.idealFor}</p>

            <div className="mt-8 rounded-2xl border border-ink-100 bg-ink-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Vous repartez avec</p>
              <ul className="mt-4 space-y-2.5">
                {plan.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-2.5 text-sm text-ink-800">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-5">
            {plan.included.map((block) => (
              <Card key={block.title} className="p-6">
                <h2 className="text-base font-semibold text-ink-950">{block.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {block.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                {block.limit ? (
                  <p className="mt-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {block.limit}
                  </p>
                ) : null}
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-ink-100 bg-ink-50 py-16">
        <div className="container-page grid gap-8 lg:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Minus className="h-4 w-4 text-ink-400" />
              <h2 className="text-base font-semibold text-ink-950">Non inclus</h2>
            </div>
            <ul className="mt-4 space-y-2.5">
              {plan.notIncluded.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-ink-600">
                  <Minus className="mt-0.5 h-4 w-4 shrink-0 text-ink-300" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-ink-100 pt-4 text-xs text-ink-500">
              Toute production supplémentaire fait l’objet d’une prestation complémentaire.
            </p>
          </Card>

          <div className="space-y-4">
            {plan.awarenessNote ? (
              <Alert tone="warning" title="À savoir" icon={<Info className="h-4 w-4" />}>
                {plan.awarenessNote}
              </Alert>
            ) : null}

            <Alert tone="info" title="Ce que nous ne promettons pas">
              ALLNEEDS ne promet pas un résultat chiffré avant analyse : nous mesurons, ajustons et rendons compte.
            </Alert>

            <AccordionList
              items={[
                {
                  q: 'Que se passe-t-il si le périmètre change en cours de mission ?',
                  a: 'Toute production supplémentaire est chiffrée et validée par écrit avant d’être réalisée. Le périmètre initial reste celui du contrat.',
                },
                {
                  q: 'Qui produit les livrables ?',
                  a: 'ALLNEEDS pour la méthode, la structure et le pilotage. Les prestataires du réseau sont mobilisés pour les productions spécifiques, après votre accord.',
                },
                {
                  q: 'Les limites écrites sont-elles contractuelles ?',
                  a: 'Oui. Les limites affichées sur cette page figurent dans le contrat de mission.',
                },
              ]}
            />
          </div>
        </div>
      </section>

      {plan.code !== 'STARTER' ? <section className="container-page pb-4"><Card className="border-brand-200 bg-brand-50/40 p-6"><p className="eyebrow">Après votre mission</p><h2 className="mt-2 font-display text-2xl text-ink-950">Prolonger avec ALLNEEDS ACCÈS</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">CONNECT, PLUS et PRIORITÉ servent à trouver, vérifier et suivre les prestataires tout au long de l’année. Après une mission PRO ou PERFORMANCE, la fiche prévoit aussi un avantage sur la première année PLUS.</p><Link to="/acces" search={{ secteur: sector }} className="mt-4 inline-block"><Button size="sm">Voir ALLNEEDS ACCÈS</Button></Link></Card></section> : null}

      <section className="container-page py-16">
        <h2 className="display-2">Comparer avec les autres formules</h2>
        <div className="mt-8">
          <p className="text-sm text-ink-600">Le comparatif des formules sera disponible dans votre espace après publication de votre diagnostic.</p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {others.map((other) => (
            <Card key={other.code} className="flex flex-col p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-ink-950">{other.name}</p>
                <Badge tone="neutral">{other.verb}</Badge>
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-600">{other.tagline}</p>
              <div className="mt-5 flex items-center justify-between">
                <div></div>
                <Link to="/missions/$code" params={{ code: other.code.toLowerCase() }} search={{ secteur: sector }}>
                  <Button size="sm" variant="outline">
                    Voir {other.name}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <CtaBand
        title={`${plan.name} — Parlons de votre établissement`}
        description={`Offre de lancement jusqu’au ${LAUNCH_OFFER.deadline} ${LAUNCH_OFFER.condition}. Un premier échange de 20 minutes suffit à savoir si ${plan.name} correspond à votre situation.`}
      />
    </>
  )
}

export function AccordionList({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white">
      {items.map((item, i) => (
        <div key={item.q}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-ink-50/60"
          >
            <span className="text-sm font-semibold text-ink-900">{item.q}</span>
            {open === i ? <Minus className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" /> : <Plus className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />}
          </button>
          {open === i ? <p className="animate-fade-in px-5 pb-5 text-sm leading-relaxed text-ink-600">{item.a}</p> : null}
        </div>
      ))}
    </div>
  )
}

export function MissionIndex({ sector }: { sector: Sector }) {
  const plans = PLANS[sector]
  const content = SECTORS[sector]

  return (
    <>
      <section className="border-b border-ink-100 bg-ink-50">
        <div className="container-page py-16">
          <p className="eyebrow">{content.name}</p>
          <h1 className="display-1 mt-4 max-w-3xl">Trois formules, une seule logique : votre priorité d’abord.</h1>
          <p className="lede mt-5 max-w-2xl">
            STARTER pour savoir où agir. PRO pour avoir les outils. PERFORMANCE pour les mettre en œuvre et les
            ajuster. Chaque formule est indépendante, chaque limite est écrite.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/diagnostic">
              <Button size="lg">
                Diagnostic
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/tarifs">
              <Button size="lg" variant="outline">
                Voir tous les tarifs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.code} className={cn('flex flex-col p-6', plan.code === 'PRO' && 'border-brand-300 shadow-lift')}>
              <div className="flex items-center justify-between">
                <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-400">{plan.step}</p>
                <Badge tone="brand">{plan.verb}</Badge>
              </div>
              <h2 className="mt-3 font-display text-2xl tracking-tight text-ink-950">{plan.name}</h2>
              <div className="mt-3">



              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-600">{plan.tagline}</p>
              <ul className="mt-5 space-y-2">
                {plan.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-sm text-ink-700">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    {h}
                  </li>
                ))}
              </ul>
              <Link
                to="/missions/$code"
                params={{ code: plan.code.toLowerCase() }}
                search={{ secteur: sector }}
                className="mt-6"
              >
                <Button size="sm" fullWidth variant={plan.code === 'PRO' ? 'primary' : 'outline'}>
                  Fiche {plan.name}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-ink-100 bg-ink-50 py-16">
        <div className="container-page">
          <h2 className="display-2">Comparatif des formules</h2>
          <div className="mt-8">
            <p className="text-sm text-ink-600">Le comparatif des formules sera disponible dans votre espace après publication de votre diagnostic.</p>
          </div>
        </div>
      </section>

      <CtaBand
        title="Vous hésitez entre deux formules ?"
        description="Le diagnostic STARTER sert exactement à ça : il vous dit laquelle choisir, et pourquoi. Priorités définies après analyse."
      />
    </>
  )
}
