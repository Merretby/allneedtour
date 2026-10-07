import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Building2, Search } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import { Badge, Card, Input, Progress, Select, Stat, Tabs } from '@/components/ui'
import { SECTOR_LABEL } from '@/data/catalog'
import { longDate, relative } from '@/lib/format'
import { percentage } from '@/lib/utils'
import { DEMO_NOW } from '@/data/demo'

export const Route = createFileRoute('/admin/clients/')({
  component: AdminClients,
  head: () => ({ meta: [{ title: 'Clients — ALLNEEDS' }] }),
})

export function AdminClients() {
  const { state } = useDemo()
  const now = new Date(DEMO_NOW).getTime()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('tous')

  const orgs = state.orgs
    .filter((o) => (filter === 'tous' ? true : o.sector === filter))
    .filter((o) =>
      query.trim()
        ? `${o.name} ${o.city} ${o.contactName} ${o.kind}`.toLowerCase().includes(query.toLowerCase())
        : true,
    )
    .map((org) => {
      const needs = state.needs.filter((n) => n.orgId === org.id)
      const missions = state.missions.filter((m) => m.orgId === org.id)
      const missionValue = missions.reduce((acc, m) => acc + m.price, 0)
      const lastActivity = [...needs.map((n) => n.submittedAt), ...missions.map((m) => m.startedAt)].sort().reverse()[0]
      return { org, needs, missions, missionValue, lastActivity }
    })
    .sort((a, b) => (b.lastActivity ?? '').localeCompare(a.lastActivity ?? ''))

  const onboarded = state.orgs.filter((o) => o.onboardedAt).length
  const totalNeeds = state.needs.length
  const totalMissions = state.missions.length
  const totalValue = state.missions.reduce((acc, m) => acc + m.price, 0)

  return (
    <>
      <PageHeader
        eyebrow="Portefeuille"
        title="Clients"
        description="Établissements abonnés, volume d’affaires contractualisé et niveau d’avancement de chaque compte."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Établissements" value={state.orgs.length} hint={`${onboarded} onboardés`} tone="brand" />
        <Stat label="Besoins cumulés" value={totalNeeds} hint="Toutes formules confondues" tone="info" />
        <Stat label="Missions" value={totalMissions} hint="STARTER, PRO, PERFORMANCE" tone="violet" />
        <Stat label="CA missions" value={`${totalValue.toLocaleString('fr-FR')} DH`} hint="HT, hors prestataires" tone="success" />
      </div>

      <Card className="mb-5 p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un établissement, une ville, un contact…"
              className="pl-10"
            />
          </div>
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="sm:w-56">
            <option value="tous">Tous les secteurs</option>
            <option value="enseignement">Enseignement</option>
            <option value="sante">Santé</option>
            <option value="tourisme">Tourisme</option>
          </Select>
        </div>
      </Card>

      <div className="mb-5">
        <Tabs
          value={filter}
          onChange={setFilter}
          tabs={[
            { value: 'tous', label: 'Tous', count: state.orgs.length },
            { value: 'enseignement', label: 'Enseignement', count: state.orgs.filter((o) => o.sector === 'enseignement').length },
            { value: 'sante', label: 'Santé', count: state.orgs.filter((o) => o.sector === 'sante').length },
            { value: 'tourisme', label: 'Tourisme', count: state.orgs.filter((o) => o.sector === 'tourisme').length },
          ]}
        />
      </div>

      <div className="space-y-4">
        {orgs.map(({ org, needs, missions, missionValue, lastActivity }) => {
          const activeNeeds = needs.filter((n) => !['signe', 'clos'].includes(n.status))
          const diagnostics = state.diagnostics.filter((d) => d.orgId === org.id && d.status === 'publie')
          return (
            <Card key={org.id}>
              <div className="flex flex-wrap items-start justify-between gap-4 p-5">
                <div className="flex min-w-0 items-start gap-4">
                  <span className="rounded-xl bg-ink-950 p-2.5 text-sand-300">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to="/admin/clients/$id"
                        params={{ id: org.id }}
                        className="text-base font-semibold text-ink-950 hover:text-brand-700"
                      >
                        {org.name}
                      </Link>
                      {org.onboardedAt ? (
                        <Badge tone="success">Onboardé</Badge>
                      ) : (
                        <Badge tone="warning">Onboarding à faire</Badge>
                      )}
                      <Badge tone="neutral">{SECTOR_LABEL[org.sector]}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-500">
                      {org.kind} · {org.city} · {org.size}
                    </p>
                    <p className="mt-1 text-xs text-ink-500">
                      {org.contactName} ({org.contactRole}) · client depuis le {longDate(org.createdAt)}
                      {lastActivity ? ` · dernière activité ${relative(lastActivity, now)}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-ink-500">Besoins</p>
                    <p className="font-display text-xl text-ink-950">{needs.length}</p>
                    <p className="text-[0.65rem] text-ink-400">{activeNeeds.length} actifs</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ink-500">Missions</p>
                    <p className="font-display text-xl text-ink-950">{missions.length}</p>
                    <p className="text-[0.65rem] text-ink-400">{diagnostics.length} diagnostic(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-ink-500">CA missions</p>
                    <p className="font-display text-xl text-ink-950">{missionValue.toLocaleString('fr-FR')}</p>
                    <p className="text-[0.65rem] text-ink-400">DH HT</p>
                  </div>
                  <Link
                    to="/admin/clients/$id"
                    params={{ id: org.id }}
                    className="rounded-lg p-2 text-ink-400 hover:bg-ink-50 hover:text-ink-900"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="border-t border-ink-100 px-5 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  {org.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                  <Progress
                    className="ml-auto w-40"
                    value={percentage(missions.filter((m) => m.status === 'terminee').length, missions.length)}
                    tone="emerald"
                    label="Missions terminées"
                  />
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </>
  )
}
