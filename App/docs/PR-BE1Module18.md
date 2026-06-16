# PR Módulo 18: Validación de Secciones Deshabilitadas en Site Config

## Descripción
Se agrega validación en el endpoint `PUT /api/config` para evitar que se deshabiliten todas las secciones de la página principal. Se permite un máximo de 3 secciones deshabilitadas simultáneamente, garantizando que siempre haya al menos una sección visible.

## Reglas de Validación

| Regla | Descripción |
|-------|-------------|
| Máximo 3 deshabilitadas | No se pueden deshabilitar más de 3 secciones |
| Al menos 1 habilitada | Debe haber al menos una sección visible |
| Merge con DB | La validación considera el estado actual de la DB, no solo lo enviado |

## Endpoint Afectado

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| PUT | `/api/config` | Actualizar configuración del sitio | Admin |

## Archivos Modificados

### Backend (`App/backend/src/`)

- **`controllers/siteconfig.controller.js`** (modificado)
  - Nueva constante `MAX_DISABLED_SECTIONS = 3`
  - Antes de actualizar, obtiene la config actual de la DB
  - Mergea las secciones enviadas con las existentes (por ID)
  - Cuenta secciones con `visible: false` en el resultado del merge
  - Rechaza con error 400 si:
    - Todas las secciones quedan deshabilitadas
    - Más de 3 secciones quedan deshabilitadas

### Tests (`App/backend/tests/integration/`)

- **`siteconfig.test.js`** (modificado)
  - 5 nuevos tests para validación de secciones deshabilitadas:
    - Permitir exactamente 3 secciones deshabilitadas
    - Rechazar más de 3 secciones deshabilitadas
    - Rechazar si todas están deshabilitadas
    - Rechazar al hacer merge que exceda el límite
    - Permitir actualización parcial sin exceder el límite

## Lógica de Merge

La validación compara contra el estado actual de la DB:

```
1. Obtener secciones existentes de la DB
2. Para cada sección enviada:
   - Si el ID ya existe → actualizar (reemplazar)
   - Si el ID es nuevo → agregar
3. Contar secciones con visible: false en el resultado
4. Validar reglas (max 3 deshabilitadas, al menos 1 habilitada)
```

## Ejemplo de Validación

### Escenario: DB tiene 7 secciones (todas visibles)

**PUT con 4 secciones deshabilitadas:**
```json
{
  "sections": [
    { "id": "hero", "visible": false, "order": 1 },
    { "id": "statistics", "visible": false, "order": 2 },
    { "id": "careers", "visible": false, "order": 3 },
    { "id": "news", "visible": false, "order": 4 }
  ]
}
```

**Resultado del merge:**
- Secciones de DB sin cambios: 3 (events, testimonials, gallery)
- Secciones actualizadas: 4 (hero, statistics, careers, news)
- Total deshabilitadas: 4 > 3 → **RECHAZADO**

**PUT con 3 secciones deshabilitadas:**
```json
{
  "sections": [
    { "id": "hero", "visible": false, "order": 1 },
    { "id": "statistics", "visible": false, "order": 2 },
    { "id": "careers", "visible": false, "order": 3 }
  ]
}
```

**Resultado del merge:**
- Secciones de DB sin cambios: 4 (news, events, testimonials, gallery)
- Secciones actualizadas: 3 (hero, statistics, careers)
- Total deshabilitadas: 3 ≤ 3 → **ACEPTADO**

## Respuesta de Error

```json
{
  "success": false,
  "errors": [
    {
      "msg": "No se pueden deshabilitar más de 3 secciones de la página principal"
    }
  ]
}
```

o

```json
{
  "success": false,
  "errors": [
    {
      "msg": "Debe haber al menos una sección habilitada en la página principal"
    }
  ]
}
```

## Tests
```bash
make tests-back arg=site
```

**Resultado:** 18 tests pasando (13 existentes + 5 nuevos de validación de secciones)

## Dependencias
- Módulo BE 7 (Configuración del Sitio)
- Endpoint `PUT /api/config` existente

## Contraparte Frontend

### Cómo manejar en el frontend

El frontend debe manejar el error 400 cuando intente deshabilitar más de 3 secciones:

```jsx
try {
  await api.put('/config', { sections: updatedSections });
} catch (error) {
  if (error.response?.status === 400) {
    const errorMsg = error.response.data.errors?.[0]?.msg;
    // Mostrar toast de error al usuario
    toast.error(errorMsg || 'Error al actualizar secciones');
  }
}
```

### Consideraciones UI
- Deshabilitar visualmente el checkbox/toggle de secciones cuando ya hay 3 deshabilitadas
- Mostrar indicador de cuántas secciones están deshabilitadas (ej: "3/3 deshabilitadas")
- Validación en tiempo real antes de enviar al backend

## Mejoras Futuras
- Hacer el límite configurable desde el admin (actualmente hardcodeado en 3)
- Agregar tooltip explicando por qué no se puede deshabilitar más secciones
- Notificación push cuando se alcanza el límite
