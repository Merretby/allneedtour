import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SECTORS, SECTOR_ORDER } from '@/data/catalog'
import { FaqList, CtaBand } from '@/components/marketing'
import { Card, Input, SectionHeading } from '@/components/ui'
import { useSelectedSector } from '@/lib/sector-filter'

export const Route = createFileRoute('/_public/faq')({
  component: FaqPage,
  head: () => ({
    meta: [
      { title: 'Questions fréquentes — ALLNEEDS' },
      {
        name: 'description',
        content:
          'Missions, délais, limites, paiements, abonnement ACCÈS, protection des données : les réponses écrites.',
      },
    ],
  }),
})

const GENERALES = [
  {
    q: 'Faut-il s’engager pour le diagnostic STARTER ?',
    a: 'Non, aucun engagement. C’est un rendez-vous de 1h30 qui se termine par un livrable écrit : état des lieux, difficultés prioritaires, opportunités et 3 priorités recommandées.',
  },
  {
    q: 'Comment se passe le démarrage ?',
    a: 'Diagnostic → réunion de cadrage → structuration → livraison → accompagnement éventuel. Le délai court à partir de la réunion de cadrage, pas à la commande.',
  },
  {
    q: 'Qui fournit les contenus (textes, photos, accès) ?',
    a: 'Vous. Les contenus et informations nécessaires sont fournis par le client dans les délais convenus. Sans eux, la livraison est décalée d’autant.',
  },
  {
    q: 'Combien de retouches sont incluses ?',
    a: '2 tours de retouches par livrable. Toute production supplémentaire fait l’objet d’une prestation complémentaire chiffrée avant d’être réalisée.',
  },
  {
    q: 'À qui appartiennent les livrables ?',
    a: 'Le site, les réseaux sociaux et les comptes publicitaires restent votre propriété. Les documents, process et supports vous sont transmis et vous appartiennent.',
  },
  {
    q: 'ALLNEEDS intervient-il sur le contenu pédagogique ou clinique ?',
    a: 'Jamais. Notre périmètre est organisationnel, commercial et administratif. Nous ne fournissons pas de conseil pédagogique, clinique, juridique, fiscal ou comptable.',
  },
  {
    q: 'Comment sont gérées les images d’enfants ou de patients ?',
    a: 'Aucune donnée nominative n’est utilisée. Toute image d’élève, de mineur ou de personne soignée n’est utilisée qu’avec l’autorisation écrite des représentants légaux, à recueillir par l’établissement.',
  },
  {
    q: 'Que se passe-t-il si le périmètre évolue en cours de mission ?',
    a: 'Chaque production supplémentaire est chiffrée et validée par écrit avant d’être réalisée. Rien n’est ajouté sans accord.',
  },
  {
    q: 'Quels sont les modalités de paiement ?',
    a: 'Missions : paiement unique. Abonnement ACCÈS : payable d’avance en une fois ou en 4 échéances trimestrielles. Prix hors taxes, TVA 20 % en sus. Les conditions précises figurent sur le devis.',
  },
  {
    q: 'ALLNEEDS promet-elle des résultats chiffrés ?',
    a: 'Non. Nous mesurons, ajustons et rendons compte. Sur les charges, nous n’annonçons aucune économie avant analyse : nous identifions, quantifions et évaluons les opportunités.',
  },
]

const ACCES_FAQ = [
  {
    q: 'Qu’est-ce qu’un « besoin » ?',
    a: 'Un besoin correspond à une catégorie de prestation. Une demande complexe qui couvre plusieurs prestations compte pour 2 besoins. Les besoins non utilisés restent valables pendant toute la durée de l’abonnement.',
  },
  {
    q: 'Le pool de besoins est-il reportable ?',
    a: 'Oui. Vous disposez d’un pool pour l’année, reportable sur les 12 mois : vous l’utilisez au rythme de votre activité sans perdre ce que vous n’avez pas consommé.',
  },
  {
    q: 'Le contrat est-il conclu avec ALLNEEDS ?',
    a: 'ALLNEEDS sélectionne, vérifie et met en relation. Le contrat est conclu directement entre vous et le prestataire, qui reste responsable de sa prestation. Le prix du prestataire n’est pas inclus dans l’abonnement.',
  },
  {
    q: 'ALLNEEDS prend-elle une commission ?',
    a: 'Nous vous informons de toute commission éventuellement perçue auprès d’un prestataire.',
  },
  {
    q: 'Quelle différence entre vérification de base et approfondie ?',
    a: 'Vérification de base : existence légale (RC, ICE) et activité du prestataire. Vérification approfondie : en plus 2 références clients, cohérence des tarifs avec le marché et délais annoncés, et selon la prestation, références d’établissements et respect des règles applicables aux mineurs.',
  },
  {
    q: 'Peut-on résilier l’abonnement ?',
    a: 'Oui : abonnement d’un an, non-reconduction possible avec un préavis de 30 jours avant l’échéance.',
  },
  {
    q: 'La remise sur les missions est-elle cumulable avec l’offre de lancement ?',
    a: 'Non. L’avantage abonné (PLUS ou PRIORITÉ) s’applique au prix normal des missions PRO et PERFORMANCE et n’est pas cumulable avec l’offre de lancement.',
  },
  {
    q: 'Le budget publicitaire est-il inclus ?',
    a: 'Non. Il n’est pas inclus dans les missions. Un budget adapté est défini après analyse pour obtenir des résultats mesurables sur une campagne sponsorisée.',
  },
]

