import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight, Building2, Eye, EyeOff, KeyRound, ShieldCheck, UserRoundCog } from 'lucide-react'
import { AuthLayout } from '@/components/AuthLayout'
import { Alert, Button, Card, Checkbox, Field, Input } from '@/components/ui'
import { useDemo, type Role } from '@/store/store'

export const Route = createFileRoute('/connexion')({
  component: ConnexionPage,
  head: () => ({ meta: [{ title: 'Connexion — ALLNEEDS' }] }),
})

const DEMO_ACCOUNTS = [
  { role: 'client' as const, userId: 'usr-amina', title: 'Client Enseignement', email: 'a.bennani@al-amal.ma', target: '/app' as const, icon: Building2, desc: 'École Al Amal · uniquement l’espace Enseignement.' },
  { role: 'client' as const, userId: 'usr-youssef', title: 'Client Santé', email: 'direction@clinique-nour.ma', target: '/app' as const, icon: Building2, desc: 'Clinique Nour · uniquement l’espace Santé.' },
  { role: 'client' as const, userId: 'usr-salma', title: 'Client Tourisme', email: 'salma@riad-lumen.ma', target: '/app' as const, icon: Building2, desc: 'Riad Lumen · uniquement l’espace Tourisme.' },
  { role: 'concierge' as const, userId: 'conc-001', title: 'Concierge', email: 'concierge.sante@allneeds.ma', target: '/concierge' as const, icon: UserRoundCog, desc: 'Voit seulement les entreprises et secteurs qui lui sont attribués.' },
  { role: 'admin' as const, userId: 'admin-nada', title: 'Administrateur', email: 'nada@allneeds.ma', target: '/admin' as const, icon: ShieldCheck, desc: 'Gère les concierges, entreprises et autorisations.' },
]

const DEMO_PASSWORD = 'demonstration'


function ConnexionPage() {
  const navigate = useNavigate()
  const { setRole, dispatch } = useDemo()
  const [email, setEmail] = useState('a.bennani@al-amal.ma')
  const [password, setPassword] = useState('demonstration')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  function openRole(role: Role, target: '/app' | '/admin' | '/concierge', userId?: string) {
    setRole(role)
    if (userId) dispatch({ type: 'SWITCH_USER', userId })
    navigate({ to: target as any })
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) {
      setError('Saisissez une adresse e-mail valide.')
      return
    }
    const normalized = email.trim().toLowerCase()
    if (password !== DEMO_PASSWORD) {
      setError('Mot de passe de démonstration incorrect.')
      return
    }
    const account = DEMO_ACCOUNTS.find((item) => item.email.toLowerCase() === normalized)
    if (!account) {
      setError('Compte de démonstration inconnu. Utilisez un des comptes affichés.')
      return
    }
    return openRole(account.role, account.target, account.userId)
  }

  return (
    <AuthLayout
      title="Choisissez votre espace ALLNEEDS"
      subtitle="Trois profils séparés : Client, Concierge et Administrateur. Chaque profil n'accède qu'aux fonctions qui lui sont autorisées."
      footer={<>Pas encore de compte client ? <Link to="/inscription" className="font-semibold text-brand-700">Faire une demande</Link></>}
    >
      <div className="mb-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {DEMO_ACCOUNTS.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => { setEmail(account.email); setPassword(DEMO_PASSWORD); openRole(account.role, account.target, account.userId) }}
            className="rounded-xl border border-ink-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-sm"
          >
            <account.icon className="h-5 w-5 text-brand-700" />
            <p className="mt-3 text-sm font-bold text-ink-950">{account.title}</p>
            <p className="mt-1 text-[0.72rem] leading-relaxed text-ink-500">{account.desc}</p>
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-5">
        <Field label="Adresse e-mail" required>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@entreprise.ma" />
        </Field>
        <Field label="Mot de passe" required>
          <div className="relative">
            <Input type={show ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
            <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-400 hover:bg-ink-100" aria-label="Afficher le mot de passe">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <div className="flex items-center justify-between">
          <Checkbox defaultChecked label="Rester connecté" />
          <button type="button" className="text-xs font-semibold text-brand-700">Mot de passe oublié ?</button>
        </div>
        {error ? <Alert tone="danger">{error}</Alert> : null}
        <Button type="submit" size="lg" fullWidth>Se connecter <ArrowRight className="h-4 w-4" /></Button>
      </form>

      <Card className="mt-8 p-4">
        <div className="flex items-start gap-3">
          <KeyRound className="mt-0.5 h-4 w-4 text-brand-700" />
          <p className="text-xs leading-relaxed text-ink-500">Démo UX : utilisez le mot de passe « demonstration ». Chaque compte client est rattaché à un seul secteur et ne voit jamais les deux autres.</p>
        </div>
      </Card>
    </AuthLayout>
  )
}
