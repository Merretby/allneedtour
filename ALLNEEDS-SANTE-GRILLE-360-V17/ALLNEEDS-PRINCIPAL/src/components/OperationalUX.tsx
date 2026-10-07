import { Link } from '@tanstack/react-router'
import { AlertTriangle, ArrowRight, CheckCircle2, CircleDot, Info, Target } from 'lucide-react'
import type { NextActionItem, OperationalTone } from '@/lib/operational'
import { cn } from '@/lib/utils'

const toneMeta: Record<OperationalTone, { label: string; className: string; icon: typeof Info }> = {
  action: { label: 'Action requise', className: 'bg-blue-50 text-blue-800 ring-blue-200', icon: CircleDot },
  attention: { label: 'Attention', className: 'bg-amber-50 text-amber-800 ring-amber-200', icon: AlertTriangle },
  information: { label: 'Information', className: 'bg-slate-50 text-slate-700 ring-slate-200', icon: Info },
  resultat: { label: 'Résultat', className: 'bg-emerald-50 text-emerald-800 ring-emerald-200', icon: CheckCircle2 },
}

export function WorkflowStrip({ compact = false }: { compact?: boolean }) {
  const steps = ['Besoin', 'Diagnostic', 'Priorité', 'Décision', 'Action', 'Résultat', 'KPI', 'Optimisation']
  return (
    <div className={cn('operational-loop', compact && 'is-compact')} aria-label="Boucle opérationnelle ALLNEEDS">
      {steps.map((step, index) => (
        <div className="operational-loop-step" key={step}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{step}</strong>
          {index < steps.length - 1 ? <ArrowRight className="operational-loop-arrow" size={14} /> : null}
        </div>
      ))}
    </div>
  )
}

export function NextActionCard({ action, featured = false }: { action: NextActionItem; featured?: boolean }) {
  const meta = toneMeta[action.tone]
  const Icon = meta.icon
  return (
    <article className={cn('next-action-card', featured && 'is-featured')}>
      <div className="next-action-topline">
        <span className={cn('next-action-tone', meta.className)}><Icon size={13} /> {meta.label}</span>
        {featured ? <span className="next-action-priority"><Target size={13} /> Prochaine action utile</span> : null}
      </div>
      <h3>{action.title}</h3>
      <p className="next-action-detail">{action.detail}</p>
      <dl className="next-action-context">
        <div><dt>Pourquoi maintenant</dt><dd>{action.why}</dd></div>
        <div><dt>Résultat attendu</dt><dd>{action.result}</dd></div>
      </dl>
      <Link to={action.to as any} className="next-action-link">Ouvrir l’action <ArrowRight size={15} /></Link>
    </article>
  )
}

export function EmptyNextAction() {
  return (
    <div className="next-action-empty">
      <CheckCircle2 size={22} />
      <div><strong>Aucune action prioritaire détectée.</strong><p>Votre espace ne contient pas actuellement d’élément nécessitant une décision immédiate.</p></div>
    </div>
  )
}