export function FaqPage() {
  const [query, setQuery] = useState('')
  const selectedSector = useSelectedSector()

  const filtered = useMemo(() => {
    const all = [
      { group: 'Général', items: GENERALES },
      ...(selectedSector ? [{ group: SECTORS[selectedSector].name, items: SECTORS[selectedSector].faq }] : SECTOR_ORDER.map((sector) => ({ group: SECTORS[sector].name, items: SECTORS[sector].faq }))),
      { group: 'ALLNEEDS ACCÈS', items: ACCES_FAQ },
    ]
    if (!query.trim()) return all
    const q = query.toLowerCase()
    return all
      .map((block) => ({
        group: block.group,
        items: block.items.filter(
          (item) => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q),
        ),
      }))
      .filter((block) => block.items.length > 0)
  }, [query, selectedSector])

  return (
    <>
      <section className="border-b border-ink-100 bg-ink-50">
        <div className="container-page py-16">
          <p className="eyebrow">Questions fréquentes</p>
          <h1 className="display-1 mt-4 max-w-3xl">Les réponses que nous écrivons avant de signer.</h1>
          <p className="lede mt-5 max-w-2xl">
            Délais, limites, propriété des livrables, données personnelles, paiements : tout est explicite. Si votre
            question n’est pas là, écrivez-nous.
          </p>

          <div className="relative mt-8 max-w-xl">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une question…"
              className="pl-10"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[0.35fr_0.65fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Rubriques</p>
              <ul className="mt-4 space-y-2 text-sm">
                {filtered.map((block) => (
                  <li key={block.group} className="flex items-center justify-between gap-3 text-ink-700">
                    <span>{block.group}</span>
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[0.65rem] tabular-nums text-ink-600">
                      {block.items.length}
                    </span>
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                Poser une question
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          </div>

          <div className="space-y-12">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-12 text-center">
                <p className="text-sm font-semibold text-ink-800">Aucune réponse pour « {query} »</p>
                <p className="mt-1.5 text-sm text-ink-500">Écrivez-nous, nous répondons sous 24 h ouvrées.</p>
                <Link to="/contact" className="mt-5 inline-block">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                    Nous écrire
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              </div>
            ) : null}

            {filtered.map((block) => (
              <div key={block.group}>
                <h2 className="font-display text-2xl tracking-tight text-ink-950">{block.group}</h2>
                <div className="mt-5">
                  <FaqList items={block.items} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <SectionHeading
            eyebrow="En résumé"
            title="Ce que nous écrivons dans chaque contrat"
            align="center"
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: 'Le périmètre', d: 'Ce qui est inclus, ce qui ne l’est pas, combien de versions.' },
              { t: 'Les limites', d: 'Un chiffre par livrable. Pas de « selon le projet ».' },
              { t: 'Les délais', d: 'À compter de la réunion de cadrage, pas de la commande.' },
              { t: 'Vos données', d: 'Aucune donnée nominative. Autorisations écrites exigées.' },
            ].map((item) => (
              <Card key={item.t} className="p-5">
                <p className="text-sm font-semibold text-ink-950">{item.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Une question sans réponse ici ?"
        description="Écrivez-nous : nous répondons sous 24 h ouvrées, et si ALLNEEDS n’est pas la bonne réponse, nous vous le dirons."
        secondary={{ label: 'Voir les tarifs', to: '/tarifs' }}
      />
    </>
  )
}
