import { useEffect, type ReactNode } from 'react'
import { Link, useNavigate, type LinkProps } from '@tanstack/react-router'
import {
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Gauge,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Target,
  UsersRound,
  LineChart,
  FolderKanban,
  LogOut,
  MessageSquare,
  Network,
  Receipt,
  RefreshCcw,
  Settings2,
  ShieldCheck,
  UserRoundCog,
} from 'lucide-react'
import { orgHasSaasAccess, useDemo, type Role } from '@/store/store'
import { cn } from '@/lib/utils'
import { Avatar, Button } from '@/components/ui'

/* ------------------------------------------------------------------ */
/* Toaster                                                             */
/* ------------------------------------------------------------------ */

export function Toaster() {
  const { state, dispatch } = useDemo()

  useEffect(() => {
    if (state.toasts.length === 0) return
    const timers = state.toasts.map((toast) =>
      window.setTimeout(() => dispatch({ type: 'TOAST_REMOVE', id: toast.id }), 5200),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [state.toasts, dispatch])

  if (state.toasts.length === 0) return null

  const tones = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    info: 'border-sky-200 bg-sky-50 text-sky-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
      {state.toasts.map((toast) => (
        <div key={toast.id} className={cn('pointer-events-auto animate-fade-up rounded-xl border px-4 py-3 shadow-lift', tones[toast.tone])}>
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.description ? <p className="mt-0.5 text-xs opacity-80">{toast.description}</p> : null}
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

interface NavItem {
  label: string
  to: LinkProps['to']
  icon: ReactNode
  badge?: number
  disabled?: boolean
  disabledHint?: string
}

function buildClientNav(unreadMessages: number, pendingDocs: number, saasEnabled: boolean, workspaceRole: 'dirigeant'|'manager'|'collaborateur'): NavItem[] {
  const items: NavItem[] = [
    { label: 'Accueil · Cockpit', to: '/app', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Objectifs', to: '/app/objectifs' as any, icon: <Target className="h-4 w-4" /> },
    { label: 'Actions', to: '/app/actions' as any, icon: <ListChecks className="h-4 w-4" /> },
    { label: 'Équipe', to: '/app/equipe' as any, icon: <UsersRound className="h-4 w-4" /> },
    { label: 'Écosystème', to: '/app/ecosysteme' as any, icon: <Network className="h-4 w-4" /> },
    { label: 'Performance', to: '/app/performance' as any, icon: <LineChart className="h-4 w-4" /> },
    { label: 'Projets', to: '/app/projets' as any, icon: <FolderKanban className="h-4 w-4" /> },
    { label: 'Documents', to: '/app/documents', icon: <ShieldCheck className="h-4 w-4" />, badge: pendingDocs },
    { label: 'Notifications', to: '/app/notifications' as any, icon: <Bell className="h-4 w-4" /> },
    { label: 'Espace métier SaaS', to: '/app/espace-metier', icon: <Building2 className="h-4 w-4" />, disabled: !saasEnabled, disabledHint: 'En attente de validation ALLNEEDS' },
    { label: 'Plus · Besoins', to: '/app/besoins', icon: <Inbox className="h-4 w-4" /> },
    { label: 'Plus · Diagnostics', to: '/app/diagnostics', icon: <Gauge className="h-4 w-4" /> },
    { label: 'Plus · Missions', to: '/app/missions', icon: <Briefcase className="h-4 w-4" /> },
    { label: 'Plus · Messages', to: '/app/messages', icon: <MessageSquare className="h-4 w-4" />, badge: unreadMessages },
    { label: 'Paramètres', to: '/app/parametres' as any, icon: <Settings2 className="h-4 w-4" /> },
  ]
  if (workspaceRole === 'collaborateur') return items.filter((item) => ['Accueil · Cockpit','Actions','Projets','Documents','Notifications','Plus · Messages','Paramètres'].includes(item.label))
  if (workspaceRole === 'manager') return items.filter((item) => !['Espace métier SaaS','Plus · Diagnostics'].includes(item.label))
  return items
}


function buildConciergeNav(): NavItem[] {
  return [
    { label: 'Mon portefeuille', to: '/concierge' as any, icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Entreprises suivies', to: '/concierge/entreprises' as any, icon: <Building2 className="h-4 w-4" /> },
    { label: 'Besoins', to: '/concierge/besoins' as any, icon: <Inbox className="h-4 w-4" /> },
    { label: 'Diagnostics', to: '/concierge/diagnostics' as any, icon: <Gauge className="h-4 w-4" /> },
    { label: 'Missions', to: '/concierge/missions' as any, icon: <Briefcase className="h-4 w-4" /> },
    { label: 'Suivi commercial', to: '/concierge/suivi-commercial' as any, icon: <BarChart3 className="h-4 w-4" /> },
    { label: 'Prestataires', to: '/concierge/prestataires' as any, icon: <Network className="h-4 w-4" /> },
    { label: 'Rendez-vous', to: '/concierge/rendez-vous' as any, icon: <CalendarDays className="h-4 w-4" /> },
    { label: 'Documents', to: '/concierge/documents' as any, icon: <FileText className="h-4 w-4" /> },
    { label: 'Messages', to: '/concierge/messages' as any, icon: <MessageSquare className="h-4 w-4" /> },
  ]
}

function buildAdminNav(): NavItem[] {
  return [
    { label: 'Revue diagnostics auto', to: '/admin/diagnostics-auto', icon: <Gauge className="h-4 w-4" /> },
    { label: 'Vue d’ensemble', to: '/admin', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Concierges & accès', to: '/admin/concierges' as any, icon: <UserRoundCog className="h-4 w-4" /> },
    { label: 'Pipeline', to: '/admin/pipeline', icon: <BarChart3 className="h-4 w-4" /> },
    { label: 'Clients', to: '/admin/clients', icon: <Building2 className="h-4 w-4" /> },
    { label: 'Qualification', to: '/admin/qualification', icon: <ClipboardList className="h-4 w-4" /> },
    { label: 'Diagnostics internes', to: '/admin/diagnostics', icon: <Gauge className="h-4 w-4" /> },
    { label: 'Grille STARTER', to: '/admin/grille', icon: <ClipboardCheck className="h-4 w-4" /> },
    { label: 'Besoins', to: '/admin/besoins', icon: <Inbox className="h-4 w-4" /> },
    { label: 'Prestataires', to: '/admin/prestataires', icon: <Network className="h-4 w-4" /> },
    { label: 'Missions', to: '/admin/missions', icon: <Briefcase className="h-4 w-4" /> },
    { label: 'Quotas & abonnements', to: '/admin/quotas', icon: <RefreshCcw className="h-4 w-4" /> },
    { label: 'Relances', to: '/admin/relances', icon: <Bell className="h-4 w-4" /> },
  ]
}

/* ------------------------------------------------------------------ */
/* App shell                                                           */
/* ------------------------------------------------------------------ */

export function AppShell({
  children,
  variant,
}: {
  children: ReactNode
  variant: 'client' | 'admin' | 'concierge'
}) {
  const { state, dispatch, user, role } = useDemo()
  const navigate = useNavigate()

  const unread = state.threads.reduce((acc, t) => acc + t.unread, 0)
  const pendingDocs = state.documents.filter((d) => d.status !== 'valide').length
  const clientOrg = state.orgs.find((org) => org.id === user.orgId)
  const clientSaasEnabled = clientOrg ? orgHasSaasAccess(state, clientOrg.id, clientOrg.sector) : false

  const nav = variant === 'admin' ? buildAdminNav() : variant === 'concierge' ? buildConciergeNav() : buildClientNav(unread, pendingDocs, clientSaasEnabled, state.clientWorkspaceRole)

  function switchRole(next: Role) {
    dispatch({ type: 'SET_ROLE', role: next })
    navigate({ to: next === 'admin' ? '/admin' : next === 'concierge' ? ('/concierge' as any) : '/app' })
  }

  return (
    <div className={`workspace-redesign workspace-${variant} flex min-h-screen bg-ink-50`}>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ink-100 bg-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-ink-100 px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-950 font-display text-base text-sand-300">
              A
            </span>
            <span className="leading-none">
              <span className="block text-sm font-bold tracking-tight text-ink-950">ALLNEEDS</span>
              <span className="block text-[0.65rem] font-semibold uppercase tracking-widest text-ink-400">
                {variant === 'admin' ? 'Administration' : variant === 'concierge' ? 'Concierge' : 'Espace client'}
              </span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {nav.map((item) => item.disabled ? (
            <div key={String(item.to)} title={item.disabledHint} className="flex cursor-not-allowed items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-300">
              <span className="flex items-center gap-2.5">{item.icon}{item.label}</span>
              <span className="text-[0.62rem] font-bold uppercase tracking-wider text-ink-300">Verrouillé</span>
            </div>
          ) : (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50 hover:text-ink-950"
              activeProps={{ className: 'bg-brand-50 text-brand-800 hover:bg-brand-50' }}
            >
              <span className="flex items-center gap-2.5">{item.icon}{item.label}</span>
              {item.badge ? <span className="rounded-full bg-ink-950 px-1.5 py-0.5 text-[0.62rem] font-bold text-white">{item.badge}</span> : null}
            </Link>
          ))}
        </nav>

        <div className="border-t border-ink-100 p-3">
          <div className="rounded-xl bg-ink-50 p-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-400">Jeu de démonstration</p>
            <p className="mt-1 text-[0.7rem] leading-relaxed text-ink-500">
              Les données sont partagées entre l’espace client et l’admin, stockées dans votre navigateur.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => {
                dispatch({ type: 'RESET' })
                dispatch({ type: 'TOAST_ADD', toast: { title: 'Démonstration réinitialisée', tone: 'info' } })
              }}
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Réinitialiser
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-ink-100 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-950 font-display text-base text-sand-300 lg:hidden">
              A
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-950">
                {variant === 'admin' ? 'Administration ALLNEEDS' : variant === 'concierge' ? 'Portefeuille concierge' : (clientOrg?.name ?? 'Espace client')}
              </p>
              <p className="truncate text-xs text-ink-500">
                {variant === 'admin' ? 'Vue interne · gestion des accès' : variant === 'concierge' ? 'Pilotage complet des entreprises attribuées' : clientOrg ? `${clientOrg.kind} · ${clientOrg.city}` : 'Votre espace ALLNEEDS'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-full border border-ink-200 bg-ink-50 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-ink-600 sm:block">
              {variant === 'admin' ? 'Administrateur' : variant === 'concierge' ? 'Concierge' : 'Client'}
            </div>

            {variant === 'client' ? (
              <Link
                to="/app/messages"
                className="relative rounded-lg p-2 text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
              >
                <Bell className="h-4 w-4" />
                {unread > 0 ? <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" /> : null}
              </Link>
            ) : null}

            <div className="flex items-center gap-2 border-l border-ink-100 pl-2">
              <Avatar name={user.name} size="sm" />
              <div className="hidden leading-tight md:block">
                <p className="text-xs font-semibold text-ink-900">{user.name}</p>
                <p className="text-[0.65rem] text-ink-500">{user.roleLabel}</p>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-ink-400 md:block" />
            </div>

            <button
              type="button"
              onClick={() => navigate({ to: '/' })}
              className="rounded-lg p-2 text-ink-400 transition hover:bg-ink-100 hover:text-ink-800"
              title="Retour au site public"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page header (used inside app + admin)                               */
/* ------------------------------------------------------------------ */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string
  title: string
  description?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow ? <p className="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-700">{eyebrow}</p> : null}
        <h1 className="font-display text-2xl tracking-tight text-ink-950 sm:text-3xl">{title}</h1>
        {description ? <div className="mt-1.5 text-sm text-ink-500">{description}</div> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}
