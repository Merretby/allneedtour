import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { ACCESS_OFFERS, SECTOR_LABEL, SECTOR_ORDER } from '@/data/catalog'
import { useDemo } from '@/store/store'
import { AuthLayout } from '@/components/AuthLayout'
import { Alert, Button, Card, Checkbox, Field, Input, Select, Steps } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { AccessTier, Sector } from '@/types'

export const Route = createFileRoute('/inscription')({
  validateSearch: (search: Record<string, unknown>): { offre?: AccessTier | null } => {
    const value = search.offre ? String(search.offre).toUpperCase() : null
    const valid = ACCESS_OFFERS.some((o) => o.tier === value)
    return { offre: valid ? (value as AccessTier) : null }
  },
  component: InscriptionPage,
  head: () => ({
    meta: [
      { title: 'Créer un compte — ALLNEEDS' },
      { name: 'description', content: 'Créez votre compte ALLNEEDS, choisissez votre secteur et votre espace métier.' },
    ],
  }),
})

const STEP_LABELS = ['Établissement', 'Coordonnées', 'Confirmation']

const WORKSPACE_PROFILES: Record<Sector, { value: string; label: string; description: string }[]> = {
  enseignement: [
    { value: 'ecole', label: 'École / établissement scolaire', description: 'Inscriptions, élèves, familles, équipe et paiements.' },
    { value: 'creche', label: 'Crèche / maternelle', description: 'Admissions, familles, présence, équipe et facturation.' },
    { value: 'formation', label: 'Centre de formation', description: 'Inscriptions, sessions, apprenants, formateurs et règlements.' },
  ],
  sante: [
    { value: 'cabinet', label: 'Cabinet', description: 'Patients, rendez-vous, praticiens, paiements et charges.' },
    { value: 'centre', label: 'Centre de santé', description: 'Accueil, planning multi-praticiens, équipe, paiements et suivi.' },
    { value: 'laboratoire', label: 'Laboratoire', description: 'Accueil, dossiers, équipe, encaissements et organisation.' },
  ],
  tourisme: [
    { value: 'hebergement', label: 'Hébergement', description: 'Réservations, chambres, check-in/out, ménage et paiements.' },
    { value: 'restauration', label: 'Restauration', description: 'Tables, menus, ingrédients, stock, commandes et caisse.' },
    { value: 'activites', label: 'Activités', description: 'Planning, capacités, réservations, participants et paiements.' },
    { value: 'transport', label: 'Transport', description: 'Véhicules, chauffeurs, trajets, réservations et disponibilités.' },
    { value: 'agence', label: 'Agence de voyage', description: 'Dossiers, voyageurs, hébergement, repas, activités, transport et marge.' },
  ],
}

