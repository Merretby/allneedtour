import { Link, createFileRoute } from '@tanstack/react-router'
import { Building2, CalendarDays, FileText, LockKeyhole, Mail, MapPin, Phone, PlusCircle, ShieldCheck, Tags, UsersRound } from 'lucide-react'
import { Badge, Button, Card, SectionHeading } from '@/components/ui'
import { SECTOR_LABEL } from '@/data/catalog'
import { conciergeScope, useDemo } from '@/store/store'

export const Route = createFileRoute('/concierge/')({ component: ConciergeDashboard })

function ConciergeDashboard() {
  const { state } = useDemo()
  const { concierge, orgs } = conciergeScope(state)

  return (
    <div className="container-app py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Espace concierge" title="Votre portefeuille autorisé" description="Vous voyez uniquement les entreprises et secteurs que l’administrateur vous a attribués, ainsi que les entreprises que vous avez vous-même apportées." />
        <Link to={"/concierge/entreprises" as any}><Button><PlusCircle className="h-4 w-4" /> Ajouter une entreprise</Button></Link>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card className="p-5"><UsersRound className="h-5 w-5 text-brand-700" /><p className="mt-3 text-3xl font-display text-ink-950">{orgs.length}</p><p className="text-xs text-ink-500">entreprises visibles</p></Card>
        <Card className="p-5"><ShieldCheck className="h-5 w-5 text-brand-700" /><p className="mt-3 text-3xl font-display text-ink-950">{concierge?.sectors.length ?? 0}</p><p className="text-xs text-ink-500">secteur(s) autorisé(s)</p></Card>
        <Card className="p-5"><LockKeyhole className="h-5 w-5 text-brand-700" /><p className="mt-3 text-sm font-semibold text-ink-950">Aucune vue globale</p><p className="mt-1 text-xs text-ink-500">Les autres entreprises ALLNEEDS restent invisibles.</p></Card>
      </div>

      <div className="mt-8 space-y-5">
        {orgs.map((org) => {
          const needs = state.needs.filter((item) => item.orgId === org.id)
          const missions = state.missions.filter((item) => item.orgId === org.id)
          const diagnostics = state.diagnostics.filter((item) => item.orgId === org.id)
          const meetings = state.meetings.filter((item) => item.orgId === org.id)
          const documents = state.documents.filter((item) => item.orgId === org.id)
          return (
            <Card key={org.id} className="overflow-hidden p-0">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-100 bg-white p-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2"><p className="text-xl font-bold text-ink-950">{org.name}</p><Badge tone="brand">{SECTOR_LABEL[org.sector]}</Badge></div>
                  <p className="mt-1 text-sm text-ink-500">{org.kind}</p>
                  <p className="mt-2 flex items-center gap-1 text-sm text-ink-600"><MapPin className="h-4 w-4" /> {org.city} · {org.size}</p>
                </div>
                <div className="flex flex-col items-end gap-3"><div className="rounded-xl bg-brand-50 px-4 py-3 text-right"><p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Suivi concierge</p><p className="mt-1 text-sm font-semibold text-ink-950">Dossier complet visible</p></div><Link to={'/concierge/entreprises/$id' as any} params={{ id: org.id } as any}><Button size="sm">Ouvrir le dossier complet</Button></Link></div>
              </div>

              <div className="grid gap-6 p-6 xl:grid-cols-[1.05fr_1fr]">
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400">Contact principal</p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <p className="text-sm text-ink-700"><strong className="text-ink-950">{org.contactName}</strong><br/><span className="text-ink-500">{org.contactRole}</span></p>
                      <div className="space-y-2 text-sm text-ink-600"><p className="flex items-center gap-2"><Mail className="h-4 w-4 text-brand-700" /> {org.contactEmail}</p><p className="flex items-center gap-2"><Phone className="h-4 w-4 text-brand-700" /> {org.contactPhone}</p></div>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400">Contexte & notes</p>
                    <p className="mt-2 rounded-xl bg-ink-50 p-4 text-sm leading-relaxed text-ink-700">{org.notes || 'Aucune note enregistrée.'}</p>
                  </div>
                  <div>
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-ink-400"><Tags className="h-4 w-4" /> Tags</p>
                    <div className="mt-2 flex flex-wrap gap-2">{org.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-ink-100 p-4"><p className="text-2xl font-display text-ink-950">{needs.length}</p><p className="text-xs text-ink-500">besoins</p></div>
                    <div className="rounded-xl border border-ink-100 p-4"><p className="text-2xl font-display text-ink-950">{missions.length}</p><p className="text-xs text-ink-500">missions</p></div>
                    <div className="rounded-xl border border-ink-100 p-4"><p className="text-2xl font-display text-ink-950">{diagnostics.length}</p><p className="text-xs text-ink-500">diagnostics</p></div>
                    <div className="rounded-xl border border-ink-100 p-4"><p className="text-2xl font-display text-ink-950">{meetings.length}</p><p className="text-xs text-ink-500">rendez-vous</p></div>
                    <div className="rounded-xl border border-ink-100 p-4"><p className="text-2xl font-display text-ink-950">{documents.length}</p><p className="text-xs text-ink-500">documents</p></div>
                  </div>
                  <div className="rounded-xl border border-ink-100 p-4">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-ink-400"><CalendarDays className="h-4 w-4" /> Dates dossier</p>
                    <div className="mt-3 grid gap-2 text-sm text-ink-600 sm:grid-cols-2"><p><strong>Créé :</strong> {new Date(org.createdAt).toLocaleDateString('fr-FR')}</p><p><strong>Onboarding :</strong> {org.onboardedAt ? new Date(org.onboardedAt).toLocaleDateString('fr-FR') : 'À planifier'}</p></div>
                  </div>
                  <div className="rounded-xl border border-ink-100 p-4">
                    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-ink-400"><FileText className="h-4 w-4" /> Activité récente</p>
                    <div className="mt-3 space-y-2 text-sm text-ink-700">
                      {needs.slice(0,2).map((item)=><p key={item.id}>Besoin · <strong>{item.title}</strong> · {item.status}</p>)}
                      {missions.slice(0,2).map((item)=><p key={item.id}>Mission · <strong>{item.title}</strong> · {item.status}</p>)}
                      {!needs.length && !missions.length ? <p className="text-ink-500">Aucune activité enregistrée pour le moment.</p> : null}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
        {orgs.length === 0 ? <Card className="p-8 text-center"><Building2 className="mx-auto h-6 w-6 text-ink-400" /><p className="mt-3 font-semibold text-ink-900">Aucune entreprise attribuée</p><p className="mt-1 text-sm text-ink-500">L’administrateur doit vous donner un secteur et une entreprise.</p></Card> : null}
      </div>

    </div>
  )
}
