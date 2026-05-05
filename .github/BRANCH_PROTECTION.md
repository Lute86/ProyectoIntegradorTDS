# Protección de Rama `main` - Información para el Equipo

## Propósito
Estas reglas protegen la rama `main` (producción) para evitar cambios no revisados, prevenir errores en producción y asegurar que todo código pasa por revisión y pruebas antes de ser integrado.

## Reglas Enforcingidas (Qué está bloqueado)
1. **PRs a `main` solo pueden provenir de `develop`**
   No se permite abrir Pull Requests a `main` desde ninguna otra rama (ej: `feature/*`, `hotfix/*`, ramas locales directas).
2. **PRs a `main` requieren aprobación de otro integrante**
   Al menos 1 revisión aprobada de otro miembro del equipo es obligatoria para hacer merge. El owner del repositorio está exento de este requisito.
3. **No se permiten pushes directos a `main`**
   Todo cambio debe pasar por un PR desde `develop`, no se puede hacer `git push` directo a `main` desde ninguna PC local.
4. **Checks obligatorios antes de merge**
   Los siguientes workflows de GitHub Actions deben pasar exitosamente antes de poder hacer merge a `main`:
   - `PR Branch Check` (verifica que el PR provenga de `develop`)
   - `CI` (ejecuta lint y tests de backend y frontend)

## ¿Cómo afecta tu flujo de trabajo?
1. **Nunca trabajes directamente en `main` o `develop`**
   Crea tus ramas de feature desde `develop`:
   ```bash
   git checkout develop && git pull && git checkout -b feature/tu-feature
   ```
2. **Integra tus cambios a `develop` primero**
   Las ramas de feature se mergean a `develop` antes de enviarse a `main`.
3. **PRs a `main` se abren únicamente desde `develop`**
   No abras PRs a `main` directamente desde tus ramas de feature; primero haz merge de tu feature a `develop`, luego abrí el PR de `develop` a `main`.
4. **Espera revisión**
   Pedí a otro integrante del equipo que revise tu PR. Si eres el owner del repositorio, no necesitás revisión.
5. **Asegúrate de que todos los checks pasen**
   Si el workflow `PR Branch Check` falla, significa que tu PR no viene de `develop`. Si el workflow `CI` falla, corregí los errores de lint o tests antes de que se pueda hacer merge.

## Workflows Automáticos (GitHub Actions)
Estos archivos están en `.github/workflows/` y se ejecutan automáticamente en los servidores de GitHub (no en tu PC local):
1. **`pr-branch-check.yml`**
   Se ejecuta cuando se abre o actualiza un PR a `main`. Marca el PR como fallido si no proviene de `develop`.
2. **`ci.yml`**
   Se ejecuta en pushes a `develop`/`main` y en PRs. Corre lint y tests de backend y frontend. Si falla, no se puede hacer merge a `main`.

## Problemas Comunes
- **Mi PR a `main` falla el check de rama**: Cerrá el PR y abrí uno nuevo asegurándote de que la rama de origen sea `develop`.
- **No puedo hacer merge porque falta revisión**: Pedile a otro integrante del equipo que revise y apruebe tu PR.
- **Los tests fallan**: Corregí los errores de lint o tests localmente, hacé push de los cambios al PR y esperá a que los workflows pasen.
