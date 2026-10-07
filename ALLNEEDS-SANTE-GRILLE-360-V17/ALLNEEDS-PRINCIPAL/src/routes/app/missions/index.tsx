import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Briefcase, CalendarDays, Check, Clock } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import { Alert, Badge, Button, Card, CardHeader, CardBody, EmptyState, Progress } from '@/components/ui'
import { LEVER_LABEL, MISSION_STATUS } from '@/lib/status'
import { longDate, money, relative } from '@/lib/format'

export const Route = createFileRoute('/app/missions/')({
  component: MissionsPage,
  head: () => ({ meta: [{ title: 'Mes missions — ALLNEEDS' }] }),
})

export function MissionsPage() {
  const { state, orgId } = useDemo()

  const missions = state.missions
    .filter((m) => m.orgId === orgId)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))

  return (
    <>
      <PageHeader
        eyebrow="Missions"
        title="Mes missions"
        description="Périmètre écrit, jalons datés, livrables suivis. Le périmètre est contractuel."
        actions={
          <Link to="/missions">
            <Button size="sm" variant="outline">
              Découvrir une nouvelle mission
            </Button>
          </Link>
        }
      />

      {missions.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-5 w-5" />}
          title="Aucune mission en cours"
          description="Un diagnostic STARTER permet de savoir quelle mission correspond à votre situation."
          action={
            <Link to="/diagnostic">
              <Button size="sm">Diagnostic offert</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-5">
          {missions.map((mission) => {
            const status = MISSION_STATUS[mission.status]
            const deliverables = state.deliverables.filter((d) => d.missionId === mission.id)
            const done = deliverables.filter((d) => d.status === 'valide').length
            const nextMeeting = state.meetings
              .filter((m) => m.missionId === mission.id && m.status !== 'realise' && m.status !== 'annule')
              .sort((a, b) => a.at.localeCompare(b.at))[0]

            return (
              <Card key={mission.id}>
                <CardHeader
                  title={`${mission.code} · ${mission.title}`}
                  description={`Réf. ${mission.ref} · démarrée le ${longDate(mission.startedAt)} · livraison ${longDate(mission.targetEnd)}`}
                  action={<Badge tone={status.tone}>{status.label}</Badge>}
                />
                <CardBody>
                  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                      <div className="flex flex-wrap gap-1.5">
                        {mission.levers.map((lever) => (
                          <Badge key={lever} tone="neutral">
                            {LEVER_LABEL[lever] ?? lever}
                          </Badge>
                        ))}
                      </div>

                      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-ink-400">Périmètre</p>
                      <ul className="mt-3 space-y-1.5">
                        {mission.scope.map((s) => (
                          <li key={s} className="flex items-start gap-2 text-sm leading-relaxed text-ink-700">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                            {s}
                          </li>
                        ))}
                      </ul>

                      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-ink-400">Non inclus</p>
                      <ul className="mt-3 space-y-1.5">
                        {mission.outOfScope.map((s) => (
                          <li key={s} className="flex items-start gap-2 text-sm leading-relaxed text-ink-500">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <Progress value={mission.onboardingProgress} label="Avancement" />
                        <p className="mt-2 text-xs text-ink-500">
                          {deliverables.length > 0 ? `${done}/${deliverables.length} livrables validés` : 'Aucun livrable encore'}
                        </p>
                      </div>

                      <div className="rounded-xl bg-ink-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Jalons</p>
                        <ul className="mt-3 space-y-2">
                          {mission.milestones.slice(0, 4).map((ms) => (
                            <li key={ms.id} className="flex items-center justify-between gap-3 text-sm">
                              <span className={ms.status === 'fait' ? 'text-ink-400 line-through' : 'text-ink-800'}>
                                {ms.title}
                              </span>
                              <span className="shrink-0 text-xs text-ink-400">{longDate(ms.dueAt)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {nextMeeting ? (
                        <div className="flex items-start gap-3 rounded-xl border border-brand-200 bg-brand-50 p-4">
                          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
                          <div>
                            <p className="text-sm font-semibold text-brand-900">{nextMeeting.title}</p>
                            <p className="mt-0.5 text-xs text-brand-800">
                              {relative(nextMeeting.at)} · {nextMeeting.durationMin} min
                            </p>
                          </div>
                        </div>
                      ) : null}

                      <div className="flex items-center justify-between border-t border-ink-100 pt-4">
                        <span className="flex items-center gap-1.5 text-xs text-ink-500">
                          <Clock className="h-3.5 w-3.5" />
                          {mission.owner}
                        </span>
                        <span className="text-sm text-ink-500">Périmètre convenu</span>
                      </div>

                      <Link to="/app/missions/$id" params={{ id: mission.id }} className="block">
                        <Button size="sm" fullWidth variant="outline">
                          Ouvrir la mission
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )
          })}
        </div>
      )}

      <Alert tone="warning" className="mt-6" title="Retouches et production supplémentaire">
        2 tours de retouches par livrable sont inclus. Toute production supplémentaire fait l’objet d’une prestation
        complémentaire chiffrée et validée avant d’être réalisée.
      </Alert>

      <p className="mt-4 text-xs text-ink-400">
        Besoin d’un historique détaillé par livrable ?{' '}
        <Link to="/app/livrables" className="font-semibold text-brand-700">
          Voir mes livrables
        </Link>{' '}
        — ou votre{' '}
        <Link to="/app/documents" className="font-semibold text-brand-700">
          dossier documentaire
        </Link>
        . Dernière mise à jour : {relative(state.now)}.
      </p>
    </>
  )
}
