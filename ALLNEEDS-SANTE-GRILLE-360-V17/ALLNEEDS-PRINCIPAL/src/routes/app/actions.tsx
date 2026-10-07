import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/layouts'
import { useDemo } from '@/store/store'
import { buildNextActions } from '@/lib/operational'
import { NextActionCard, EmptyNextAction } from '@/components/OperationalUX'

export const Route = createFileRoute('/app/actions')({ component: ActionsPage })
function ActionsPage(){
 const {state,orgId}=useDemo(); const actions=buildNextActions(state,orgId)
 return <><PageHeader eyebrow="Actions" title="Que devez-vous faire maintenant ?" description="Chaque élément relie une information à une décision, une action et un résultat attendu."/><div className="next-action-stack wide">{actions.map((a,i)=><NextActionCard key={a.id} action={a} featured={i===0}/>)}{!actions.length?<EmptyNextAction/>:null}</div></>
}
