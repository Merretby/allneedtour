import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Inbox, Mail, Phone, UserPlus } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  Select,
  Tabs,
  TableWrap,
  Td,
  Th,
  Tr,
} from '@/components/ui'
import { SECTOR_LABEL } from '@/data/catalog'
import { relative } from '@/lib/format'

const KIND_LABEL: Record<string, string> = {
  besoin: 'Besoin',
  mission: 'Mission',
  diagnostic: 'Diagnostic',
  contact: 'Contact',
  newsletter: 'Newsletter',
}

const STATUS: Record<string, { label: string; tone: 'neutral' | 'info' | 'brand' | 'success' }> = {
  nouveau: { label: 'Nouveau', tone: 'brand' },
  contacte: { label: 'Contacté', tone: 'info' },
  planifie: { label: 'Planifié', tone: 'neutral' },
  clos: { label: 'Clos', tone: 'success' },
}

export const Route = createFileRoute('/admin/qualification')({
  component: QualificationPage,
  head: () => ({ meta: [{ title: 'Qualification — ALLNEEDS' }] }),
})

export function QualificationPage() {
  const { state, dispatch } = useDemo()
  const [filter, setFilter] = useState('tous')
  const [assignee, setAssignee] = useState('tous')

  const team = Array.from(new Set([...state.leads.map((l) => l.assignedTo), ...state.requests.map((r) => r.assignedTo)]))

  const requests = state.requests
    .filter((r) => (filter === 'tous' ? true : r.kind === filter))
    .filter((r) => (assignee === 'tous' ? true : r.assignedTo === assignee))
    .sort((a, b) => b.at.localeCompare(a.at))

  const bookings = state.bookings
    .filter((b) => (filter === 'tous' ? true : b.status === 'confirme'))
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <>
      <PageHeader
        eyebrow="Entrée"
        title="Qualification des demandes"
        description="Tout ce qui arrive du site public est qualifié ici avant de devenir un lead, un besoin ou un diagnostic."
      />

      <div className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
        <Tabs
          value={filter}
          onChange={setFilter}
          tabs={[
            { value: 'tous', label: 'Toutes', count: state.requests.length },
            { value: 'besoin', label: 'Besoins', count: state.requests.filter((r) => r.kind === 'besoin').length },
            { value: 'mission', label: 'Missions', count: state.requests.filter((r) => r.kind === 'mission').length },
            { value: 'diagnostic', label: 'Diagnostics', count: state.requests.filter((r) => r.kind === 'diagnostic').length },
            { value: 'contact', label: 'Contacts', count: state.requests.filter((r) => r.kind === 'contact').length },
          ]}
        />
        <Select value={assignee} onChange={(e) => setAssignee(e.target.value)} className="lg:w-52">
          <option value="tous">Toute l’équipe</option>
          {team.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader
            title="Demandes entrantes"
            description="Une demande non respondue sous 24 h ouvrées est une demande perdue."
            action={<Badge tone={state.requests.filter((r) => r.status === 'nouveau').length ? 'brand' : 'neutral'}>{state.requests.filter((r) => r.status === 'nouveau').length} nouvelles</Badge>}
          />
          <TableWrap>
            <thead>
              <tr>
                <Th>Établissement</Th>
                <Th>Type</Th>
                <Th>Message</Th>
                <Th>Reçue</Th>
                <Th>Statut</Th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => {
                const status = STATUS[r.status]
                return (
                  <Tr key={r.id}>
                    <Td>
                      <p className="font-semibold text-ink-950">{r.org}</p>
                      <p className="text-xs text-ink-500">
                        {r.name} · {SECTOR_LABEL[r.sector]} · {r.city}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2 text-[0.68rem] text-ink-400">
                        <a href={`mailto:${r.email}`} className="flex items-center gap-1 hover:text-brand-700">
                          <Mail className="h-3 w-3" />
                          {r.email}
                        </a>
                        <a href={`tel:${r.phone}`} className="flex items-center gap-1 hover:text-brand-700">
                          <Phone className="h-3 w-3" />
                          {r.phone}
                        </a>
                      </div>
                    </Td>
                    <Td>
                      <Badge tone="neutral">{KIND_LABEL[r.kind]}</Badge>
                      <p className="mt-1 text-xs text-ink-500">{r.budget}</p>
                    </Td>
                    <Td className="max-w-[280px] text-xs text-ink-600">{r.message}</Td>
                    <Td className="whitespace-nowrap text-xs text-ink-500">{relative(r.at, new Date(state.now).getTime())}</Td>
                    <Td>
                      <Select
                        value={r.status}
                        onChange={(e) =>
                          dispatch({
                            type: 'REQUEST_SET_STATUS',
                            id: r.id,
                            status: e.target.value as (typeof state.requests)[number]['status'],
                          })
                        }
                        className="h-8 w-32 text-xs"
                      >
                        {Object.entries(STATUS).map(([value, meta]) => (
                          <option key={value} value={value}>
                            {meta.label}
                          </option>
                        ))}
                      </Select>
                      <Select
                        value={r.assignedTo}
                        onChange={(e) => dispatch({ type: 'REQUEST_ASSIGN', id: r.id, assignedTo: e.target.value })}
                        className="mt-1 h-8 w-32 text-xs"
                      >
                        <option value="Non assigné">Non assigné</option>
                        {team
                          .filter((t) => t !== 'Non assigné')
                          .map((t) => (
                            <option key={t} value={t}>
                              {t.split(' ')[0]}
                            </option>
                          ))}
                      </Select>
                    </Td>
                  </Tr>
                )
              })}
            </tbody>
          </TableWrap>
          {requests.length === 0 ? (
            <CardBody>
              <p className="text-sm text-ink-500">Aucune demande dans cette vue.</p>
            </CardBody>
          ) : null}
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Réservations de diagnostic" description="Le diagnostic STARTER est notre porte d’entrée." />
            <div className="divide-y divide-ink-50">
              {bookings.length === 0 ? (
                <CardBody>
                  <p className="text-sm text-ink-500">Aucune réservation.</p>
                </CardBody>
              ) : null}
              {bookings.map((b) => (
                <div key={b.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-ink-950">{b.org}</p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {b.name} ({b.role}) · {b.topic}
                      </p>
                    </div>
                    <Badge tone={b.status === 'confirme' ? 'success' : 'warning'}>
                      {b.status === 'confirme' ? 'Confirmé' : 'À confirmer'}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-ink-600">
                    {b.date} · {b.slot} · {b.format === 'sur_site' ? 'Sur site' : b.format === 'visio' ? 'Visio' : 'Téléphone'} ·{' '}
                    {b.city}
                  </p>
                  {b.status !== 'confirme' ? (
                    <Button
                      className="mt-3"
                      size="sm"
                      onClick={() => dispatch({ type: 'BOOKING_SET_STATUS', id: b.id, status: 'confirme' })}
                    >
                      Confirmer le créneau
                    </Button>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>

          <Alert tone="info" title="Règle de qualification" icon={<Inbox className="h-4 w-4" />}>
            Une demande devient un lead lorsque le besoin est nommé, le budget connu et la décision identifiée. Sinon, elle
            reste une demande à traiter.
          </Alert>

          <Card className="p-5">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-brand-700" />
              <p className="text-sm font-semibold text-ink-950">Convertir en lead</p>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink-500">
              Une fois qualifiée, la demande est rattachée à un établissement et devient une ligne du pipeline. Utilisez la
              page Pipeline pour créer la ligne et suivre les étapes.
            </p>
            <Button size="sm" variant="outline" className="mt-3">
              Ouvrir le pipeline
            </Button>
          </Card>
        </div>
      </div>
    </>
  )
}
