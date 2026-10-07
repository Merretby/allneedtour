import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { MissionPage } from '@/components/MissionPage'
import type { MissionCode, Sector } from '@/types'

const SECTORS: Sector[] = ['enseignement', 'sante', 'tourisme']
const CODES: MissionCode[] = ['STARTER', 'PRO', 'PERFORMANCE']

export const Route = createFileRoute('/_public/missions/$code')({
  beforeLoad: () => { throw redirect({ to: '/tarifs' }) },
  validateSearch: (search: Record<string, unknown>): { secteur?: Sector } => {
    const value = String(search.secteur ?? 'enseignement')
    return { secteur: (SECTORS.includes(value as Sector) ? value : 'enseignement') as Sector }
  },
  component: MissionDetail,
  head: ({ params }) => ({
    meta: [
      { title: `Mission ${(params.code ?? 'starter').toUpperCase()} — ALLNEEDS` },
      {
        name: 'description',
        content: 'Contenu détaillé, livrables, limites et délai de la mission.',
      },
    ],
  }),
})

function MissionDetail() {
  const { code } = Route.useParams()
  const { secteur } = Route.useSearch()
  const upper = (code ?? 'starter').toUpperCase() as MissionCode
  const mission: MissionCode = CODES.includes(upper) ? upper : 'STARTER'
  const currentSecteur = secteur ?? 'enseignement'

  return (
    <>
      <div className="container-page pt-6">
        <Link
          to="/missions/$code"
          params={{ code: 'starter' }}
          search={{ secteur: currentSecteur }}
          className="text-xs font-semibold text-ink-500 transition hover:text-ink-900"
        >
          ← Voir les autres formules
        </Link>
      </div>
      <MissionPage code={mission} sector={currentSecteur} />
    </>
  )
}
