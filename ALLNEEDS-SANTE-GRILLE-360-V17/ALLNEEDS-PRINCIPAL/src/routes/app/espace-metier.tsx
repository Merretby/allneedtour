import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink, HeartPulse } from 'lucide-react'

export const Route = createFileRoute('/app/espace-metier')({ component: Metier })

function Metier() {
  const url = 'https://allneed-s-sante.vercel.app'
  return (
    <section className="container-page py-10">
      <div className="health-external-card">
        <div className="health-external-icon"><HeartPulse size={28}/></div>
        <div>
          <span className="eyebrow">ALLNEEDS SANTÉ · ESPACE SÉPARÉ</span>
          <h1>La gestion Santé vit dans sa propre plateforme.</h1>
          <p>Le portail principal conserve votre parcours ALLNEEDS. L’espace opérationnel Santé est maintenant séparé pour garder une expérience plus simple et plus claire.</p>
        </div>
        {url ? <a href={url} target="_blank" rel="noreferrer" className="health-external-action">Ouvrir ALLNEEDS Santé <ExternalLink size={16}/></a> : <div className="health-external-action disabled">Lien disponible après publication</div>}
      </div>
    </section>
  )
}
