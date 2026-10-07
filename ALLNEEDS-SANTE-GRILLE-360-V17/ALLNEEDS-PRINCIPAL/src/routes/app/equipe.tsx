import { createFileRoute } from '@tanstack/react-router'
import { BriefcaseBusiness, UserRound, UsersRound } from 'lucide-react'
import { PageHeader } from '@/components/layouts'
import { useDemo } from '@/store/store'

export const Route = createFileRoute('/app/equipe')({ component: TeamPage })
function TeamPage(){
 const {state,orgId,user}=useDemo(); const org=state.orgs.find(o=>o.id===orgId); const missions=state.missions.filter(m=>m.orgId===orgId&&m.status!=='terminee'); const needs=state.needs.filter(n=>n.orgId===orgId&&!['clos','signe'].includes(n.status));
 const owners=Array.from(new Set([...missions.map(m=>m.owner),...needs.map(n=>n.assignedTo)])).filter(Boolean)
 return <><PageHeader eyebrow="Équipe" title="Responsabilités visibles, décisions plus simples." description="Le rôle doit déterminer l’expérience. Cette vue utilise uniquement les responsables déjà présents dans vos besoins et missions."/>
 <div className="team-responsibility-grid"><section><span className="role-icon"><UserRound/></span><small>DIRIGEANT</small><h2>{user.name}</h2><p>{org?.contactRole ?? 'Direction'} · décide, arbitre et valide les priorités.</p></section>{owners.map((owner)=><section key={owner}><span className="role-icon secondary"><BriefcaseBusiness/></span><small>RESPONSABLE / INTERVENANT</small><h2>{owner}</h2><p>Responsable explicitement affecté à au moins un besoin ou une mission active.</p></section>)}{!owners.length?<section><span className="role-icon secondary"><UsersRound/></span><small>ÉQUIPE</small><h2>Aucune affectation active</h2><p>Les responsables apparaîtront ici lorsqu’ils seront reliés aux actions.</p></section>:null}</div>
 <div className="role-principles"><h3>Principe de rôle</h3><div><strong>Dirigeant</strong><span>Situation globale, objectifs, priorités, décisions, résultats.</span></div><div><strong>Manager / responsable</strong><span>Périmètre, objectifs, actions, missions et problèmes opérationnels.</span></div><div><strong>Collaborateur</strong><span>Tâches, priorités, échéances et informations nécessaires au travail.</span></div></div></>
}
