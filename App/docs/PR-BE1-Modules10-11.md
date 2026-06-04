# Modulo 10-11 - Unit Tests: Utils y Services

## Resumen de cambios

Se implementa la suite completa de unit tests para utilidades y servicios del backend, con mocks compartidos de Sequelize para aislamiento total de la base de datos.

**Cambios principales:**
- Sistema de mocks compartidos para modelos Sequelize (`createModelMock`, `createInstanceMock`, `Op`)
- 5 archivos de tests de utilidades (AppError, token, asyncHandler, dbErrorHandler, response)
- 13 archivos de tests de servicios (auth, user, carrera, materia, noticia, categoria, evento, testimonio, horario, consulta, imagen, stats, siteconfig)
- Patrón ESM con `jest.unstable_mockModule` para testing aislado

## Para el equipo

### Backend

#### Arquitectura de testing

```
tests/unit/
├── mocks/
│   └── models.js           # Mocks compartidos de Sequelize
├── utils/
│   ├── AppError.test.js    # Tests de clases de error
│   ├── token.test.js       # Tests de JWT utilities
│   ├── asyncHandler.test.js # Tests de wrapper async
│   ├── dbErrorHandler.test.js # Tests de manejo de errores Sequelize
│   └── response.test.js    # Tests de helpers de respuesta
└── services/
    ├── auth.services.test.js
    ├── user.services.test.js
    ├── carrera.services.test.js
    ├── materia.services.test.js
    ├── noticia.services.test.js
    ├── categoria.services.test.js
    ├── evento.services.test.js
    ├── testimonio.services.test.js
    ├── horario.services.test.js
    ├── consulta.services.test.js
    ├── imagen.services.test.js
    ├── stats.services.test.js
    └── siteconfig.services.test.js
```

#### Mocks compartidos (`tests/unit/mocks/models.js`)

Sistema de mocks para aislar los servicios de la base de datos real:

```javascript
// Crear mock de modelo
const UserMock = createModelMock({
  // Overrides específicos
  findOne: jest.fn().mockResolvedValue(mockUser),
});

// Crear mock de instancia (para update, destroy, toJSON)
const instance = createInstanceMock({
  id: 1,
  email: 'test@test.com',
  activo: true,
});
// instance.update(), instance.destroy(), instance.toJSON() disponibles

// Mock de operadores Sequelize
import { Op } from '../mocks/models.js';
// Op.and, Op.or, Op.like, Op.gte, Op.lte, Op.in, Op.ne
```

#### Patrón de testing de servicios

Todos los tests de servicios siguen el mismo patrón:

```javascript
import { jest } from '@jest/globals';
import { createModelMock, createInstanceMock } from '../mocks/models.js';

// 1. Mockear dependencias ANTES de importar el servicio
jest.unstable_mockModule('../../../src/models/index.js', () => ({
  default: { User: createModelMock() },
}));

// 2. Importar después de los mocks
const models = (await import('../../../src/models/index.js')).default;
const { login, register } = await import('../../../src/services/auth.services.js');

// 3. Testear con beforeEach para limpiar mocks
describe('auth.services', () => {
  beforeEach(() => jest.clearAllMocks());

  it('deberia crear usuario', async () => {
    models.User.findOne.mockResolvedValue(null);
    models.User.create.mockResolvedValue(createInstanceMock({ id: 1 }));

    const result = await register({ email: 'test@test.com' });

    expect(models.User.create).toHaveBeenCalled();
    expect(result.user).not.toHaveProperty('password_hash');
  });
});
```

#### Tests de utilidades

| Archivo | Cubre | Tests clave |
|---------|-------|-------------|
| `AppError.test.js` | Clases de error custom | Status codes (400/401/403/404/409), herencia instanceof, mensajes default vs custom |
| `token.test.js` | JWT utilities | `generateToken` retorna string, `verifyToken` retorna payload o lanza error, `decodeToken` retorna payload o null |
| `asyncHandler.test.js` | Wrapper async | Éxito retorna resultado, rechazo llama `next(error)`, pasa req/res/next |
| `dbErrorHandler.test.js` | Manejo de errores Sequelize | UniqueConstraint→409, ValidationError→400, ForeignKey→400, EmptyResult→404, AppError re-lanzado, errores desconocidos re-lanzados |
| `response.test.js` | Helpers de respuesta | 12 funciones (success, created, deleted, noContent, badRequest, etc.), badRequest incluye/excluye errors condicionalmente |

