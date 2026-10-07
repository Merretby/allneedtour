import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Target } from 'lucide-react'
import { PageHeader } from '@/components/layouts'
import { useDemo } from '@/store/store'
import { buildObjectives, buildNextActions } from '@/lib/operational'
import { WorkflowStrip } from '@/components/OperationalUX'

export const Route = createFileRoute('/app/objectifs')({ component: ObjectivesPage })

function ObjectivesPage() {
  const { state, orgId } = useDemo()
  const objectives = buildObjectives(state, orgId)
  const actions = buildNextActions(state, orgId)
  return <>
    <PageHeader eyebrow="Objectifs" title="Commencez par ce que vous voulez obtenir." description="Les quatre métiers ALLNEEDS restent des moteurs de réponse derrière l’expérience : vous naviguez par objectifs, problèmes et actions." />
    <WorkflowStrip compact />
    <div className="objective-detail-grid">
      {objectives.map((o) => <section className="objective-detail-card" key={o.id}>
        <div className="objective-detail-icon"><Target size={19}/></div>
        <span>{o.engine}</span><h2>{o.title}</h2><p>{o.description}</p>
        <div className="objective-detail-metrics"><div><strong>{o.activeNeeds}</strong><small>besoins actifs</small></div><div><strong>{o.activeMissions}</strong><small>missions actives</small></div></div>
        <div className="objective-related-actions">
          <small>Actions actuellement visibles</small>
          {actions.filter((a) => o.links.some((link) => a.to.startsWith(link))).slice(0,2).map((a)=><Link key={a.id} to={a.to as any}>{a.title}<ArrowRight size={14}/></Link>)}
          {!actions.some((a) => o.links.some((link) => a.to.startsWith(link))) ? <p>Aucune action active reliée à cet objectif dans les données de démonstration.</p> : null}
        </div>
      </section>)}
    </div>
  </>
}
