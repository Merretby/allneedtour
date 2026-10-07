import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  GraduationCap,
  HeartPulse,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react'
import { selectSector, useSelectedSector } from '@/lib/sector-filter'

export const Route = createFileRoute('/_public/')({
  component: Home,
  head: () => ({ meta: [{ title: 'ALLNEEDS — Du besoin à la solution' }] }),
})

const sectors = [
  { id: 'sante' as const, name: 'Santé', icon: HeartPulse, desc: 'Patients, organisation, charges et priorités.', tags: 'Cabinets · Centres · Laboratoires', color: '#0ea5e9' },
  { id: 'enseignement' as const, name: 'Enseignement', icon: GraduationCap, desc: 'Inscriptions, équipe, image et prestataires.', tags: 'Écoles · Crèches · Formation', color: '#8b5cf6' },
  { id: 'tourisme' as const, name: 'Tourisme', icon: Compass, desc: 'Réservations, visibilité, exploitation et fournisseurs.', tags: 'Hébergement · Restauration · Activités', color: '#14b8a6' },
]

const spaces = [
  { label: 'Client', title: 'Suivre sans se perdre', copy: 'Vos besoins, vos missions et les prochaines actions dans un espace limité à votre secteur.', image: '/previews/client-sante.png', caption: 'Aperçu de l’espace Client', icon: LayoutDashboard },
  { label: 'Concierge', title: 'Traiter avec contexte', copy: 'Une vue de travail limitée aux entreprises attribuées, avec statuts, relances et actions utiles.', image: '/previews/concierge.png', caption: 'Aperçu de l’espace Concierge', icon: UsersRound },
  { label: 'Administrateur', title: 'Piloter avec contrôle', copy: 'Comptes, affectations, besoins, missions et accès regroupés dans une vue de pilotage globale.', image: '/previews/admin.png', caption: 'Aperçu de l’espace Administrateur', icon: ShieldCheck },
]

function Home() {
  const selected = useSelectedSector()
  return (
    <div className="v15-home">
      <section className="v15-hero-wrap">
        <div className="container-page v15-hero">
          <div className="v15-hero-copy">
            <span className="v15-kicker"><Sparkles size={14}/> ALLNEEDS · UN BESOIN, UN CHEMIN CLAIR</span>
            <h1>Votre besoin n’a pas besoin d’être compliqué.</h1>
            <p>ALLNEEDS vous aide à comprendre ce qui bloque, choisir la bonne priorité et passer à l’action avec un parcours simple.</p>
            <div className="v15-hero-actions">
              <a className="v15-primary" href="#secteurs">Choisir mon secteur <ArrowRight size={18}/></a>
              <Link className="v15-secondary" to="/connexion">Accéder à mon espace</Link>
            </div>
            <div className="v15-proof">
              <span><Check size={14}/> Un seul secteur à la fois</span>
              <span><Check size={14}/> Des étapes lisibles</span>
              <span><Check size={14}/> Des actions visibles</span>
            </div>
          </div>
          <div className="v15-command-card">
            <div className="v15-command-top"><span>Comment ça avance</span><strong>01 → 04</strong></div>
            <article className="is-main"><small>01 · BESOIN</small><h3>Je veux savoir où agir.</h3><p>Vous partez de votre situation, pas d’un catalogue.</p></article>
            <div className="v15-mini-steps">
              <article><span>02</span><div><small>COMPRENDRE</small><strong>Faire le point</strong></div></article>
              <article><span>03</span><div><small>STRUCTURER</small><strong>Clarifier la solution</strong></div></article>
              <article><span>04</span><div><small>AGIR</small><strong>Suivre la suite</strong></div></article>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page v15-sector-section" id="secteurs">
        <div className="v15-section-intro">
          <span className="v15-kicker dark">COMMENCEZ ICI</span>
          <h2>Choisissez votre secteur. Le reste du site s’adapte.</h2>
          <p>Une fois le secteur choisi, les autres univers disparaissent du parcours pour garder une expérience simple.</p>
        </div>
        <div className="v15-sector-grid">
          {sectors.map((sector, index) => {
            const Icon = sector.icon
            const isSelected = selected === sector.id
            return (
              <Link key={sector.id} to="/secteurs/$sector" params={{sector: sector.id}} onClick={() => selectSector(sector.id)} className={`v15-sector ${isSelected ? 'selected' : ''}`} style={{'--accent': sector.color} as React.CSSProperties}>
                <div className="v15-sector-index">0{index + 1}</div>
                <div className="v15-sector-icon"><Icon size={25}/></div>
                <div className="v15-sector-body">
                  <div className="v15-sector-title"><h3>{sector.name}</h3>{isSelected && <span>Secteur actuel</span>}</div>
                  <p>{sector.desc}</p>
                  <small>{sector.tags}</small>
                </div>
                <ArrowUpRight className="v15-sector-arrow" size={21}/>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="v15-journey">
        <div className="container-page">
          <div className="v15-section-intro light">
            <span className="v15-kicker">UN PARCOURS QUI NE VOUS NOIE PAS</span>
            <h2>Trois étapes. Une décision à la fois.</h2>
          </div>
          <div className="v15-journey-grid">
            {[
              ['01','Comprendre','Identifier les faits, les difficultés et les priorités.'],
              ['02','Structurer','Transformer les priorités retenues en méthodes et outils concrets.'],
              ['03','Agir','Mettre en œuvre, suivre les résultats et ajuster.'],
            ].map(([n,t,c]) => <article key={n}><span>{n}</span><div><h3>{t}</h3><p>{c}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="container-page v15-spaces">
        <div className="v15-section-intro split">
          <div><span className="v15-kicker dark">APRÈS CONNEXION</span><h2>Des espaces différents. Le même langage visuel.</h2></div>
          <p>Chaque profil voit ce dont il a besoin, sans exposer toute la complexité du produit.</p>
        </div>
        <div className="v15-space-stack">
          {spaces.map((space, idx) => {
            const Icon = space.icon
            return <article className="v15-space" key={space.label}>
              <div className="v15-space-copy"><span><Icon size={16}/>{space.label}</span><h3>{space.title}</h3><p>{space.copy}</p><small>Statuts visibles · prochaines actions · vue simplifiée</small></div>
              <figure><img src={space.image} alt={space.caption}/><figcaption>{space.caption}<em>Démo</em></figcaption></figure>
              <div className="v15-space-number">0{idx+1}</div>
            </article>
          })}
        </div>
      </section>

      <section className="container-page v15-bottom-cta">
        <div><span className="v15-kicker dark">PRÊT À COMMENCER ?</span><h2>Choisissez votre secteur et avancez étape par étape.</h2></div>
        <a className="v15-primary" href="#secteurs">Commencer maintenant <ArrowRight size={18}/></a>
      </section>
    </div>
  )
}
