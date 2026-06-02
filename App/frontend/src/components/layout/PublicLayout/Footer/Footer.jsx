import { Link } from 'react-router-dom';
import { useSiteConfigStore } from '../../../../stores/siteConfigStore';

export default function Footer() {
  const { config } = useSiteConfigStore()

  return (
    <footer className="mt-auto" style={{ backgroundColor: 'var(--clr-surface)' }}>
      <div className="max-w-content mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
          <div>
            <h3 className="font-bold text-lg mb-3" style={{ color: '#fff' }}>{config.siteName}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
               {config.siteSubtitle}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3" style={{ color: '#fff' }}>Enlaces Rapidos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/carreras" className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.7)' }}>Carreras</Link></li>
              <li><Link to="/noticias" className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.7)' }}>Noticias</Link></li>
              <li><Link to="/estudiantes" className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.7)' }}>Estudiantes</Link></li>
              <li><Link to="/login" className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.7)' }}>Administracion</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3" style={{ color: '#fff' }}>Contacto</h3>
            <ul className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <li>{config.contactEmail}</li>
              <li>{config.address}</li>
              <li>{config.contactPhone}</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="py-4 text-center text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
        <p>{config.footerText}</p>
      </div>
    </footer>
  );
}
