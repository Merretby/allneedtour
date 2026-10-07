import { createFileRoute } from '@tanstack/react-router'
import { ConciergeGuard, ConciergeHeading, OrgIdentity, ScopedEmpty } from '@/features/concierge/ScopedSection'
import { conciergeScope, useDemo } from '@/store/store'
import { Badge, Card, Select } from '@/components/ui'
import { NEED_FLOW, NEED_STATUS } from '@/lib/status'

export const Route = createFileRoute('/concierge/besoins')({ component: ConciergeNeeds })
function ConciergeNeeds(){
 const {state,dispatch}=useDemo(); const {orgIds}=conciergeScope(state); const items=state.needs.filter(x=>orgIds.has(x.orgId))
 return <ConciergeGuard><ConciergeHeading eyebrow="Suivi opérationnel" title="Besoins des entreprises suivies" description="Même profondeur de suivi que l’administration, limitée à votre portefeuille."/><div className="mt-8 space-y-4">{items.map(item=>{const status=NEED_STATUS[item.status];return <Card key={item.id} className="p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><OrgIdentity orgId={item.orgId}/><p className="mt-3 text-base font-semibold text-ink-950">{item.title}</p><p className="mt-1 text-sm text-ink-500">{item.categoryLabel} · {item.location}</p><p className="mt-2 text-sm leading-relaxed text-ink-600">{item.description}</p></div><div className="flex items-center gap-2"><Badge tone={status.tone}>{status.label}</Badge><Select value={item.status} onChange={(e)=>dispatch({type:'NEED_SET_STATUS',id:item.id,status:e.target.value as any,label:'Statut mis à jour par le concierge'})} className="w-48">{[...NEED_FLOW,'clos' as const].map(v=><option key={v} value={v}>{NEED_STATUS[v].label}</option>)}</Select></div></div><div className="mt-4 flex flex-wrap gap-2 text-xs text-ink-500"><span>{item.candidateIds.length} prestataire(s)</span><span>·</span><span>{item.quoteIds.length} devis</span><span>·</span><span>Assigné à {item.assignedTo}</span></div></Card>})}{!items.length&&<ScopedEmpty/>}</div></ConciergeGuard>
}
