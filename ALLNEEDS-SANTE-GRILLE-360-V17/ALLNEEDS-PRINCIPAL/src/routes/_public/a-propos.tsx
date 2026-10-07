import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, ShieldCheck, Users, Network, FileCheck2 } from 'lucide-react'
import { LAUNCH_OFFER, SECTORS } from '@/data/catalog'
import { ReasonCards } from '@/components/marketing'
import { Card, SectionHeading, Alert } from '@/components/ui'

export const Route = createFileRoute('/_public/a-propos')({
  component: AProposPage,
  head: () => ({
    meta: [
      { title: 'Qui est derrière ALLNEEDS' },
      {
        name: 'description',
        content: 'Notre méthode, notre cadre, nos engagements et nos références.',
      },
    ],
  }),
})

const PRINCIPES = [
  {
    icon: ShieldCheck,
    title: 'Un cadre qui protège',
    detail:
      'Aucune donnée nominative d’élève, de patient ou de client. Images d’enfants uniquement avec autorisation écrite des représentants légaux, à recueillir par l’établissement.',
  },
  {
    icon: Users,
    title: 'Un seul interlocuteur',
    detail:
      'Nous mobilisons les compétences nécessaires : graphiste, développeur, juriste administratif, consultant communication. Vous n’avez pas à chercher dix prestataires.',
  },
  {
    icon: FileCheck2,
    title: 'Un périmètre écrit',
    detail:
      'Chaque formule affiche ses limites en chiffres : pages, plateformes, fiches de poste, rendez-vous. Ce qui est écrit est contractuel.',
  },
  {
    icon: Network,
    title: 'Des prestataires vérifiés',
    detail:
      'Existence légale, références clients, cohérence des tarifs, respect des règles applicables aux mineurs. Nous informons de toute commission éventuellement perçue.',
  },
]

export function AProposPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-ink-50">
        <div className="container-page py-16">
          <p className="eyebrow">Qui est derrière ALLNEEDS</p>
          <h1 className="display-1 mt-4 max-w-3xl">Un réseau de solutions, pas une agence qui vend des rapports.</h1>
          <p className="lede mt-5 max-w-2xl">
            ALLNEEDS identifie les priorités de votre établissement, construit les solutions adaptées et mobilise les
            compétences nécessaires. Comprendre · Structurer · Agir.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading eyebrow="Notre méthode" title="Le besoin de l’établissement est le point de départ." />
            <div className="prose-allneeds mt-6">
              <p>
                Nous ne partons pas d’un catalogue. Nous partons de votre situation et de votre calendrier :
                inscriptions, rentrée, saison haute, échéances d’assurances.
              </p>
              <p>
                Un seul interlocuteur suit votre demande du premier échange jusqu’à la signature avec le prestataire, puis
                jusqu’au bilan. Les livrables sont produits pour être utilisés par votre équipe, pas pour être rangés
                dans un dossier.
              </p>
              <p>
                Nous ne promettons pas de résultat chiffré avant analyse. Sur les charges, nous n’annonçons aucune
                économie avant d’avoir mesuré la situation réelle.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {PRINCIPES.map((principe) => (
              <Card key={principe.title} className="p-5">
                <principe.icon className="h-5 w-5 text-brand-700" />
                <p className="mt-3 text-sm font-semibold text-ink-950">{principe.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{principe.detail}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-ink-100 bg-ink-50 py-16">
        <div className="container-page">
          <SectionHeading eyebrow="Nos principes" title="Trois raisons qui reviennent dans chaque mission" align="center" />
          <div className="mt-14">
            <ReasonCards reasons={SECTORS.enseignement.reasons} />
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <SectionHeading eyebrow="Références" title="Établissements accompagnés" />
        <div className="mt-10 space-y-4">
          {[
            '[Référence 1 : type de structure, ville, résultat : à compléter]',
            '[Référence 2 : à compléter]',
            '[Référence 3 : à compléter]',
          ].map((ref) => (
            <Card key={ref} className="p-5">
              <p className="text-sm text-ink-600">{ref}</p>
            </Card>
          ))}
        </div>
        <Alert tone="warning" className="mt-6" title="Références à compléter">
          Les références réelles sont communiquées lors du premier rendez-vous, avec l’accord des établissements
          concernés. Les chiffres cités sur ce site sont des données de démonstration.
        </Alert>
      </section>

      <section className="container-page pb-20">
        <Card className="flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">
              {LAUNCH_OFFER.label} · {LAUNCH_OFFER.deadline}
            </p>
            <h2 className="mt-3 font-display text-2xl tracking-tight text-ink-950">
              Le premier pas est gratuit : un diagnostic de 1h30.
            </h2>
            <p className="mt-2 text-sm text-ink-600">
              Sans engagement. Vous repartez avec 3 priorités écrites.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/diagnostic">
              <span className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-700 px-5 text-sm font-semibold text-white transition hover:bg-brand-800">
                Réserver
                <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <Link to="/tarifs">
              <span className="inline-flex h-11 items-center rounded-lg border border-ink-200 px-5 text-sm font-semibold text-ink-800 transition hover:bg-ink-50">
                Voir les tarifs
              </span>
            </Link>
          </div>
        </Card>
      </section>
    </>
  )
}
