/**
 * rpgData.js
 * Base de datos para el Modo Aventura RPG: Las Crónicas del Álgebra (Estilo Final Fantasy)
 * Alineado al Currículum de 1° Medio Chile (MINEDUC)
 */

export const RPG_HEROES = [
  {
    id: "manuel",
    name: "Manuel",
    title: "Paladín del Álgebra",
    role: "Tank / Daño Físico",
    avatar: "manuel",
    level: 1,
    hp: 120,
    maxHp: 120,
    mp: 40,
    maxMp: 40,
    attack: 25,
    defense: 15,
    skills: [
      {
        id: "golpe_binomio",
        name: "⚔️ Golpe del Binomio",
        mpCost: 10,
        damageMultiplier: 1.6,
        description: "Concentra el poder de (a+b)² para un impacto contundente.",
        topic: "cuadrado_binomio"
      },
      {
        id: "escudo_balanza",
        name: "🛡️ Escudo de la Balanza",
        mpCost: 15,
        damageMultiplier: 0,
        healAmount: 45,
        description: "Restaura 45 HP y equilibra la balanza.",
        topic: "lineal_entera"
      }
    ],
    equipment: {
      weapon: "Espada de Regla",
      armor: "Peto de Cuadrícula"
    }
  },
  {
    id: "sofia",
    name: "Sofía",
    title: "Maga de Ecuaciones",
    role: "Hechicera / Daño Mágico Masivo",
    avatar: "sofia",
    level: 1,
    hp: 90,
    maxHp: 90,
    mp: 70,
    maxMp: 70,
    attack: 35,
    defense: 8,
    skills: [
      {
        id: "tormenta_trinomios",
        name: "🪄 Tormenta de Trinomios",
        mpCost: 20,
        damageMultiplier: 2.2,
        description: "Invoca rayos de factorización para infligir daño masivo.",
        topic: "trinomio"
      },
      {
        id: "chispa_diferencia",
        name: "⚡ Chispa de Cuadrados",
        mpCost: 12,
        damageMultiplier: 1.5,
        description: "Lanza proyectiles de a² - b² = (a+b)(a-b).",
        topic: "diferencia_cuadrados"
      }
    ],
    equipment: {
      weapon: "Báculo de Euclides",
      armor: "Túnica de Gauss"
    }
  },
  {
    id: "nico",
    name: "Nico",
    title: "Pícaro del Factor",
    role: "Velocista / Críticos & Ganzúa",
    avatar: "nico",
    level: 1,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    attack: 28,
    defense: 10,
    skills: [
      {
        id: "corte_factor_comun",
        name: "🗡️ Corte de Factor Común",
        mpCost: 12,
        damageMultiplier: 1.8,
        description: "Extrae el factor común para un golpe crítico certero.",
        topic: "factor_comun"
      },
      {
        id: "trampa_termino_comun",
        name: "🪤 Trampa de Término Común",
        mpCost: 15,
        damageMultiplier: 1.7,
        description: "Tiende una emboscada con binomios (x+a)(x+b).",
        topic: "termino_comun"
      }
    ],
    equipment: {
      weapon: "Dagas de Compás",
      armor: "Capa de Signos"
    }
  }
];

export const RPG_ITEMS = [
  {
    id: "pocion_hp",
    name: "Poción de Álgebra",
    type: "consumable",
    icon: "🧪",
    effect: "Restaura 60 HP a un aliado",
    value: 60,
    price: 30
  },
  {
    id: "elixir_mp",
    name: "Elixir de Concentración",
    type: "consumable",
    icon: "💧",
    effect: "Restaura 40 MP a un aliado",
    value: 40,
    price: 35
  },
  {
    id: "pergamino_pista",
    name: "Pergamino de Euclides",
    type: "consumable",
    icon: "📜",
    effect: "Revela la pista directa del ejercicio actual",
    value: 1,
    price: 50
  }
];

