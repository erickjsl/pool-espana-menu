# Pool Espana | Menu digital

Proyecto listo para publicar gratis en Vercel y compartir por QR Code.

## Tecnologias

- Vite
- React
- TypeScript

## Ejecutar localmente

```bash
npm install
npm run dev
```

## Build de produccion

```bash
npm run build
```

La carpeta generada sera `dist/`.

## Donde editar el contenido

Todo el contenido del negocio quedo centralizado en:

- `src/data/menu.ts`

En ese archivo podes cambiar:

- Nombre del negocio
- Numero de WhatsApp
- Titulos y textos del hero
- Promociones destacadas
- Combos
- Precios de bebidas, tragos y comidas
- Galeria de imagenes

## Imagenes utilizadas

Las piezas visuales se copiaron a:

- `public/images/`

Si queres reemplazar un poster, mantenes el mismo nombre de archivo o actualizas la ruta en `src/data/menu.ts`.

## Rutina sugerida para operar el menu

1. Abrir `src/data/menu.ts`.
2. Cambiar precios, promos o textos.
3. Ejecutar `npm run dev` para revisar.
4. Ejecutar `npm run build` para validar.
5. Subir a Vercel.
6. Copiar la URL publicada.
7. Generar un QR con esa URL y ponerlo en mesas, barra o flyers.

## Publicar gratis en Vercel

### Opcion 1: desde GitHub

1. Subi la carpeta `web` a un repositorio.
2. Entrá a Vercel.
3. Elegí `Add New Project`.
4. Importá el repositorio.
5. Framework preset: `Vite`.
6. Deploy.

### Opcion 2: con CLI

```bash
npm i -g vercel
vercel
```

Despues, para publicar cambios:

```bash
vercel --prod
```

## QR Code

Cuando Vercel te entregue la URL final:

1. Copiala.
2. Usala en cualquier generador de QR.
3. Descarga el QR en PNG o SVG.
4. Imprimilo y colocalo en mesas o entrada.

## Observacion importante

Algunas bebidas premium de las notas manuscritas tenian precios que no coinciden con los posters impresos. En el sitio deje ambas referencias cuando aportaban valor, marcando las manuscritas como `Lista manuscrita` o `Segun disponibilidad`. Si queres, en el siguiente paso puedo dejar una version 100% depurada solo con los precios finales confirmados.
