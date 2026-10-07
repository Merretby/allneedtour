import { createFileRoute } from '@tanstack/react-router'
import { ConciergeGuard, ConciergeHeading, OrgIdentity, ScopedEmpty } from '@/features/concierge/ScopedSection'
import { conciergeScope, useDemo } from '@/store/store'
import { Badge, Button, Card, Meter } from '@/components/ui'

export const Route = createFileRoute('/concierge/diagnostics')({ component: ConciergeDiagnostics })
function ConciergeDiagnostics(){
 const {state,dispatch}=useDemo(); const {orgIds}=conciergeScope(state); const items=state.diagnostics.filter(x=>orgIds.has(x.orgId))
 return <ConciergeGuard><ConciergeHeading eyebrow="Diagnostic" title="Diagnostics du portefeuille" description="Brouillons, revues et diagnostics publiés pour les entreprises qui vous sont confiées."/><div className="mt-8 space-y-4">{items.map(item=><Card key={item.id} className="p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><OrgIdentity orgId={item.orgId}/><p className="mt-3 font-semibold text-ink-950">{item.ref}</p><p className="text-xs text-ink-500">{item.author} · {new Date(item.createdAt).toLocaleDateString('fr-FR')}</p></div><div className="flex items-center gap-2"><Badge tone={item.status==='publie'?'success':'warning'}>{item.status==='publie'?'Publié':'En revue'}</Badge>{item.status!=='publie'?<Button size="sm" variant="outline" onClick={()=>dispatch({type:'DIAGNOSTIC_PUBLISH',id:item.id})}>Publier</Button>:<Button size="sm" variant="outline" onClick={()=>dispatch({type:'DIAGNOSTIC_BACK_TO_REVIEW',id:item.id})}>Remettre en revue</Button>}</div></div><div className="mt-4 flex flex-wrap gap-4">{item.scores.map(score=><div key={score.lever}><p className="mb-1 text-xs text-ink-500">{score.lever}</p><Meter value={score.score}/></div>)}</div></Card>)}{!items.length&&<ScopedEmpty/>}</div></ConciergeGuard>
}
