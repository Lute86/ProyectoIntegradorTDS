# Flujo de Trabajo - IFTS 29 Nueva Web

Guía paso a paso para que todos los integrantes del equipo trabajen de forma consistente, siguiendo las reglas de ramas, commits, tests y documentación del proyecto.

*Nota: Todas las reglas descritas en este documento fueron definidas en conjunto por los integrantes del equipo, por lo que su cumplimiento es obligatorio para todos los miembros. Si algún integrante desea modificar alguna regla, debe conversarlo primero con el equipo. Si la propuesta es aprobada, se debe actualizar este archivo `WORKFLOW.md` para reflejar el cambio, y todos los miembros deberán seguir la nueva versión de las reglas a partir de su actualización.*

## Visión General del Flujo
El proyecto usa un flujo simplificado basado en `main` (producción) y `develop` (integración):
- Todo código nuevo se crea desde `develop`
- Las ramas de trabajo se mergean primero a `develop`
- Los despliegues a producción se hacen mediante PR de `develop` a `main` (solo desde `develop`, requiere aprobación)

---

## 1. Gestión de Ramas
### Ramas Principales (Protegidas)
| Rama | Propósito | Regla |
|------|-----------|-------|
| `main` | Código en producción | Sin pushes directos, solo PRs desde `develop` |
| `develop` | Integración de features | Sin pushes directos, solo merges de ramas de trabajo |

### Tipos de Ramas de Trabajo
Crea ramas desde `develop` con el siguiente formato (minúsculas, guiones):
- **`feature/<descripcion>`**: Nuevas funcionalidades o módulos  
  Ej: `feature/be-modulo3-gestion-usuarios`, `feature/fe-login-page`
- **`fix/<descripcion>`**: Corrección de bugs  
  Ej: `fix/be-auth-refresh-token`, `fix/fe-carreras-filter`
- **`chore/<descripcion>`**: Tareas de mantenimiento, configuración, CI/CD  
  Ej: `chore/ci-workflows-setup`, `chore/update-dependencies`
- **`docs/<descripcion>`**: Cambios solo en documentación  
  Ej: `docs/update-tasks-md`, `docs/add-workflow-guide`
- **`test/<descripcion>`**: Cambios solo en pruebas  
  Ej: `test/be-users-crud`, `test/fe-login-form`

### Reglas Básicas
- Nunca trabajes directamente en `main` o `develop`
- Una rama = una tarea/module (evita mezclar cambios no relacionados)
- Elimina la rama después de mergear para mantener el repositorio limpio -opcional-

---

## 2. Comandos con Makefile
El proyecto incluye un `Makefile` en la carpeta `App/` con todos los comandos necesarios para desarrollo, pruebas y despliegue.

### Comandos Disponibles
Para ver la lista completa de comandos disponibles, ejecuta dentro de la carpeta `App`:
```bash
make help
```

### Uso Recomendado
El uso del **Makefile es la forma recomendada de ejecutar comandos** en el proyecto, ya que simplifica la ejecución dentro de los contenedores Docker y unifica los comandos para todo el equipo (incluyendo usuarios en Windows).

### Ejecución Manual
Si prefieres ejecutar los comandos manualmente (sin Makefile), algunos de los comandos específicos están detallados en el archivo `README.md` (sección Referencia de comandos - En Windows), incluyendo los comandos para backend, frontend y Docker.

---

## 3. Commits
Usa **Conventional Commits** para mensajes claros y consistentes:
```
<tipo>(<ámbito>): <descripción corta>
```
### Tipos de Commit
| Tipo | Propósito | Ejemplo |
|------|-----------|---------|
| `feat` | Nueva funcionalidad | `feat(be/users): add user CRUD controller` |
| `fix` | Corrección de bug | `fix(fe/login): correct redirect after login` |
| `chore` | Mantenimiento/config | `chore(ci): add branch check workflow` |
| `docs` | Documentación | `docs(tasks): mark BE module 3 as completed` |
| `test` | Pruebas | `test(be/auth): add JWT middleware tests` |
| `refactor` | Refactorización (sin cambios de funcionalidad) | `refactor(be/routes): simplify route registration` |
| `style` | Lint/correcciones de formato | `style(fe): fix eslint errors in LoginPage` |

### Reglas para Commits
- Escribe mensajes en español, claros y descriptivos (no "fix", "update code")
- Commits atómicos: un commit por cambio lógico
- No incluyas secretos, `.env`, `node_modules` o archivos generados
- Si completaste una tarea de `Tasks.md`, marca la casilla con `[✓]` en el mismo commit que el código

---

## 4. Testing Obligatorio
⚠️ **Es obligatorio escribir pruebas para todo código nuevo o modificado. No se aceptarán PRs sin pruebas correspondientes.**

### Antes de Subir Código (Push)
Corre las pruebas de tu entorno de trabajo **localmente** (dentro del contenedor Docker o en tu máquina):
#### Backend (App/backend)
```bash
# Usando Makefile (desde BASE/App)
make tests-back

# O manualmente dentro del contenedor
docker exec -it <backend_container> npm test
```
#### Frontend (App/frontend)
```bash
# Manualmente dentro del contenedor
docker exec -it <frontend_container> npm test

# O en tu máquina (si tienes node instalado)
cd App/frontend && npm test
```

