import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AlarmClock, BellRing, CheckCheck, FileWarning, MessageSquareWarning } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  Divider,
  EmptyState,
  Tabs,
} from '@/components/ui'
import { MEETING_STATUS } from '@/lib/status'
import { dateTime, daysUntil, longDate, relative } from '@/lib/format'
import { byId } from '@/lib/utils'
import { DEMO_NOW } from '@/data/demo'

export const Route = createFileRoute('/admin/relances')({
  component: AdminRelances,
  head: () => ({ meta: [{ title: 'Relances — ALLNEEDS' }] }),
})

export function AdminRelances() {
  const { state, dispatch } = useDemo()
  const [filter, setFilter] = useState('toutes')
  const now = new Date(DEMO_NOW).getTime()

  const leads = state.leads
    .filter((l) => l.stage !== 'gagne' && l.stage !== 'perdu')
    .map((l) => ({ lead: l, left: daysUntil(l.nextActionAt, now) }))
    .sort((a, b) => a.left - b.left)

  const due = leads.filter((l) => l.left <= 0)
  const soon = leads.filter((l) => l.left > 0 && l.left <= 7)

  const docsPending = state.documents.filter((d) => d.status === 'demande')
  const quotesPending = state.quotes.filter((q) => q.status === 'recu' || q.status === 'en_etude')
  const threadsUnread = state.threads.filter((t) => t.unread > 0)
  const meetingsSoon = state.meetings
    .filter((m) => m.status === 'propose' || m.status === 'confirme')
    .sort((a, b) => a.at.localeCompare(b.at))

  const all = [
    ...leads.map((l) => ({
      id: `lead-${l.lead.id}`,
      tone: l.left <= 0 ? ('danger' as const) : l.left <= 3 ? ('warning' as const) : ('info' as const),
      title: l.lead.nextAction,
      body: `${l.lead.orgName} — ${l.lead.contactName} · étape : ${l.lead.stage}`,
      due: l.left <= 0 ? `En retard de ${Math.abs(l.left)} j` : `Dans ${l.left} j · ${longDate(l.lead.nextActionAt)}`,
      action: 'Relancer',
      onAction: () => dispatch({ type: 'LEAD_PATCH', id: l.lead.id, patch: { lastContactAt: DEMO_NOW } }),
    })),
    ...docsPending.map((doc) => {
      const org = byId(state.orgs, doc.orgId)
      return {
        id: `doc-${doc.id}`,
        tone: 'warning' as const,
        title: `Document manquant : ${doc.name}`,
        body: `${org?.name} — ${doc.required ? 'obligatoire' : 'recommandé'} · ${doc.comment || 'relance nécessaire'}`,
        due: `Reçu ${relative(doc.updatedAt, now)}`,
        action: 'Relancer',
        onAction: () => dispatch({ type: 'TOAST_ADD', toast: { title: 'Relance envoyée', description: doc.name, tone: 'success' } }),
      }
    }),
    ...quotesPending.map((q) => {
      const need = byId(state.needs, q.needId)
      const org = byId(state.orgs, need?.orgId)
      return {
        id: `quote-${q.id}`,
        tone: 'info' as const,
        title: `Devis sans décision : ${q.amount} DH`,
        body: `${org?.name} — ${need?.title}`,
        due: `Reçu ${relative(q.receivedAt, now)} · valable jusqu’au ${longDate(q.validUntil)}`,
        action: 'Relancer',
        onAction: () => dispatch({ type: 'TOAST_ADD', toast: { title: 'Relance envoyée', description: need?.title ?? '', tone: 'success' } }),
      }
    }),
    ...threadsUnread.map((t) => {
      const org = byId(state.orgs, t.orgId)
      return {
        id: `thread-${t.id}`,
        tone: 'warning' as const,
        title: `${t.unread} message(s) non lu(s) — ${t.subject}`,
        body: `${org?.name} · fil ${t.topic}`,
        due: `Dernière activité ${relative(t.lastAt, now)}`,
        action: 'Ouvrir',
        onAction: () => dispatch({ type: 'TOAST_ADD', toast: { title: 'Fil ouvert', description: t.subject, tone: 'info' } }),
      }
    }),
  ].filter((item) => (filter === 'toutes' ? true : item.tone === filter))

  return (
    <>
      <PageHeader
        eyebrow="Rigueur"
        title="Relances"
        description="Une relance est une trace écrite, jamais un appel non tracé. Tout ce qui attend une action est listé ici."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-ink-100 bg-white p-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-500">Actions en retard</p>
          <p className="mt-2 font-display text-3xl leading-none text-ink-950">{due.length}</p>
          <p className="mt-2 text-xs text-ink-500">Pipeline non traité à la date prévue</p>
        </div>
        <div className="rounded-xl border border-ink-100 bg-white p-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-500">Sous 7 jours</p>
          <p className="mt-2 font-display text-3xl leading-none text-ink-950">{soon.length}</p>
          <p className="mt-2 text-xs text-ink-500">À préparer cette semaine</p>
        </div>
        <div className="rounded-xl border border-ink-100 bg-white p-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-500">Documents manquants</p>
          <p className="mt-2 font-display text-3xl leading-none text-ink-950">{docsPending.length}</p>
          <p className="mt-2 text-xs text-ink-500">Peuvent bloquer une mission</p>
        </div>
        <div className="rounded-xl border border-ink-100 bg-white p-4">
          <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-500">Rendez-vous à confirmer</p>
          <p className="mt-2 font-display text-3xl leading-none text-ink-950">
            {meetingsSoon.filter((m) => m.status === 'propose').length}
          </p>
          <p className="mt-2 text-xs text-ink-500">Créneaux proposés au client</p>
        </div>
      </div>

      <div className="mb-5">
        <Tabs
          value={filter}
          onChange={setFilter}
          tabs={[
            { value: 'toutes', label: 'Toutes', count: all.length },
            { value: 'danger', label: 'En retard' },
            { value: 'warning', label: 'À surveiller' },
            { value: 'info', label: 'Information' },
          ]}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader title="File de relances" description="Classée par échéance." />
          <div className="divide-y divide-ink-50">
            {all.length === 0 ? (
              <CardBody>
                <EmptyState
                  title="Rien à relancer"
                  description="Aucune action en attente. C’est l’état normal d’une équipe qui tient ses engagements."
                  icon={<CheckCheck className="h-5 w-5" />}
                />
              </CardBody>
            ) : null}
            {all.map((item) => (
              <div key={item.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge tone={item.tone}>{item.due}</Badge>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-ink-950">{item.title}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{item.body}</p>
                </div>
                <Button size="sm" variant="outline" onClick={item.onAction}>
                  {item.action}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Prochains rendez-vous" description="Confirmer un créneau, c’est tenir une promesse." />
            <div className="divide-y divide-ink-50">
              {meetingsSoon.map((m) => {
                const org = byId(state.orgs, m.orgId)
                const status = MEETING_STATUS[m.status]
                return (
                  <div key={m.id} className="px-5 py-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-ink-900">{m.title}</p>
                        <p className="mt-0.5 text-xs text-ink-500">
                          {org?.name} · {dateTime(m.at)} · {m.location}
                        </p>
                      </div>
                      <Badge tone={status.tone}>{status.label}</Badge>
                    </div>
                    {m.status === 'propose' ? (
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={() => dispatch({ type: 'MEETING_SET_STATUS', id: m.id, status: 'confirme' })}
                      >
                        Confirmer
                      </Button>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <AlarmClock className="h-4 w-4 text-brand-700" />
              <p className="text-sm font-semibold text-ink-950">Rythme recommandé</p>
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-ink-600">
              <li>• Besoin reçu : réponse sous 24 h ouvrées, même pour dire « nous cherchons ».</li>
              <li>• Prestataire proposé : relance à J+2 s’il n’a pas répondu.</li>
              <li>• Devis transmis : point de suivi à J+5 avant expiration de validité.</li>
              <li>• Mission livrée : bilan sous 5 jours, pas de laisser-en-passer.</li>
            </ul>
            <Divider className="my-4" />
            <div className="grid gap-2 text-xs text-ink-500">
              <p className="flex items-center gap-2">
                <BellRing className="h-3.5 w-3.5" />
                Rappels automatiques : à activer dans la version production.
              </p>
              <p className="flex items-center gap-2">
                <FileWarning className="h-3.5 w-3.5" />
                Historique des relances : conservé côté serveur, pas en frontend.
              </p>
              <p className="flex items-center gap-2">
                <MessageSquareWarning className="h-3.5 w-3.5" />
                Une relance client se fait dans la messagerie, pour rester traçable.
              </p>
            </div>
          </Card>

          <Alert tone="info" title="Frontend seul">
            Cette page regroupe les actions en attente à partir du jeu de démonstration. En production, elle se brancherait
            sur un vrai ordonnanceur et un journal d’audit.
          </Alert>
        </div>
      </div>
    </>
  )
}
