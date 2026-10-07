import { useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, Inbox, Send } from 'lucide-react'
import { ACCESS_OFFERS, SECTOR_LABEL, SECTOR_ORDER } from '@/data/catalog'
import { useDemo } from '@/store/store'
import { Card, Checkbox, Field, Input, Select, Steps, Textarea, Button, Alert, Badge } from '@/components/ui'
import type { Sector } from '@/types'

export const Route = createFileRoute('/_public/demande')({
  component: DemandePage,
  head: () => ({
    meta: [
      { title: 'Déposer un besoin — ALLNEEDS' },
      {
        name: 'description',
        content:
          'Décrivez votre besoin ou votre projet : ALLNEEDS qualifie la demande et vous répond sous 24 h ouvrées.',
      },
    ],
  }),
})

const CATEGORIES = [
  { value: 'logiciel', label: 'Logiciel de gestion, site ou espace en ligne' },
  { value: 'creation', label: 'Logo, identité visuelle, photo, vidéo, impression' },
  { value: 'rh', label: 'Recrutement, paie, formation, organisation' },
  { value: 'logistique', label: 'Transport, restauration, assurance, fournitures' },
  { value: 'energie', label: 'Énergie, fluides, télécom' },
  { value: 'maintenance', label: 'Maintenance informatique, réseaux, équipements' },
]

const STEP_LABELS = ['Votre établissement', 'Votre besoin', 'Vos contraintes']

