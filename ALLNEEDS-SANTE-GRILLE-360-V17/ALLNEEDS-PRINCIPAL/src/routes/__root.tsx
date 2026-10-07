import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Toaster } from '@/components/layouts'

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Outlet />
      <Toaster />
    </div>
  )
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-display text-7xl text-sand-400">404</p>
      <div>
        <h1 className="display-2">Page introuvable</h1>
        <p className="lede mx-auto mt-3 max-w-md">
          Cette page n’existe pas ou a été déplacée. Reprenons depuis l’accueil.
        </p>
      </div>
      <a
        href="/"
        className="inline-flex h-11 items-center rounded-lg bg-brand-700 px-5 text-sm font-semibold text-white transition hover:bg-brand-800"
      >
        Retour à l’accueil
      </a>
    </div>
  )
}
