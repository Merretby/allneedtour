import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/layouts'
import { useDemo } from '@/store/store'
import { missionProgress } from '@/lib/operational'
import { Progress } from '@/components/ui'

export const Route = createFileRoute('/app/performance')({ component: PerformancePage })
function PerformancePage(){
 const {state,orgId}=useDemo(); const needs=state.needs.filter(n=>n.orgId===orgId); const missions=state.missions.filter(m=>m.orgId===orgId); const diags=state.diagnostics.filter(d=>d.orgId===orgId&&d.status==='publie'); const closedNeeds=needs.filter(n=>['clos','signe'].includes(n.status)).length;
 return <><PageHeader eyebrow="Performance" title="Mesurer uniquement ce qui existe réellement." description="Aucun KPI n’est inventé : les indicateurs ci-dessous sont calculés à partir des besoins, missions et diagnostics présents dans cet espace."/>
 <div className="performance-kpis"><div><small>Besoins enregistrés</small><strong>{needs.length}</strong><span>{closedNeeds} clos ou signés</span></div><div><small>Missions</small><strong>{missions.length}</strong><span>{missions.filter(m=>m.status==='terminee').length} terminées</span></div><div><small>Diagnostics publiés</small><strong>{diags.length}</strong><span>Scores affichés uniquement quand renseignés</span></div><div><small>Documents validés</small><strong>{state.documents.filter(d=>d.orgId===orgId&&d.status==='valide').length}</strong><span>sur {state.documents.filter(d=>d.orgId===orgId).length} documents</span></div></div>
 <div className="performance-panels"><section><h2>Progression des missions</h2>{missions.map(m=><div className="performance-row" key={m.id}><div><strong>{m.title}</strong><small>{m.code} · {m.status}</small></div><Progress value={missionProgress(m)}/><b>{missionProgress(m)}%</b></div>)}</section><section><h2>Diagnostics publiés</h2>{diags.map(d=><div className="diagnostic-real-row" key={d.id}><div><strong>{d.ref}</strong><small>{d.priorities.length} priorité{d.priorities.length>1?'s':''}</small></div><div>{d.scores.map(s=><span key={s.lever}>{s.lever}: <b>{s.score}</b></span>)}</div></div>)}{!diags.length?<p className="muted-copy">Aucun diagnostic publié.</p>:null}</section></div></>
}
