# 🛠️ REFERENCIA DE COMANDOS MAKEFILE

**Todos los comandos disponibles para desarrollo**

---

## 📋 Comandos de Desarrollo

### `make dev`
Inicia el entorno de desarrollo con Docker

```bash
make dev
```

- Levanta frontend (Vite en puerto 5173)
- Levanta backend (Express en puerto 3000)
- Levanta base de datos (SQLite)
- Ejecuta migraciones automáticamente
- Ejecuta seeders (datos iniciales)
- Habilita hot-reload

---

### `make dev-down`
Detiene el entorno de desarrollo

```bash
make dev-down
```

- Detiene todos los contenedores
- NO elimina datos
- Puedes volver a ejecutar `make dev`

---

### `make dev-reset`
Reinicia todo desde cero

```bash
make dev-reset
```

- Detiene contenedores
- **Elimina la base de datos** ⚠️
- Próximo `make dev` creará BD nueva

---

## 🗂️ Comandos de Base de Datos

### `make migrate-dev`
Ejecuta migraciones de BD

```bash
make migrate-dev
```

---

### `make seed-dev`
Carga datos iniciales

```bash
make seed-dev
```

---

## 🧪 Comandos de Testing

### `make tests-back`
Ejecuta tests del backend

```bash
make tests-back
```

---

### `make tests-frontend`
Ejecuta tests del frontend

```bash
make tests-frontend
```

---

## 📊 Comandos de Monitoreo

### `make logs-dev`
Ver logs en tiempo real

```bash
make logs-dev
```

---

### `make shell-be-dev`
Acceder a shell del backend

```bash
make shell-be-dev
```

---

## 📦 Otros Comandos

### `make install`
Instala dependencias

```bash
make install
```

---

## 🚀 Flujo Típico

```bash
# Inicial
make dev

# Si agregaron dependencias
make dev-down
make install
make dev

# Para hacer cambios
# ... editar archivos ...
# Los cambios se aplican automático (hot-reload)

# Para resetear BD
make dev-reset && make dev

# Ver logs
make logs-dev

# Cuando terminas el día
make dev-down
```

---

## 💡 Tips

- **Hot-reload automático:** Guardas un archivo y se recarga solo
- **No necesitas entrar a contenedores:** Trabajas con tus archivos locales
- **Datos de prueba precargados:** Usuarios, noticias, carreras, etc.
- **Logs en tiempo real:** Usa `make logs-dev`

---

## 📚 Ver También

- [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)
- [DOCKER.md](./DOCKER.md)
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
