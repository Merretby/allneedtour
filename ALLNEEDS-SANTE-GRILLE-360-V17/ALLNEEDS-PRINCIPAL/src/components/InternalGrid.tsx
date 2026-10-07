import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AlertTriangle, Download, FileJson, Printer, RotateCcw, ShieldCheck } from 'lucide-react'
import { DIAGNOSTIC_GRIDS, GRID_CHARGE_HEADERS, GRID_SCORE_NOTE } from '@/data/grid'
import { SECTOR_LABEL, SECTOR_ORDER } from '@/data/catalog'
import { cn } from '@/lib/utils'
import { Alert, Badge, Button, Card, CardBody, CardHeader, Field, Input, Select, TableWrap, Td, Textarea, Th, Tr } from '@/components/ui'
import type { DiagnosticGrid, GridChargeDraft, GridDraft, Sector } from '@/types'

const STORAGE_PREFIX = 'allneeds.grid.'

function emptyDraft(sector: Sector): GridDraft {
  return {
    sector,
    fields: {},
    documents: {},
    answers: {},
    scores: {},
    keyPoints: {},
    charges: {},
    synth: {},
    criteria: {},
    decision: '',
    decisionNotes: '',
    nextStep: '',
    updatedAt: new Date().toISOString(),
  }
}

function emptyCharge(): GridChargeDraft {
  return { fournisseur: '', cost: '', due: '', notes: '' }
}

function loadDraft(sector: Sector): GridDraft {
  if (typeof window === 'undefined') return emptyDraft(sector)
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + sector)
    if (!raw) return emptyDraft(sector)
    const parsed = JSON.parse(raw) as Partial<GridDraft>
    return { ...emptyDraft(sector), ...parsed, sector }
  } catch {
    return emptyDraft(sector)
  }
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value.trim()) ? `'${value}` : value
  return `"${safe.replace(/"/g, '""')}"`
}

