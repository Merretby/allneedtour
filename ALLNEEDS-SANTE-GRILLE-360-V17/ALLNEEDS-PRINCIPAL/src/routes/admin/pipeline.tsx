import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { CalendarClock, GripVertical, Mail, Phone, Plus, Trophy } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  Field,
  Input,
  Modal,
  Select,
  Stat,
  TableWrap,
  Td,
  Textarea,
  Th,
  Tr,
  useDisclosure,
} from '@/components/ui'
import { LEAD_FLOW, LEAD_STAGE } from '@/lib/status'
import { SECTOR_LABEL } from '@/data/catalog'
import { longDate, money, relative, daysUntil } from '@/lib/format'
import { DEMO_NOW } from '@/data/demo'
import type { Lead, LeadSource, LeadStage, Sector } from '@/types'

export const Route = createFileRoute('/admin/pipeline')({
  component: PipelinePage,
  head: () => ({ meta: [{ title: 'Pipeline — ALLNEEDS' }] }),
})

const SOURCES: Record<LeadSource, string> = {
  site: 'Site',
  recommandation: 'Recommandation',
  abonnement: 'Abonnement',
  'appel entrant': 'Appel entrant',
  evenement: 'Événement',
  linkedin: 'LinkedIn',
}

export function PipelinePage() {
  const { state, dispatch } = useDemo()
  const modal = useDisclosure()
  const now = new Date(DEMO_NOW).getTime()
  const [assignee, setAssignee] = useState('tous')

  const [form, setForm] = useState({
    orgName: '',
    contactName: '',
    contactRole: '',
    email: '',
    phone: '',
    city: '',
    sector: 'enseignement' as Sector,
    kind: '',
    source: 'site' as LeadSource,
    budget: '',
    notes: '',
  })

  const team = useMemo(() => Array.from(new Set(state.leads.map((l) => l.assignedTo))), [state.leads])
  const filtered = state.leads.filter((l) => (assignee === 'tous' ? true : l.assignedTo === assignee))

  const open = filtered.filter((l) => l.stage !== 'gagne' && l.stage !== 'perdu')
  const won = filtered.filter((l) => l.stage === 'gagne')
  const lost = filtered.filter((l) => l.stage === 'perdu')
  const pipelineValue = open.reduce((acc, l) => acc + (l.budget ?? 0), 0)
  const winRate = filtered.length > 0 ? Math.round((won.length / (won.length + lost.length)) * 100) : 0

  function createLead() {
    dispatch({
      type: 'LEAD_CREATE',
      lead: {
        id: `lead-${Math.random().toString(36).slice(2, 8)}`,
        orgName: form.orgName || 'Nouvel établissement',
        contactName: form.contactName || 'Contact à qualifier',
        contactRole: form.contactRole,
        email: form.email,
        phone: form.phone,
        city: form.city,
        sector: form.sector,
        kind: form.kind,
        headcount: '',
        source: form.source,
        stage: 'nouveau',
        budget: form.budget ? Number(form.budget) : null,
        urgency: 'normale',
        assignedTo: 'Nada Bennani',
        createdAt: DEMO_NOW,
        lastContactAt: DEMO_NOW,
        nextAction: 'Premier appel de qualification',
        nextActionAt: new Date(new Date(DEMO_NOW).getTime() + 86400000).toISOString(),
        score: 50,
        notes: form.notes,
        convertedOrgId: null,
      },
    })
    modal.close()
    setForm({
      orgName: '',
      contactName: '',
      contactRole: '',
      email: '',
      phone: '',
      city: '',
      sector: 'enseignement',
      kind: '',
      source: 'site',
      budget: '',
      notes: '',
    })
  }

  return (
    <>
      <PageHeader
        eyebrow="Commercial"
        title="Pipeline"
        description="Du premier contact à la signature. Un lead gagné devient un établissement avec un espace client."
        actions={
          <>
            <Select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="w-48">
              <option value="tous">Toute l’équipe</option>
              {team.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
            <Button size="sm" onClick={modal.openFn}>
              <Plus className="h-3.5 w-3.5" />
              Nouveau lead
            </Button>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Opportunités" value={open.length} hint={`${money(pipelineValue)} de budget annoncé`} tone="brand" />
        <Stat label="Gagnés" value={won.length} hint={money(won.reduce((a, l) => a + (l.budget ?? 0), 0))} tone="success" />
        <Stat label="Perdus" value={lost.length} hint="Budgets reportés ou non actés" tone="warning" />
        <Stat label="Taux de réussite" value={`${winRate} %`} hint="Gagnés sur leads clos" tone="info" />
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-5">
        {LEAD_FLOW.map((stage) => {
          const items = filtered.filter((l) => l.stage === stage)
          const value = items.reduce((acc, l) => acc + (l.budget ?? 0), 0)
          return (
            <div key={stage} className="rounded-2xl border border-ink-100 bg-white p-3">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-ink-900">{LEAD_STAGE[stage].label}</p>
                  <p className="text-[0.65rem] text-ink-400">{items.length} lead(s)</p>
                </div>
                <Badge tone={LEAD_STAGE[stage].tone}>{money(value)}</Badge>
              </div>
              <div className="space-y-2">
                {items.map((lead) => (
                  <LeadCard key={lead.id} lead={lead} now={now} />
                ))}
                {items.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-ink-200 px-3 py-4 text-center text-xs text-ink-400">
                    Vide
                  </p>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      <Card>
        <CardBody className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink-950">Leads perdus</p>
              <p className="text-xs text-ink-500">Un lead perdu reste documenté : la raison compte plus que la perte.</p>
            </div>
            <Badge tone="danger">{lost.length}</Badge>
          </div>
          <TableWrap>
            <thead>
              <tr>
                <Th>Établissement</Th>
                <Th>Motif</Th>
                <Th>Budget</Th>
                <Th>Dernier contact</Th>
                <Th>Suivant</Th>
              </tr>
            </thead>
            <tbody>
              {lost.map((lead) => (
                <Tr key={lead.id}>
                  <Td>
                    <span className="font-semibold text-ink-950">{lead.orgName}</span>
                    <span className="block text-xs text-ink-500">{lead.kind}</span>
                  </Td>
                  <Td>{lead.notes}</Td>
                  <Td>{lead.budget ? money(lead.budget) : '—'}</Td>
                  <Td>{longDate(lead.lastContactAt)}</Td>
                  <Td>{lead.nextAction}</Td>
                </Tr>
              ))}
            </tbody>
          </TableWrap>
        </CardBody>
      </Card>

      <Modal
        open={modal.open}
        onClose={modal.close}
        title="Nouveau lead"
        description="Il apparaît immédiatement dans la première colonne du pipeline."
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Établissement" required>
              <Input value={form.orgName} onChange={(e) => setForm({ ...form, orgName: e.target.value })} placeholder="École Les Oliviers" />
            </Field>
            <Field label="Type">
              <Input value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value })} placeholder="École privée" />
            </Field>
            <Field label="Contact" required>
              <Input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
            </Field>
            <Field label="Fonction">
              <Input value={form.contactRole} onChange={(e) => setForm({ ...form, contactRole: e.target.value })} placeholder="Directrice" />
            </Field>
            <Field label="E-mail">
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Téléphone">
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="Ville">
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </Field>
            <Field label="Secteur">
              <Select value={form.sector} onChange={(e) => setForm({ ...form, sector: e.target.value as Sector })}>
                <option value="enseignement">Enseignement</option>
                <option value="sante">Santé</option>
                <option value="tourisme">Tourisme</option>
              </Select>
            </Field>
            <Field label="Source">
              <Select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })}>
                {Object.entries(SOURCES).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Budget annoncé (DH)">
              <Input
                type="number"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
                placeholder="15000"
              />
            </Field>
          </div>
          <Field label="Notes de qualification">
            <Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={modal.close}>
              Annuler
            </Button>
            <Button onClick={createLead}>Créer le lead</Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

function LeadCard({ lead, now }: { lead: Lead; now: number }) {
  const { dispatch } = useDemo()
  const nextIndex = LEAD_FLOW.indexOf(lead.stage)
  const nextStage = LEAD_FLOW[Math.min(nextIndex + 1, LEAD_FLOW.length - 1)]
  const late = daysUntil(lead.nextActionAt, now) < 0 && lead.stage !== 'gagne'

  return (
    <div className={`rounded-xl border p-3 ${late ? 'border-red-200 bg-red-50/40' : 'border-ink-100'}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold leading-snug text-ink-950">{lead.orgName}</p>
        <GripVertical className="h-3.5 w-3.5 shrink-0 text-ink-300" />
      </div>
      <p className="mt-0.5 text-xs text-ink-500">
        {lead.contactName} · {SECTOR_LABEL[lead.sector]} · {lead.city}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <Badge tone={lead.urgency === 'haute' ? 'danger' : 'neutral'}>{SOURCES[lead.source]}</Badge>
        {lead.budget ? <Badge tone="brand">{money(lead.budget)}</Badge> : null}
        <Badge tone={lead.score >= 75 ? 'success' : lead.score >= 55 ? 'info' : 'neutral'}>{lead.score}</Badge>
      </div>

      <p className="mt-2 text-xs leading-relaxed text-ink-600">{lead.nextAction}</p>
      <p className={`mt-1 flex items-center gap-1 text-[0.68rem] ${late ? 'font-semibold text-red-600' : 'text-ink-400'}`}>
        <CalendarClock className="h-3 w-3" />
        {late ? `En retard de ${Math.abs(daysUntil(lead.nextActionAt, now))} j` : relative(lead.nextActionAt, now)}
      </p>

      <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-2">
        <div className="flex gap-1 text-ink-400">
          <a href={`mailto:${lead.email}`} title="E-mail" className="rounded p-1 hover:bg-ink-50 hover:text-ink-800">
            <Mail className="h-3.5 w-3.5" />
          </a>
          <a href={`tel:${lead.phone}`} title="Téléphone" className="rounded p-1 hover:bg-ink-50 hover:text-ink-800">
            <Phone className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="flex items-center gap-1">
          <Select
            value={lead.stage}
            onChange={(e) => dispatch({ type: 'LEAD_SET_STAGE', id: lead.id, stage: e.target.value as LeadStage })}
            className="h-7 w-32 text-xs"
          >
            {Object.entries(LEAD_STAGE).map(([value, meta]) => (
              <option key={value} value={value}>
                {meta.label}
              </option>
            ))}
          </Select>
          {nextStage !== lead.stage ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => dispatch({ type: 'LEAD_SET_STAGE', id: lead.id, stage: nextStage })}
              title={`Passer à ${LEAD_STAGE[nextStage].label}`}
            >
              <Trophy className="h-3.5 w-3.5" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}
