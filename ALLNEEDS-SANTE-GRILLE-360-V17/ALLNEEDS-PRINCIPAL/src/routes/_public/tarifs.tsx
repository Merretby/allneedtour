import { Link, createFileRoute } from '@tanstack/react-router'
import { ACCESS_OFFERS, PLANS, SECTORS, SECTOR_ORDER } from '@/data/catalog'
import { CtaBand } from '@/components/marketing'
import { Badge, Button, Card, SectionHeading } from '@/components/ui'
import { useSelectedSector } from '@/lib/sector-filter'

export const Route = createFileRoute('/_public/tarifs')({
  component: OffresPage,
  head: () => ({ meta: [{ title: 'Missions — ALLNEEDS' }, { name: 'description', content: 'Découvrez les contenus, livrables et périmètres des missions et des abonnements ALLNEEDS.' }] }),
})

export function OffresPage() {
  const sector = useSelectedSector()
  const sectors = sector ? [sector] : SECTOR_ORDER
  return <>
    <section className="border-b border-ink-100 bg-ink-50"><div className="container-page py-16">
      <p className="eyebrow">Missions</p><h1 className="display-1 mt-4">Un contenu clair pour chaque étape.</h1>
      <p className="lede mt-5 max-w-2xl">Découvrez ce que chaque formule comprend. Votre diagnostic permet ensuite d’identifier l’accompagnement adapté à votre structure.</p>
    </div></section>
    <section className="container-page py-16"><SectionHeading eyebrow="Missions" title="Comprendre · Structurer · Agir" />
      <div className="mt-10 space-y-10">{sectors.map(s => <div key={s}><h2 className="font-display text-2xl text-ink-950">{SECTORS[s].name}</h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">{PLANS[s].map(plan => <Card key={plan.code} className="flex flex-col p-6">
          <Badge tone="brand">{plan.verb}</Badge><h3 className="mt-3 text-lg font-bold text-ink-950">{plan.name}</h3>
          <p className="mt-3 text-sm text-ink-600">{plan.tagline}</p><p className="mt-3 text-xs text-ink-500">Délai : {plan.delay}</p>
          <ul className="mt-5 flex-1 list-disc space-y-2 pl-4 text-sm text-ink-700">{plan.deliverables.map(item => <li key={item}>{item}</li>)}</ul>
          <Link to="/missions/$code" params={{ code: plan.code.toLowerCase() }} search={{ secteur: s }} className="mt-6"><Button fullWidth variant="outline">Voir le contenu {plan.name}</Button></Link>
        </Card>)}</div></div>)}</div>
    </section>
    <section className="border-y border-ink-100 bg-ink-50 py-16"><div className="container-page"><SectionHeading eyebrow="ALLNEEDS ACCÈS" title="Un accompagnement dans la durée" />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">{ACCESS_OFFERS.map(offer => <Card key={offer.tier} className="flex flex-col p-6">
        <h3 className="text-lg font-bold text-ink-950">{offer.name}</h3><p className="mt-3 text-sm text-ink-600">{offer.tagline}</p>
        <ul className="mt-5 flex-1 space-y-2 text-sm text-ink-700"><li>{offer.needsPerYear} besoins par an</li><li>{offer.concurrentNeeds} besoins simultanés</li><li>{offer.providersPerNeed} prestataires proposés par besoin</li><li>Première proposition : {offer.firstProposal}</li><li>Réponse : {offer.responseTime}</li></ul>
        <Link to="/inscription" search={{ offre: offer.tier }} className="mt-6"><Button fullWidth>Choisir {offer.name}</Button></Link>
      </Card>)}</div>
    </div></section>
    <CtaBand title="Commençons par votre diagnostic" description="Identifiez vos priorités et choisissez un accompagnement adapté à votre établissement." />
  </>
}