export function InternalGrid({ sector }: { sector: Sector }) {
  const grid: DiagnosticGrid = DIAGNOSTIC_GRIDS[sector]
  const [draft, setDraft] = useState<GridDraft>(() => loadDraft(sector))

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_PREFIX + sector, JSON.stringify(draft))
    } catch {
      /* stockage indisponible : la grille reste utilisable en mémoire */
    }
  }, [draft, sector])

  function patch(update: (current: GridDraft) => GridDraft) {
    setDraft((current) => ({ ...update(current), updatedAt: new Date().toISOString() }))
  }

  const leverTotals = useMemo(
    () =>
      grid.levers.map((l) => {
        const scored = l.questions.map((q) => draft.scores[q.id] ?? 0)
        const total = scored.reduce((acc, n) => acc + n, 0)
        const answered = scored.filter((n) => n > 0).length
        return { id: l.id, total, answered, max: l.questions.length * 5 }
      }),
    [grid.levers, draft.scores],
  )

  const qualificationTotal = useMemo(
    () => grid.criteria.reduce((acc, c) => acc + (draft.criteria[c.id]?.note ?? 0), 0),
    [grid.criteria, draft.criteria],
  )

  const reading = grid.readings.find((r) => qualificationTotal >= r.min && qualificationTotal <= r.max)

  function setField(id: string, value: string) {
    patch((d) => ({ ...d, fields: { ...d.fields, [id]: value } }))
  }

  function setAnswer(id: string, value: string) {
    patch((d) => ({ ...d, answers: { ...d.answers, [id]: value } }))
  }

  function setScore(id: string, value: number) {
    patch((d) => {
      const scores = { ...d.scores }
      if (value === 0) delete scores[id]
      else scores[id] = value
      return { ...d, scores }
    })
  }

  function setCharge(id: string, key: keyof GridChargeDraft, value: string) {
    patch((d) => ({
      ...d,
      charges: {
        ...d.charges,
        [id]: { ...emptyCharge(), ...d.charges[id], [key]: value },
      },
    }))
  }

  function setCriterion(id: string, note: number, comment?: string) {
    patch((d) => ({
      ...d,
      criteria: {
        ...d.criteria,
        [id]: { note, comment: comment ?? d.criteria[id]?.comment ?? '' },
      },
    }))
  }

  function buildRows(): [string, string, string][] {
    const rows: [string, string, string][] = []
    rows.push(['En-tête', 'Grille', grid.title])
    rows.push(['En-tête', 'Contexte', grid.context])
    grid.structureFields.forEach((f) => rows.push(['Structure', f.label, draft.fields[f.id] ?? '']))
    grid.documents.forEach((d) => rows.push(['Documents demandés', d, draft.documents[d] ? 'Reçu' : 'Non reçu']))
    grid.levers.forEach((l, i) => {
      const total = leverTotals[i]
      rows.push([`Levier ${i + 1}`, `${l.name} — score`, `${total.total} / ${total.max}`])
      l.questions.forEach((q, qi) => {
        rows.push([`Levier ${i + 1} · Q${qi + 1}`, q.text, draft.answers[q.id] ?? ''])
        rows.push([`Levier ${i + 1} · Q${qi + 1}`, 'Score /5', String(draft.scores[q.id] ?? '')])
      })
      rows.push([`Levier ${i + 1}`, 'Point clé à retenir', draft.keyPoints[l.id] ?? ''])
    })
    grid.chargeRows.forEach((c) => {
      const entry = draft.charges[c.id]
      rows.push(['Charges', c.poste, entry?.fournisseur ?? ''])
      rows.push(['Charges', `${c.poste} — coût annuel HT`, entry?.cost ?? ''])
      rows.push(['Charges', `${c.poste} — échéance`, entry?.due ?? ''])
      rows.push(['Charges', `${c.poste} — observations`, entry?.notes ?? ''])
    })
    grid.synthRows.forEach((s) => rows.push(['Synthèse', s.label, draft.synth[s.id] ?? '']))
    grid.criteria.forEach((c) => {
      const entry = draft.criteria[c.id]
      rows.push(['Qualification', c.label, String(entry?.note ?? '')])
      rows.push(['Qualification', `${c.label} — commentaire`, entry?.comment ?? ''])
    })
    rows.push(['Qualification', 'Score total', `${qualificationTotal} / ${grid.criteria.length * 2}`])
    rows.push(['Qualification', 'Lecture du score', `Lecture du score (${grid.readingsNote})`])
    rows.push(['Décision', 'Recommandation', draft.decision])
    rows.push(['Décision', 'Précisions', draft.decisionNotes])
    rows.push(['Décision', 'Prochain rendez-vous / relance', draft.nextStep])
    return rows
  }

  function exportCsv() {
    const header = ['Section', 'Rubrique', 'Valeur']
    const body = buildRows().map((r) => r.map(csvCell).join(','))
    download(`grille-starter-${sector}-${new Date().toISOString().slice(0, 10)}.csv`, [header.join(','), ...body].join('\n'), 'text/csv;charset=utf-8')
  }

  function exportJson() {
    const payload = {
      meta: {
        titre: grid.title,
        contexte: grid.context,
        secteur: SECTOR_LABEL[sector],
        exporteLe: new Date().toISOString(),
        derniereModification: draft.updatedAt,
      },
      releves: {
        structure: grid.structureFields.map((f) => ({ rubrique: f.label, valeur: draft.fields[f.id] ?? '' })),
        documents: grid.documents.map((d) => ({ document: d, recu: Boolean(draft.documents[d]) })),
        leviers: grid.levers.map((l, i) => ({
          levier: l.name,
          score: leverTotals[i].total,
          maximum: leverTotals[i].max,
          pointCle: draft.keyPoints[l.id] ?? '',
          questions: l.questions.map((q) => ({
            numero: q.id,
            question: q.text,
            reponse: draft.answers[q.id] ?? '',
            score: draft.scores[q.id] ?? null,
          })),
        })),
        charges: grid.chargeRows.map((c) => ({
          poste: c.poste,
          fournisseur: draft.charges[c.id]?.fournisseur ?? '',
          coutAnnuelHT: draft.charges[c.id]?.cost ?? '',
          echeance: draft.charges[c.id]?.due ?? '',
          observations: draft.charges[c.id]?.notes ?? '',
        })),
        synthese: grid.synthRows.map((s) => ({ rubrique: s.label, contenu: draft.synth[s.id] ?? '' })),
        qualification: {
          criteres: grid.criteria.map((c) => ({
            critere: c.label,
            note: draft.criteria[c.id]?.note ?? 0,
            commentaire: draft.criteria[c.id]?.comment ?? '',
          })),
          scoreTotal: qualificationTotal,
          maximum: grid.criteria.length * 2,
          lecture: grid.readings,
          recommandation: reading?.action ?? '',
        },
        decision: {
          recommandation: draft.decision,
          precisions: draft.decisionNotes,
          prochainRendezVous: draft.nextStep,
        },
      },
    }
    download(
      `grille-starter-${sector}-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(payload, null, 2),
      'application/json',
    )
  }

  function reset() {
    if (typeof window !== 'undefined' && !window.confirm('Effacer toutes les réponses de cette grille ?')) return
    patch(() => emptyDraft(sector))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-ink-100 bg-white p-3">
        {SECTOR_ORDER.map((s) => (
          <Link
            key={s}
            to="/admin/grille"
            search={{ secteur: s }}
            className={cn(
              'rounded-full border px-4 py-2 text-sm font-semibold transition',
              s === sector
                ? 'border-ink-950 bg-ink-950 text-white'
                : 'border-ink-200 text-ink-600 hover:border-ink-400 hover:text-ink-950',
            )}
          >
            {SECTOR_LABEL[s]}
          </Link>
        ))}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            <Printer className="h-3.5 w-3.5" />
            Imprimer
          </Button>
          <Button size="sm" variant="outline" onClick={exportCsv}>
            <Download className="h-3.5 w-3.5" />
            CSV
          </Button>
          <Button size="sm" variant="outline" onClick={exportJson}>
            <FileJson className="h-3.5 w-3.5" />
            JSON
          </Button>
          <Button size="sm" variant="ghost" onClick={reset}>
            <RotateCcw className="h-3.5 w-3.5" />
            Réinitialiser
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader
          title={grid.title}
          description={grid.context}
          action={<Badge tone="warning">Usage interne</Badge>}
        />
        <CardBody className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {grid.structureFields.map((field) => (
              <Field key={field.id} label={field.label}>
                {field.type === 'select' ? (
                  <Select value={draft.fields[field.id] ?? ''} onChange={(e) => setField(field.id, e.target.value)}>
                    <option value="">{field.placeholder}</option>
                    {field.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    type={field.type === 'date' ? 'date' : 'text'}
                    value={draft.fields[field.id] ?? ''}
                    placeholder={field.placeholder}
                    onChange={(e) => setField(field.id, e.target.value)}
                  />
                )}
              </Field>
            ))}
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-950">Avant le rendez-vous : documents à demander</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {grid.documents.map((doc) => {
                const checked = Boolean(draft.documents[doc])
                return (
                  <button
                    key={doc}
                    type="button"
                    onClick={() =>
                      patch((d) => ({ ...d, documents: { ...d.documents, [doc]: !d.documents[doc] } }))
                    }
                    className={cn(
                      'flex items-start gap-2.5 rounded-xl border px-3 py-2.5 text-left text-sm transition',
                      checked
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                        : 'border-ink-200 bg-white text-ink-700 hover:border-ink-400',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[0.6rem] font-bold',
                        checked ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-ink-300 text-transparent',
                      )}
                    >
                      ✓
                    </span>
                    {doc}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-950">Déroulé (90 minutes)</p>
            <TableWrap className="mt-3">
              <thead>
                <tr>
                  <Th>Durée</Th>
                  <Th>Bloc</Th>
                  <Th>Objectif</Th>
                </tr>
              </thead>
              <tbody>
                {grid.steps.map((step) => (
                  <Tr key={step.range}>
                    <Td>
                      <span className="whitespace-nowrap font-medium text-ink-900">{step.range}</span>
                    </Td>
                    <Td>
                      <span className="font-medium text-ink-900">{step.block}</span>
                      <span className="block text-xs text-ink-500">{step.duration}</span>
                    </Td>
                    <Td>{step.objective}</Td>
                  </Tr>
                ))}
              </tbody>
            </TableWrap>
          </div>

          <Alert tone="warning" title={sector === 'sante' ? 'Notre engagement pour votre structure' : `Garde-fous ${SECTOR_LABEL[sector]}`} icon={<ShieldCheck className="h-4 w-4" />}>
            {sector === 'sante' ? <p className="mb-3">Notre analyse porte sur l’organisation, la gestion et la performance de votre structure — jamais sur la prise en charge médicale de vos patients.</p> : null}
            <ul className="mt-1 list-disc space-y-1 pl-4">
              {grid.guardrails.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </Alert>
        </CardBody>
      </Card>

      {grid.levers.map((l, index) => {
        const totals = leverTotals[index]
        return (
          <Card key={l.id}>
            <CardHeader
              title={`Levier ${index + 1} · ${l.name}`}
              description={l.scoreNote}
              action={
                <Badge tone={totals.total >= totals.max * 0.7 ? 'success' : totals.total > 0 ? 'warning' : 'neutral'}>
                  Score du levier : {totals.total} / {totals.max}
                </Badge>
              }
            />
            <CardBody className="space-y-4">
              <div className="space-y-3">
                {l.questions.map((q, qi) => (
                  <div key={q.id} className="rounded-xl border border-ink-100 p-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <p className="text-sm font-medium text-ink-900">
                        <span className="mr-2 text-ink-400">{qi + 1}.</span>
                        {q.text}
                      </p>
                      <div className="flex shrink-0 items-center gap-1">
                        {[1, 2, 3, 4, 5].map((n) => {
                          const active = draft.scores[q.id] === n
                          return (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setScore(q.id, active ? 0 : n)}
                              className={cn(
                                'h-8 w-8 rounded-lg border text-sm font-semibold transition',
                                active
                                  ? 'border-brand-600 bg-brand-600 text-white'
                                  : 'border-ink-200 text-ink-500 hover:border-ink-400 hover:text-ink-900',
                              )}
                            >
                              {n}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <Textarea
                      rows={2}
                      className="mt-2"
                      placeholder="Réponse et observations"
                      value={draft.answers[q.id] ?? ''}
                      onChange={(e) => setAnswer(q.id, e.target.value)}
                    />
                  </div>
                ))}
              </div>

              <Field label="Point clé à retenir">
                <Input
                  value={draft.keyPoints[l.id] ?? ''}
                  placeholder="Ce qu’il faut retenir de ce levier"
                  onChange={(e) =>
                    patch((d) => ({ ...d, keyPoints: { ...d.keyPoints, [l.id]: e.target.value } }))
                  }
                />
              </Field>
            </CardBody>
          </Card>
        )
      })}

      <Card>
        <CardHeader title="Charges récurrentes : relevé" description={grid.chargeIntro} />
        <CardBody>
          <TableWrap>
            <thead>
              <tr>
                <Th>Poste</Th>
                {GRID_CHARGE_HEADERS.map((h) => (
                  <Th key={h}>{h}</Th>
                ))}
              </tr>
            </thead>
            <tbody>
                {grid.chargeRows.map((c) => (
                  <Tr key={c.id}>
                    <Td>
                      <span className="font-medium text-ink-900">{c.poste}</span>
                    </Td>
                    <Td>
                      <Input
                        value={draft.charges[c.id]?.fournisseur ?? ''}
                        placeholder="Fournisseur"
                        onChange={(e) => setCharge(c.id, 'fournisseur', e.target.value)}
                      />
                    </Td>
                    <Td>
                      <Input
                        value={draft.charges[c.id]?.cost ?? ''}
                        placeholder="0 DH"
                        onChange={(e) => setCharge(c.id, 'cost', e.target.value)}
                      />
                    </Td>
                    <Td>
                      <Input
                        value={draft.charges[c.id]?.due ?? ''}
                        placeholder="JJ/MM"
                        onChange={(e) => setCharge(c.id, 'due', e.target.value)}
                      />
                    </Td>
                    <Td>
                      <Input
                        value={draft.charges[c.id]?.notes ?? ''}
                        placeholder="Observations"
                        onChange={(e) => setCharge(c.id, 'notes', e.target.value)}
                      />
                    </Td>
                  </Tr>
                ))}
            </tbody>
          </TableWrap>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Synthèse du diagnostic" description="À remplir avec le client avant la fin du rendez-vous." />
        <CardBody className="space-y-4">
          {grid.synthRows.map((s) => (
            <Field key={s.id} label={s.label}>
              <Textarea
                rows={s.lines}
                value={draft.synth[s.id] ?? ''}
                onChange={(e) =>
                  patch((d) => ({ ...d, synth: { ...d.synth, [s.id]: e.target.value } }))
                }
              />
            </Field>
          ))}
        </CardBody>
      </Card>

      <Card className="border-amber-300">
        <CardHeader
          title="Qualification commerciale"
          description="Ne pas montrer au client."
          action={<Badge tone="warning">{qualificationTotal} / {grid.criteria.length * 2}</Badge>}
        />
        <CardBody className="space-y-4">
          <p className="text-sm text-ink-600">{grid.criteriaNote}</p>

          <div className="space-y-3">
            {grid.criteria.map((c) => {
              const entry = draft.criteria[c.id]
              return (
                <div key={c.id} className="rounded-xl border border-ink-100 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-medium text-ink-900">{c.label}</p>
                    <div className="flex items-center gap-1">
                      {[0, 1, 2].map((n) => {
                        const active = (entry?.note ?? 0) === n
                        return (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setCriterion(c.id, n)}
                            className={cn(
                              'h-8 w-8 rounded-lg border text-sm font-semibold transition',
                              active
                                ? 'border-ink-950 bg-ink-950 text-white'
                                : 'border-ink-200 text-ink-500 hover:border-ink-400 hover:text-ink-900',
                            )}
                          >
                            {n}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <Input
                    className="mt-2"
                    placeholder="Commentaire"
                    value={entry?.comment ?? ''}
                    onChange={(e) => setCriterion(c.id, entry?.note ?? 0, e.target.value)}
                  />
                </div>
              )
            })}
          </div>

          <div className="rounded-xl bg-ink-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
              Lecture du score ({grid.readingsNote})
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-600">
              {grid.readings.map((r) => (
                <li key={r.range} className={cn(reading?.range === r.range && 'font-semibold text-ink-950')}>
                  <span className="inline-block w-20 font-semibold">{r.range}</span>
                  {r.action}
                </li>
              ))}
            </ul>
            {reading ? (
              <p className="mt-3 flex items-start gap-2 text-sm font-semibold text-brand-700">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                {reading.action}
              </p>
            ) : null}
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-950">Décision</p>
            <TableWrap className="mt-3">
              <thead>
                <tr>
                  <Th>Rubrique</Th>
                  <Th>Précisions</Th>
                </tr>
              </thead>
              <tbody>
                <Tr>
                  <Td>
                    <span className="font-medium text-ink-900">Score total</span>
                  </Td>
                  <Td>
                    <span className="text-sm font-semibold text-ink-950">
                      {qualificationTotal} / {grid.criteria.length * 2}
                    </span>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <span className="font-medium text-ink-900">Recommandation</span>
                    <span className="block text-xs text-ink-500">
                      {grid.decisions.join(' · ')}
                    </span>
                  </Td>
                  <Td>
                    <Select
                      value={draft.decision}
                      onChange={(e) => patch((d) => ({ ...d, decision: e.target.value }))}
                    >
                      <option value="">Sélectionnez</option>
                      {grid.decisions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </Select>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <span className="font-medium text-ink-900">Prochain rendez-vous / relance</span>
                  </Td>
                  <Td>
                    <Input
                      type="date"
                      value={draft.nextStep}
                      onChange={(e) => patch((d) => ({ ...d, nextStep: e.target.value }))}
                    />
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <span className="font-medium text-ink-900">Précisions</span>
                  </Td>
                  <Td>
                    <Textarea
                      rows={2}
                      placeholder="Engagements, qui fait quoi, pour quand"
                      value={draft.decisionNotes}
                      onChange={(e) => patch((d) => ({ ...d, decisionNotes: e.target.value }))}
                    />
                  </Td>
                </Tr>
              </tbody>
            </TableWrap>
          </div>
        </CardBody>
      </Card>

      <p className="text-center text-xs text-ink-400">
        Brouillon enregistré automatiquement dans ce navigateur · dernière modification{' '}
        {new Date(draft.updatedAt).toLocaleString('fr-FR')} · {GRID_SCORE_NOTE}
      </p>
    </div>
  )
}
