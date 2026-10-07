import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, CalendarDays, FileText, Mail, MapPin, Phone, ShieldCheck, Tags, UserCheck } from 'lucide-react'
import { conciergeScope, orgHasSaasAccess, useDemo } from '@/store/store'
import { Badge, Card, CardBody, CardHeader, KeyValue, Progress, SectionHeading, Stat } from '@/components/ui'
import { SECTOR_LABEL } from '@/data/catalog'
import { MISSION_STATUS, NEED_STATUS } from '@/lib/status'
import { dateTime, money } from '@/lib/format'

export const Route = createFileRoute('/concierge/entreprises/$id')({ component: ConciergeCompanyDetail })

function ConciergeCompanyDetail(){
  const { id } = Route.useParams() as { id: string }
  const { state } = useDemo()
  const { orgIds } = conciergeScope(state)
  if (!orgIds.has(id)) throw notFound()
  const org = state.orgs.find((item) => item.id === id)
  if (!org) throw notFound()

  const needs = state.needs.filter((item) => item.orgId === org.id)
  const missions = state.missions.filter((item) => item.orgId === org.id)
  const diagnostics = state.diagnostics.filter((item) => item.orgId === org.id)
  const meetings = state.meetings.filter((item) => item.orgId === org.id).sort((a,b)=>b.at.localeCompare(a.at))
  const documents = state.documents.filter((item) => item.orgId === org.id)
  const threads = state.threads.filter((item) => item.orgId === org.id)
  const messages = state.messages.filter((item) => item.orgId === org.id)
  const deliverables = state.deliverables.filter((d) => missions.some((m) => m.id === d.missionId))
  const lead = state.leads.find((item) => item.convertedOrgId === org.id)
  const quotes = state.quotes.filter((quote) => needs.some((need) => need.id === quote.needId))
  const providerIds = new Set([...needs.flatMap((n)=>n.candidateIds), ...quotes.map((q)=>q.providerId)])
  const providers = state.providers.filter((p)=>providerIds.has(p.id))
  const saasEnabled = orgHasSaasAccess(state, org.id, org.sector)
  const missionValue = missions.reduce((sum,item)=>sum+item.price,0)

  return <div className="container-app py-8">
    <Link to={'/concierge' as any} className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-ink-500 hover:text-ink-950"><ArrowLeft className="h-4 w-4"/> Retour au portefeuille</Link>
    <div className="flex flex-wrap items-start justify-between gap-5">
      <SectionHeading eyebrow={`${SECTOR_LABEL[org.sector]} · ${org.city}`} title={org.name} description={`${org.kind} · ${org.size}`} />
      <div className="flex flex-wrap gap-2"><Badge tone={org.onboardedAt?'success':'warning'}>{org.onboardedAt?'Onboardé':'Onboarding à faire'}</Badge><Badge tone={saasEnabled?'success':'neutral'}>{saasEnabled?'SaaS activé':'SaaS verrouillé'}</Badge></div>
    </div>

    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <Stat label="Besoins" value={needs.length} hint={`${needs.filter(n=>!['signe','clos'].includes(n.status)).length} actifs`} tone="brand"/>
      <Stat label="Missions" value={missions.length} hint={`${money(missionValue)} HT`} tone="violet"/>
      <Stat label="Diagnostics" value={diagnostics.length} hint={`${diagnostics.filter(d=>d.status==='publie').length} publiés`} tone="info"/>
      <Stat label="Documents" value={documents.length} hint={`${documents.filter(d=>d.status!=='valide').length} à traiter`} tone="warning"/>
      <Stat label="Rendez-vous" value={meetings.length} hint={`${threads.length} conversation(s)`} tone="success"/>
    </div>

    <div className="mt-6 grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
      <aside className="space-y-6">
        <Card><CardHeader title="Fiche entreprise complète"/><CardBody className="space-y-3">
          <KeyValue label="Secteur">{SECTOR_LABEL[org.sector]}</KeyValue>
          <KeyValue label="Type">{org.kind}</KeyValue>
          <KeyValue label="Ville"><span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4"/>{org.city}</span></KeyValue>
          <KeyValue label="Taille / activité">{org.size}</KeyValue>
          <KeyValue label="Contact principal">{org.contactName}<span className="block text-xs text-ink-500">{org.contactRole}</span></KeyValue>
          <a href={`mailto:${org.contactEmail}`} className="flex items-center gap-2 text-sm text-ink-700 hover:text-brand-700"><Mail className="h-4 w-4"/>{org.contactEmail}</a>
          <a href={`tel:${org.contactPhone}`} className="flex items-center gap-2 text-sm text-ink-700 hover:text-brand-700"><Phone className="h-4 w-4"/>{org.contactPhone}</a>
          <div className="border-t border-ink-100 pt-3"><p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Notes</p><p className="mt-2 text-sm leading-relaxed text-ink-600">{org.notes||'Aucune note.'}</p></div>
          <div className="border-t border-ink-100 pt-3"><p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-400"><Tags className="h-4 w-4"/> Tags</p><div className="mt-2 flex flex-wrap gap-2">{org.tags.map(tag=><Badge key={tag}>{tag}</Badge>)}</div></div>
        </CardBody></Card>

        <Card><CardHeader title="Accès & statut"/><CardBody className="space-y-3">
          <KeyValue label="SaaS métier"><Badge tone={saasEnabled?'success':'neutral'}>{saasEnabled?'Activé':'Verrouillé'}</Badge></KeyValue>
          <KeyValue label="Abonnement démo">{state.subscription.tier} · {state.subscription.status}</KeyValue>
          <KeyValue label="Paiement">{state.subscription.payment}</KeyValue>
          <KeyValue label="Création">{new Date(org.createdAt).toLocaleDateString('fr-FR')}</KeyValue>
          <KeyValue label="Onboarding">{org.onboardedAt?new Date(org.onboardedAt).toLocaleDateString('fr-FR'):'À planifier'}</KeyValue>
          <p className="rounded-lg bg-ink-50 p-3 text-xs leading-relaxed text-ink-500">Le concierge visualise l’état d’accès mais ne peut pas s’attribuer de droits globaux. L’activation SaaS reste pilotée par l’administrateur.</p>
        </CardBody></Card>

        {lead?<Card><CardHeader title="Qualification commerciale"/><CardBody className="space-y-3"><KeyValue label="Score">{lead.score}/100</KeyValue><KeyValue label="Budget">{lead.budget?money(lead.budget):'—'}</KeyValue><KeyValue label="Prochaine action">{lead.nextAction}</KeyValue><p className="text-sm text-ink-600">{lead.notes}</p></CardBody></Card>:null}
      </aside>

      <div className="space-y-6">
        <Card><CardHeader title="Besoins" description="Demandes, prestataires proposés et devis."/><div className="divide-y divide-ink-50">{needs.map(n=>{const st=NEED_STATUS[n.status];return <div key={n.id} className="p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-semibold text-ink-950">{n.title}</p><p className="text-xs text-ink-500">{n.categoryLabel} · {n.candidateIds.length} prestataire(s) · {n.quoteIds.length} devis</p></div><Badge tone={st.tone}>{st.label}</Badge></div><p className="mt-2 text-sm text-ink-600">{n.description}</p></div>})}{!needs.length?<p className="p-5 text-sm text-ink-500">Aucun besoin.</p>:null}</div></Card>

        <Card><CardHeader title="Missions & livrables"/><div className="divide-y divide-ink-50">{missions.map(m=><div key={m.id} className="p-5"><div className="flex flex-wrap justify-between gap-3"><div><p className="font-semibold text-ink-950">{m.code} · {m.title}</p><p className="text-xs text-ink-500">{m.owner} · {money(m.price)} HT</p></div><Badge tone={MISSION_STATUS[m.status].tone}>{MISSION_STATUS[m.status].label}</Badge></div><Progress className="mt-3" value={m.onboardingProgress} label="Avancement"/><div className="mt-3 grid gap-2 md:grid-cols-2">{m.milestones.map(ms=><p key={ms.id} className="rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-600">{ms.title} · {ms.status}</p>)}</div></div>)}{!missions.length?<p className="p-5 text-sm text-ink-500">Aucune mission.</p>:null}</div></Card>

        <Card><CardHeader title="Diagnostics"/><div className="divide-y divide-ink-50">{diagnostics.map(d=><div key={d.id} className="p-5"><div className="flex justify-between gap-3"><div><p className="font-semibold text-ink-950">{d.ref}</p><p className="text-xs text-ink-500">{d.author} · {new Date(d.createdAt).toLocaleDateString('fr-FR')}</p></div><Badge tone={d.status==='publie'?'success':'warning'}>{d.status}</Badge></div><div className="mt-3 flex flex-wrap gap-2">{d.scores.map(s=><Badge key={s.lever}>{s.lever}: {s.score}/5</Badge>)}</div></div>)}{!diagnostics.length?<p className="p-5 text-sm text-ink-500">Aucun diagnostic.</p>:null}</div></Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card><CardHeader title="Rendez-vous"/><div className="divide-y divide-ink-50">{meetings.slice(0,6).map(m=><div key={m.id} className="p-4"><p className="flex items-center gap-2 font-semibold text-ink-950"><CalendarDays className="h-4 w-4"/>{m.title}</p><p className="mt-1 text-xs text-ink-500">{dateTime(m.at)} · {m.status}</p></div>)}{!meetings.length?<p className="p-4 text-sm text-ink-500">Aucun rendez-vous.</p>:null}</div></Card>
          <Card><CardHeader title="Documents"/><div className="divide-y divide-ink-50">{documents.slice(0,8).map(d=><div key={d.id} className="flex items-center justify-between gap-3 p-4"><div><p className="flex items-center gap-2 font-semibold text-ink-950"><FileText className="h-4 w-4"/>{d.name}</p><p className="text-xs text-ink-500">{d.comment||'Aucun commentaire'}</p></div><Badge tone={d.status==='valide'?'success':'warning'}>{d.status}</Badge></div>)}{!documents.length?<p className="p-4 text-sm text-ink-500">Aucun document.</p>:null}</div></Card>
        </div>

        <Card><CardHeader title="Prestataires, devis & échanges"/><CardBody><div className="grid gap-4 md:grid-cols-3"><div><p className="text-2xl font-display text-ink-950">{providers.length}</p><p className="text-xs text-ink-500">prestataires liés</p></div><div><p className="text-2xl font-display text-ink-950">{quotes.length}</p><p className="text-xs text-ink-500">devis</p></div><div><p className="text-2xl font-display text-ink-950">{messages.length}</p><p className="text-xs text-ink-500">messages</p></div></div><div className="mt-4 flex flex-wrap gap-2">{providers.map(p=><Badge key={p.id} tone="info">{p.name}</Badge>)}</div></CardBody></Card>

        <Card><CardHeader title="Périmètre concierge"/><CardBody><p className="flex items-start gap-2 text-sm leading-relaxed text-ink-600"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-700"/>Cette vue regroupe toutes les informations opérationnelles disponibles pour {org.name}. Les autres entreprises ALLNEEDS restent hors de votre périmètre, y compris par accès direct à une URL.</p></CardBody></Card>
      </div>
    </div>
  </div>
}
