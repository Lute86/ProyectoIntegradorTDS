import { useSiteConfigStore } from '../../../../stores/siteConfigStore';

export default function Footer() {
  const { config } = useSiteConfigStore()

  return (
    <footer className="mt-auto bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-content mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ color: 'rgba(255,255,255,0.8)' }}>
          <div>
            <h3 className="font-bold text-lg mb-3" style={{ color: '#fff' }}>{config.siteName}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
               {config.siteSubtitle}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3" style={{ color: '#fff' }}>Contacto</h3>
            <ul className="space-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {config.contactEmail && <li>{config.contactEmail}</li>}
              {config.address && <li>{config.address}</li>}
              {config.contactPhone && <li>{config.contactPhone}</li>}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3" style={{ color: '#fff' }}>Redes Sociales</h3>
            <ul className="space-y-2 text-sm">
              {Object.entries(config.socialLinks || {}).filter(([, url]) => url).length > 0 ? (
                Object.entries(config.socialLinks).map(([red, url]) =>
                  url ? (
                    <li key={red}>
                      <a href={url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white" style={{ color: 'rgba(255,255,255,0.7)' }}>
                        {red.charAt(0).toUpperCase() + red.slice(1)}
                      </a>
                    </li>
                  ) : null
                )
              ) : (
                <li style={{ color: 'rgba(255,255,255,0.5)' }}>Sin redes configuradas</li>
              )}
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
