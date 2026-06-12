# Pool Espana | Menu digital

Proyecto listo para publicar en Vercel y compartir por QR Code.

## Tecnologias

- Vite
- React
- TypeScript
- Vercel Functions
- Playwright

## Ejecutar localmente

```bash
npm install
npm run dev
```

## Tests E2E

```bash
npx playwright install chromium
npm run test:e2e
```

El flujo E2E actual cubre la navegacion mobile del menu y protege el regreso a `Bebidas` al volver al tope.

## Build de produccion

```bash
npm run build
```

La carpeta generada sera `dist/`.

## Donde editar el contenido

Todo el contenido del negocio quedo centralizado en:

- `src/data/menu.ts`
- `/admin` para edicion visual

En ese contenido podes cambiar:

- Nombre del negocio
- Numero de WhatsApp
- Titulos y textos del hero
- Combos
- Precios de bebidas, tragos y comidas
- Imagenes de productos

## Imagenes utilizadas

Las piezas visuales se copiaron a:

- `public/images/`

Si queres reemplazar un poster, mantenes el mismo nombre del archivo o actualizas la ruta en `src/data/menu.ts`.

## Panel admin

La ruta:

- `/admin`

permite:

- editar el contenido con formularios
- guardar cambios para todos los dispositivos usando GitHub como fuente central
- importar un JSON
- descargar un JSON actualizado
- restaurar el contenido original
- limitar intentos de login para frenar fuerza bruta

Importante:

- el `/admin` necesita variables de entorno en Vercel para autenticar y escribir en GitHub
- si cambias variables de entorno en Vercel, hace un redeploy para que apliquen en el nuevo deploy
- si GitHub no responde, el sitio sigue mostrando la ultima copia disponible

## Variables de entorno

Usa `.env.example` como referencia base.

Variables principales:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `ADMIN_LOGIN_MAX_ATTEMPTS`
- `ADMIN_LOGIN_WINDOW_MS`
- `ADMIN_LOGIN_BLOCK_MS`
- `MENU_CONTENT_GITHUB_TOKEN`
- `MENU_CONTENT_GITHUB_REPO`
- `MENU_CONTENT_GITHUB_BRANCH`
- `MENU_CONTENT_GITHUB_PATH`

## Rutina sugerida para operar el menu

1. Abrir `/admin` o `src/data/menu.ts`.
2. Cambiar precios, promos o textos.
3. Ejecutar `npm run dev` para revisar.
4. Ejecutar `npm run build` para validar.
5. Ejecutar `npm run test:e2e` si tocaste navegacion o layout mobile.
6. Subir a GitHub para disparar un nuevo deploy en Vercel.
7. Validar la URL publicada.
8. Generar o reutilizar el QR final.

## Publicar en Vercel

### Opcion 1: desde GitHub

1. Subi la carpeta a un repositorio.
2. Entra a Vercel.
3. Elige `Add New Project`.
4. Importa el repositorio.
5. Framework preset: `Vite`.
6. Deploy.

Si agregas o cambias variables de entorno:

1. Abri `Settings > Environment Variables`.
2. Guarda los cambios.
3. Redeploy del proyecto.

### Opcion 2: con CLI

```bash
npm i -g vercel
vercel
```

Despues, para publicar cambios:

```bash
vercel --prod
```

## Observacion importante

Algunas bebidas premium de las notas manuscritas tenian precios que no coinciden con los posters impresos. En el sitio deje ambas referencias cuando aportaban valor, marcando las manuscritas como `Lista manuscrita` o `Segun disponibilidad`. Si queres, en el siguiente paso puedo dejar una version 100% depurada solo con los precios finales confirmados.
