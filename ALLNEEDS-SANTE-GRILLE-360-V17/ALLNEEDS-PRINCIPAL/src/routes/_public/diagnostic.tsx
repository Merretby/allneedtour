import { useEffect, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CalendarCheck, CheckCircle2, Clock, Video } from 'lucide-react'
import { LAUNCH_OFFER, SECTORS, SECTOR_LABEL, SECTOR_ORDER } from '@/data/catalog'
import { useDemo } from '@/store/store'
import { Alert, Badge, Button, Card, Field, Input, Select, Textarea } from '@/components/ui'
import type { Sector } from '@/types'
import { useSelectedSector } from '@/lib/sector-filter'

export const Route = createFileRoute('/_public/diagnostic')({
  component: DiagnosticPage,
  head: () => ({
    meta: [
      { title: 'Réserver un diagnostic STARTER — ALLNEEDS' },
      {
        name: 'description',
        content:
          '1h30 pour identifier vos 3 priorités : inscriptions, image, équipe, charges. Sans engagement, livrable écrit.',
      },
    ],
  }),
})

const SLOTS = ['09:00 – 10:30', '10:00 – 11:30', '14:00 – 15:30', '16:00 – 17:30']

const TOPICS = [
  'Les inscriptions stagnent',
  'L’image et la présence en ligne ne suivent pas',
  'L’organisation repose sur trop peu de personnes',
  'Les charges augmentent sans visibilité',
  'Autre priorité',
]

function nextBusinessDays(count: number) {
  const out: string[] = []
  const date = new Date()
  while (out.length < count) {
    const day = date.getDay()
    if (day !== 0 && day !== 6) out.push(date.toISOString().slice(0, 10))
    date.setDate(date.getDate() + 1)
  }
  return out
}