### Reglas de Testing
- Backend: Tests en `tests/integration/` (Jest + Supertest)
- Frontend: Tests en `src/tests/` (Vitest + Testing Library)
- Todo nuevo feature/modificación debe tener sus propias pruebas
- Todas las pruebas deben pasar localmente y en CI (GitHub Actions) antes de mergear

---

## 5. Documentación
Actualiza la documentación de todo cambio siguiendo el patrón de los **módulos 1 y 2 de BE** (ya completados y documentados en `Tasks.md`):

### Actualización de Tasks.md
- Marca las tareas completadas con `[✓]` (como los módulos BE 1 y 2)
- Si agregas un nuevo módulo, añádelo a `Tasks.md` siguiendo la estructura existente:
  ```
  #### Módulo X: <Nombre>
  **Tareas:**
  - [ ] Tarea 1
  - [ ] Tarea 2
  **Dependencias:** ...
  **Contraparte FE/BE:** ...
  ```

### Documentación Propia de Módulos
Al completar un módulo (como los BE 1 y 2), asegúrate de que:
1. Todas sus tareas estén marcadas en `Tasks.md`
2. El módulo requiere explicación de lo aplicado y su funcionalidad/uso, crea un archivo dedicado en `docs/` (ej: `docs/FEModulo3-usuarios.md`) siguiendo el formato de documentación existente

### Variables de Entorno
Si agregas una nueva variable de entorno al proyecto:
1. Actualiza el archivo `.env.example` con la nueva variable, su descripción y valor por defecto (si aplica)


⚠️ **Regla importante**: Nunca commites archivos `.env` (están incluidos en `.gitignore`). Solo se permite commitear `.env.example` como plantilla para que el equipo configure su entorno local.

### Otros Documentos
Actualiza `README.md` o `WORKFLOW.md` si tu cambio afecta:
- Comandos de desarrollo
- Convenciones de código
- Flujo de trabajo del equipo

---


## 6. Pasos Antes de Hacer Push
1. **Actualiza tu rama con `develop`**:
   ```bash
   git checkout develop && git pull origin develop
   git checkout <tu-rama> && git rebase develop
   ```
2. **Corre lint** para tu entorno:
   - Backend: `make lint-backend` (o `npm run lint` en contenedor)
   - Frontend: `make lint-frontend` (o `npm run lint` en contenedor)
3. **Corre tests** de tu entorno (como se detalla en sección 3)
4. **Actualiza documentación** (`Tasks.md`, etc.)
5. **Haz commit** con mensaje válido (sección 2)
6. **Push** a tu rama:
   ```bash
   git push origin <tu-rama>
   ```

---

## 7. Proceso de Pull Requests
### Paso 1: Merge a `develop`
1. Crea un PR desde tu rama de trabajo a `develop`
2. Agrega descripción clara: referencia el módulo/tarea (ej: "Completa BE Módulo 3: Gestión de Usuarios")
3. Solicita revisión a otro integrante del equipo
4. Espera a que pasen los checks de CI (lint + tests)
5. Mergea solo después de aprobación y checks verdes

### Paso 2: Merge a `main`
1. Solo se permite PR de `develop` a `main` (bloqueado por GitHub si viene de otra rama)
2. Requiere 1 aprobación de otro integrante (excepto owner)
3. Todos los checks de CI deben pasar (`PR Branch Check`, `CI`)
4. No se permiten pushes directos a `main`

---

## 8. Tags de Git (Versiones/Releases)
Los tags se usan exclusivamente para marcar versiones de release del proyecto. Solo se crean en la rama `main` después de completar un despliegue a producción.

### Formato de Tags
Usa **Semantic Versioning (SemVer)** con el prefijo `v`:
```
vX.Y.Z
```
Donde:
- `X` = Major (versión mayor)
- `Y` = Minor (versión menor)
- `Z` = Patch (parche)

### Reglas de Incremento
| Parte | Cuándo incrementar | Ejemplo |
|-------|-------------------|---------|
| **X (Major)** | Cambios incompatibles con versiones anteriores (breaking changes) | `v1.0.0` → `v2.0.0` |
| **Y (Minor)** | Nuevas funcionalidades compatibles con versiones anteriores | `v1.2.0` → `v1.3.0` |
| **Z (Patch)** | Correcciones de bugs compatibles con versiones anteriores | `v1.2.0` → `v1.2.1` |

### Ejemplos Prácticos
- `v1.0.0`: Primera versión estable
- `v1.1.0`: Nueva funcionalidad (ej: módulo de gestión de usuarios)
- `v1.1.1`: Corrección de bug en el módulo de usuarios
- `v2.0.0`: Cambio que rompe compatibilidad (ej: refactorización de API que cambia endpoints)

### Reglas para Crear Tags
1. Solo crear tags en la rama `main` (nunca en `develop` u otras ramas)
2. Asegúrate de que el código en `main` sea estable y corresponda a un release
3. Usa `git tag -a vX.Y.Z -m "Release vX.Y.Z: <descripción>"` para crear un tag anotado
4. Sube el tag al remoto: `git push origin vX.Y.Z`

Para más detalles sobre Semantic Versioning, consulta: https://semver.org/lang/es/

---

## Referencias
- Tareas del proyecto: `Tasks.md`
- Protección de ramas: `.github/BRANCH_PROTECTION.md`