export function InscriptionPage() {
  const { offre: offreFromUrl } = Route.useSearch()
  const navigate = useNavigate()
  const { dispatch } = useDemo()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    situation: 'entreprise_existante' as 'entreprise_existante'|'creation'|'investisseur', org: '', kind: '', sector: 'enseignement' as Sector, workspaceProfile: 'ecole', city: '', size: '',
    name: '', role: '', email: '', phone: '', accept: false,
  })
  const [error, setError] = useState('')

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) { setForm((v) => ({ ...v, [key]: value })) }
  function setSector(sector: Sector) { setForm((v) => ({ ...v, sector, workspaceProfile: WORKSPACE_PROFILES[sector][0].value })) }
  function validate(current: number) {
    if (current === 0 && !form.org.trim()) return 'Indiquez le nom de votre établissement.'
    if (current === 1 && (!form.name.trim() || !form.email.includes('@'))) return 'Nom et adresse e-mail valides sont nécessaires.'
    if (current === 2 && !form.accept) return 'Vous devez accepter les conditions.'
    return ''
  }
  function next() { const m=validate(step); if(m){setError(m);return}; setError(''); setStep((v)=>Math.min(v+1, STEP_LABELS.length-1)) }
  function submit() {
    const m=validate(2); if(m){setError(m);return}
    dispatch({ type: 'REGISTRATION_SET', profile: { sector: form.sector, workspaceProfile: form.workspaceProfile, situation: form.situation, tier: null, payment: null } })
    dispatch({ type: 'SET_ONBOARDED', value: false })
    navigate({ to: '/onboarding' })
  }

  return <AuthLayout
    title="Créer votre compte ALLNEEDS"
    subtitle="Choisissez votre secteur et votre espace métier. L’abonnement ALLNEEDS ACCÈS se choisit ensuite depuis votre compte."
    footer={<>Déjà client ? <Link to="/connexion" className="font-semibold text-brand-700">Se connecter</Link></>}
  >
    <Steps steps={STEP_LABELS} current={step} className="mb-8" />
    <div className="space-y-5">
      {step===0 ? <>
        <div><p className="mb-2 text-sm font-semibold text-ink-900">Votre situation</p><p className="mb-3 text-xs text-ink-500">Le contexte pilote l’expérience sans créer des dizaines de parcours séparés.</p><div className="grid gap-3 sm:grid-cols-3">{[{value:'entreprise_existante',label:'Entreprise existante',desc:'Améliorer, résoudre, développer.'},{value:'creation',label:'Entreprise en création',desc:'Avancer étape par étape.'},{value:'investisseur',label:'Investisseur',desc:'Opportunités, maturité, partenaires.'}].map((item)=><button key={item.value} type="button" onClick={()=>set('situation',item.value as typeof form.situation)} className={cn('rounded-xl border p-4 text-left transition',form.situation===item.value?'border-brand-600 bg-brand-50':'border-ink-200 hover:border-ink-400')}><p className="text-sm font-semibold text-ink-950">{item.label}</p><p className="mt-1 text-xs text-ink-500">{item.desc}</p></button>)}</div></div>
        <Field label="Nom de l’établissement" required><Input value={form.org} onChange={(e)=>set('org',e.target.value)} placeholder="École Al Amal" /></Field>
        <Field label="Type de structure" hint="École privée, crèche, clinique, hôtel…"><Input value={form.kind} onChange={(e)=>set('kind',e.target.value)} placeholder="École privée" /></Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Secteur"><Select value={form.sector} onChange={(e)=>setSector(e.target.value as Sector)}>{SECTOR_ORDER.map((sector)=><option key={sector} value={sector}>{SECTOR_LABEL[sector]}</option>)}</Select></Field>
          <Field label="Ville"><Input value={form.city} onChange={(e)=>set('city',e.target.value)} placeholder="Casablanca" /></Field>
          <Field label="Effectif"><Input value={form.size} onChange={(e)=>set('size',e.target.value)} placeholder="18 salariés" /></Field>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-ink-900">Affichage métier souhaité</p>
          <p className="mb-3 text-xs text-ink-500">Choisissez uniquement l’espace correspondant à votre activité. Les autres secteurs ne seront pas affichés dans votre compte.</p>
          <div className="grid gap-3 sm:grid-cols-2">{WORKSPACE_PROFILES[form.sector].map((profile)=><button key={profile.value} type="button" onClick={()=>set('workspaceProfile',profile.value)} className={cn('rounded-xl border p-4 text-left transition', form.workspaceProfile===profile.value?'border-brand-600 bg-brand-50':'border-ink-200 hover:border-ink-400')}><p className="text-sm font-semibold text-ink-950">{profile.label}</p><p className="mt-1 text-xs leading-relaxed text-ink-500">{profile.description}</p></button>)}</div>
        </div>
        <Alert tone="info">Votre SaaS métier sera visible mais verrouillé jusqu’à activation par ALLNEEDS. Aucun autre secteur ne sera affiché.</Alert>
      </> : null}
      {step===1 ? <>
        <div className="grid gap-5 sm:grid-cols-2"><Field label="Votre nom" required><Input value={form.name} onChange={(e)=>set('name',e.target.value)} placeholder="Amina Bennani" /></Field><Field label="Votre fonction"><Input value={form.role} onChange={(e)=>set('role',e.target.value)} placeholder="Directrice" /></Field></div>
        <Field label="Adresse e-mail" required><Input type="email" value={form.email} onChange={(e)=>set('email',e.target.value)} placeholder="vous@etablissement.ma" /></Field>
        <Field label="Téléphone" hint="Utilisé pour les rendez-vous et WhatsApp."><Input value={form.phone} onChange={(e)=>set('phone',e.target.value)} placeholder="+212 6 ..." /></Field>
        <Alert tone="info">STARTER reste le diagnostic de lancement. CONNECT, PLUS et PRIORITÉ sont proposés séparément dans votre compte, selon les conditions de la fiche ALLNEEDS ACCÈS.</Alert>
      </> : null}
      {step===2 ? <>
        <Card className="p-5"><p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Récapitulatif</p><dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-ink-500">Situation</dt><dd className="font-medium text-ink-900">{form.situation==='creation'?'Entreprise en création':form.situation==='investisseur'?'Investisseur':'Entreprise existante'}</dd></div><div className="flex justify-between gap-4"><dt className="text-ink-500">Établissement</dt><dd className="font-medium text-ink-900">{form.org}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-500">Secteur</dt><dd className="font-medium text-ink-900">{SECTOR_LABEL[form.sector]}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-500">Espace métier</dt><dd className="text-right font-medium text-ink-900">{WORKSPACE_PROFILES[form.sector].find((x)=>x.value===form.workspaceProfile)?.label}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-500">Contact</dt><dd className="text-right font-medium text-ink-900">{form.name}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-500">ALLNEEDS ACCÈS</dt><dd className="text-right font-medium text-ink-900">À choisir après création du compte</dd></div>
        </dl></Card>
        {offreFromUrl ? <Alert tone="info">Vous avez consulté la formule {offreFromUrl}. Elle ne sera pas activée automatiquement : vous la confirmerez depuis votre compte.</Alert> : null}
        <Checkbox checked={form.accept} onChange={(e)=>set('accept',e.target.checked)} label="J’accepte les conditions et la politique de confidentialité." />
      </> : null}
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <div className="flex items-center justify-between gap-3 pt-2"><Button variant="ghost" onClick={()=>setStep((v)=>Math.max(0,v-1))} disabled={step===0}>Retour</Button>{step<STEP_LABELS.length-1?<Button onClick={next}>Continuer <ArrowRight className="h-4 w-4" /></Button>:<Button onClick={submit}>Créer mon compte <ArrowRight className="h-4 w-4" /></Button>}</div>
    </div>
  </AuthLayout>
}
