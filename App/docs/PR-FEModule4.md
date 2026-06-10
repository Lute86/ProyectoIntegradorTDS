# Pull Request - Modulo 4: Gestion de Contenido Admin

**Autor:** Andres (FE Dev 2)
**Rama:** `feature/fe-modulo4-admin`
**Stack:** React 19, Vite 6, Tailwind 4, Zustand, React Hook Form + Zod, TipTap

---

## Resumen

Implementacion completa del panel de administracion de contenido del IFTS 29. Se construyeron 6 paginas CRUD con sus respectivos stores de Zustand, modales de formulario y componentes base reutilizables. Todos los datos son simulados (mocks) para independencia del backend.

---

## Paginas Construidas

| Pagina | Ruta | Modal Asociado |
|--------|------|----------------|
| DashboardPage | `/admin` | — |
| UsuariosPage | `/admin/usuarios` | UsuarioFormModal |
| NoticiasPage | `/admin/noticias` | NoticiaFormModal |
| EventosPage | `/admin/eventos` | EventoFormModal |
| TestimoniosPage | `/admin/testimonios` | TestimonioFormModal |
| GaleriaPage | `/admin/galeria` | ImageUploadModal |
| CarrerasPage | `/admin/carreras` | CarreraFormModal, BuscarMateriaModal |
| MateriasPage | `/admin/materias` | MateriaFormModal |

---

## Componentes Base Creados

| Componente | Ubicacion | Proposito |
|------------|-----------|-----------|
| DataTable | `src/components/ui/DataTable.tsx` | Tabla generica con tipado `<T>`, columnas configurables y estados empty |
| RichEditor | `src/components/ui/RichEditor.tsx` | Editor de texto enriquecido con TipTap (toolbar: N, C, H1-H3, Lista, Num., Cite, Link) |
| ImageUploader | `src/components/ui/ImageUploader.tsx` | Zona de drag & drop visual con preview y seleccion por clic |
| UserAvatar | `src/components/ui/UserAvatar.tsx` | Avatar circular con imagen o iniciales, 3 tamanos (sm/md/lg) |

---

## Stores de Estado (Zustand)

| Store | Metodos |
|-------|---------|
| `usuariosStore` | fetchUsuarios, addUsuario, updateUsuario, deleteUsuario |
| `noticiasStore` | fetchNoticias, addNoticia, updateNoticia, deleteNoticia |
| `eventosStore` | fetchEventos, addEvento, updateEvento, deleteEvento |
| `testimoniosStore` | fetchTestimonios, addTestimonio, updateTestimonio, deleteTestimonio |
| `galeriaStore` | fetchImagenes, addImagen, deleteImagen |
| `carrerasStore` | fetchCarreras, fetchCarreraBySlug, addCarrera, updateCarrera, deleteCarrera |
| `materiasStore` | fetchMaterias, createMateria, updateMateria, deleteMateria, addAsignacion, updateAsignacion, removeAsignacion |

---

## Archivos de Mock

| Archivo | Contenido |
|---------|-----------|
| `src/mocks/users.mock.ts` | 5 usuarios de prueba (admin, profesores, tutores) |
| `src/mocks/noticias.mock.ts` | 4 noticias con contenido HTML |
| `src/mocks/eventos.mock.ts` | 4 eventos con fecha, hora y modalidad |
| `src/mocks/testimonios.mock.ts` | 4 testimonios con estado pendiente/aprobado |
| `src/mocks/galeria.mock.ts` | 6 imagenes con URL de placeholder |

---

## Detalles Tecnicos

- **Validacion:** Todos los formularios usan Zod schemas con mensajes de error en espanol
- **RichEditor:** Integrado via `Controller` de react-hook-form en NoticiaFormModal y EventoFormModal
- **UX States:** Cada pagina implementa Loading (skeleton), Error (banner rojo) y Empty (mensaje informativo)
- **Galeria:** Layout con CSS Grid responsivo, overlay con info al hover, boton de eliminacion superpuesto
- **Enrutador:** `AppRouter.tsx` con index route al Dashboard y rutas anidadas bajo `/admin`
- **Sin emojis:** Todos los iconos reemplazados por texto simple o bloques de color Tailwind
- **Manejo errores stores:** carrerasStore/materiasStore relanzan excepciones tras setear error; componentes muestran feedback sin cerrar modal

---

## Pendientes

- ~~Integracion con API real~~ ✅ RESUELTO (todos los stores conectados)
- ~~Agregar paginacion y busqueda en DataTable~~ ✅ RESUELTO
- ~~Escribir tests unitarios de stores (consultas, usuarios, eventos, testimonios)~~ ✅ RESUELTO
- Implementar `ImageUploader` con subida real al servidor (depende de backend con multer)
- Escribir tests de componentes (DataTable, modales)

---

## Actualizaciones Posteriores

### DataTable — prop `selectable`
**Archivo:** `src/components/ui/DataTable.tsx`
- Nuevas props: `selectable` (boolean), `selectedIds` (Set), `onSelectionChange` (callback)
- Columna de checkbox en cada fila + checkbox select-all en header (solo pagina actual)
- Tipado generico `<T>` compatible con columnas existentes

### CarrerasPage — DataTable searchable
**Archivo:** `src/pages/admin/CarrerasPage/CarrerasPage.jsx`
- Tabla manual reemplazada por `<DataTable searchable />`
- Columnas: ID, Nombre (bolita de color + descripcion), Modalidad (badge), Duracion, Activa (badge), Acciones
- Busqueda textual + paginacion automatica

### MateriasPage — DataTable searchable + selectable + bulk
**Archivo:** `src/pages/admin/MateriasPage/MateriasPage.jsx`
- Tabla manual reemplazada por `<DataTable searchable selectable />`
- Barra de accion bulk ("Asignar a carrera" + "Limpiar seleccion") cuando hay materias seleccionadas
- Modal inline `AsignarCarreraModal`: muestra materias a asignar (chips), selector de carrera, al seleccionar fetchea materias existentes agrupadas por cuatrimestre, inputs cuatrimestre + carga horaria, asignacion en lote con feedback por materia
- Captura y muestra mensaje de error de API si todas fallan

### CarreraDetailAdmin — validacion opcional en Horarios
**Archivo:** `src/pages/admin/CarrerasPage/CarreraDetailAdmin.jsx`
- `validarTodo()`: salta filas sin `dia` ni `horario` (no las exige)
- `handleBlur()`: mismo criterio, no valida filas vacias al perder foco
- `cargarHorarios()` ya ignora filas sin dia/horario (`continue`)
- Permite guardar horarios solo para las materias que tienen datos, dejando el resto vacias

