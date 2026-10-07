import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { COMPANY, LAUNCH_OFFER } from '@/data/catalog'
import { Alert, Card } from '@/components/ui'

export const Route = createFileRoute('/_public/conditions')({
  component: ConditionsPage,
  head: () => ({
    meta: [{ title: 'Conditions de l’offre — ALLNEEDS' }],
  }),
})

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-ink-100 pt-8">
      <h2 className="font-display text-2xl tracking-tight text-ink-950">{title}</h2>
      <div className="prose-allneeds mt-4">{children}</div>
    </section>
  )
}

function ConditionsPage() {
  return (
    <>
      <section className="border-b border-ink-100 bg-ink-50">
        <div className="container-page py-16">
          <p className="eyebrow">Conditions</p>
          <h1 className="display-1 mt-4 max-w-3xl">Conditions de l’offre et cadre d’intervention.</h1>
          <p className="lede mt-5 max-w-2xl">
            Cette page résume les règles applicables à nos missions et à notre abonnement. Les conditions précises de
            chaque prestation figurent sur le devis et le contrat.
          </p>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[0.32fr_0.68fr]">
          <nav className="lg:sticky lg:top-28 lg:self-start">
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Sommaire</p>
              <ul className="mt-4 space-y-2 text-sm text-ink-700">
                {[
                  'Identité',
                  'Offre de lancement',
                  'Tarifs et paiement',
                  'Contenus et retouches',
                  'Données personnelles',
                  'Budget publicitaire',
                  'Accès et prestations externalisées',
                  'Abonnement ACCÈS',
                  'Engagements ALLNEEDS',
                  'Références',
                ].map((item, i) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-ink-300">{String(i + 1).padStart(2, '0')}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </nav>

          <div className="space-y-8">
            <Section title="Identité">
              <p>
                ALLNEEDS : {COMPANY.legal}. Siège : {COMPANY.city}. Coordonnées : {COMPANY.phone} · {COMPANY.whatsapp}{' '}
                · {COMPANY.email} · {COMPANY.site}.
              </p>
            </Section>

            <Section title="Offre de lancement">
              <ul>
                <li>
                  Offre de lancement valable jusqu’au <strong>{LAUNCH_OFFER.deadline}</strong> ou jusqu’aux{' '}
                  <strong>5 premiers clients</strong> Enseignement PRO ou PERFORMANCE, selon la première échéance.
                </li>
                <li>Le diagnostic STARTER identifie vos priorités.</li>
                <li>Les tarifs de l’abonnement ACCÈS ne sont pas concernés par l’offre de lancement.</li>
              </ul>
            </Section>

            <Section title="Tarifs et paiement">
              <ul>
                <li>{COMPANY.taxNote} Conditions de paiement précisées sur le devis.</li>
                <li>Missions : paiement unique.</li>
                <li>
                  Abonnement d’un an, payable d’avance en une fois ou en 4 échéances trimestrielles. Délais en jours
                  ouvrés, à compter de la réception d’une demande complète.
                </li>
              </ul>
            </Section>

            <Section title="Contenus et retouches">
              <ul>
                <li>
                  Contenus et informations nécessaires (textes, photos, accès) fournis par le client dans les délais
                  convenus.
                </li>
                <li>2 tours de retouches par livrable.</li>
                <li>Toute production supplémentaire fait l’objet d’une prestation complémentaire.</li>
                <li>Le site, les réseaux sociaux et les comptes publicitaires restent la propriété du client.</li>
              </ul>
            </Section>

            <Section title="Données personnelles et mineurs">
              <ul>
                <li>
                  Les images et données concernant des élèves ne sont utilisées qu’avec l’autorisation de leurs
                  représentants légaux, à recueillir par l’établissement.
                </li>
                <li>
                  Aucune donnée nominative d’élève, de patient ou de client n’est transmise à un prestataire par
                  ALLNEEDS.
                </li>
                <li>
                  ALLNEEDS ne fournit pas de conseil juridique, fiscal ou comptable, et ne négocie pas pour le compte du
                  membre.
                </li>
              </ul>
            </Section>

            <Section title="Budget publicitaire">
              <p>
                Budget publicitaire non inclus : budget à définir après analyse pour obtenir des résultats
                mesurables. ALLNEEDS ne promet pas de résultat chiffré avant analyse : nous mesurons, ajustons et
                rendons compte.
              </p>
            </Section>

            <Section title="Accès et prestations externalisées">
              <ul>
                <li>
                  ALLNEEDS sélectionne, vérifie et met en relation. Le contrat est conclu directement entre le membre et
                  le prestataire, qui reste responsable de sa prestation.
                </li>
                <li>Le prix du prestataire n’est pas inclus dans l’abonnement.</li>
                <li>ALLNEEDS vous informe de toute commission éventuellement perçue auprès d’un prestataire.</li>
              </ul>
            </Section>

            <Section title="Abonnement ACCÈS">
              <ul>
                <li>Abonnement d’un an, non-reconduction possible avec un préavis de 30 jours avant l’échéance.</li>
                <li>
                  Un besoin correspond à une catégorie de prestation. Une demande complexe qui couvre plusieurs
                  prestations compte pour 2 besoins.
                </li>
                <li>Les besoins non utilisés restent valables pendant toute la durée de l’abonnement.</li>
                <li>
                  Avantage abonné (PLUS ou PRIORITÉ) sur les missions PRO et PERFORMANCE au prix normal, non
                  cumulable avec l’offre de lancement.
                </li>
              </ul>
            </Section>

            <Section title="Engagements ALLNEEDS">
              <ul>
                <li>Vérification de base : existence légale (RC, ICE) et activité du prestataire.</li>
                <li>
                  Vérification approfondie : en plus 2 références clients, cohérence des tarifs avec le marché et délais
                  annoncés, et selon la prestation, références d’établissements et respect des règles applicables aux
                  mineurs (transport, restauration).
                </li>
                <li>Délais annoncés en jours ouvrés, à compter de la réception d’une demande complète.</li>
              </ul>
            </Section>

            <Section title="Références">
              <ul>
                <li>[Référence 1 : type de structure, ville, résultat : à compléter]</li>
                <li>[Référence 2 : à compléter]</li>
                <li>[Référence 3 : à compléter]</li>
              </ul>
            </Section>

            <Alert tone="warning" title="Frontend de démonstration">
              Cette interface est un prototype. Les mentions entre crochets sont à compléter avec les informations
              juridiques réelles avant publication.
            </Alert>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap gap-3">
          <Link to="/tarifs">
            <span className="inline-flex h-11 items-center gap-2 rounded-lg bg-brand-700 px-5 text-sm font-semibold text-white transition hover:bg-brand-800">
              Voir les tarifs
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
          <Link to="/contact">
            <span className="inline-flex h-11 items-center rounded-lg border border-ink-200 px-5 text-sm font-semibold text-ink-800 transition hover:bg-ink-50">
              Nous contacter
            </span>
          </Link>
        </div>
      </section>
    </>
  )
}
