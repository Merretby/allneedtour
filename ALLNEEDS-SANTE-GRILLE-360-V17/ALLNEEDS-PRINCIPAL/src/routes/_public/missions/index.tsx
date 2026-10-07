import { createFileRoute, redirect } from '@tanstack/react-router'
import { MissionIndex } from '@/components/MissionPage'
import type { Sector } from '@/types'

const SECTORS: Sector[] = ['enseignement', 'sante', 'tourisme']

export const Route = createFileRoute('/_public/missions/')({
  beforeLoad: () => { throw redirect({ to: '/tarifs' }) },
  validateSearch: (search: Record<string, unknown>): { secteur?: Sector } => {
    const value = String(search.secteur ?? 'enseignement')
    return { secteur: (SECTORS.includes(value as Sector) ? value : 'enseignement') as Sector }
  },
  component: MissionsIndex,
  head: () => ({
    meta: [
      { title: 'Missions STARTER, PRO et PERFORMANCE — ALLNEEDS' },
      {
        name: 'description',
        content:
          'Diagnostic 1h30, structuration 4 à 6 semaines, accompagnement 30 jours. Comparatif complet et limites écrites.',
      },
    ],
  }),
})

function MissionsIndex() {
  const { secteur } = Route.useSearch()
  return <MissionIndex sector={secteur ?? 'enseignement'} />
}
