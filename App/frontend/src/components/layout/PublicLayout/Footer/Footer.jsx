import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 mt-auto">
      <div className="max-w-content mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">IFTS 29</h3>
            <p className="text-sm leading-relaxed">
               Instituto de Formacion Tecnica Superior N 29. Formando profesionales en tecnologia desde hace mas de 15
               años.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Enlaces Rapidos</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/carreras" className="hover:text-white transition-colors">Carreras</Link></li>
              <li><Link to="/noticias" className="hover:text-white transition-colors">Noticias</Link></li>
              <li><Link to="/estudiantes" className="hover:text-white transition-colors">Estudiantes</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Administracion</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>dfts.ifts29@bue.edu.ar</li>
              <li>Buenos Aires, Argentina</li>
              <li>(011) 1234-5678</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-700 py-4 text-center text-sm">
        <p>Todos los derechos reservados &copy; IFTS N°29 - 2026</p>
      </div>
    </footer>
  );
}
