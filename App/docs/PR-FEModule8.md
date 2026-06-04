# Pull Request - Modulo 8: Integracion Formulario de Contacto con API

**Autor:** FE Dev 1
**Rama:** `feature/fe-modulo8-contacto-api`
**Stack:** React 19, Vite 6, Tailwind 4, Axios, React Hook Form + Zod

---

## Resumen

Integracion del formulario de contacto publico (`ContactoPage`) con el backend real `POST /api/consultas`. Se reemplazo el mock con `setTimeout` por una llamada HTTP real, se corrigio la captura del payload del formulario, y se agregaron estados de feedback visual para el usuario (exito/error).

---

## Archivos Modificados

| Archivo | Cambio |
|---------|--------|
| `src/pages/public/ContactoPage/ContactoPage.jsx` | `handleSubmit` recibe `data`, llama `api.post('/consultas', data)` en vez de setTimeout, estados `error`/`success` con feedback visual, relanza error para que `ContactForm` no resete en fallo |

---

## Archivos Creados

| Archivo | Proposito |
|---------|-----------|
| `src/tests/pages/ContactoPage.test.jsx` | Tests de integracion: verifica que `api.post` se llama con los datos del form, estados de exito, error generico, error con mensaje del servidor, y loading |

---

## Detalles Tecnicos

- **Payload:** `handleSubmit(data)` recibe `{ nombre, email, asunto, mensaje }` de React Hook Form via ContactForm
- **API:** `POST /api/consultas` (publico, rate limit 5/min)
- **Feedback:** Muestra error en rojo (`<p className="text-red-500">`) o exito en verde debajo del formulario
- **Reset:** ContactForm llama `reset()` solo si `onSubmit` se resuelve correctamente; el `throw err` en el catch evita que se limpie el form si falla

---

## Tests

```
npm test -- src/tests/pages/ContactoPage.test.jsx
```

Casos cubiertos:
- Renderizado del formulario e info de contacto
- `api.post` llamado con datos correctos
- Mensaje de exito visible tras envio exitoso
- Mensaje de error con mensaje del servidor
- Mensaje de error generico si el servidor no devuelve mensaje
- Boton deshabilitado con texto "Enviando..." durante la carga
