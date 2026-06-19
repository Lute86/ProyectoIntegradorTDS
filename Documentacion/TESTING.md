# ✅ TESTING

**Cómo ejecutar y escribir pruebas**

---

## 🧪 Tipos de Pruebas

### Unit Tests
Prueban una función/método aisladamente

```javascript
// backend/tests/unit/utils/token.test.js
test('generaToken debe crear un JWT válido', () => {
  const token = generaToken({id: 1});
  expect(token).toBeDefined();
  expect(typeof token).toBe('string');
});
```

### Integration Tests
Prueban múltiples componentes juntos

```javascript
// backend/tests/integration/auth.test.js
test('POST /api/auth/login debe retornar token', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@ifts29.edu.ar',
      password: 'admin1234'
    });
  
  expect(res.status).toBe(200);
  expect(res.body.data.token).toBeDefined();
});
```

### Component Tests (Frontend)
Prueban componentes React

```javascript
// frontend/tests/components/Button.test.js
test('Button debe renderizar con texto', () => {
  render(<Button>Haz clic</Button>);
  expect(screen.getByText('Haz clic')).toBeInTheDocument();
});
```

---

## 📊 Estructura de Tests

### Backend (Jest)

```
backend/tests/
├── unit/
│   ├── utils/
│   │   └── token.test.js
│   └── services/
│       └── carrera.service.test.js
├── integration/
│   ├── auth.test.js
│   ├── carrera.test.js
│   └── noticia.test.js
└── helpers/
    └── test-setup.js
```

### Frontend (Vitest)

```
frontend/src/tests/
├── components/
│   ├── Button.test.jsx
│   └── Modal.test.jsx
├── pages/
│   └── HomePage.test.jsx
├── stores/
│   └── authStore.test.js
└── setup.js
```

---

## 🚀 Ejecutar Tests

### Backend

```bash
# Todos
npm test

# En watch mode (rerun al cambiar)
npm run test:watch

# Con cobertura
npm run test:cov

# Un archivo específico
npm test -- auth.test.js

# Un test específico
npm test -- --testNamePattern="login"
```

### Frontend

```bash
# Todos
npm test

# Watch mode
npm test -- --watch

# Cobertura
npm test -- --coverage

# Archivo específico
npm test Button.test.jsx
```

---

## 📈 Cobertura Esperada

### Backend

```
Statements   : 80%+ (líneas ejecutadas)
Branches     : 75%+ (condicionales if/else)
Functions    : 85%+ (funciones ejecutadas)
Lines        : 80%+ (líneas totales)
```

**Comando:**
```bash
npm run test:cov
```

**Salida esperada:**
```
 PASS  tests/integration/auth.test.js
 PASS  tests/unit/utils/token.test.js

----------|---------|---------|---------|
File      | Stmts   | Branch  | Funcs   |
----------|---------|---------|---------|
All files | 82.5    | 76.3    | 84.2    |
```

### Frontend

```
Statements   : 70%+
Branches     : 65%+
Functions    : 75%+
Lines        : 70%+
```

---

## ✍️ Escribir un Test

### Backend Example

```javascript
// tests/integration/noticias.test.js
const request = require('supertest');
const app = require('../src/app');
const { Noticia } = require('../src/models');

describe('POST /api/noticias', () => {
  let token;

  beforeEach(async () => {
    // Setup: crear usuario y obtener token
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@ifts29.edu.ar',
        password: 'admin1234'
      });
    token = res.body.data.token;
  });

  test('debe crear una noticia si es admin', async () => {
    const res = await request(app)
      .post('/api/noticias')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Mi Noticia',
        slug: 'mi-noticia',
        contenido: '<p>Contenido</p>',
        estado: 'borrador'
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.noticia.titulo).toBe('Mi Noticia');
  });

  test('debe fallar si email no es válido', async () => {
    const res = await request(app)
      .post('/api/noticias')
      .set('Authorization', `Bearer fake-token`)
      .send({...});

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
```

### Frontend Example

```javascript
// tests/pages/HomePage.test.jsx
import { render, screen } from '@testing-library/react';
import HomePage from '../../pages/HomePage';

describe('HomePage', () => {
  test('debe renderizar título', () => {
    render(<HomePage />);
    expect(screen.getByText(/IFTS 29/i)).toBeInTheDocument();
  });

  test('debe mostrar lista de carreras', async () => {
    render(<HomePage />);
    expect(await screen.findByText(/Carreras/i)).toBeInTheDocument();
  });
});
```

---

## 🔍 Best Practices

### ✅ Hacer

- Test nombres descriptivos: "debe crear usuario con email válido"
- Tests independientes: uno no depende de otro
- Setup y teardown: beforeEach, afterEach
- Una cosa por test: un assert por test
- Usar fixtures: datos de prueba reutilizables

### ❌ Evitar

- Tests frágiles: que fallan por cambios menores
- Tests lentos: > 1 segundo cada uno
- Tests con side effects: que modifican estado global
- Lógica compleja: tests deben ser simples

---

## 📚 Ver También

- [COMANDOS_MAKEFILE.md](./COMANDOS_MAKEFILE.md)
- [ARQUITECTURA.md](./ARQUITECTURA.md)
