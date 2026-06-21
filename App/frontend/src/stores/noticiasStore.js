import { create } from 'zustand';
import { noticiasService } from '../services/noticiasService';
import useUIStore from './uiStore';

const TTL = 30000;

export const useNoticiasStore = create((set, get) => ({
  noticias: [],
  selectedNoticia: null,
  categorias: [],
  isLoading: false,
  error: null,
  _lastFetched: 0,
  _lastParams: '\0',

  fetchNoticias: async (params) => {
    const now = Date.now();
    const { _lastFetched, _lastParams, noticias } = get();
    const paramsKey = params ? JSON.stringify(params) : '';
    // Solo usa cache si los datos son frescos (TTL 30s) Y se pidieron con los mismos
    // filtros. Asi, alternar entre la home (estado=publicado) y el admin (todos los
    // estados) siempre vuelve a pedir el listado correcto en vez de reusar el filtrado.
    if (
    paramsKey === _lastParams &&
    _lastFetched > 0 &&
    now - _lastFetched < TTL &&
    noticias.length > 0)
    {
      return;
    }
    set({ isLoading: true, error: null });
    try {
      const response = await noticiasService.getAll(params);
      // La API devuelve { success, data: { data: [...], total, page, limit, totalPages } }
      const datos = response.data?.data;
      const noticiasData = datos?.data ?? [];
      set({ noticias: noticiasData, isLoading: false, _lastFetched: Date.now(), _lastParams: paramsKey });
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al cargar las noticias';
      set({ error: mensaje, isLoading: false });
    }
  },

  fetchNoticiaBySlug: async (slug) => {
    set({ isLoading: true, error: null, selectedNoticia: null });
    try {
      const response = await noticiasService.getBySlug(slug);
      set({ selectedNoticia: response.data?.data || response.data, isLoading: false });
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al cargar la noticia';
      set({ error: mensaje, isLoading: false });
    }
  },

  fetchCategorias: async () => {
    const now = Date.now();
    const { _lastFetched, categorias } = get();
    if (_lastFetched > 0 && now - _lastFetched < TTL && categorias.length > 0) {
      return;
    }
    try {
      const response = await noticiasService.getCategories();
      set({ categorias: response.data.data, _lastFetched: Date.now() });
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al cargar categorias';
      set({ error: mensaje });
    }
  },

  addNoticia: async (nuevaNoticia) => {
    try {
      const response = await noticiasService.create(nuevaNoticia);
      set((state) => ({
        noticias: [...state.noticias, response.data.data]
      }));
      useUIStore.getState().setPageNotification({ message: 'Noticia creada exitosamente', type: 'success' });
    } catch (err) {
      let mensaje = err.response?.data?.message || 'Error al crear la noticia';
      mensaje = mensaje.replace(/[Ss]lug/g, 'título');
      useUIStore.getState().setPageNotification({ message: mensaje, type: 'error' });
    }
  },

  updateNoticia: async (id, data) => {
    try {
      const response = await noticiasService.update(id, data);
      set((state) => ({
        noticias: state.noticias.map((n) =>
        n.id === id ? { ...n, ...response.data.data } : n
        )
      }));
      useUIStore.getState().setPageNotification({ message: 'Noticia actualizada exitosamente', type: 'success' });
    } catch (err) {
      let mensaje = err.response?.data?.message || 'Error al actualizar la noticia';
      mensaje = mensaje.replace(/[Ss]lug/g, 'título');
      useUIStore.getState().setPageNotification({ message: mensaje, type: 'error' });
    }
  },

  deleteNoticia: async (id) => {
    try {
      await noticiasService.remove(id);
      set((state) => ({
        noticias: state.noticias.filter((n) => n.id !== id)
      }));
      useUIStore.getState().setPageNotification({ message: 'Noticia eliminada exitosamente', type: 'success' });
    } catch (err) {
      const mensaje = err.response?.data?.message || 'Error al eliminar la noticia';
      useUIStore.getState().setPageNotification({ message: mensaje, type: 'error' });
    }
  },

  setSelectedNoticia: (noticia) => set({ selectedNoticia: noticia })
}));
