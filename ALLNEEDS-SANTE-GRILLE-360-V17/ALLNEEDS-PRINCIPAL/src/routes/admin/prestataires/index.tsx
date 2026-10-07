import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ShieldCheck, Star } from 'lucide-react'
import { useDemo } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import { Badge, Card, CardHeader, CardBody, Input, Select, Stat, Tabs } from '@/components/ui'
import { SECTOR_LABEL } from '@/data/catalog'
import { longDate, relative } from '@/lib/format'
import { byId } from '@/lib/utils'
import { DEMO_NOW } from '@/data/demo'

export const Route = createFileRoute('/admin/prestataires/')({
  component: AdminProviders,
  head: () => ({ meta: [{ title: 'Réseau prestataires — ALLNEEDS' }] }),
})

export function AdminProviders() {
  const { state } = useDemo()
  const [filter, setFilter] = useState('tous')
  const [query, setQuery] = useState('')
  const now = new Date(DEMO_NOW).getTime()

  const categories = Array.from(new Set(state.providers.map((p) => p.category)))
  const cities = Array.from(new Set(state.providers.map((p) => p.city)))

  const providers = state.providers
    .filter((p) => (filter === 'tous' ? true : p.verification === filter))
    .filter((p) =>
      query.trim() ? `${p.name} ${p.categoryLabel} ${p.city}`.toLowerCase().includes(query.toLowerCase()) : true,
    )

  const needsByProvider = state.needs.reduce<Record<string, number>>((acc, need) => {
    need.candidateIds.forEach((id) => {
      acc[id] = (acc[id] ?? 0) + 1
    })
    return acc
  }, {})

  const quotesByProvider = state.quotes.reduce<Record<string, number>>((acc, q) => {
    acc[q.providerId] = (acc[q.providerId] ?? 0) + 1
    return acc
  }, {})

  const won = state.quotes.filter((q) => q.status === 'accepte')

  return (
    <>
      <PageHeader
        eyebrow="Réseau"
        title="Prestataires du réseau"
        description="Un prestataire proposé sans vérification est un risque pour le client. Le niveau de vérification conditionne la proposition."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Prestataires" value={state.providers.length} hint={`${categories.length} catégories`} tone="brand" />
        <Stat
          label="Vérification approfondie"
          value={state.providers.filter((p) => p.verification === 'approfondie').length}
          hint="proposables sans réserve"
          tone="success"
        />
        <Stat
          label="Conformité mineurs"
          value={state.providers.filter((p) => p.minorsCompliant).length}
          hint="obligatoire si public mineur"
          tone="violet"
        />
        <Stat
          label="Taux d'acceptation"
          value={`${won.length}/${state.quotes.length}`}
          hint="devis acceptés par les clients"
          tone="info"
        />
      </div>

      <Card className="mb-5 p-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher un prestataire…" />
          <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="tous">Tous les niveaux</option>
            <option value="base">Vérification de base</option>
            <option value="approfondie">Vérification approfondie</option>
          </Select>
        </div>
      </Card>

      <div className="mb-5">
        <Tabs
          value={filter}
          onChange={setFilter}
          tabs={[
            { value: 'tous', label: 'Tous', count: state.providers.length },
            { value: 'approfondie', label: 'Approfondie', count: state.providers.filter((p) => p.verification === 'approfondie').length },
            { value: 'base', label: 'Base', count: state.providers.filter((p) => p.verification === 'base').length },
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {providers.map((provider) => {
          const sectorNeeds = state.needs.filter((n) => n.candidateIds.includes(provider.id))
          const clients = Array.from(new Set(sectorNeeds.map((n) => byId(state.orgs, n.orgId)?.name).filter(Boolean)))
          return (
            <Card key={provider.id}>
              <CardHeader
                title={provider.name}
                description={`${provider.categoryLabel} · ${provider.city} · vérifié le ${longDate(provider.verifiedAt)}`}
                action={
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-semibold text-ink-700">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {provider.rating.toFixed(1)}
                    </span>
                    <Badge tone={provider.verification === 'approfondie' ? 'success' : 'warning'}>
                      {provider.verification === 'approfondie' ? 'Approfondie' : 'Base'}
                    </Badge>
                  </div>
                }
              />
              <CardBody>
                <div className="flex flex-wrap gap-1.5">
                  {provider.minorsCompliant ? (
                    <Badge tone="brand">
                      <ShieldCheck className="h-3 w-3" />
                      Mineurs
                    </Badge>
                  ) : (
                    <Badge tone="danger">Non conforme mineurs</Badge>
                  )}
                  {provider.insurance ? <Badge tone="info">Assuré</Badge> : <Badge tone="warning">Assurance non vérifiée</Badge>}
                  <Badge tone="neutral">Réponse {provider.responseDelay}</Badge>
                  <Badge tone="neutral">{provider.priceHint}</Badge>
                </div>

                <ul className="mt-3 space-y-1">
                  {provider.highlights.map((h) => (
                    <li key={h} className="text-sm text-ink-700">
                      — {h}
                    </li>
                  ))}
                </ul>

                <p className="mt-3 rounded-lg bg-ink-50 px-3 py-2 text-xs italic text-ink-600">{provider.note}</p>

                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-ink-100 pt-3 text-center">
                  <div>
                    <p className="text-xs text-ink-500">Besoins</p>
                    <p className="font-display text-lg text-ink-950">{needsByProvider[provider.id] ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-500">Devis</p>
                    <p className="font-display text-lg text-ink-950">{quotesByProvider[provider.id] ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink-500">Clients</p>
                    <p className="font-display text-lg text-ink-950">{clients.length}</p>
                  </div>
                </div>

                {clients.length > 0 ? (
                  <p className="mt-3 text-xs text-ink-500">
                    Déployed chez : {clients.join(', ')} · dernière proposition{' '}
                    {relative(state.now, now)}
                  </p>
                ) : (
                  <p className="mt-3 text-xs text-ink-400">Aucune mobilisation sur un besoin pour le moment.</p>
                )}

                <p className="mt-3 text-[0.68rem] text-ink-400">
                  Secteurs concernés : {SECTOR_LABEL.enseignement}, {SECTOR_LABEL.sante}, {SECTOR_LABEL.tourisme} ·{' '}
                  {provider.references.join(' · ')}
                </p>
              </CardBody>
            </Card>
          )
        })}
      </div>
    </>
  )
}