#### Tests de servicios

| Archivo | Cubre | Tests clave |
|---------|-------|-------------|
| `auth.services.test.js` | Auth service | register hashea password y genera token, login verifica credentials y actualiza `ultimo_acceso`, rechaza email duplicado, refreshToken valida token |
| `user.services.test.js` | User CRUD | create excluye `password_hash`, rechaza email duplicado, `toggleActive` cambia estado, getAll filtra por rol |
| `carrera.services.test.js` | Carrera CRUD | create genera slug único, rechaza slug duplicado, remove bloquea si tiene materias (cascade protection), getAll filtra por modalidad |
| `materia.services.test.js` | Materia CRUD | create valida que `carrera_id` existe (FK), getAll filtra por carrera/cuatrimestre, eager-load de carrera en getById |
| `noticia.services.test.js` | Noticia CRUD | getAll con paginación, búsqueda por titulo/contenido con `Op.or`, create valida FK de categoria/autor, slug único |
| `categoria.services.test.js` | Categoria CRUD | create genera slug único, rechaza slug duplicado, getAll retorna todas |
| `evento.services.test.js` | Evento CRUD | getAll con filtros fecha (`Op.gte`/`Op.lte`), filtro por estado, nombre único en update |
| `testimonio.services.test.js` | Testimonio CRUD | getAll con filtro visible, create retorna `visible=true` por defecto |
| `horario.services.test.js` | Horario CRUD | create valida que `materia_id` existe, eager-load de materia, filtro por materia/comision/dia |
| `consulta.services.test.js` | Consulta CRUD | `getUnreadCount` retorna conteo correcto, búsqueda por nombre/email/asunto con `Op.or`, paginación |
| `imagen.services.test.js` | Imagen service | create valida URL única, update rechaza URL duplicada, filtro por categoria/entidad_id |
| `stats.services.test.js` | Stats/dashboard | `getDashboardStats` retorna conteos correctos (carreras activas, materias, staff) |
| `siteconfig.services.test.js` | SiteConfig | `getConfig` crea registro default si no existe, `updateConfig` upsert correctamente |

## Tests

Ejecutar todos los unit tests:

```bash
make tests-back
```

Ejecutar solo utils:

```bash
docker exec -it <backend_container> npx jest tests/unit/utils
```

Ejecutar solo services:

```bash
docker exec -it <backend_container> npx jest tests/unit/services
```

Ejecutar un archivo específico:

```bash
docker exec -it <backend_container> npx jest tests/unit/services/auth.services.test.js
```

## Archivos creados

| Archivo | Descripcion |
|---------|-------------|
| `tests/unit/mocks/models.js` | Mocks compartidos: `createModelMock()`, `createInstanceMock()`, `Op` |
| `tests/unit/utils/AppError.test.js` | Tests de clases de error (AppError, BadRequest, Unauthorized, Forbidden, NotFound, Conflict) |
| `tests/unit/utils/token.test.js` | Tests de JWT utilities (generate, verify, decode) |
| `tests/unit/utils/asyncHandler.test.js` | Tests de wrapper async para controladores |
| `tests/unit/utils/dbErrorHandler.test.js` | Tests de conversión de errores Sequelize a AppErrors |
| `tests/unit/utils/response.test.js` | Tests de helpers de respuesta HTTP |
| `tests/unit/services/auth.services.test.js` | Tests de servicio de autenticación |
| `tests/unit/services/user.services.test.js` | Tests de servicio de usuarios |
| `tests/unit/services/carrera.services.test.js` | Tests de servicio de carreras |
| `tests/unit/services/materia.services.test.js` | Tests de servicio de materias |
| `tests/unit/services/noticia.services.test.js` | Tests de servicio de noticias |
| `tests/unit/services/categoria.services.test.js` | Tests de servicio de categorías |
| `tests/unit/services/evento.services.test.js` | Tests de servicio de eventos |
| `tests/unit/services/testimonio.services.test.js` | Tests de servicio de testimonios |
| `tests/unit/services/horario.services.test.js` | Tests de servicio de horarios |
| `tests/unit/services/consulta.services.test.js` | Tests de servicio de consultas |
| `tests/unit/services/imagen.services.test.js` | Tests de servicio de imágenes |
| `tests/unit/services/stats.services.test.js` | Tests de servicio de estadísticas |
| `tests/unit/services/siteconfig.services.test.js` | Tests de servicio de configuración del sitio |
