import { useState, useEffect } from 'react';
import { useSiteConfigStore } from '../../../stores/siteConfigStore';

interface FormData {
  siteName: string;
  siteSubtitle: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  seoDescription: string;
  instagram: string;
  facebook: string;
}

const AjustesPage = () => {
  const { config, isLoading, saveConfig } = useSiteConfigStore();
  const [form, setForm] = useState<FormData>({
    siteName: '', siteSubtitle: '', contactEmail: '', contactPhone: '',
    address: '', seoDescription: '', instagram: '', facebook: '',
  });
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    if (!config) return;
    setForm({
      siteName: config.siteName, siteSubtitle: config.siteSubtitle,
      contactEmail: config.contactEmail, contactPhone: config.contactPhone,
      address: config.address, seoDescription: config.seoDescription,
      instagram: config.socialLinks?.instagram || '',
      facebook: config.socialLinks?.facebook || '',
    });
  }, [config]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGuardar = async () => {
    try {
      useSiteConfigStore.getState().updateConfig({
        siteName: form.siteName, siteSubtitle: form.siteSubtitle,
        contactEmail: form.contactEmail, contactPhone: form.contactPhone,
        address: form.address, seoDescription: form.seoDescription,
        socialLinks: { instagram: form.instagram, facebook: form.facebook },
      });
      await saveConfig();
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2500);
    } catch {
      setGuardado(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-100 rounded w-1/4" />
        <div className="h-64 bg-gray-100 rounded-xl" />
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Ajustes del Sitio</h1>
          <p className="text-sm text-gray-500">Configuracion general, SEO y redes sociales.</p>
        </div>
        <button onClick={handleGuardar} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95">
          Guardar Cambios
        </button>
      </div>

      {guardado && (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-xl">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Cambios guardados correctamente.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <h2 className="text-base font-bold text-gray-900">Configuracion General</h2>
          <div className="space-y-3">
            <Campo label="Nombre del sitio" name="siteName" value={form.siteName} onChange={handleChange} />
            <Campo label="Subtitulo" name="siteSubtitle" value={form.siteSubtitle} onChange={handleChange} />
            <Campo label="Email de contacto" name="contactEmail" value={form.contactEmail} onChange={handleChange} />
            <Campo label="Telefono" name="contactPhone" value={form.contactPhone} onChange={handleChange} />
            <Campo label="Direccion" name="address" value={form.address} onChange={handleChange} />
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <h2 className="text-base font-bold text-gray-900">Redes Sociales</h2>
          <div className="space-y-3">
            <Campo label="Instagram (URL)" name="instagram" value={form.instagram} onChange={handleChange} />
            <Campo label="Facebook (URL)" name="facebook" value={form.facebook} onChange={handleChange} />
          </div>
        </section>

        <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-4">
          <h2 className="text-base font-bold text-gray-900">SEO</h2>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripcion SEO</label>
            <textarea name="seoDescription" value={form.seoDescription} onChange={handleChange} rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
              placeholder="Breve descripcion para motores de busqueda..."
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const Campo = ({ label, name, value, onChange }: { label: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    <input name={name} value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
  </div>
);

export default AjustesPage;
