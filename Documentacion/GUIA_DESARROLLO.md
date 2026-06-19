# 👨‍💻 GUÍA DE DESARROLLO

**Cómo agregar nuevas funcionalidades**

---

## 🏗️ Estructura Recomendada

### Para agregar una nueva sección (ej: Comentarios)

```
1. DATABASE
   ├── Crear modelo Comment en models/
   └── Crear migración en migrations/

2. BACKEND
   ├── Crear controller: comentarios.controller.js
   ├── Crear service: comentarios.service.js
   └── Crear routes: comentarios.routes.js

3. FRONTEND
   ├── Crear store: comentariosStore.ts
   ├── Crear service: comentariosService.ts
   ├── Crear componentes en components/
   └── Integrar en pages/

4. TESTING
   ├── Tests backend: tests/integration/comentarios.test.js
   └── Tests frontend: tests/components/Comment.test.jsx
```

---

## 📋 Paso a Paso: Agregar un CRUD

### 1. Crear Modelo de BD

```javascript
// models/Comentario.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comentario = sequelize.define('Comentario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { len: [1, 500] }
    },
    autor_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    noticia_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Comentario.associate = (models) => {
    Comentario.belongsTo(models.User, { as: 'autor' });
    Comentario.belongsTo(models.Noticia, { as: 'noticia' });
  };

  return Comentario;
};
```

### 2. Crear Migración

```javascript
// migrations/YYYYMMDDHHMMSS-create-comentarios.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comentarios', {
      id: { type: Sequelize.INTEGER, primaryKey: true },
      contenido: { type: Sequelize.TEXT, allowNull: false },
      // ... más campos
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Comentarios');
  }
};
```

### 3. Crear Controller

```javascript
// controllers/comentarios.controller.js
const { Comentario } = require('../models');

exports.crear = async (req, res) => {
  try {
    const comentario = await Comentario.create({
      ...req.body,
      autor_id: req.user.id
    });
    res.status(201).json({
      success: true,
      data: { comentario }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.listar = async (req, res) => {
  try {
    const comentarios = await Comentario.findAll({
      include: 'autor'
    });
    res.json({ success: true, data: { comentarios } });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
```

### 4. Crear Routes

```javascript
// routes/comentarios.routes.js
const router = require('express').Router();
const controller = require('../controllers/comentarios.controller');
const { authenticate } = require('../middlewares');

router.get('/', controller.listar);
router.post('/', authenticate, controller.crear);

module.exports = router;
```

### 5. Registrar Routes

```javascript
// app.js
const comentariosRoutes = require('./routes/comentarios.routes');
app.use('/api/comentarios', comentariosRoutes);
```

### 6. Crear Frontend Store

```typescript
// stores/comentariosStore.ts
import { create } from 'zustand';

interface Comentario {
  id: number;
  contenido: string;
  autor: { nombre: string };
  createdAt: string;
}

interface CommentariosStore {
  comentarios: Comentario[];
  setComentarios: (c: Comentario[]) => void;
  agregarComentario: (c: Comentario) => void;
}

export const useComentariosStore = create<CommentariosStore>((set) => ({
  comentarios: [],
  setComentarios: (comentarios) => set({ comentarios }),
  agregarComentario: (comentario) =>
    set((state) => ({
      comentarios: [...state.comentarios, comentario]
    }))
}));
```

### 7. Crear Frontend Service

```typescript
// services/comentariosService.ts
import api from './api';

export const comentariosService = {
  async listar() {
    const { data } = await api.get('/comentarios');
    return data.data.comentarios;
  },

  async crear(contenido: string, noticia_id: number) {
    const { data } = await api.post('/comentarios', {
      contenido,
      noticia_id
    });
    return data.data.comentario;
  }
};
```

### 8. Usar en Componentes

```jsx
// components/ComentariosList.jsx
import { useEffect } from 'react';
import { useComentariosStore } from '../stores/comentariosStore';
import { comentariosService } from '../services/comentariosService';

export function ComentariosList({ noticiaId }) {
  const { comentarios, setComentarios } = useComentariosStore();

  useEffect(() => {
    comentariosService.listar().then(setComentarios);
  }, []);

  return (
    <div>
      {comentarios.map((c) => (
        <div key={c.id}>
          <p>{c.contenido}</p>
          <small>{c.autor.nombre}</small>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔄 Git Workflow

```bash
# 1. Crear rama
git checkout -b feature/comentarios

# 2. Hacer cambios
# ... editar archivos ...

# 3. Commitear
git add .
git commit -m "feat: agregar sistema de comentarios"

# 4. Push
git push origin feature/comentarios

# 5. Pull Request en GitHub
# → Especificar cambios
# → Link a issue (si existe)
# → Esperar review

# 6. Merge a develop
```

---

## ✅ Convenciones

### Nombres

- **Archivos:** kebab-case: `comentarios.controller.js`
- **Funciones:** camelCase: `crearComentario()`
- **Constantes:** UPPER_SNAKE_CASE: `MAX_COMMENTS`
- **Clases:** PascalCase: `Comentario`

### Commits

```
feat: agregar nuevo recurso
fix: resolver bug
docs: actualizar README
test: agregar tests
style: cambios de formato
refactor: reorganizar código
chore: tareas de mantenimiento
```

### Rutas API

```
GET    /api/comentarios          # Listar todos
POST   /api/comentarios          # Crear
GET    /api/comentarios/:id      # Obtener uno
PUT    /api/comentarios/:id      # Actualizar
DELETE /api/comentarios/:id      # Eliminar
```

---

## 🧪 Testing

Agregar tests junto con el código:

```javascript
// tests/integration/comentarios.test.js
test('POST /api/comentarios debe crear comentario', async () => {
  // ...test code
});
```

---

## 📚 Ver También

- [ARQUITECTURA.md](./ARQUITECTURA.md)
- [BASE_DE_DATOS.md](./BASE_DE_DATOS.md)
- [TESTING.md](./TESTING.md)