export const RPG_WORLDS = [
  {
    id: "world_1",
    worldNumber: 1,
    name: "El Bosque de los Monomios",
    subtitle: "Términos Semejantes & Factor Común (OA 2)",
    themeClass: "biome-forest",
    icon: "🌲",
    bgGradient: "linear-gradient(135deg, #062b1e 0%, #0d402b 100%)",
    nodes: [
      {
        id: "node_1_1",
        worldId: "world_1",
        title: "Sendero de Monomios",
        type: "battle",
        icon: "⚔️",
        x: 12,
        y: 60,
        enemy: {
          name: "Limo Monomial",
          hp: 120,
          maxHp: 120,
          attack: 12,
          sprite: "slime",
          xpReward: 60,
          goldReward: 25
        },
        topic: "terminos_semejantes",
        requiredStars: 0,
        nextNodes: ["node_1_2"]
      },
      {
        id: "node_1_2",
        worldId: "world_1",
        title: "El Portón Rúnico de Madera",
        type: "door",
        icon: "🚪",
        x: 32,
        y: 40,
        puzzleDescription: "Para abrir este portón ancestral, debes reducir los términos semejantes y activar los engranajes mágicos.",
        topic: "terminos_semejantes",
        requiredStars: 0,
        nextNodes: ["node_1_3", "node_1_chest"]
      },
      {
        id: "node_1_chest",
        worldId: "world_1",
        title: "Cofre Oculto del Bosque",
        type: "chest",
        icon: "📦",
        x: 46,
        y: 75,
        puzzleDescription: "Una cerradura de factor común protege un botín misterioso.",
        topic: "factor_comun",
        rewards: { gold: 80, items: ["pocion_hp", "elixir_mp"] },
        nextNodes: ["node_1_4"]
      },
      {
        id: "node_1_3",
        worldId: "world_1",
        title: "Santuario de Al-Juarismi",
        type: "shrine",
        icon: "⛲",
        x: 55,
        y: 35,
        healFull: true,
        loreTip: "Recuerda: Los términos semejantes tienen exactamente las mismas variables y exponentes (ej: 3x²y con -5x²y).",
        nextNodes: ["node_1_4"]
      },
      {
        id: "node_1_4",
        worldId: "world_1",
        title: "Puente del Factor Común",
        type: "battle",
        icon: "⚔️",
        x: 74,
        y: 50,
        enemy: {
          name: "Ent de las Raíces",
          hp: 160,
          maxHp: 160,
          attack: 18,
          sprite: "tree_monster",
          xpReward: 90,
          goldReward: 40
        },
        topic: "factor_comun",
        nextNodes: ["node_1_5"]
      },
      {
        id: "node_1_5",
        worldId: "world_1",
        title: "Cámara del Gólem de Ramas (Jefe)",
        type: "boss",
        icon: "👑",
        x: 90,
        y: 45,
        enemy: {
          name: "Gólem Monomio Primordial",
          hp: 260,
          maxHp: 260,
          attack: 24,
          sprite: "boss_golem",
          xpReward: 200,
          goldReward: 120
        },
        topic: "factor_comun",
        nextNodes: ["node_2_1"]
      }
    ]
  },
  {
    id: "world_2",
    worldNumber: 2,
    name: "Las Ruinas de los Productos Notables",
    subtitle: "Cuadrado de Binomio y Suma por Diferencia (OA 3)",
    themeClass: "biome-ruins",
    icon: "🏛️",
    bgGradient: "linear-gradient(135deg, #2a1b06 0%, #4a2f0a 100%)",
    nodes: [
      {
        id: "node_2_1",
        worldId: "world_2",
        title: "Entrada a las Pirámides Binomiales",
        type: "battle",
        icon: "⚔️",
        x: 12,
        y: 50,
        enemy: {
          name: "Espectro del Binomio",
          hp: 200,
          maxHp: 200,
          attack: 22,
          sprite: "specter",
          xpReward: 110,
          goldReward: 50
        },
        topic: "cuadrado_binomio",
        nextNodes: ["node_2_2"]
      },
      {
        id: "node_2_2",
        worldId: "world_2",
        title: "Puerta de los Dos Cuadrados",
        type: "door",
        icon: "🚪",
        x: 35,
        y: 35,
        puzzleDescription: "La inscripción reza: '(a + b)(a - b) = a² - b²'. Resuelve la suma por diferencia para abrir el sello.",
        topic: "suma_por_diferencia",
        nextNodes: ["node_2_chest", "node_2_3"]
      },
      {
        id: "node_2_chest",
        worldId: "world_2",
        title: "Sarcófago de Oro de Gauss",
        type: "chest",
        icon: "📦",
        x: 48,
        y: 70,
        puzzleDescription: "Una trampa de binomio con término común custodia el tesoro.",
        topic: "termino_comun",
        rewards: { gold: 140, items: ["pergamino_pista", "pocion_hp"] },
        nextNodes: ["node_2_4"]
      },
      {
        id: "node_2_3",
        worldId: "world_2",
        title: "Fuente de la Simetría",
        type: "shrine",
        icon: "⛲",
        x: 60,
        y: 30,
        healFull: true,
        loreTip: "¡Ojo con los signos! En (a - b)², el doble producto es negativo: a² - 2ab + b².",
        nextNodes: ["node_2_4"]
      },
      {
        id: "node_2_4",
        worldId: "world_2",
        title: "Guardia de la Esfinge",
        type: "battle",
        icon: "⚔️",
        x: 75,
        y: 55,
        enemy: {
          name: "Centinela de Piedra",
          hp: 240,
          maxHp: 240,
          attack: 26,
          sprite: "sentinel",
          xpReward: 140,
          goldReward: 65
        },
        topic: "termino_comun",
        nextNodes: ["node_2_5"]
      },
      {
        id: "node_2_5",
        worldId: "world_2",
        title: "Cúpula de la Esfinge Binomial (Jefe)",
        type: "boss",
        icon: "👑",
        x: 90,
        y: 45,
        enemy: {
          name: "Esfinge Binomial Legendaria",
          hp: 380,
          maxHp: 380,
          attack: 32,
          sprite: "boss_sphinx",
          xpReward: 300,
          goldReward: 180
        },
        topic: "cuadrado_binomio",
        nextNodes: ["node_3_1"]
      }
    ]
  },
  {
    id: "world_3",
    worldNumber: 3,
    name: "Las Cavernas de la Factorización",
    subtitle: "Trinomios x² + px + q y Dif. de Cuadrados (OA 2)",
    themeClass: "biome-cavern",
    icon: "💎",
    bgGradient: "linear-gradient(135deg, #091d34 0%, #15325b 100%)",
    nodes: [
      {
        id: "node_3_1",
        worldId: "world_3",
        title: "Galería de Cuarzo Trinomio",
        type: "battle",
        icon: "⚔️",
        x: 12,
        y: 50,
        enemy: {
          name: "Gárgola de Cristal",
          hp: 280,
          maxHp: 280,
          attack: 30,
          sprite: "crystal_gargoyle",
          xpReward: 180,
          goldReward: 75
        },
        topic: "trinomio",
        nextNodes: ["node_3_2"]
      },
      {
        id: "node_3_2",
        worldId: "world_3",
        title: "Portal de Cristal Descompuesto",
        type: "door",
        icon: "🚪",
        x: 35,
        y: 40,
        puzzleDescription: "Encuentra los dos números cuya multiplicación dé 'q' y suma dé 'p' para abrir la compuerta.",
        topic: "trinomio",
        nextNodes: ["node_3_chest", "node_3_3"]
      },
      {
        id: "node_3_chest",
        worldId: "world_3",
        title: "Filón de Diamantes Algebraicos",
        type: "chest",
        icon: "📦",
        x: 48,
        y: 75,
        puzzleDescription: "Un cerrojo de diferencia de cuadrados bloquea el cofre brillante.",
        topic: "diferencia_cuadrados",
        rewards: { gold: 200, items: ["pocion_hp", "elixir_mp", "pergamino_pista"] },
        nextNodes: ["node_3_4"]
      },
      {
        id: "node_3_3",
        worldId: "world_3",
        title: "Altar de la Descomposición",
        type: "shrine",
        icon: "⛲",
        x: 58,
        y: 30,
        healFull: true,
        loreTip: "Para x² - 5x + 6: dos números que multiplicados den +6 y sumados -5 son (-2) y (-3) => (x-2)(x-3).",
        nextNodes: ["node_3_4"]
      },
      {
        id: "node_3_4",
        worldId: "world_3",
        title: "Abismo de los Factores Primos",
        type: "battle",
        icon: "⚔️",
        x: 75,
        y: 55,
        enemy: {
          name: "Horror de Cuadrados",
          hp: 340,
          maxHp: 340,
          attack: 36,
          sprite: "abyss_monster",
          xpReward: 220,
          goldReward: 90
        },
        topic: "diferencia_cuadrados",
        nextNodes: ["node_3_5"]
      },
      {
        id: "node_3_5",
        worldId: "world_3",
        title: "Núcleo del Cristal Polinómico (Jefe)",
        type: "boss",
        icon: "👑",
        x: 90,
        y: 45,
        enemy: {
          name: "Leviatán de Cristal Polinómico",
          hp: 500,
          maxHp: 500,
          attack: 42,
          sprite: "boss_crystal",
          xpReward: 420,
          goldReward: 250
        },
        topic: "trinomio",
        nextNodes: ["node_4_1"]
      }
    ]
  },
  {
    id: "world_4",
    worldNumber: 4,
    name: "El Valle de la Gran Balanza",
    subtitle: "Ecuaciones Lineales Enteras y con Paréntesis (OA 4)",
    themeClass: "biome-scale",
    icon: "⚖️",
    bgGradient: "linear-gradient(135deg, #301700 0%, #582b05 100%)",
    nodes: [
      {
        id: "node_4_1",
        worldId: "world_4",
        title: "Plataformas Flotantes de Despeje",
        type: "battle",
        icon: "⚔️",
        x: 12,
        y: 50,
        enemy: {
          name: "Autómata del Desequilibrio",
          hp: 380,
          maxHp: 380,
          attack: 38,
          sprite: "automaton",
          xpReward: 260,
          goldReward: 100
        },
        topic: "lineal_entera",
        nextNodes: ["node_4_2"]
      },
      {
        id: "node_4_2",
        worldId: "world_4",
        title: "Puente Levadizo Equilibrado",
        type: "door",
        icon: "🚪",
        x: 35,
        y: 40,
        puzzleDescription: "Aplica la propiedad de la balanza: ax + b = cx + d para nivelar los platillos y bajar el puente.",
        topic: "lineal_entera",
        nextNodes: ["node_4_chest", "node_4_3"]
      },
      {
        id: "node_4_chest",
        worldId: "world_4",
        title: "Bóveda de las Pesas Doradas",
        type: "chest",
        icon: "📦",
        x: 48,
        y: 75,
        puzzleDescription: "Una ecuación con propiedad distributiva a(x + b) = c sella la caja fuerte.",
        topic: "lineal_parentesis",
        rewards: { gold: 260, items: ["pocion_hp", "pocion_hp", "elixir_mp"] },
        nextNodes: ["node_4_4"]
      },
      {
        id: "node_4_3",
        worldId: "world_4",
        title: "Monolito del Cero Absoluto",
        type: "shrine",
        icon: "⛲",
        x: 58,
        y: 30,
        healFull: true,
        loreTip: "Si tienes paréntesis como 3(2x - 4), primero multiplica 3 por cada término dentro: 6x - 12.",
        nextNodes: ["node_4_4"]
      },
      {
        id: "node_4_4",
        worldId: "world_4",
        title: "Torreón de las Fracciones",
        type: "battle",
        icon: "⚔️",
        x: 75,
        y: 55,
        enemy: {
          name: "Coloso de Balanza",
          hp: 440,
          maxHp: 440,
          attack: 44,
          sprite: "scale_colossus",
          xpReward: 320,
          goldReward: 130
        },
        topic: "lineal_parentesis",
        nextNodes: ["node_4_5"]
      },
      {
        id: "node_4_5",
        worldId: "world_4",
        title: "Santuario del Guardián del Equilibrio (Jefe)",
        type: "boss",
        icon: "👑",
        x: 90,
        y: 45,
        enemy: {
          name: "Gran Guardián del Equilibrio Cósmico",
          hp: 650,
          maxHp: 650,
          attack: 50,
          sprite: "boss_guardian",
          xpReward: 550,
          goldReward: 350
        },
        topic: "lineal_parentesis",
        nextNodes: ["node_5_1"]
      }
    ]
  },
  {
    id: "world_5",
    worldNumber: 5,
    name: "La Ciudadela del Dr. Monomio",
    subtitle: "Desafío Final Integrado: SIMCE y Álgebra Completa (1° Medio)",
    themeClass: "biome-citadel",
    icon: "🏰",
    bgGradient: "linear-gradient(135deg, #320815 0%, #5a0e28 100%)",
    nodes: [
      {
        id: "node_5_1",
        worldId: "world_5",
        title: "Murallas de la Ciudadela",
        type: "battle",
        icon: "⚔️",
        x: 12,
        y: 50,
        enemy: {
          name: "Guardia Real de Monomio",
          hp: 500,
          maxHp: 500,
          attack: 48,
          sprite: "elite_guard",
          xpReward: 400,
          goldReward: 160
        },
        topic: "simce_1medio",
        nextNodes: ["node_5_2"]
      },
      {
        id: "node_5_2",
        worldId: "world_5",
        title: "Puerta del Trono Supremo",
        type: "door",
        icon: "🚪",
        x: 35,
        y: 40,
        puzzleDescription: "El sello supremo combina problemas de planteo y productos notables. ¡Solo los verdaderos maestros pueden pasar!",
        topic: "problema_planteo",
        nextNodes: ["node_5_chest", "node_5_3"]
      },
      {
        id: "node_5_chest",
        worldId: "world_5",
        title: "Arsenal Legendario del MINEDUC",
        type: "chest",
        icon: "📦",
        x: 48,
        y: 75,
        puzzleDescription: "Un desafío integral para conseguir las armas legendarias del 7.0.",
        topic: "simce_1medio",
        rewards: { gold: 500, items: ["pocion_hp", "pocion_hp", "elixir_mp", "pergamino_pista"] },
        nextNodes: ["node_5_4"]
      },
      {
        id: "node_5_3",
        worldId: "world_5",
        title: "Recámara de Meditación de Manuel",
        type: "shrine",
        icon: "⛲",
        x: 58,
        y: 30,
        healFull: true,
        loreTip: "Manuel: ¡Llegamos a la batalla final! Recuerda todo lo practicado: lee con calma, identifica la incógnita y aplica las fórmulas paso a paso.",
        nextNodes: ["node_5_4"]
      },
      {
        id: "node_5_4",
        worldId: "world_5",
        title: "Antecámara del Dragón Polinómico",
        type: "battle",
        icon: "⚔️",
        x: 75,
        y: 55,
        enemy: {
          name: "Dragón Polinómico Ancestral",
          hp: 680,
          maxHp: 680,
          attack: 55,
          sprite: "dragon",
          xpReward: 600,
          goldReward: 250
        },
        topic: "simce_1medio",
        nextNodes: ["node_5_5"]
      },
      {
        id: "node_5_5",
        worldId: "world_5",
        title: "Trono del Dr. Monomio (Batalla Final)",
        type: "boss",
        icon: "👑",
        x: 90,
        y: 45,
        enemy: {
          name: "Dr. Monomio (Supremo)",
          hp: 950,
          maxHp: 950,
          attack: 65,
          sprite: "boss",
          xpReward: 1500,
          goldReward: 1000
        },
        topic: "simce_1medio",
        nextNodes: []
      }
    ]
  }
];
