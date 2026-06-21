# 🎨 COMPONENTES Y ESTADO

**Documentación de componentes React y stores Zustand**

---

## 📦 Componentes UI Base

Componentes reutilizables en `components/ui/`

### Button

```jsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="lg">
  Haz clic
</Button>

// Props
- variant: 'primary' | 'secondary' | 'danger'
- size: 'sm' | 'md' | 'lg'
- disabled: boolean
- loading: boolean
- onClick: () => void
```

### Modal

```jsx
import { Modal } from '@/components/ui/Modal';

<Modal open={isOpen} onClose={() => setIsOpen(false)}>
  <Modal.Header>Título</Modal.Header>
  <Modal.Body>Contenido</Modal.Body>
  <Modal.Footer>
    <Button>Aceptar</Button>
  </Modal.Footer>
</Modal>
```

### Card

```jsx
import { Card } from '@/components/ui/Card';

<Card>
  <Card.Header>Título</Card.Header>
  <Card.Body>Contenido</Card.Body>
  <Card.Footer>Pie</Card.Footer>
</Card>
```

### Input

```jsx
import { Input } from '@/components/ui/Input';

<Input 
  type="email"
  placeholder="tu@email.com"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

---

## 🎯 Componentes Específicos

### Admin - NuevoNoticiaModal

**Ubicación:** `components/admin/NuevoNoticiaModal.jsx`

**Props:**
- `open`: boolean
- `onClose`: () => void
- `onSave`: (noticia) => void

**Features:**
- Editor de texto enriquecido (Tiptap)
- Upload de imagen
- Selector de categoría
- Estado (borrador/publicado)

### Admin - CarrerasDataTable

**Ubicación:** `components/admin/CarrerasDataTable.jsx`

**Props:**
- `data`: Carrera[]
- `onEdit`: (id) => void
- `onDelete`: (id) => void

**Features:**
- Sorting
- Pagination
- Inline editing
- Confirmación de eliminar

### Public - CarreraCard

**Ubicación:** `components/public/CarreraCard.jsx`

**Props:**
- `carrera`: Carrera
- `onClick`: () => void

**Features:**
- Imagen y descripción
- Tags (modalidad)
- Hover effect

---

## 🏪 Zustand Stores

Estado global con Zustand

### authStore

```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthStore {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>(
  persist((set) => ({
    token: null,
    user: null,
    setAuth: (token, user) => set({ token, user }),
    logout: () => set({ token: null, user: null })
  }), {
    name: 'auth-storage' // localStorage key
  })
);

// Uso
const { user, logout } = useAuthStore();
```

### noticiasStore

```typescript
// stores/noticiasStore.ts
export const useNoticiasStore = create((set, get) => ({
  noticias: [],
  total: 0,
  currentPage: 1,
  
  setNoticias: (noticias) => set({ noticias }),
  agregarNoticia: (noticia) => 
    set(s => ({ noticias: [noticia, ...s.noticias] })),
  eliminarNoticia: (id) =>
    set(s => ({ noticias: s.noticias.filter(n => n.id !== id) })),
  
  nextPage: () => set(s => ({ currentPage: s.currentPage + 1 }))
}));
```

### carrerasStore

```typescript
export const useCarrerasStore = create((set) => ({
  carreras: [],
  selectedCarrera: null,
  
  setCarreras: (carreras) => set({ carreras }),
  selectCarrera: (id) => 
    set(s => ({
      selectedCarrera: s.carreras.find(c => c.id === id)
    }))
}));
```

---

## 🔗 React Contexts

Contextos globales en `contexts/`

### AuthContext

```jsx
// contexts/AuthContext.jsx
import { createContext, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { user, logout } = useAuthStore();

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

### ThemeContext

Maneja tema claro/oscuro y colores personalizados

### ToastContext

Sistema de notificaciones (éxito, error, info)

```jsx
// Uso
const { toast } = useToast();

toast.success('Noticia creada!');
toast.error('Error al crear');
toast.info('Procesando...');
```

---

## 🪝 Custom Hooks

Hooks personalizados en `hooks/`

### useApi

```typescript
// hooks/useApi.ts
export function useApi(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(url)
      .then(res => setData(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// Uso
const { data: noticias, loading } = useApi('/api/noticias');
```

### useForm

Combina React Hook Form + Zod:

```typescript
const { register, errors, handleSubmit } = useForm({
  resolver: zodResolver(schema)
});
```

### usePagination

```typescript
const { page, total, pageSize, goToPage } = usePagination(20);
```

---

## 📊 Estructura de Componentes Grandes

### Estructura de AdminNoticiasPage

```
AdminNoticiasPage/
├── index.jsx              (componente principal)
├── AdminNoticiasPage.module.css
├── Toolbar.jsx            (barra con filtros)
├── NoticiasTable.jsx      (tabla)
├── NuevoNoticiaModal.jsx  (modal crear)
├── EditarNoticiaModal.jsx (modal editar)
└── DeleteConfirmDialog.jsx (confirmación)
```

**Flujo:**
1. AdminNoticiasPage carga noticias en useEffect
2. Usa noticiasStore para estado
3. Toolbar maneja filtros
4. NoticiasTable muestra datos
5. Modales abren/cierran por estado local

---

## 🎨 Estilo con TailwindCSS

### Clases Comunes

```jsx
// Colores
className="text-blue-600 bg-gray-100"

// Espaciado
className="p-4 m-2 gap-3"

// Responsive
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Estados hover, focus
className="hover:bg-gray-200 focus:outline-blue-500"
```

### Componentes Customizados

Se definen en CSS modules para evitar conflictos:

```css
/* AdminNoticiasPage.module.css */
.container {
  @apply max-w-6xl mx-auto px-4 py-8;
}

.header {
  @apply flex justify-between items-center mb-6;
}
```

---

## 📚 Ver También

- [ARQUITECTURA.md](./ARQUITECTURA.md)
- [GUIA_DESARROLLO.md](./GUIA_DESARROLLO.md)
- [BASE_DE_DATOS.md](./BASE_DE_DATOS.md)
