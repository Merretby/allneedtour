import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Eye, FileCheck2, Gauge, Pencil, Send, Undo2 } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  Field,
  Meter,
  Modal,
  Tabs,
  Textarea,
  useDisclosure,
} from '@/components/ui'
import { LEVER_LABEL } from '@/lib/status'
import { minutesToHours } from '@/lib/metrics'
import { longDate, relative } from '@/lib/format'
import { byId } from '@/lib/utils'
import type { InternalDiagnostic, Levers } from '@/types'

export const Route = createFileRoute('/admin/diagnostics/')({
  component: AdminDiagnostics,
  head: () => ({ meta: [{ title: 'Diagnostics internes — ALLNEEDS' }] }),
})

const LEVERS: Levers[] = [
  'inscriptions',
  'image',
  'equipe',
  'charges',
  'offre',
  'frequentation',
  'conformite',
  'experience',
]

export function AdminDiagnostics() {
  const { state, dispatch } = useDemo()
  const [filter, setFilter] = useState('tous')
  const edit = useDisclosure()
  const [draft, setDraft] = useState<InternalDiagnostic | null>(null)

  const list = state.diagnostics
    .filter((d) => (filter === 'tous' ? true : d.status === filter))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))

  function openEdit(diag: InternalDiagnostic) {
    setDraft(JSON.parse(JSON.stringify(diag)) as InternalDiagnostic)
    edit.openFn()
  }

  function save() {
    if (!draft) return
    dispatch({ type: 'DIAGNOSTIC_SAVE', diagnostic: draft })
    edit.close()
  }

  return (
    <>
      <PageHeader
        eyebrow="Interne"
        title="Diagnostics internes"
        description="Rien n’est publié sans relecture : ni nom de prestataire, ni donnée identifiante, ni promesse de résultat."
        actions={
          <Badge tone="warning">
            {state.diagnostics.filter((d) => d.status === 'en_revue').length} en relecture
          </Badge>
        }
      />

      <div className="mb-5">
        <Tabs
          value={filter}
          onChange={setFilter}
          tabs={[
            { value: 'tous', label: 'Tous', count: state.diagnostics.length },
            { value: 'brouillon', label: 'Brouillons', count: state.diagnostics.filter((d) => d.status === 'brouillon').length },
            { value: 'en_revue', label: 'En relecture', count: state.diagnostics.filter((d) => d.status === 'en_revue').length },
            { value: 'publie', label: 'Publiés', count: state.diagnostics.filter((d) => d.status === 'publie').length },
          ]}
        />
      </div>

      <div className="space-y-4">
        {list.map((diag) => {
          const org = byId(state.orgs, diag.orgId)
          const average = Math.round(diag.scores.reduce((a, s) => a + s.score, 0) / diag.scores.length)
          return (
            <Card key={diag.id}>
              <CardHeader
                title={`${diag.ref} · ${org?.name ?? 'Établissement'}`}
                description={`${diag.author} · ${minutesToHours(diag.durationMin)} · créé ${relative(diag.createdAt, new Date(state.now).getTime())}`}
                action={
                  <div className="flex items-center gap-2">
                    <Badge tone={diag.status === 'publie' ? 'success' : diag.status === 'en_revue' ? 'warning' : 'neutral'}>
                      {diag.status === 'publie' ? 'Publié' : diag.status === 'en_revue' ? 'En relecture' : 'Brouillon'}
                    </Badge>
                    <Badge tone="neutral">Score {average}</Badge>
                  </div>
                }
              />
              <CardBody>
                <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Scores par levier</p>
                    <ul className="mt-3 space-y-2.5">
                      {diag.scores.map((s) => (
                        <li key={s.lever} className="flex items-center justify-between gap-3">
                          <span className="text-sm text-ink-700">{LEVER_LABEL[s.lever] ?? s.lever}</span>
                          <Meter value={s.score} />
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-xs text-ink-500">
                      {diag.publishedAt ? `Publié le ${longDate(diag.publishedAt)}` : 'Jamais publié'}
                      {diag.reviewedAt ? ` · relu le ${longDate(diag.reviewedAt)}` : ''}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <InternalList title="Forces" items={diag.strengths} tone="success" />
                    <InternalList title="Difficultés" items={diag.difficulties} tone="warning" />
                    <InternalList title="Opportunités" items={diag.opportunities} tone="info" />
                    <InternalList title="3 priorités" items={diag.priorities} tone="brand" />
                  </div>
                </div>

                {diag.notes ? (
                  <p className="mt-5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900">
                    Note de relecture : {diag.notes}
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap gap-2 border-t border-ink-100 pt-4">
                  <Button size="sm" variant="outline" onClick={() => openEdit(diag)}>
                    <Pencil className="h-3.5 w-3.5" />
                    Modifier
                  </Button>
                  {diag.status === 'publie' ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dispatch({ type: 'DIAGNOSTIC_BACK_TO_REVIEW', id: diag.id })}
                    >
                      <Undo2 className="h-3.5 w-3.5" />
                      Repasser en relecture
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => dispatch({ type: 'DIAGNOSTIC_PUBLISH', id: diag.id })}>
                      <Send className="h-3.5 w-3.5" />
                      Publier dans l’espace client
                    </Button>
                  )}
                  <span className="flex items-center gap-1.5 text-xs text-ink-500">
                    <Eye className="h-3.5 w-3.5" />
                    Visible par {org?.contactName ?? 'le client'} dès la publication
                  </span>
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>

      <Alert tone="warning" className="mt-6" title="Règles de publication" icon={<FileCheck2 className="h-4 w-4" />}>
        Anonymisez tout prestataire cité, retirez les données nominatives de salariés ou de patients, et vérifiez que chaque
        priorité est réalisable par l’établissement lui-même.
      </Alert>

      <Modal open={edit.open} onClose={edit.close} title="Modifier le diagnostic" size="lg" description="Les modifications portent sur le contenu publié.">
        {draft ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Référence">
                <input
                  className="h-10 w-full rounded-lg border border-ink-200 px-3 text-sm"
                  value={draft.ref}
                  onChange={(e) => setDraft({ ...draft, ref: e.target.value })}
                />
              </Field>
              <Field label="Auteur">
                <input
                  className="h-10 w-full rounded-lg border border-ink-200 px-3 text-sm"
                  value={draft.author}
                  onChange={(e) => setDraft({ ...draft, author: e.target.value })}
                />
              </Field>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-ink-700">
                <Gauge className="h-3.5 w-3.5" />
                Scores (0 à 100)
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {LEVERS.map((lever) => {
                  const existing = draft.scores.find((s) => s.lever === lever)
                  return (
                    <div key={lever} className="flex items-center gap-3">
                      <span className="w-40 shrink-0 text-xs text-ink-600">{LEVER_LABEL[lever]}</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={existing?.score ?? 50}
                        onChange={(e) => {
                          const value = Number(e.target.value)
                          setDraft({
                            ...draft,
                            scores: existing
                              ? draft.scores.map((s) => (s.lever === lever ? { ...s, score: value } : s))
                              : [...draft.scores, { lever, score: value }],
                          })
                        }}
                        className="h-1 flex-1 accent-brand-700"
                      />
                      <span className="w-8 text-right text-xs tabular-nums text-ink-600">
                        {existing?.score ?? 50}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <ListEditor
              label="Forces"
              items={draft.strengths}
              onChange={(strengths) => setDraft({ ...draft, strengths })}
            />
            <ListEditor
              label="Difficultés prioritaires"
              items={draft.difficulties}
              onChange={(difficulties) => setDraft({ ...draft, difficulties })}
            />
            <ListEditor
              label="Opportunités"
              items={draft.opportunities}
              onChange={(opportunities) => setDraft({ ...draft, opportunities })}
            />
            <ListEditor
              label="3 priorités"
              items={draft.priorities}
              onChange={(priorities) => setDraft({ ...draft, priorities })}
            />

            <Field label="Note de relecture interne" hint="Visible uniquement par l’équipe.">
              <Textarea rows={2} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} />
            </Field>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={edit.close}>
                Annuler
              </Button>
              <Button onClick={save}>Enregistrer</Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  )
}

function InternalList({
  title,
  items,
  tone,
}: {
  title: string
  items: string[]
  tone: 'success' | 'warning' | 'info' | 'brand'
}) {
  const colors = {
    success: 'text-emerald-700',
    warning: 'text-amber-700',
    info: 'text-sky-700',
    brand: 'text-brand-700',
  }
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item} className={`text-sm leading-relaxed ${colors[tone]}`}>
            — {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ListEditor({
  label,
  items,
  onChange,
}: {
  label: string
  items: string[]
  onChange: (next: string[]) => void
}) {
  return (
    <Field label={label} hint="Une ligne par élément. Videz une ligne pour la supprimer.">
      <Textarea
        rows={4}
        value={items.join('\n')}
        onChange={(e) => onChange(e.target.value.split('\n').filter((l) => l.trim().length > 0))}
      />
    </Field>
  )
}
