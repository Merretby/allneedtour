import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Bell, Briefcase, FileCheck2, Inbox, Target, UsersRound } from 'lucide-react'
import { PageHeader } from '@/components/layouts'
import { WorkflowStrip, NextActionCard, EmptyNextAction } from '@/components/OperationalUX'
import { useDemo } from '@/store/store'
import { buildNextActions, buildObjectives, resolveSituation, situationLabel, missionProgress } from '@/lib/operational'
import { Badge, Progress } from '@/components/ui'

export const Route = createFileRoute('/app/')({
  component: ClientCockpit,
  head: () => ({ meta: [{ title: 'Cockpit — ALLNEEDS' }] }),
})

function ClientCockpit() {
  const { state, orgId, user } = useDemo()
  const org = state.orgs.find((o) => o.id === orgId)
  const nextActions = buildNextActions(state, orgId)
  const objectives = buildObjectives(state, orgId)
  const situation = resolveSituation(state)
  const activeNeeds = state.needs.filter((n) => n.orgId === orgId && !['clos', 'signe'].includes(n.status))
  const activeMissions = state.missions.filter((m) => m.orgId === orgId && m.status !== 'terminee')
  const pendingDocs = state.documents.filter((d) => d.orgId === orgId && d.required && d.status !== 'valide')
  const unreadNotifs = state.notifications.filter((n) => !n.read).length

  return (
    <div className="operational-cockpit">
      <PageHeader
        eyebrow={`${situationLabel(situation)} · ${org?.sector ?? ''}`}
        title={`Bonjour ${user.name.split(' ')[0]}. Voici ce qui mérite votre attention.`}
        description={`${org?.name ?? 'Votre entreprise'} · ${org?.city ?? ''} · ${org?.kind ?? ''} · Vue ${state.clientWorkspaceRole}`}
        actions={<Link to="/app/notifications" className="cockpit-notif-link"><Bell size={16}/>{unreadNotifs ? `${unreadNotifs} notification${unreadNotifs > 1 ? 's' : ''}` : 'Notifications'}</Link>}
      />

      <section className="cockpit-hero-grid">
        <div>
          <p className="cockpit-label">ONE NEXT ACTION</p>
          {nextActions[0] ? <NextActionCard action={nextActions[0]} featured /> : <EmptyNextAction />}
        </div>
        <aside className="cockpit-context-card">
          <span>Votre contexte</span>
          <h2>{situationLabel(situation)}</h2>
          <p>ALLNEEDS adapte la lecture aux besoins, aux actions en cours et aux résultats réellement présents dans votre espace.</p>
          <div className="cockpit-context-stats">
            <div><strong>{activeNeeds.length}</strong><small>besoins actifs</small></div>
            <div><strong>{activeMissions.length}</strong><small>missions actives</small></div>
            <div><strong>{pendingDocs.length}</strong><small>documents requis</small></div>
          </div>
        </aside>
      </section>

      <section className="cockpit-section">
        <div className="cockpit-section-heading"><div><span>BOUCLE PRODUIT</span><h2>Du besoin à l’optimisation</h2></div><p>La plateforme organise la complexité derrière une chaîne de décision simple.</p></div>
        <WorkflowStrip />
      </section>

      <section className="cockpit-section">
        <div className="cockpit-section-heading"><div><span>VOS PRIORITÉS</span><h2>Objectifs plutôt que modules</h2></div><Link to="/app/objectifs">Voir tous les objectifs <ArrowRight size={14}/></Link></div>
        <div className="objective-grid">
          {objectives.map((objective) => (
            <Link to="/app/objectifs" key={objective.id} className="objective-card">
              <span>{objective.engine}</span>
              <h3>{objective.title}</h3>
              <p>{objective.description}</p>
              <div><strong>{objective.activeNeeds + objective.activeMissions}</strong><small>élément{objective.activeNeeds + objective.activeMissions > 1 ? 's' : ''} actif{objective.activeNeeds + objective.activeMissions > 1 ? 's' : ''} lié{objective.activeNeeds + objective.activeMissions > 1 ? 's' : ''}</small></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="cockpit-section cockpit-two-columns">
        <div>
          <div className="cockpit-section-heading compact"><div><span>ACTIONS</span><h2>Les 3 prochaines</h2></div><Link to="/app/actions">Tout voir</Link></div>
          <div className="next-action-stack">
            {nextActions.slice(1, 4).map((action) => <NextActionCard key={action.id} action={action} />)}
            {nextActions.length <= 1 ? <EmptyNextAction /> : null}
          </div>
        </div>
        <div>
          <div className="cockpit-section-heading compact"><div><span>PROJETS</span><h2>Missions en cours</h2></div><Link to="/app/projets">Tout voir</Link></div>
          <div className="mission-snapshot-list">
            {activeMissions.slice(0, 4).map((mission) => (
              <Link to={`/app/missions/${mission.id}` as any} className="mission-snapshot" key={mission.id}>
                <div className="mission-snapshot-top"><div><Badge tone="brand">{mission.code}</Badge><strong>{mission.title}</strong></div><span>{missionProgress(mission)}%</span></div>
                <Progress value={missionProgress(mission)} />
                <small>{mission.owner} · {mission.milestones.filter((m) => m.status === 'fait').length}/{mission.milestones.length} jalons terminés</small>
              </Link>
            ))}
            {!activeMissions.length ? <div className="simple-empty"><Briefcase size={20}/><span>Aucune mission active.</span></div> : null}
          </div>
        </div>
      </section>

      <section className="cockpit-quick-nav">
        <Link to="/app/besoins"><Inbox/><span><strong>Exprimer un besoin</strong><small>Qualifier le problème avant la solution.</small></span></Link>
        <Link to="/app/equipe"><UsersRound/><span><strong>Équipe & responsabilités</strong><small>Voir qui intervient dans votre parcours.</small></span></Link>
        <Link to="/app/ecosysteme"><Target/><span><strong>Écosystème</strong><small>Experts et partenaires reliés à vos besoins.</small></span></Link>
        <Link to="/app/performance"><FileCheck2/><span><strong>Performance</strong><small>Mesures issues de vos données réelles.</small></span></Link>
      </section>
    </div>
  )
}
