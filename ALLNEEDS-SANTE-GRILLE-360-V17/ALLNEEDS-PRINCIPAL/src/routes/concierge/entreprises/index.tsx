import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { PlusCircle } from 'lucide-react'
import { Button, Card, Field, Input, Select, SectionHeading } from '@/components/ui'
import { conciergeScope, useDemo } from '@/store/store'
import type { Sector } from '@/types'

export const Route = createFileRoute('/concierge/entreprises/')({ component: ConciergeCompanies })

function ConciergeCompanies() {
  const { state, dispatch } = useDemo()
  const { concierge } = conciergeScope(state)
  const allowedSectors = concierge?.sectors ?? []
  const [sector, setSector] = useState<Sector>(allowedSectors[0] ?? 'sante')

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!concierge || !allowedSectors.includes(sector)) return
    const fd = new FormData(e.currentTarget)
    const id = `org-conc-${Date.now()}`
    dispatch({
      type: 'CONCIERGE_ADD_ORG',
      conciergeId: concierge.id,
      org: {
        id,
        name: String(fd.get('name')),
        sector,
        city: String(fd.get('city')),
        kind: String(fd.get('kind')),
        size: String(fd.get('size')),
        contactName: String(fd.get('contactName')),
        contactRole: String(fd.get('contactRole')),
        contactEmail: String(fd.get('contactEmail')),
        contactPhone: String(fd.get('contactPhone')),
        onboardedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        tags: ['Apport concierge'],
        notes: 'Entreprise créée depuis l’espace concierge.',
      },
    })
    e.currentTarget.reset()
  }

  return <div className="container-app py-8">
    <SectionHeading eyebrow="Entreprise apportée" title="Créer une fiche pour démarrer le suivi" description="Le concierge peut créer une entreprise uniquement dans un secteur que l’administrateur lui a autorisé." />
    <Card className="mt-8 p-6">
      <form onSubmit={submit} className="grid gap-5 md:grid-cols-2">
        <Field label="Entreprise" required><Input name="name" required /></Field>
        <Field label="Secteur" required><Select value={sector} onChange={(e) => setSector(e.target.value as Sector)}>{allowedSectors.map((s) => <option key={s} value={s}>{s}</option>)}</Select></Field>
        <Field label="Type de structure" required><Input name="kind" placeholder="Cabinet, centre, laboratoire…" required /></Field>
        <Field label="Ville" required><Input name="city" required /></Field>
        <Field label="Taille / effectif"><Input name="size" /></Field>
        <Field label="Nom du contact" required><Input name="contactName" required /></Field>
        <Field label="Fonction du contact"><Input name="contactRole" /></Field>
        <Field label="E-mail"><Input name="contactEmail" type="email" /></Field>
        <Field label="Téléphone"><Input name="contactPhone" /></Field>
        <div className="md:col-span-2"><Button type="submit"><PlusCircle className="h-4 w-4" /> Créer et ajouter à mon suivi</Button></div>
      </form>
    </Card>
  </div>
}
