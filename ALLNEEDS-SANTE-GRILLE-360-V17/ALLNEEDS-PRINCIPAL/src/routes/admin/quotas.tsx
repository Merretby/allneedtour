import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { AlertTriangle, Gauge, RefreshCcw } from 'lucide-react'
import { useDemo, tierLimit } from '@/store/store'
import { PageHeader } from '@/components/layouts'
import {
  Alert,
  Badge,
  Button,
  Card,
  CardHeader,
  CardBody,
  KeyValue,
  Progress,
  Select,
  Stat,
  TableWrap,
  Td,
  Th,
  Tr,
} from '@/components/ui'
import { ACCESS_OFFERS } from '@/data/catalog'
import { longDate, money, pct } from '@/lib/format'
import { percentage } from '@/lib/utils'
import type { AccessTier } from '@/types'

export const Route = createFileRoute('/admin/quotas')({
  component: AdminQuotas,
  head: () => ({ meta: [{ title: 'Quotas & abonnements — ALLNEEDS' }] }),
})

export function AdminQuotas() {
  const { state, dispatch } = useDemo()
  const [tier, setTier] = useState<AccessTier>(state.subscription.tier)

  const sub = state.subscription
  const offer = ACCESS_OFFERS.find((o) => o.tier === sub.tier)
  const needsLimit = tierLimit(sub.tier, 'needsPerYear')
  const concurrentLimit = tierLimit(sub.tier, 'concurrentNeeds')
  const usedPct = percentage(sub.consumed, needsLimit)
  const activeNeeds = state.needs.filter((n) => !['signe', 'clos'].includes(n.status))
  const concurrentOk = activeNeeds.length <= concurrentLimit
  const mrr = ACCESS_OFFERS.reduce((acc, o) => acc + (state.orgs.some((org) => org.tags.some((t) => t.includes(o.name))) ? o.priceYear : 0), 0)

  return (
    <>
      <PageHeader
        eyebrow="Revenu récurrent"
        title="Quotas & abonnements"
        description="Le quota fait partie de la promesse commerciale : le dépasser sans prévenir détruit la confiance."
        actions={
          <Select value={tier} onChange={(e) => setTier(e.target.value as AccessTier)} className="w-52">
            {ACCESS_OFFERS.map((o) => (
              <option key={o.tier} value={o.tier}>
                {o.name}
              </option>
            ))}
          </Select>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Formule active" value={offer?.name ?? sub.tier} hint="Contenu de la formule active" tone="brand" />
        <Stat label="Besoins consommés" value={`${sub.consumed}/${needsLimit}`} hint={`${pct(usedPct)} du quota`} tone={usedPct > 85 ? 'warning' : 'success'} />
        <Stat
          label="Simultanés"
          value={`${activeNeeds.length}/${concurrentLimit}`}
          hint="besoins ouverts en parallèle"
          tone={concurrentOk ? 'success' : 'danger'}
        />
        <Stat label="RRR catalogue" value={money(mrr)} hint="abonnements de démonstration" tone="violet" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader
              title={`Quota de l’établissement de démonstration (${offer?.name})`}
              description={`Échéance ${longDate(sub.renewsAt)} · reconduction ${sub.autoRenew ? 'automatique' : 'manuelle'}`}
              action={
                <Badge tone={sub.status === 'actif' ? 'success' : sub.status === 'expire' ? 'danger' : 'warning'}>
                  {sub.status === 'actif' ? 'Actif' : sub.status === 'expire' ? 'Résilié' : 'Suspendu'}
                </Badge>
              }
            />
            <CardBody className="space-y-4">
              <Progress value={usedPct} tone={usedPct > 85 ? 'amber' : 'brand'} label="Besoins utilisés" />
              <Progress
                value={percentage(activeNeeds.length, concurrentLimit)}
                tone={concurrentOk ? 'emerald' : 'red'}
                label="Besoins simultanés"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <KeyValue label="Consommés">{sub.consumed}</KeyValue>
                <KeyValue label="Restants">{Math.max(0, needsLimit - sub.consumed)}</KeyValue>
                <KeyValue label="Report au 1er janvier">{sub.poolCarriedOver}</KeyValue>
                <KeyValue label="Diagnostics STARTER offerts utilisés">
                  {sub.starterUsed} / {offer?.starterDiagnostic === 'offert' ? 1 : 0}
                </KeyValue>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-ink-100 pt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => dispatch({ type: 'SUBSCRIPTION_CONSUME', count: 1 })}
                >
                  +1 besoin consommé
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => dispatch({ type: 'SUBSCRIPTION_PATCH', patch: { poolCarriedOver: sub.poolCarriedOver + 1 } })}
                >
                  Reporter 1 besoin
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dispatch({ type: 'SUBSCRIPTION_PATCH', patch: { autoRenew: !sub.autoRenew } })}
                >
                  <RefreshCcw className="h-3.5 w-3.5" />
                  {sub.autoRenew ? 'Désactiver la reconduction' : 'Activer la reconduction'}
                </Button>
              </div>
            </CardBody>
          </Card>

          {usedPct > 85 ? (
            <Alert tone="warning" title="Quota presque atteint" icon={<AlertTriangle className="h-4 w-4" />}>
              Il reste {Math.max(0, needsLimit - sub.consumed)} besoin(s). Préparez une proposition de renouvellement ou un
              passage à la formule supérieure avant le dépassement.
            </Alert>
          ) : null}

          {!concurrentOk ? (
            <Alert tone="danger" title="Dépassement simultané" icon={<Gauge className="h-4 w-4" />}>
              {activeNeeds.length} besoins ouverts pour {concurrentLimit} autorisés. Classez ou fusionnez avant d’en ouvrir un
              autre.
            </Alert>
          ) : null}
        </div>

        <Card>
          <CardHeader title="Comparatif des formules" description="Ce que promet chaque formule." />
          <TableWrap>
            <thead>
              <tr>
                <Th>Formule</Th>
                <Th>Besoins</Th>
                <Th>Simultanés</Th>
                <Th>Prestataires</Th>
                <Th>1re proposition</Th>

              </tr>
            </thead>
            <tbody>
              {ACCESS_OFFERS.map((o) => (
                <Tr key={o.tier} className={o.tier === sub.tier ? 'bg-brand-50/50' : undefined}>
                  <Td>
                    <span className="font-semibold text-ink-950">{o.name}</span>
                    {o.featured ? (
                      <Badge tone="brand" className="ml-2">
                        Recommandée
                      </Badge>
                    ) : null}
                  </Td>
                  <Td>{o.needsPerYear}</Td>
                  <Td>{o.concurrentNeeds}</Td>
                  <Td>{o.providersPerNeed}</Td>
                  <Td>{o.firstProposal}</Td>

                </Tr>
              ))}
            </tbody>
          </TableWrap>
          <CardBody>
            <p className="text-xs leading-relaxed text-ink-500">
              Les engagements de délai (première proposition, comparaison, suivi, réponse) sont affichés publiquement sur la
              page ACCÈS. Tout écart doit être documenté avant de facturer.
            </p>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