export function DiagnosticPage() {
  const { dispatch } = useDemo()
  const selectedSector = useSelectedSector()
  const days = nextBusinessDays(6)

  const [form, setForm] = useState({
    org: '',
    name: '',
    role: '',
    email: '',
    phone: '',
    sector: 'enseignement' as Sector,
    city: '',
    headcount: '',
    date: days[1] ?? days[0] ?? '',
    slot: SLOTS[1],
    format: 'visio' as 'sur_site' | 'visio' | 'telephone',
    topic: TOPICS[0],
  })
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (selectedSector) setForm((current) => ({ ...current, sector: selectedSector }))
  }, [selectedSector])

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.org.trim() || !form.name.trim() || !form.email.trim()) {
      setError('Merci de renseigner votre établissement, votre nom et votre e-mail.')
      return
    }
    dispatch({
      type: 'BOOKING_CREATE',
      booking: {
        at: `${form.date}T${form.slot.split(' – ')[0]}:00.000Z`,
        org: form.org,
        name: form.name,
        role: form.role,
        email: form.email,
        phone: form.phone,
        sector: form.sector,
        city: form.city,
        headcount: form.headcount,
        date: form.date,
        slot: form.slot,
        format: form.format,
        topic: form.topic,
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
          <h1 className="display-2 mt-6">Diagnostic réservé</h1>
          <p className="lede mx-auto mt-4 max-w-lg">
            {form.name.split(' ')[0]}, votre créneau du {new Date(form.date).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}{' '}
            à {form.slot} est confirmé pour {form.org}.
          </p>

          <div className="mx-auto mt-8 max-w-md rounded-2xl bg-ink-50 p-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Créneau</p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Format</dt>
                <dd className="font-medium text-ink-900">
                  {form.format === 'visio' ? 'Visio' : form.format === 'sur_site' ? 'Sur site' : 'Téléphone'}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Priorité évoquée</dt>
                <dd className="text-right font-medium text-ink-900">{form.topic}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-500">Durée</dt>
                <dd className="font-medium text-ink-900">1h30 maximum</dd>
              </div>
            </dl>
          </div>

          <p className="mt-6 text-sm text-ink-600">
            Vous recevez une confirmation par e-mail et WhatsApp. Sans engagement : vous repartez avec 3 priorités
            écrites.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/missions/$code" params={{ code: 'starter' }}>
              <Button>
                Découvrir STARTER
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">Retour à l’accueil</Button>
            </Link>
          </div>

          <p className="mt-6 text-xs text-ink-400">
            La réservation apparaît dans le dashboard admin (rubrique Rendez-vous).
          </p>
        </Card>
      </div>
    )
  }

  return (
    <>
      <section className="border-b border-ink-100 bg-ink-950 text-white">
        <div className="container-page py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <Badge tone="warning">{LAUNCH_OFFER.label} · {LAUNCH_OFFER.deadline}</Badge>
              <h1 className="mt-5 font-display text-4xl leading-[1.08] tracking-tight sm:text-5xl">
                Commencez par le diagnostic.
              </h1>
              <p className="mt-5 max-w-xl leading-relaxed text-ink-200">
                1h30 pour identifier vos 3 priorités, sans engagement. Vous repartez avec un état des lieux, vos
                difficultés prioritaires et une recommandation écrite.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { icon: Clock, title: '1h30 maximum', detail: 'Un créneau unique, à votre initiative.' },
                  { icon: Video, title: 'Visio, sur site ou téléphone', detail: 'Comme vous préférez.' },
                  { icon: CalendarCheck, title: 'Créneau sous 72 h', detail: 'Selon nos disponibilités.' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-sand-300" />
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-sm text-ink-300">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-sand-300">Ce que nous analysons</p>
              <ul className="mt-4 space-y-3">
                {SECTORS.enseignement.levers.map((lever) => (
                  <li key={lever.id}>
                    <p className="text-sm font-semibold">{lever.name}</p>
                    <p className="text-xs text-ink-300">{lever.detail}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-white/10 pt-5 text-xs text-ink-300">
                Non inclus : création, production, accompagnement opérationnel, recherche de prestataires, négociation ou
                mise en œuvre. Aucun avis pédagogique, réglementaire ou juridique.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-6 sm:p-8">
            <h2 className="font-display text-2xl tracking-tight text-ink-950">Réserver mon créneau</h2>
            <p className="mt-2 text-sm text-ink-500">Tous les champs marqués d’un astérisque sont nécessaires.</p>

            <form onSubmit={submit} className="mt-8 space-y-5">
              <Field label="Nom de l’établissement" required>
                <Input value={form.org} onChange={(e) => set('org', e.target.value)} placeholder="École Al Amal" />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Votre nom" required>
                  <Input value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Amina Bennani" />
                </Field>
                <Field label="Votre fonction">
                  <Input value={form.role} onChange={(e) => set('role', e.target.value)} placeholder="Directrice" />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="E-mail" required>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    placeholder="vous@etablissement.ma"
                  />
                </Field>
                <Field label="Téléphone">
                  <Input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+212 6 ..." />
                </Field>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <Field label="Secteur">
                  {selectedSector ? (
                    <div className="flex h-11 items-center rounded-xl border border-ink-200 bg-ink-50 px-3 text-sm font-semibold text-ink-800">{SECTOR_LABEL[selectedSector]}</div>
                  ) : (
                    <Select value={form.sector} onChange={(e) => set('sector', e.target.value as Sector)}>
                      {SECTOR_ORDER.map((sector) => (
                        <option key={sector} value={sector}>{SECTOR_LABEL[sector]}</option>
                      ))}
                    </Select>
                  )}
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

              <Field label="Priorité que vous souhaitez aborder" required>
                <Select value={form.topic} onChange={(e) => set('topic', e.target.value)}>
                  {TOPICS.map((topic) => (
                    <option key={topic} value={topic}>
                      {topic}
                    </option>
                  ))}
                </Select>
              </Field>

              <div>
                <p className="mb-2 text-xs font-semibold text-ink-700">Date</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {days.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => set('date', day)}
                      className={`rounded-lg border px-3 py-2.5 text-left text-xs transition ${
                        form.date === day
                          ? 'border-brand-600 bg-brand-50 font-semibold text-brand-800'
                          : 'border-ink-200 hover:border-ink-400'
                      }`}
                    >
                      {new Date(day).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Créneau">
                  <Select value={form.slot} onChange={(e) => set('slot', e.target.value)}>
                    {SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Format">
                  <Select value={form.format} onChange={(e) => set('format', e.target.value as typeof form.format)}>
                    <option value="visio">Visio</option>
                    <option value="sur_site">Sur site</option>
                    <option value="telephone">Téléphone</option>
                  </Select>
                </Field>
              </div>

              {error ? <p className="text-xs text-red-600">{error}</p> : null}

              <Button type="submit" size="lg" fullWidth>
                Confirmer mon créneau
                <ArrowRight className="h-4 w-4" />
              </Button>

              <p className="text-xs leading-relaxed text-ink-500">
                En confirmant, vous acceptez d’être recontacté pour organiser ce rendez-vous. Aucun engagement
                contractuel, aucune donnée nominative d’élève ou de patient n’est demandée.
              </p>
            </form>
          </Card>

          <aside className="space-y-5">
            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Vous repartez avec</p>
              <ul className="mt-4 space-y-2.5">
                {[
                  'Un état des lieux synthétique',
                  'Vos principales forces',
                  'Vos difficultés prioritaires',
                  'Les opportunités détectées',
                  '3 priorités recommandées',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-ink-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <Alert tone="info" title="Votre diagnostic">Après analyse et validation, votre diagnostic est publié dans votre espace client avec vos priorités et le comparatif des formules.</Alert>

            <Card className="p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Et ensuite ?</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Si le diagnostic montre que vous avez besoin de process, d’outils ou d’un suivi, nous vous présentons
                PRO ou PERFORMANCE — avec le périmètre et les limites écrits avant signature.
              </p>
              <Link to="/missions" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                Voir les formules
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Card>
          </aside>
        </div>
      </section>
    </>
  )
}
