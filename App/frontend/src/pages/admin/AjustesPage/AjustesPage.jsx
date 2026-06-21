import { useState, useEffect } from 'react';
import { useSiteConfigStore } from '../../../stores/siteConfigStore';

const AjustesPage = () => {
  const { config, isLoading, saveConfig } = useSiteConfigStore();
  const [form, setForm] = useState({
    siteName: '', siteSubtitle: '', contactEmail: '', contactPhone: '',
    address: '', seoDescription: '', socialLinks: {}
  });
  const [guardado, setGuardado] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!config) return;
    setForm({
      siteName: config.siteName, siteSubtitle: config.siteSubtitle,
      contactEmail: config.contactEmail, contactPhone: config.contactPhone,
      address: config.address, seoDescription: config.seoDescription,
      socialLinks: { ...config.socialLinks }
    });
  }, [config]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social-')) {
      const key = name.slice(7);
      setForm((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGuardar = async () => {
    setErrorMsg('');
    try {
      useSiteConfigStore.getState().updateConfig({
        siteName: form.siteName, siteSubtitle: form.siteSubtitle,
        contactEmail: form.contactEmail, contactPhone: form.contactPhone,
        address: form.address, seoDescription: form.seoDescription,
        socialLinks: form.socialLinks
      });
      await saveConfig();
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2500);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error al guardar los cambios');
      setGuardado(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-1/3" />
        <div className="h-4 bg-gray-100 dark:bg-slate-700/50 rounded w-1/4" />
        <div className="h-64 bg-gray-100 dark:bg-slate-700/50 rounded-xl" />
      </div>);

  }

  if (!config) return null;

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 tracking-tight">Ajustes del Sitio</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">Configuracion general, SEO y redes sociales.</p>
        </div>
        <button onClick={handleGuardar} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-all shadow-sm active:scale-95">
          Guardar Cambios
        </button>
      </div>

      {guardado &&
      <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm font-medium rounded-xl">
          <span className="w-2 h-2 rounded-full bg-green-500" /> Cambios guardados correctamente.
        </div>
      }
      {errorMsg &&
      <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm font-medium rounded-xl">
          <span className="w-2 h-2 rounded-full bg-red-500" /> {errorMsg}
        </div>
      }

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-slate-100">Configuracion General</h2>
          <div className="space-y-3">
            <Campo label="Nombre del sitio" name="siteName" value={form.siteName} onChange={handleChange} />
            <Campo label="Subtitulo" name="siteSubtitle" value={form.siteSubtitle} onChange={handleChange} />
            <Campo label="Email de contacto" name="contactEmail" value={form.contactEmail} onChange={handleChange} />
            <Campo label="Telefono" name="contactPhone" value={form.contactPhone} onChange={handleChange} />
            <Campo label="Direccion" name="address" value={form.address} onChange={handleChange} />
          </div>
        </section>

        <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-slate-100">Redes Sociales</h2>
          <div className="space-y-3">
            {Object.entries(form.socialLinks).map(([key, value]) =>
            <Campo key={key} label={key.charAt(0).toUpperCase() + key.slice(1)} name={`social-${key}`} value={value || ''} onChange={handleChange} />
            )}
          </div>
        </section>

        <section className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 space-y-4">
          <h2 className="text-base font-bold text-gray-900 dark:text-slate-100">SEO</h2>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">Descripcion SEO</label>
            <textarea name="seoDescription" value={form.seoDescription} onChange={handleChange} rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
            placeholder="Breve descripcion para motores de busqueda..." />

          </div>
        </section>
      </div>
    </div>);

};

const Campo = ({ label, name, value, onChange }) =>
<div>
    <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1">{label}</label>
    <input name={name} value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:placeholder:text-slate-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
  </div>;

export default AjustesPage;
