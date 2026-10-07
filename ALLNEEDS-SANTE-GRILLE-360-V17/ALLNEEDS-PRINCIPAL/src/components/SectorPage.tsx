import { Link } from '@tanstack/react-router'
import { useEffect } from 'react'
import { ArrowRight, CheckCircle2, ClipboardList, FileCheck2, Info, LockKeyhole, Timer } from 'lucide-react'
import { LAUNCH_OFFER, PLANS, SECTORS } from '@/data/catalog'
import { DIAGNOSTIC_GRIDS } from '@/data/grid'
import { money } from '@/lib/format'
import {
  ComparisonTable,
  CtaBand,
  FaqList,
  HighlightGrid,
  LeverGrid,
  MissionTabs,
  OneLiners,
  ReasonCards,
  StepBlocks,
} from '@/components/marketing'
import { Alert, Badge, Button, Card, SectionHeading } from '@/components/ui'
import type { Sector } from '@/types'
import { selectSector } from '@/lib/sector-filter'


function SectorDiagnosticDetail({ sector }: { sector: Sector }) {
  const grid = DIAGNOSTIC_GRIDS[sector]
  const sectorName = SECTORS[sector].name

  return (
    <section className="border-b border-ink-100 bg-white py-20">
      <div className="container-page">
        <SectionHeading
          eyebrow={`${sectorName} · diagnostic STARTER`}
          title="Un diagnostic guidé, sans surcharge"
          description={`En 1h30, le diagnostic ${sectorName} avance en quatre temps. Les questions sont propres à votre secteur et restent disponibles ci-dessous si vous souhaitez voir le détail.`}
        />

        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {grid.steps.map((step) => {
            const Icon = step.block.includes('Cadrage') ? Timer : step.block.includes('4 leviers') ? ClipboardList : step.block.includes('Synthèse') ? FileCheck2 : CheckCircle2
            return (
              <Card key={step.range} className="p-5">
                <Icon className="h-5 w-5 text-brand-700" />
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-700">{step.range}</p>
                <p className="mt-1 font-semibold text-ink-950">{step.block}</p>
                <p className="mt-2 text-xs leading-relaxed text-ink-500">{step.objective}</p>
              </Card>
            )
          })}
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          {grid.levers.map((lever, index) => (
            <details key={lever.id} className="sector-diagnostic-detail group rounded-2xl border border-ink-100 bg-white p-0">
              <summary className="flex cursor-pointer list-none items-center gap-3 p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-sm font-bold text-brand-700">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Levier {index + 1}</p>
                  <h3 className="mt-1 font-semibold text-ink-950">{lever.name}</h3>
                </div>
                <span className="text-xs font-semibold text-brand-700">Voir les {lever.questions.length} questions</span>
              </summary>
              <div className="border-t border-ink-100 px-5 pb-5 pt-4">
                <ol className="space-y-2.5">
                  {lever.questions.map((question, questionIndex) => (
                    <li key={question.id} className="flex items-start gap-2 text-sm leading-relaxed text-ink-600">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[0.65rem] font-bold text-emerald-700">{questionIndex + 1}</span>
                      {question.text}
                    </li>
                  ))}
                </ol>
                <div className="mt-5 rounded-xl bg-ink-50 p-3 text-xs text-ink-500">{lever.scoreNote} · Maximum : {lever.questions.length * 5} points.</div>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6">
            <h3 className="font-semibold text-ink-950">À préparer avant le rendez-vous</h3>
            <p className="mt-2 text-sm text-ink-500">Quelques éléments suffisent pour partir de faits concrets.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {grid.documents.map((item) => (
                <div key={item} className="flex gap-2 rounded-lg border border-ink-100 p-3 text-xs text-ink-600">
                  <FileCheck2 className="h-4 w-4 shrink-0 text-brand-700" />
                  {item}
                </div>
              ))}
            </div>
          </Card>
          <Card className="border-amber-200 bg-amber-50 p-6">
            <div className="flex items-center gap-2">
              <LockKeyhole className="h-5 w-5 text-amber-700" />
              <h3 className="font-semibold text-amber-950">Un cadre clair dès le départ</h3>
            </div>
            {sector === 'sante' ? <p className="mt-4 text-sm leading-relaxed text-amber-900">Notre analyse porte sur l’organisation, la gestion et la performance de votre structure — jamais sur la prise en charge médicale de vos patients.</p> : null}
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-amber-900">
              {grid.guardrails.map((item) => <li key={item}>• {item}</li>)}
            </ul>
          </Card>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-6">
            <h3 className="font-semibold text-ink-950">Charges récurrentes observées</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-500">{grid.chargeIntro}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {grid.chargeRows.map((row) => <div key={row.id} className="rounded-lg bg-ink-50 px-3 py-2 text-xs font-medium text-ink-700">{row.poste}</div>)}
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-semibold text-ink-950">Ce que vous obtenez à la fin</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {grid.synthRows.map((row) => (
                <div key={row.id} className="flex items-start gap-2 rounded-lg border border-ink-100 p-3 text-xs text-ink-600">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {row.label}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}

export function SectorPage({ sector }: { sector: Sector }) {
  useEffect(() => { selectSector(sector) }, [sector])
  const content = SECTORS[sector]
  const plans = PLANS[sector]

  return (
    <>
      <section className="border-b border-ink-100 bg-ink-50">
        <div className="container-page py-12">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="eyebrow">{content.name}</p>
              <h1 className="display-1 mt-4">{content.tagline}</h1>
              <p className="lede mt-5 max-w-xl">{content.promise}</p>
              <p className="mt-4 text-sm font-medium text-ink-500">Pour qui : {content.audience}</p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/diagnostic">
                  <Button size="lg">
                    Diagnostic STARTER
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

              </div>
            </div>

            <Card className="overflow-hidden p-0">
              <div className="divide-y divide-ink-100">
                {plans.map((plan) => (
                  <div key={plan.code} className="flex items-start gap-4 px-6 py-5">
                    <span className="mt-0.5 font-display text-2xl text-sand-400">{plan.step}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-ink-950">{plan.name}</p>
                        <Badge tone="brand">{plan.verb}</Badge>
                      </div>
                      <p className="mt-1 text-xs text-ink-500">{plan.delay}</p>
                    </div>
                    <div className="shrink-0 text-right">


                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="sector-private-preview">
          <div>
            <p className="eyebrow">Après connexion</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-ink-950">Votre espace {content.name}, sans les autres secteurs</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-600">Le tableau de bord reste centré sur vos besoins, vos missions, vos rendez-vous et les prochaines actions utiles à votre activité.</p>
            <div className="mt-5 flex flex-wrap gap-2 text-xs text-ink-600">
              <span className="rounded-full bg-ink-50 px-3 py-2">Statuts visibles</span>
              <span className="rounded-full bg-ink-50 px-3 py-2">Suivi sectoriel</span>
              <span className="rounded-full bg-ink-50 px-3 py-2">Actions prioritaires</span>
            </div>
          </div>
          <figure>
            <img src={`/previews/client-${sector}.png`} alt={`Aperçu de l’espace Client ${content.name}`} loading="lazy" />
            <figcaption>Aperçu de l’espace Client {content.name} · données de démonstration</figcaption>
          </figure>
        </div>
      </section>

      <SectorDiagnosticDetail sector={sector} />

      <section className="container-page py-20">
        <SectionHeading eyebrow="Comment ça marche" title="Comprendre · Structurer · Agir" />
        <div className="mt-14">
          <StepBlocks steps={content.steps} />
        </div>
        <div className="mt-12">
          <MissionTabs />
        </div>
      </section>

      <section className="border-y border-ink-100 bg-ink-50 py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Les leviers" title={`Les ${content.levers.length} leviers que nous travaillons`} />
          <div className="mt-14">
            <LeverGrid levers={content.levers} />
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <SectionHeading eyebrow="Pourquoi ALLNEEDS" title="Votre établissement d’abord" align="center" />
        <div className="mt-14">
          <ReasonCards reasons={content.reasons} />
        </div>
        <div className="mt-16">
          <HighlightGrid items={content.highlights} />
        </div>
      </section>

      <section className="container-page pb-20">
        <SectionHeading
          eyebrow="Formules"
          title="Trois formules, un périmètre écrit"
          description={`Offre de lancement jusqu’au ${LAUNCH_OFFER.deadline} ${LAUNCH_OFFER.condition}.`}
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.code} className="flex flex-col p-6">
              <div className="flex items-center justify-between">
                <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-400">{plan.step}</p>
                <Badge tone="brand">{plan.verb}</Badge>
              </div>
              <h3 className="mt-3 font-display text-2xl tracking-tight text-ink-950">{plan.name}</h3>
              <div className="mt-3"></div>
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
                  Voir la fiche {plan.name}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-ink-100 bg-ink-50 py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Comparatif" title="Formule par formule, ligne par ligne" />
          <div className="mt-12">
            <p className="text-sm text-ink-600">Le comparatif des formules sera disponible dans votre espace après publication de votre diagnostic.</p>
          </div>
        </div>
      </section>

      {content.awarenessNote ? (
        <section className="container-page py-16">
          <Alert tone="warning" title="À savoir" icon={<Info className="h-4 w-4" />}>
            {content.awarenessNote}
          </Alert>
        </section>
      ) : null}

      {content.extraNotes.length > 0 ? (
        <section className="container-page pb-16">
          <div className="grid gap-5 md:grid-cols-3">
            {content.extraNotes.map((note) => (
              <Card key={note.title} className="p-5">
                <p className="text-sm font-semibold text-ink-950">{note.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{note.detail}</p>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      <section className="container-page py-20">
        <SectionHeading eyebrow="La différence" title="Une phrase par formule" align="center" />
        <div className="mt-14">
          <OneLiners
            lines={content.oneLiner}
            links={{ STARTER: 'Voir STARTER', PRO: 'Voir PRO', PERFORMANCE: 'Voir PERFORMANCE' }}
          />
        </div>
      </section>

      <section className="container-page pb-20">
        <SectionHeading eyebrow="FAQ" title={`Questions fréquentes ${sector === 'enseignement' ? 'ENSEIGNEMENT' : sector === 'sante' ? 'SANTÉ' : 'TOURISME'}`} />
        <div className="mt-12">
          <FaqList items={content.faq} />
        </div>
      </section>

      <CtaBand
        title="Commencez par le diagnostic"
        description="1h30 pour identifier vos 3 priorités, sans engagement. Vous repartez avec un livrable écrit, même si vous ne travaillez pas avec nous ensuite."
      />
    </>
  )
}
