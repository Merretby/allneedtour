import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { PageHeader } from '@/components/layouts'
import { useDemo } from '@/store/store'
import { missionProgress } from '@/lib/operational'
import { Badge, Progress } from '@/components/ui'

export const Route = createFileRoute('/app/projets')({ component: ProjectsPage })
function ProjectsPage(){const {state,orgId}=useDemo();const missions=state.missions.filter(m=>m.orgId===orgId);return <><PageHeader eyebrow="Projets" title="Vos dossiers transversaux." description="Les projets regroupent les missions existantes sans dupliquer leur logique. Chaque projet garde ses jalons, son responsable et sa progression."/><div className="project-list">{missions.map(m=><Link to={`/app/missions/${m.id}` as any} key={m.id} className="project-card"><div><Badge tone="brand">{m.code}</Badge><h2>{m.title}</h2><p>{m.owner} · {m.status}</p></div><div><Progress value={missionProgress(m)}/><span>{missionProgress(m)}%</span></div><ArrowRight/></Link>)}</div></>}
