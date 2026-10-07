import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { CalendarDays, Check, CircleAlert, X } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  Progress,
  Select,
  Stat,
  Tabs,
} from '@/components/ui'
import { DELIVERABLE_STATUS, MISSION_STATUS } from '@/lib/status'
import { dateTime, daysUntil, longDate, money, relative } from '@/lib/format'
import { byId, percentage } from '@/lib/utils'
import { DEMO_NOW } from '@/data/demo'
import type { DeliverableStatus, MilestoneStatus, MissionStatus } from '@/types'

export const Route = createFileRoute('/admin/missions/')({
  component: AdminMissions,
  head: () => ({ meta: [{ title: 'Missions — ALLNEEDS' }] }),
})

export function AdminMissions() {
  const { state, dispatch } = useDemo()
  const [filter, setFilter] = useState('ouvertes')
  const now = new Date(DEMO_NOW).getTime()

  const missions = state.missions
    .filter((m) =>
      filter === 'toutes' ? true : filter === 'ouvertes' ? m.status !== 'terminee' : m.status === 'terminee',
    )
    .sort((a, b) => a.targetEnd.localeCompare(b.targetEnd))

  const open = state.missions.filter((m) => m.status !== 'terminee')
  const late = open.filter((m) => m.milestones.some((ms) => ms.status !== 'fait' && daysUntil(ms.dueAt, now) < 0))
  const deliverables = state.deliverables
  const inReview = deliverables.filter((d) => d.status === 'en_relecture')
  const reworks = deliverables.filter((d) => d.status === 'retouche')

  return (
    <>
      <PageHeader
        eyebrow="Production"
        title="Missions"
        description="Le périmètre est contractuel : ce qui n’est pas écrit n’est pas produit. Les jalons ont des dates."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Missions ouvertes" value={open.length} hint="toutes formules" tone="brand" />
        <Stat
          label="CA contractualisé"
          value={money(open.reduce((acc, m) => acc + m.price, 0))}
          hint="HT, hors prestataires"
          tone="success"
        />
        <Stat
          label="Livrables à valider"
          value={inReview.length}
          hint="en relecture côté client"
          tone={inReview.length > 0 ? 'warning' : 'success'}
        />
        <Stat label="Retouches demandées" value={reworks.length} hint="sur 2 tours inclus" tone={reworks.length > 2 ? 'danger' : 'info'} />
      </div>

      {late.length > 0 ? (
        <Alert tone="warning" className="mb-5" title="Jalons en retard" icon={<CircleAlert className="h-4 w-4" />}>
          {late.map((m) => m.ref).join(', ')} — signalez le retard au client plutôt que de le repousser en silence.
        </Alert>
      ) : null}

      <div className="mb-5">
        <Tabs
          value={filter}
          onChange={setFilter}
          tabs={[
            { value: 'ouvertes', label: 'En cours', count: open.length },
            { value: 'terminee', label: 'Terminées', count: state.missions.filter((m) => m.status === 'terminee').length },
            { value: 'toutes', label: 'Toutes', count: state.missions.length },
          ]}
        />
      </div>

      <div className="space-y-5">
        {missions.map((mission) => {
          const org = byId(state.orgs, mission.orgId)
          const items = state.deliverables.filter((d) => d.missionId === mission.id)
          const validated = items.filter((d) => d.status === 'valide').length
          const meetings = state.meetings.filter((m) => m.missionId === mission.id)
          return (
            <Card key={mission.id}>
              <CardHeader
                title={`${mission.ref} · ${mission.title}`}
                description={`${org?.name} · ${mission.levers.length} leviers · ${mission.owner} · cible ${longDate(mission.targetEnd)}`}
                action={
                  <div className="flex items-center gap-2">
                    <Badge tone={MISSION_STATUS[mission.status].tone}>{MISSION_STATUS[mission.status].label}</Badge>
                    <Select
                      value={mission.status}
                      onChange={(e) =>
                        dispatch({ type: 'MISSION_SET_STATUS', id: mission.id, status: e.target.value as MissionStatus })
                      }
                      className="h-8 w-40 text-xs"
                    >
                      {Object.entries(MISSION_STATUS).map(([value, meta]) => (
                        <option key={value} value={value}>
                          {meta.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                }
              />
              <CardBody>
                <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                  <div>
                    <Progress value={mission.onboardingProgress} label="Avancement" />
                    <p className="mt-2 text-xs text-ink-500">
                      {percentage(validated, items.length)} % des livrables validés ·{' '}
                      {meetings.filter((m) => m.status === 'realise').length}/{meetings.length} rendez-vous réalisés
                    </p>

                    <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-ink-400">Jalons</p>
                    <ul className="mt-2 space-y-2">
                      {mission.milestones.map((ms) => {
                        const left = daysUntil(ms.dueAt, now)
                        return (
                          <li key={ms.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                            <span className={ms.status === 'fait' ? 'text-ink-400 line-through' : 'text-ink-800'}>
                              {ms.title}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-ink-400">{longDate(ms.dueAt)}</span>
                              <Select
                                value={ms.status}
                                onChange={(e) =>
                                  dispatch({
                                    type: 'MILESTONE_SET_STATUS',
                                    missionId: mission.id,
                                    milestoneId: ms.id,
                                    status: e.target.value as MilestoneStatus,
                                  })
                                }
                                className="h-7 w-32 text-xs"
                              >
                                <option value="a_venir">À venir</option>
                                <option value="en_cours">En cours</option>
                                <option value="fait">Fait</option>
                                <option value="bloque">Bloqué</option>
                              </Select>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Livrables</p>
                    <ul className="mt-2 space-y-2">
                      {items.map((d) => {
                        const s = DELIVERABLE_STATUS[d.status]
                        return (
                          <li key={d.id} className="rounded-lg border border-ink-100 px-3 py-2">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium text-ink-900">{d.title}</p>
                              <Badge tone={s.tone}>{s.label}</Badge>
                            </div>
                            <p className="mt-0.5 text-xs text-ink-500">
                              v{d.version}/{d.maxVersions} · {d.type} · {relative(d.updatedAt, now)}
                            </p>
                            {d.status !== 'valide' ? (
                              <div className="mt-2 flex gap-1.5">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    dispatch({
                                      type: 'DELIVERABLE_SET_STATUS',
                                      id: d.id,
                                      status: 'en_relecture' as DeliverableStatus,
                                    })
                                  }
                                >
                                  <Check className="h-3 w-3" />
                                  En relecture
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    dispatch({
                                      type: 'DELIVERABLE_SET_STATUS',
                                      id: d.id,
                                      status: 'retouche' as DeliverableStatus,
                                    })
                                  }
                                >
                                  <X className="h-3 w-3" />
                                  Retouche
                                </Button>
                              </div>
                            ) : null}
                          </li>
                        )
                      })}
                    </ul>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink-100 pt-3">
                      <CalendarDays className="h-3.5 w-3.5 text-ink-400" />
                      {meetings.map((m) => (
                        <span key={m.id} className="text-xs text-ink-500">
                          {dateTime(m.at)} ({m.status})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>
    </>
  )
}
