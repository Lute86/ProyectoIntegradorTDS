# 🔐 CREDENCIALES DE PRUEBA

**Usuarios precargados en el sistema para desarrollo y testing**

---

## 👤 Usuarios Disponibles

Roles: Admin, Profesor, Tutor.

> ℹ️ **Sobre las contraseñas.** El seeder de usuarios
> (`make seed-dev` → `01-user-seeder.js`) crea el **admin con contraseña fija
> `admin1234`** para ingreso fácil en desarrollo. Los usuarios `profesor` y
> `tutor` se siembran con **contraseñas aleatorias** (`crypto.randomBytes`), que
> sólo se imprimen en los logs cuando `NODE_ENV` no es `production`. Para tener
> un login conocido de esos roles (u otro email/contraseña), ejecutá el script
> de creación de usuario:
>
> ```bash
> docker compose -f docker-compose.dev.yml exec backend node scripts/create-user.js   # (make seed-user-dev)
> # Defaults: admin@ifts29.edu.ar / admin1234 / rol admin
>
> # O con credenciales propias:
> docker compose -f docker-compose.dev.yml exec backend \
>   env EMAIL=tu@mail.com PASSWORD=TuPassword ROL=admin node scripts/create-user.js
> ```

### Admin (Acceso total)

```
Email:    admin@ifts29.edu.ar
Password: admin1234
Rol:      Administrador
Acceso:   Panel administrativo completo
```

**Puede:**
- ✅ Crear/editar/eliminar cualquier contenido
- ✅ Gestionar usuarios
- ✅ Personalizar sitio
- ✅ Ver reportes y estadísticas
- ✅ Acceder a todas las secciones

---

### Profesor

```
Rol:      Profesor
Acceso:   Panel administrativo limitado
```

**Puede:**
- ✅ Crear noticias propias
- ✅ Editar noticias propias
- ✅ Ver carreras y horarios
- ✅ Ver sus comisiones asignadas

**No puede:**
- ❌ Eliminar noticias
- ❌ Gestionar usuarios
- ❌ Personalizar sitio

---

### Tutor

```
Rol:      Tutor
Acceso:   Panel administrativo muy limitado
```

**Puede:**
- ✅ Ver noticias
- ✅ Ver eventos
- ✅ Crear testimonios

**No puede:**
- ❌ Crear/editar contenido propio
- ❌ Acceder a la mayoría de secciones

---

## 🌐 Acceso al Panel

1. Abre http://localhost:5173
2. Haz clic en **"Admin"** (esquina superior derecha)
3. Ingresa email y contraseña
4. Haz clic en **"Iniciar Sesión"**

---

## 🚀 Crear Nuevos Usuarios

Desde el panel admin:

1. Inicia sesión como **admin**
2. Ve a **"Usuarios"** en el menú
3. Haz clic en **"+ Nuevo Usuario"**
4. Completa:
   - Nombre
   - Apellido
   - Email
   - Contraseña
   - Rol (admin, profesor, tutor)
5. Haz clic en **"Crear"**

### Por Línea de Comandos

Dentro del contenedor:


```bash
make seed-user-dev 
o 
make shell-be-dev
npx sequelize-cli db:seed -s [numero]
```

---

## 🔄 Cambiar Contraseña

### Como Admin

1. Ve a **Usuarios**
2. Busca el usuario
3. Haz clic en **"Editar"**
4. Ingresa nueva contraseña
5. Guarda

### Como Usuario

Desde el perfil (próximamente):
- Haz clic en tu avatar (esquina superior derecha)
- Selecciona **"Cambiar Contraseña"**
- Ingresa vieja y nueva contraseña

---

## ⚠️ Notas de Seguridad

### En Desarrollo
- ✅ Las credenciales de prueba son públicas y conocidas
- ✅ Está bien usarlas para testear
- ✅ Los datos de desarrollo se pueden resetear fácilmente

### En Producción
- ❌ NUNCA uses credenciales de prueba
- ❌ Crea usuarios reales con contraseñas fuertes
- ❌ Cambia la JWT_SECRET
- ❌ Usa HTTPS obligatoriamente

---

## 🔐 Requisitos de Contraseña

La contraseña debe cumplir **todas** estas reglas:

- **Mínimo 8 caracteres**
- Al menos una **letra minúscula** (`a-z`)
- Al menos una **letra mayúscula** (`A-Z`)
- Al menos un **número** (`0-9`)

Ejemplos:

```
Admin1234        # ✅ válida (8+, may + min + número)
12345678         # ❌ rechazada (sin letras)
adminadmin       # ❌ rechazada (sin mayúscula ni número)
Admin1           # ❌ rechazada (menos de 8)
```

> ℹ️ El usuario admin sembrado (`admin1234`) se carga directo en la base por el
> seeder, que **no pasa por esta validación**, por eso funciona para ingresar
> aunque no tenga mayúscula. La regla de complejidad aplica al **crear/editar
> usuarios desde la app**.

---

## 🆘 Olvidé la Contraseña

En desarrollo puedes:

1. **Opción 1: Resetear BD**
   ```bash
   make dev-reset && make dev
   # Los seeders crean usuarios nuevos
   ```

2. **Opción 2: Cambiar en BD**
   ```bash
   # Dentro del contenedor
   sqlite3 data/dev.sqlite
   UPDATE users SET password_hash='...' WHERE email='...';
   ```

3. **Opción 3: Crear nuevo usuario**
   - Usa admin para crear uno nuevo
   - Usa esas credenciales

---

## 📊 Tabla de Permisos

| Funcionalidad | Admin | Profesor | Tutor |
|--------------|-------|----------|-------|
| Ver noticias | ✅ | ✅ | ✅ |
| Crear noticia | ✅ | ✅ | ❌ |
| Editar noticia propia | ✅ | ✅ | ❌ |
| Eliminar noticia | ✅ | ❌ | ❌ |
| Gestionar carreras | ✅ | ❌ | ❌ |
| Gestionar usuarios | ✅ | ❌ | ❌ |
| Personalizar sitio | ✅ | ❌ | ❌ |
| Ver consultas | ✅ | ❌ | ❌ |
| Responder consultas | ✅ | ❌ | ❌ |
| Ver reportes | ✅ | ❌ | ❌ |
| Gestionar horarios | ✅ | ✅ | ❌ |

---

## 🔄 Datos de Prueba

Al ejecutar `make dev` se cargan:
- ✅ 3 usuarios (admin, profesor, tutor)
- ✅ 2 carreras
- ✅ 5 noticias
- ✅ 3 eventos
- ✅ 2 testimonios
- ✅ 5 horarios
- ✅ Datos varios

---

**Ver también:** [INICIO_RAPIDO.md](./INICIO_RAPIDO.md)
