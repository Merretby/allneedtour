import { Link, createFileRoute } from '@tanstack/react-router'
import { type ReactNode } from 'react'
import {
  ArrowRight,
  Building2,
  CalendarClock,
  ClipboardList,
  Gauge,
  Inbox,
  Receipt,
  TriangleAlert,
  Users,
} from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import { Badge, Button, Card, CardHeader, CardBody, Progress, Stat } from '@/components/ui'
import { LEAD_STAGE, MISSION_STATUS, NEED_STATUS } from '@/lib/status'
import { ACCESS_OFFERS } from '@/data/catalog'
import { dateTime, daysUntil, longDate, money, relative } from '@/lib/format'
import { byId, percentage } from '@/lib/utils'
import { DEMO_NOW } from '@/data/demo'

export const Route = createFileRoute('/admin/')({
  component: AdminOverview,
  head: () => ({ meta: [{ title: 'Administration — ALLNEEDS' }] }),
})

export function AdminOverview() {
  const { state, dispatch } = useDemo()
  const now = new Date(DEMO_NOW).getTime()

  const activeNeeds = state.needs.filter((n) => !['signe', 'clos'].includes(n.status))
  const needsWithoutProvider = activeNeeds.filter((n) => n.candidateIds.length === 0)
  const needsWithQuotes = state.quotes.filter((q) => q.status === 'en_etude' || q.status === 'recu')
  const openMissions = state.missions.filter((m) => m.status !== 'terminee')
  const toReview = state.diagnostics.filter((d) => d.status === 'en_revue')
  const openLeads = state.leads.filter((l) => l.stage !== 'perdu' && l.stage !== 'gagne')
  const dueRelances = state.leads.filter((l) => daysUntil(l.nextActionAt, now) <= 3 && l.stage !== 'perdu')

  const pipelineValue = openLeads.reduce((acc, l) => acc + (l.budget ?? 0), 0)
  const wonValue = state.leads.filter((l) => l.stage === 'gagne').reduce((acc, l) => acc + (l.budget ?? 0), 0)
  const missionValue = openMissions.reduce((acc, m) => acc + m.price, 0)

  return (
    <>
      <PageHeader
        eyebrow="Administration · Écosystème"
        title="Control Tower"
        description={`Situation au ${longDate(state.now)} · ${state.orgs.length} établissements suivis · données de démonstration partagées avec l’espace client`}
        actions={
          <>
            <Link to="/admin/pipeline">
              <Button size="sm" variant="outline">
                Ouvrir le pipeline
              </Button>
            </Link>
            <Link to="/admin/besoins">
              <Button size="sm">Traiter les besoins</Button>
            </Link>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Besoins actifs"
          value={activeNeeds.length}
          hint={`${needsWithoutProvider.length} sans prestataire proposé`}
          tone={needsWithoutProvider.length > 0 ? 'warning' : 'brand'}
          icon={<Inbox className="h-4 w-4" />}
        />
        <Stat
          label="Missions en cours"
          value={openMissions.length}
          hint={`${money(missionValue)} HT de chiffre d’affaires contractualisé`}
          tone="brand"
          icon={<ClipboardList className="h-4 w-4" />}
        />
        <Stat
          label="Pipeline"
          value={money(pipelineValue)}
          hint={`${openLeads.length} opportunités · ${money(wonValue)} gagné`}
          tone="info"
          icon={<Users className="h-4 w-4" />}
        />
        <Stat
          label="À publier"
          value={toReview.length}
          hint={toReview.length > 0 ? 'Diagnostics en relecture interne' : 'Aucun diagnostic en attente'}
          tone={toReview.length > 0 ? 'warning' : 'success'}
          icon={<Gauge className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Besoins à traiter"
                description="Du plus urgent au moins urgent. Le contrat conclu directement est signalé."
              action={
                <Link to="/admin/besoins" className="text-xs font-semibold text-brand-700">
                  Tout voir
                </Link>
              }
            />
            <div className="divide-y divide-ink-50">
              {activeNeeds.slice(0, 6).map((need) => {
                const org = byId(state.orgs, need.orgId)
                const status = NEED_STATUS[need.status]
                const quotes = need.quoteIds.map((q) => byId(state.quotes, q)).filter(Boolean)
                return (
                  <div key={need.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-ink-950">{need.title}</p>
                        <Badge tone={status.tone}>{status.label}</Badge>
                        {need.urgency === 'haute' ? <Badge tone="danger">Urgent</Badge> : null}
                      </div>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {org?.name} · {need.categoryLabel} · reçu {relative(need.submittedAt, now)}
                        {need.deadline ? ` · échéance ${longDate(need.deadline)}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-right">
                      <div>
                        <p className="text-xs text-ink-500">Prestataires</p>
                        <p className="text-sm font-semibold text-ink-900">{need.candidateIds.length}</p>
                      </div>
                      <div>
                        <p className="text-xs text-ink-500">Devis</p>
                        <p className="text-sm font-semibold text-ink-900">{quotes.length}</p>
                      </div>
                      <Link to="/admin/besoins" className="text-ink-400 hover:text-ink-900">
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Missions"
              description="Jalons en cours et échéances courtes."
              action={
                <Link to="/admin/missions" className="text-xs font-semibold text-brand-700">
                  Tout voir
                </Link>
              }
            />
            <CardBody className="space-y-4">
              {openMissions.map((mission) => {
                const org = byId(state.orgs, mission.orgId)
                const next = mission.milestones.find((ms) => ms.status !== 'fait')
                const left = next ? daysUntil(next.dueAt, now) : null
                return (
                  <div key={mission.id} className="rounded-xl border border-ink-100 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-ink-950">
                          {mission.code} · {org?.name}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-500">
                          {mission.title} · {mission.owner} · {money(mission.price)} HT
                        </p>
                      </div>
                      <Badge tone={MISSION_STATUS[mission.status].tone}>
                        {MISSION_STATUS[mission.status].label}
                      </Badge>
                    </div>
                    <Progress className="mt-3" value={mission.onboardingProgress} label="Avancement" />
                    {next ? (
                      <p
                        className={`mt-2 text-xs ${
                          left !== null && left <= 7 ? 'font-semibold text-amber-700' : 'text-ink-500'
                        }`}
                      >
                        Prochain jalon : {next.title} — {longDate(next.dueAt)}
                        {left !== null ? ` (J${left >= 0 ? `+${left}` : left})` : ''}
                      </p>
                    ) : null}
                  </div>
                )
              })}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Alertes opérationnelles" />
            <div className="divide-y divide-ink-50">
              <AlertRow
                icon={<TriangleAlert className="h-4 w-4" />}
                tone={needsWithoutProvider.length > 0 ? 'warning' : 'success'}
                label="Besoins sans prestataire"
                value={`${needsWithoutProvider.length}`}
                detail="Un besoin non pourvu reste invisible pour le client : relancez la recherche ou le contact."
              />
              <AlertRow
                icon={<Receipt className="h-4 w-4" />}
                tone={needsWithQuotes.length > 0 ? 'warning' : 'success'}
                label="Devis en attente de décision"
                value={`${needsWithQuotes.length}`}
                detail="Un devis non tranché bloque la commission et la signature."
              />
              <AlertRow
                icon={<CalendarClock className="h-4 w-4" />}
                tone={dueRelances.length > 0 ? 'warning' : 'success'}
                label="Relances sous 3 jours"
                value={`${dueRelances.length}`}
                detail="Actions pipeline planifiées qui arrivent à échéance."
              />
              <AlertRow
                icon={<Building2 className="h-4 w-4" />}
                tone={state.orgs.filter((o) => !o.onboardedAt).length > 0 ? 'info' : 'success'}
                label="Établissements non onboardés"
                value={`${state.orgs.filter((o) => !o.onboardedAt).length}`}
                detail="Sans onboarding, l’espace client reste incomplet."
              />
            </div>
          </Card>

          <Card>
            <CardHeader title="Prochains rendez-vous" description="Toute l’équipe." />
            <div className="divide-y divide-ink-50">
              {state.meetings
                .filter((m) => m.status === 'confirme' || m.status === 'propose')
                .sort((a, b) => a.at.localeCompare(b.at))
                .map((m) => {
                  const org = byId(state.orgs, m.orgId)
                  return (
                    <div key={m.id} className="px-5 py-3">
                      <p className="text-sm font-semibold text-ink-900">{m.title}</p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {org?.name} · {dateTime(m.at)} · {m.location}
                      </p>
                    </div>
                  )
                })}
            </div>
          </Card>

          <Card>
            <CardHeader title="Formules d’abonnement" description="Catalogue de démonstration." />
            <CardBody className="space-y-3">
              {ACCESS_OFFERS.map((offer) => {
                const count = state.orgs.filter((o) => o.tags.some((t) => t.includes(offer.name))).length
                return (
                  <div key={offer.tier}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-ink-800">{offer.name}</span>

                    </div>
                    <Progress
                      className="mt-1.5"
                      value={percentage(count, state.orgs.length)}
                      tone={offer.featured ? 'brand' : 'ink'}
                    />
                  </div>
                )
              })}
              <Link to="/admin/quotas" className="mt-2 block text-xs font-semibold text-brand-700">
                Gérer les quotas et dépassements
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  )
}

function AlertRow({
  icon,
  tone,
  label,
  value,
  detail,
}: {
  icon: ReactNode
  tone: 'warning' | 'success' | 'info'
  value: string
  label: string
  detail: string
}) {
  const colors = {
    warning: 'bg-amber-50 text-amber-800',
    success: 'bg-emerald-50 text-emerald-700',
    info: 'bg-sky-50 text-sky-700',
  }
  return (
    <div className="flex items-start gap-3 px-5 py-3.5">
      <span className={`rounded-lg p-2 ${colors[tone]}`}>{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-ink-900">{label}</p>
          <span className="font-display text-lg leading-none text-ink-950">{value}</span>
        </div>
        <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{detail}</p>
      </div>
    </div>
  )
}
