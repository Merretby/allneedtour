import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { KeyRound, PlusCircle, ShieldCheck, UserRoundCog } from 'lucide-react'
import { Badge, Button, Card, Checkbox, Field, Input, SectionHeading } from '@/components/ui'
import { SECTOR_LABEL, SECTOR_ORDER } from '@/data/catalog'
import { useDemo } from '@/store/store'
import type { Sector } from '@/types'

export const Route = createFileRoute('/admin/concierges')({ component: AdminConcierges })

function AdminConcierges() {
  const { state, dispatch } = useDemo()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  function create(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.includes('@')) return
    dispatch({ type: 'CONCIERGE_CREATE', account: { id: `conc-${Date.now()}`, name: name.trim(), email: email.trim(), active: true, sectors: [], assignedOrgIds: [], createdOrgIds: [] } })
    setName(''); setEmail('')
  }

  return <div className="container-app py-8">
    <SectionHeading eyebrow="Administration" title="Concierges & droits d’accès" description="L’administrateur crée les comptes concierge, choisit les secteurs visibles, attribue les entreprises et décide quels espaces SaaS deviennent réellement utilisables." />

    <div className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <Card className="p-6">
        <div className="flex items-center gap-3"><UserRoundCog className="h-5 w-5 text-brand-700" /><h2 className="font-semibold text-ink-950">Créer un concierge</h2></div>
        <form className="mt-5 space-y-4" onSubmit={create}>
          <Field label="Nom complet" required><Input value={name} onChange={(e) => setName(e.target.value)} required /></Field>
          <Field label="E-mail de connexion" required><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
          <Button type="submit"><PlusCircle className="h-4 w-4" /> Créer le compte</Button>
        </form>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3"><KeyRound className="h-5 w-5 text-brand-700" /><div><h2 className="font-semibold text-ink-950">Activation SaaS par entreprise</h2><p className="text-xs text-ink-500">Le client voit uniquement son secteur. Son espace métier reste grisé et non cliquable jusqu’à activation ici.</p></div></div>
        <div className="mt-5 space-y-3">
          {state.orgs.map((org) => { const open = state.saasAccessByOrg[org.id] ?? false; return <label key={org.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-ink-200 p-4">
            <div><div className="flex items-center gap-2"><span className="text-sm font-semibold text-ink-900">{org.name}</span><Badge tone="neutral">{SECTOR_LABEL[org.sector]}</Badge><Badge tone={open ? 'success' : 'neutral'}>{open ? 'Ouvert' : 'Verrouillé'}</Badge></div><p className="mt-1 text-xs text-ink-500">{org.kind} · {org.city}</p></div>
            <Checkbox checked={open} onChange={(e) => dispatch({ type: 'SAAS_SET_ORG_ACCESS', orgId: org.id, value: e.target.checked })} label="Autoriser le SaaS" />
          </label> })}
        </div>
      </Card>
    </div>

    <div className="mt-8 space-y-5">
      {state.concierges.map((concierge) => <Card key={concierge.id} className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><div className="flex items-center gap-2"><h3 className="font-semibold text-ink-950">{concierge.name}</h3><Badge tone={concierge.active ? 'success' : 'neutral'}>{concierge.active ? 'Actif' : 'Suspendu'}</Badge></div><p className="mt-1 text-xs text-ink-500">{concierge.email}</p></div>
          <Button size="sm" variant="outline" onClick={() => dispatch({ type: 'CONCIERGE_TOGGLE', id: concierge.id })}>{concierge.active ? 'Suspendre' : 'Réactiver'}</Button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div><p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Secteurs autorisés</p><div className="mt-3 space-y-2">{SECTOR_ORDER.map((sector) => <Checkbox key={sector} checked={concierge.sectors.includes(sector)} onChange={(e) => dispatch({ type: 'CONCIERGE_ASSIGN_SECTOR', id: concierge.id, sector, value: e.target.checked })} label={SECTOR_LABEL[sector]} />)}</div></div>
          <div><p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Entreprises attribuées</p><div className="mt-3 space-y-2">{state.orgs.map((org) => <label key={org.id} className="flex items-center justify-between gap-3 rounded-lg border border-ink-100 px-3 py-2"><Checkbox checked={concierge.assignedOrgIds.includes(org.id)} onChange={(e) => dispatch({ type: 'CONCIERGE_ASSIGN_ORG', id: concierge.id, orgId: org.id, value: e.target.checked })} label={org.name} /><span className="text-[0.68rem] text-ink-400">{SECTOR_LABEL[org.sector]}</span></label>)}</div></div>
        </div>
        <div className="mt-5 rounded-xl bg-ink-50 p-4 text-xs leading-relaxed text-ink-600"><ShieldCheck className="mr-2 inline h-4 w-4 text-brand-700" />Même si une entreprise est attribuée, elle reste invisible si son secteur n’est pas autorisé. Les entreprises créées par le concierge restent rattachées à son portefeuille.</div>
      </Card>)}
    </div>
  </div>
}
