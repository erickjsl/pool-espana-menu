export type MenuItem = {
  name: string
  description?: string
  price: string
  badge?: string
  image?: string
}

export type MenuSection = {
  id: string
  eyebrow: string
  title: string
  description: string
  items: MenuItem[]
}

export type PromoCard = {
  title: string
  description: string
  price: string
  badge?: string
  image?: string
}

export type GalleryImage = {
  src: string
  alt: string
}

export type SiteData = {
  businessName: string
  displayName: string
  city: string
  tagline: string
  whatsappNumber: string
  whatsappDisplay: string
  whatsappUrl: string
  hero: {
    eyebrow: string
    title: string
    description: string
    stats: string[]
  }
  serviceHighlights: string[]
}

export type MenuContent = {
  siteData: SiteData
  featuredPromos: PromoCard[]
  comboCards: PromoCard[]
  menuSections: MenuSection[]
  galleryImages: GalleryImage[]
}

export const defaultMenuContent: MenuContent = {
  siteData: {
    businessName: 'Pool Espana',
    displayName: 'POOL ESPANA',
    city: 'Asuncion, Paraguay',
    tagline: 'Bar, pool y menu digital listo para QR',
    whatsappNumber: '595981962685',
    whatsappDisplay: '981 962 685',
    whatsappUrl:
      'https://wa.me/595981962685?text=Hola%20Pool%20Espana,%20quiero%20reservar%20una%20mesa',
    hero: {
      eyebrow: 'Pool, futbol, tragos y buena energia',
      title: 'El menu digital de Pool Espana ya esta listo para recibir reservas por QR.',
      description:
        'Una experiencia moderna, rapida y pensada para celular. Todo en espanol, con identidad nocturna, promos destacadas y secciones faciles de actualizar.',
      stats: [
        'Reservas por WhatsApp',
        'Promos destacadas',
        'Diseno optimizado para Vercel',
      ],
    },
    serviceHighlights: [
      'Canilla libre durante partidos',
      'Mesas con descuento especial',
      'Combos con ficha incluida',
      'Fast food + tragos + pool',
    ],
  },
  featuredPromos: [
    {
      title: 'Canilla libre',
      description: 'Durante el partido con ambiente futbolero y pantalla lista.',
      price: '50.000 Gs',
      badge: 'Promo estrella',
    },
    {
      title: 'Mesas con descuento',
      description: 'Ideal para grupos que quieren jugar pool y quedarse toda la noche.',
      price: '50% OFF',
      badge: 'Solo en fechas especiales',
    },
  ],
  comboCards: [
    {
      title: '3 Munich 3/4',
      description: 'Todas incluyen 1 ficha.',
      price: '55.000 Gs',
      image: '/images/products/combo-munich-3-4.jpeg',
    },
    {
      title: '3 Michelob Ultra 3/4',
      description: 'Combo para compartir.',
      price: '70.000 Gs',
      image: '/images/products/combo-michelob-ultra-3-4.jpeg',
    },
    {
      title: '6 Skol 275 ml',
      description: 'Combo con 1 ficha incluida.',
      price: '70.000 Gs',
      image: '/images/products/combo-skol-275.jpeg',
    },
    {
      title: '6 Munich Ultra botellita',
      description: 'Pensado para grupos.',
      price: '70.000 Gs',
      image: '/images/products/combo-munich-ultra-botellita.jpeg',
    },
    {
      title: '6 Coronitas',
      description: 'Combos listos para la previa.',
      price: '80.000 Gs',
      image: '/images/products/combo-coronitas-6.jpeg',
    },
    {
      title: '3 Corona 3/4',
      description: 'Con 1 ficha incluida.',
      price: '70.000 Gs',
      image: '/images/products/combo-corona-3-4.jpeg',
    },
    {
      title: '3 Patagonia',
      description: 'Combo premium.',
      price: '70.000 Gs',
      image: '/images/products/combo-patagonia-3.jpeg',
    },
    {
      title: '3 Heineken 3/4',
      description: 'Opcion clasica para compartir.',
      price: '70.000 Gs',
      image: '/images/products/combo-heineken-3-4.jpeg',
    },
    {
      title: '3 Bud 66 710 ml',
      description: 'Con 1 ficha incluida.',
      price: '70.000 Gs',
      image: '/images/products/combo-bud66-710.jpeg',
    },
    {
      title: '3 Stella Artois',
      description: 'Combos listos para la mesa.',
      price: '70.000 Gs',
      image: '/images/products/combo-stella-artois-3.jpeg',
    },
    {
      title: '3 Munich Ultra 3/4',
      description: 'Promocion vigente.',
      price: '70.000 Gs',
      image: '/images/products/combo-munich-ultra-3-4.jpeg',
    },
  ],
  menuSections: [
    {
      id: 'chopp',
      eyebrow: 'Bebidas',
      title: 'Chopp',
      description: 'Opciones tiradas y combos pensados para compartir.',
      items: [
        { name: 'Chopp Pilsen 330 ml', price: '10.000 Gs', image: '/images/products/chopp-pilsen.jpeg' },
        { name: 'Chopp Pilsen 500 ml', price: '15.000 Gs', image: '/images/products/chopp-pilsen.jpeg' },
        { name: 'Chopp Pilsen 1 litro', price: '25.000 Gs', image: '/images/products/chopp-pilsen.jpeg' },
        { name: 'Jarra Pilsen 1,5 L', price: '35.000 Gs', image: '/images/products/chopp-pilsen.jpeg' },
        { name: 'Chopp Munich 330 ml', price: '10.000 Gs', image: '/images/products/chopp-munich.jpeg' },
        { name: 'Chopp Munich 500 ml', price: '15.000 Gs', image: '/images/products/chopp-munich.jpeg' },
        { name: 'Chopp Munich 1 litro', price: '25.000 Gs', image: '/images/products/chopp-munich.jpeg' },
        { name: 'Jarra Munich 1,5 L', price: '35.000 Gs', image: '/images/products/chopp-munich.jpeg' },
        {
          name: 'Promo chopp 4 x 330 ml',
          price: '40.000 Gs',
          badge: 'Incluye 1 ficha',
          image: '/images/products/chopp-pilsen.jpeg',
        },
        {
          name: 'Promo chopp 3 x 500 ml',
          price: '50.000 Gs',
          badge: 'Incluye 1 ficha',
          image: '/images/products/chopp-munich.jpeg',
        },
        {
          name: 'Promo chopp 6 x 330 ml',
          price: '60.000 Gs',
          badge: 'Incluye 1 ficha',
          image: '/images/products/chopp-pilsen.jpeg',
        },
      ],
    },
    {
      id: 'cervezas',
      eyebrow: 'Botellas',
      title: 'Cervezas',
      description: 'Selecciones individuales segun la lista entregada.',
      items: [
        { name: 'Patagonia 740 ml', price: '25.000 Gs', image: '/images/products/patagonia-740.jpeg' },
        { name: 'Stella Artois 740 ml', price: '25.000 Gs', image: '/images/products/stella-artois-740.jpeg' },
        { name: 'Corona 710 ml', price: '25.000 Gs', image: '/images/products/corona-710.jpeg' },
        { name: 'Cerveza 660 ml / 650 ml', price: '25.000 Gs', image: '/images/products/heineken-650.jpeg' },
        { name: 'Milleria', price: '23.000 Gs', image: '/images/products/milleria-150.jpeg' },
        { name: 'Pilsen 3/4', price: '25.000 Gs', image: '/images/products/pilsen-3-4.jpeg' },
        { name: 'Pilsen 1,3 L', price: '10.000 Gs', image: '/images/products/pilsen-1-3l.jpeg' },
        { name: 'Munich 3/4', price: '25.000 Gs', image: '/images/products/munich-3-4.jpeg' },
        { name: 'Munich Ultra 3/4', price: '25.000 Gs', image: '/images/products/munich-ultra-3-4.jpeg' },
        { name: 'Munich 340 ml', price: '10.000 Gs', image: '/images/products/munich-340.jpeg' },
        { name: 'Munich LT', price: '25.000 Gs', image: '/images/products/munich-litro.jpeg' },
        { name: 'Munich Ultra', price: '10.000 Gs', image: '/images/products/munich-ultra-275.jpeg' },
        { name: 'Bud 66 710 ml', price: '25.000 Gs', image: '/images/products/bud66-710.jpeg' },
        { name: 'Bud Roja 340 ml', price: '15.000 Gs', image: '/images/products/bud-roja-340.jpeg' },
        { name: 'Corona 355 ml', price: '15.000 Gs', image: '/images/products/corona-355.jpeg' },
        { name: 'Skol 275 ml', price: '12.000 Gs', image: '/images/products/skol-275.jpeg' },
      ],
    },
    {
      id: 'tragos',
      eyebrow: 'Barra',
      title: 'Tragos',
      description: 'Cocteles, jarras y combinados para disfrutar, brindar y jugar.',
      items: [
        {
          name: 'Caipirina (vaso)',
          description: 'Cachaca, lima, azucar y hielo.',
          price: '25.000 Gs',
          image: '/images/products/caipirina-vaso.jpeg',
        },
        {
          name: 'Caipiroska (vaso)',
          description: 'Vodka, lima, azucar y hielo.',
          price: '28.000 Gs',
          image: '/images/products/caipiroska-vaso.jpeg',
        },
        {
          name: 'Sangria (vaso)',
          description: 'Vino tinto con frutas frescas.',
          price: '30.000 Gs',
          image: '/images/products/sangria-vaso.jpeg',
        },
        {
          name: 'Fernet Cola',
          description: 'Fernet Branca con Coca Cola.',
          price: '25.000 Gs',
          image: '/images/products/fernet-cola.jpeg',
        },
        {
          name: 'Whisky + shot',
          description: 'Shot a eleccion.',
          price: '25.000 Gs',
          image: '/images/products/whisky-shot.jpeg',
        },
        {
          name: 'Jagermeister + shot',
          description: 'Combinado de barra.',
          price: '35.000 Gs',
          image: '/images/products/jager-shot.jpeg',
        },
        {
          name: 'Gin Tonic (vaso)',
          description: 'Gin, tonica y toque de lima.',
          price: '25.000 Gs',
          image: '/images/products/gin-tonic.jpeg',
        },
        {
          name: 'Cuba Libre (vaso)',
          description: 'Ron, Coca Cola y lima.',
          price: '25.000 Gs',
          image: '/images/products/cuba-libre.jpeg',
        },
        {
          name: 'Daiquiri',
          description: 'Ron, lima y azucar licuado con hielo.',
          price: '30.000 Gs',
          image: '/images/products/daiquiri.jpeg',
        },
        {
          name: 'Sangria (jarra)',
          description: 'Ideal para compartir.',
          price: '60.000 Gs',
          image: '/images/products/sangria-jarra.jpeg',
        },
        {
          name: 'Caipirina (jarra)',
          description: 'Version grande para la mesa.',
          price: '60.000 Gs',
          image: '/images/products/caipirina-jarra.jpeg',
        },
        {
          name: 'Aperol',
          description: 'Aperol, espumante y soda.',
          price: '30.000 Gs',
          image: '/images/products/aperol.jpeg',
        },
      ],
    },
    {
      id: 'whisky',
      eyebrow: 'Premium',
      title: 'Whisky y etiquetas',
      description: 'Selecciones premium registradas en las fotos del bar.',
      items: [
        { name: 'Double Black Rye', price: '35.000 Gs', image: '/images/products/double-black-rye.jpeg' },
        { name: 'Jack Daniels', price: '30.000 Gs', image: '/images/products/jack-daniels.jpeg' },
        { name: 'JW Black Label', price: '50.000 Gs', image: '/images/products/jw-black-label.jpeg' },
        { name: 'JW Red Label', price: '25.000 Gs', image: '/images/products/jw-black-label.jpeg' },
        { name: 'Evan Williams Honey', price: '25.000 Gs', image: '/images/products/evan-williams-fire.jpeg' },
        { name: 'Evan Williams Fire', price: '25.000 Gs', image: '/images/products/evan-williams-fire.jpeg' },
      ],
    },
    {
      id: 'gaseosas',
      eyebrow: 'Sin alcohol',
      title: 'Gaseosas y mixers',
      description: 'Perfectas para mezclar o refrescar la mesa.',
      items: [
        { name: 'Coca Cola 500 ml', price: '10.000 Gs', image: '/images/products/coca-cola.jpeg' },
        { name: 'Fanta naranja 500 ml', price: '10.000 Gs', image: '/images/products/fanta-naranja.jpeg' },
        { name: 'Sprite 500 ml', price: '10.000 Gs', image: '/images/products/sprite.jpeg' },
        { name: 'Fanta uva 500 ml', price: '10.000 Gs', image: '/images/products/fanta-uva.jpeg' },
        { name: 'Fanta guarana 500 ml', price: '10.000 Gs', image: '/images/products/fanta-guarana.jpeg' },
        { name: 'Agua Seltz 500 ml', price: '8.000 Gs', image: '/images/products/agua-seltz.jpeg' },
        { name: 'Agua tonica 500 ml', price: '20.000 Gs', image: '/images/products/agua-tonica.jpeg' },
      ],
    },
    {
      id: 'comidas',
      eyebrow: 'Fast food',
      title: 'Comidas',
      description: 'Entrepanes, picadas, pizzas y extras para completar la salida.',
      items: [
        {
          name: 'Lomito Pool',
          description:
            'Pan, carne, tomate, repollo, huevo, jamon, queso, panceta y papas fritas.',
          price: '50.000 Gs',
          image: '/images/products/lomito-pool.jpeg',
        },
        {
          name: 'Lomito Junior',
          description: 'Pan, carne, tomate, repollo, huevo, jamon y queso.',
          price: '35.000 Gs',
          image: '/images/products/lomito-junior.jpeg',
        },
        {
          name: 'Hamburguesa',
          description: 'Pan, carne, tomate, repollo, huevo, jamon y queso.',
          price: '30.000 Gs',
          image: '/images/products/hamburguesa.jpeg',
        },
        {
          name: 'Cheese Burger',
          description:
            'Pan, carne, tomate, repollo, huevo, jamon, seleccion de quesos, panceta y papas fritas.',
          price: '45.000 Gs',
          image: '/images/products/cheese-burger.jpeg',
        },
        {
          name: 'Parrillita',
          description: 'Tapa cuadril, chorizo parrillero, chorizo picante y papas fritas.',
          price: '130.000 Gs',
          badge: 'Para 2 a 3 personas',
          image: '/images/products/parrillita.jpeg',
        },
        {
          name: 'Parrilla',
          description: 'Tapa cuadril, chorizo parrillero, chorizo picante y papas fritas.',
          price: '160.000 Gs',
          badge: 'Para 5 personas',
          image: '/images/products/parrilla.jpeg',
        },
        {
          name: 'Pizza Pepperoni',
          description: 'Salsa, queso y pepperoni.',
          price: '70.000 Gs',
          image: '/images/products/pizza-pepperoni.jpeg',
        },
        {
          name: 'Pizza Napolitana',
          description: 'Salsa, queso, jamon y tomate.',
          price: '70.000 Gs',
          image: '/images/products/pizza-napolitana.jpeg',
        },
        {
          name: 'Pizza Margarita',
          description: 'Salsa, queso, tomate y albahaca.',
          price: '70.000 Gs',
          image: '/images/products/pizza-margarita.jpeg',
        },
        {
          name: 'Pizza Muzzarella',
          description: 'Salsa y queso.',
          price: '60.000 Gs',
          image: '/images/products/pizza-muzzarella.jpeg',
        },
        {
          name: 'Pizza Catupiry con pollo',
          description: 'Salsa, queso, catupiry y pollo.',
          price: '70.000 Gs',
          image: '/images/products/pizza-catupiry-pollo.jpeg',
        },
        { name: 'Papas fritas', price: '30.000 Gs', image: '/images/products/papas-fritas.jpeg' },
      ],
    },
  ],
  galleryImages: [
    {
      src: '/images/promo-copa.jpeg',
      alt: 'Poster promocional de Pool Espana con tematica futbolera.',
    },
    {
      src: '/images/combos-ficha.jpeg',
      alt: 'Poster de combos con ficha incluida.',
    },
    {
      src: '/images/menu-fast-food.jpeg',
      alt: 'Poster de menu fast food de Pool Espana.',
    },
    {
      src: '/images/tragos-poster.jpeg',
      alt: 'Poster de tragos de Pool Espana.',
    },
    {
      src: '/images/menu-bebidas.jpeg',
      alt: 'Poster de bebidas y cervezas de Pool Espana.',
    },
  ],
}

export const menuContentStorageKey = 'pool-espana-menu-content'
