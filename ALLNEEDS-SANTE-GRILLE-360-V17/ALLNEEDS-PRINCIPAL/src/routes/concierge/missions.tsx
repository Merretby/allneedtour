import { createFileRoute } from '@tanstack/react-router'
import { ConciergeGuard, ConciergeHeading, OrgIdentity, ScopedEmpty } from '@/features/concierge/ScopedSection'
import { conciergeScope, useDemo } from '@/store/store'
import { Badge, Card, Progress, Select } from '@/components/ui'
import { MISSION_STATUS } from '@/lib/status'
import { money } from '@/lib/format'

export const Route = createFileRoute('/concierge/missions')({ component: ConciergeMissions })
function ConciergeMissions(){
 const {state,dispatch}=useDemo(); const {orgIds}=conciergeScope(state); const items=state.missions.filter(x=>orgIds.has(x.orgId))
 return <ConciergeGuard><ConciergeHeading eyebrow="Missions" title="Missions & livrables" description="Pilotage des missions des entreprises de votre portefeuille, sans accès aux autres comptes."/><div className="mt-8 space-y-4">{items.map(item=><Card key={item.id} className="p-5"><div className="flex flex-wrap justify-between gap-4"><div><OrgIdentity orgId={item.orgId}/><p className="mt-3 font-semibold text-ink-950">{item.code} · {item.title}</p><p className="text-xs text-ink-500">{item.owner}</p></div><div className="flex items-center gap-2"><Badge tone={MISSION_STATUS[item.status].tone}>{MISSION_STATUS[item.status].label}</Badge><Select value={item.status} onChange={(e)=>dispatch({type:'MISSION_SET_STATUS',id:item.id,status:e.target.value as any})} className="w-48">{Object.entries(MISSION_STATUS).map(([value,meta])=><option key={value} value={value}>{meta.label}</option>)}</Select></div></div><Progress className="mt-4" value={item.onboardingProgress} label="Avancement"/><div className="mt-4 grid gap-2 md:grid-cols-2">{item.milestones.map(ms=><div key={ms.id} className="rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-600">{ms.title} · {ms.status}</div>)}</div></Card>)}{!items.length&&<ScopedEmpty/>}</div></ConciergeGuard>
}