export function DemandePage() {
  const { dispatch } = useDemo()
  const [step, setStep] = useState(0)
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    kind: 'besoin' as 'besoin' | 'mission' | 'diagnostic' | 'contact',
    org: '',
    name: '',
    role: '',
    email: '',
    phone: '',
    sector: 'enseignement' as Sector,
    city: '',
    headcount: '',
    category: 'logiciel',
    title: '',
    message: '',
    budget: '',
    urgency: 'normale' as 'faible' | 'normale' | 'haute',
    deadline: '',
    consent: true,
  })

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function validate(current: number) {
    const next: Record<string, string> = {}
    if (current === 0) {
      if (!form.org.trim()) next.org = 'Indiquez le nom de votre établissement.'
      if (!form.name.trim()) next.name = 'Indiquez votre nom.'
      if (!form.email.trim()) next.email = 'Une adresse e-mail est nécessaire pour vous répondre.'
      if (!form.phone.trim()) next.phone = 'Un numéro permet de vous rappeler rapidement.'
    }
    if (current === 1) {
      if (!form.title.trim()) next.title = 'Donnez un titre à votre demande.'
      if (form.message.trim().length < 20) next.message = 'Décrivez votre besoin en 20 caractères ou plus.'
    }
    if (current === 2) {
      if (!form.consent) next.consent = 'Nous avons besoin de votre accord pour vous recontacter.'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function next() {
    if (!validate(step)) return
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1))
  }

  function submit() {
    if (!validate(2)) return
    dispatch({
      type: 'REQUEST_CREATE',
      request: {
        kind: form.kind,
        name: form.name,
        org: form.org,
        email: form.email,
        phone: form.phone,
        sector: form.sector,
        city: form.city,
        message: `${form.title}\n\n${form.message}\n\nCatégorie : ${form.category} · Urgence : ${form.urgency} · Budget : ${form.budget || 'à définir'}${form.deadline ? ` · Échéance : ${form.deadline}` : ''}`,
        budget: form.budget,
      },
    })
    setSent(true)
  }

  if (sent) {
    return (
      <div className="container-narrow py-20">
        <Card className="p-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h1 className="display-2 mt-6">Demande enregistrée</h1>
          <p className="lede mx-auto mt-4 max-w-lg">
            Merci {form.name.split(' ')[0]}. Un membre de l’équipe ALLNEEDS qualifie votre demande et vous répond sous 24 h
            ouvrées à {form.email}.
          </p>

          <div className="mx-auto mt-8 max-w-md rounded-2xl bg-ink-50 p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Récapitulatif</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Établissement</dt>
                <dd className="text-right font-medium text-ink-900">{form.org}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Secteur</dt>
                <dd className="text-right font-medium text-ink-900">{SECTOR_LABEL[form.sector]}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Objet</dt>
                <dd className="text-right font-medium text-ink-900">{form.title}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/diagnostic">
              <Button>
                Réserver le diagnostic
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">Retour à l’accueil</Button>
            </Link>
          </div>

          <p className="mt-6 text-xs text-ink-400">
            Cette demande est visible dans le dashboard admin de la démonstration (rubrique Qualification).
          </p>
        </Card>
      </div>
    )
  }

  return (
    <>
      <section className="border-b border-ink-100 bg-ink-50">
        <div className="container-page py-14">
          <p className="eyebrow">Formulaire de besoin</p>
          <h1 className="display-1 mt-4 max-w-3xl">Décrivez votre besoin, nous le qualifions.</h1>
          <p className="lede mt-5 max-w-2xl">
            Un besoin correspond à une catégorie de prestation. Si votre demande couvre plusieurs prestations, comptez
            deux besoins : c’est transparents et ça nous permet de proposer le bon prestataire.
          </p>
          <div className="mt-8">
            <Steps steps={STEP_LABELS} current={step} />
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-6 sm:p-8">
            {/* Étape 1 */}
            {step === 0 ? (
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Type de demande</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {[
                      { value: 'besoin', label: 'Rechercher un prestataire', hint: 'via l’abonnement ACCÈS' },
                      { value: 'mission', label: 'Demander une mission', hint: 'PRO ou PERFORMANCE' },
                      { value: 'diagnostic', label: 'Demander un diagnostic', hint: 'STARTER, analyse de votre structure' },
                      { value: 'contact', label: 'Poser une question', hint: 'Avant de vous engager' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => set('kind', option.value as typeof form.kind)}
                        className={`rounded-xl border px-4 py-3 text-left transition ${
                          form.kind === option.value
                            ? 'border-brand-600 bg-brand-50'
                            : 'border-ink-200 hover:border-ink-400'
                        }`}
                      >
                        <p className="text-sm font-semibold text-ink-900">{option.label}</p>
                        <p className="mt-0.5 text-xs text-ink-500">{option.hint}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Field label="Nom de l’établissement" required error={errors.org}>
                  <Input
                    value={form.org}
                    onChange={(e) => set('org', e.target.value)}
                    placeholder="École Al Amal"
                  />
                </Field>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Votre nom" required error={errors.name}>
                    <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Amina Bennani" />
                  </Field>
                  <Field label="Votre fonction">
                    <Input value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Directrice" />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="E-mail" required error={errors.email}>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => set('email', e.target.value)}
                      placeholder="vous@etablissement.ma"
                    />
                  </Field>
                  <Field label="Téléphone" required error={errors.phone}>
                    <Input
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="+212 6 ..."
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <Field label="Secteur">
                    <Select value={form.sector} onChange={(e) => set('sector', e.target.value as Sector)}>
                      {SECTOR_ORDER.map((sector) => (
                        <option key={sector} value={sector}>
                          {SECTOR_LABEL[sector]}
                        </option>
                      ))}
                    </Select>
                  </Field>
                  <Field label="Ville">
                    <Input value={form.city} onChange={(e) => set('city', e.target.value)} placeholder="Casablanca" />
                  </Field>
                  <Field label="Effectif">
                    <Input
                      value={form.headcount}
                      onChange={(e) => set('headcount', e.target.value)}
                      placeholder="18 salariés"
                    />
                  </Field>
                </div>
              </div>
            ) : null}

            {/* Étape 2 */}
            {step === 1 ? (
              <div className="space-y-5">
                <Field label="Catégorie de prestation" required>
                  <Select value={form.category} onChange={(e) => set('category', e.target.value)}>
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </Select>
                </Field>

                <Field label="Titre de la demande" required error={errors.title}>
                  <Input
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                    placeholder="Logiciel de gestion avec espace parents"
                  />
                </Field>

                <Field
                  label="Description"
                  required
                  error={errors.message}
                  hint="Contexte, contraintes, échéances, ce que vous avez déjà essayé."
                >
                  <Textarea
                    rows={7}
                    value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    placeholder="Nous recevons environ 300 demandes par an sur papier et WhatsApp…"
                  />
                </Field>
              </div>
            ) : null}

            {/* Étape 3 */}
            {step === 2 ? (
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Budget envisagé" hint="Une fourchette suffit.">
                    <Input
                      value={form.budget}
                      onChange={(e) => set('budget', e.target.value)}
                      placeholder="Budget à préciser, si connu"
                    />
                  </Field>
                  <Field label="Urgence">
                    <Select
                      value={form.urgency}
                      onChange={(e) => set('urgency', e.target.value as typeof form.urgency)}
                    >
                      <option value="faible">Faible — je regarde</option>
                      <option value="normale">Normale — ce trimestre</option>
                      <option value="haute">Haute — avant la rentrée</option>
                    </Select>
                  </Field>
                </div>

                <Field label="Échéance souhaitée">
                  <Input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => set('deadline', e.target.value)}
                  />
                </Field>

                <Checkbox
                  checked={form.consent}
                  onChange={(e) => set('consent', e.target.checked)}
                  label="J’accepte que ces informations soient utilisées pour traiter ma demande."
                  description="Aucune donnée nominative d’élève ou de patient n’est collectée dans ce formulaire."
                />
                {errors.consent ? <p className="text-xs text-red-600">{errors.consent}</p> : null}

                <Alert tone="info" title="Délai de réponse">
                  24 h ouvrées en CONNECT, 48 h en PLUS, 24 h avec un interlocuteur attitré en PRIORITÉ. Les délais
                  courent à compter de la réception d’une demande complète.
                </Alert>

                <div className="rounded-xl border border-ink-100 bg-ink-50 p-5">
                  <div className="flex items-center gap-2">
                    <Inbox className="h-4 w-4 text-ink-500" />
                    <p className="text-sm font-semibold text-ink-900">Récapitulatif</p>
                  </div>
                  <p className="mt-2 text-sm text-ink-600">
                    {form.org} · {form.title}
                  </p>
                  <p className="mt-1 text-xs text-ink-500">
                    {CATEGORIES.find((c) => c.value === form.category)?.label}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-ink-100 pt-6">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                Retour
              </Button>
              {step < STEP_LABELS.length - 1 ? (
                <Button onClick={next}>
                  Continuer
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={submit}>
                  <Send className="h-4 w-4" />
                  Envoyer la demande
                </Button>
              )}
            </div>
          </Card>

          <aside className="space-y-5">
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Abonnement ACCÈS</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Un besoin consommé dans le cadre d’un abonnement entre dans votre pool annuel, reportable sur 12 mois.
              </p>
              <ul className="mt-5 space-y-3">
                {ACCESS_OFFERS.map((offer) => (
                  <li key={offer.tier} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-ink-900">
                      {offer.name}
                      {offer.featured ? <Badge tone="brand">Populaire</Badge> : null}
                    </span>
                    <span className="text-ink-600">{offer.needsPerYear} besoins</span>
                  </li>
                ))}
              </ul>
              <Link to="/acces" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                Voir les niveaux ACCÈS
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>

            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Vous préférez commencer par un diagnostic ?</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                1h30 pour savoir où votre établissement doit agir en priorité. Priorités définies après analyse.
              </p>
              <Link to="/diagnostic" className="mt-5 block">
                <Button size="sm" fullWidth variant="outline">
                  Réserver le diagnostic
                </Button>
              </Link>
            </Card>
          </aside>
        </div>
      </section>
    </>
  )
}
