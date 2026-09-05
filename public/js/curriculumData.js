/**
 * curriculumData.js
 * Currículum de Matemáticas 1° Medio (MINEDUC Chile) y Lore del juego "Manuel"
 */

export const CURRICULUM_INFO = {
  pais: "Chile",
  nivel: "1° Medio",
  asignatura: "Matemáticas",
  eje: "Álgebra y Funciones",
  objetivosAprendizaje: [
    {
      codigo: "OA 3",
      descripcion: "Desarrollar los productos notables de manera concreta, pictórica y simbólica: Cuadrado del binomio, Suma por diferencia, y Producto de binomios con un término común."
    },
    {
      codigo: "OA 4",
      descripcion: "Resolver sistemas de ecuaciones lineales y ecuaciones lineales con coeficientes enteros y fraccionarios, utilizando el modelo de balanza y métodos algebraicos."
    },
    {
      codigo: "OA 2",
      descripcion: "Mostrar que comprenden la factorización de expresiones algebraicas elementales: factor común monomio y trinomios resultantes de productos notables."
    }
  ]
};

export const WORLDS = [
  {
    id: "mundo_1",
    number: 1,
    name: "El Bosque de los Términos Semejantes",
    theme: "forest",
    topic: "terminos_semejantes",
    targetScore: 300,
    requiredCorrect: 3,
    lore: {
      intro: "¡Hola! Soy Manuel, estudiante de 1° Medio. Me quedé dormido estudiando para la prueba de álgebra en el liceo y desperté en este misterioso bosque. El puente hacia la ciudad está bloqueado por ramas con monomios desordenados. ¡Ayúdame a reducir los términos semejantes para avanzar!",
      cleared: "¡Bacán! Despejamos el camino uniendo los x² con x² y los números con números. ¡Cruzamos el puente hacia las Ruinas Antiguas!"
    },
    enemy: {
      name: "Gólem Desordenado",
      hp: 100,
      sprite: "golem"
    }
  },
  {
    id: "mundo_2",
    number: 2,
    name: "Las Ruinas de los Productos Notables",
    theme: "ruins",
    topic: "productos_notables_aleatorio",
    targetScore: 600,
    requiredCorrect: 4,
    lore: {
      intro: "Llegamos a las milenarias Ruinas de los Productos Notables. Las puertas de piedra tienen inscritos binomios mágicos: cuadrados de binomio, suma por diferencia y binomios con término común. ¡Si calculamos la expansión exacta, los sellos se abrirán!",
      cleared: "¡Increíble! Dominamos el cuadrado de binomio y la suma por diferencia. ¡Las puertas se abrieron de par en par!"
    },
    enemy: {
      name: "Esfinge Binomial",
      hp: 150,
      sprite: "sphinx"
    }
  },
  {
    id: "mundo_3",
    number: 3,
    name: "La Caverna de la Factorización",
    theme: "cavern",
    topic: "trinomio",
    targetScore: 900,
    requiredCorrect: 4,
    lore: {
      intro: "Descendemos a la Caverna de Cristal. Aquí las expresiones están expandidas pero inestables. Debemos encontrar sus factores originales: el producto de binomios o factores comunes que las crearon.",
      cleared: "¡Soberbio! Factorizaste los trinomios y diferencias de cuadrados como un verdadero matemático de 1° Medio. ¡Ya sentimos la energía de la Gran Balanza!"
    },
    enemy: {
      name: "Cristal Polinómico",
      hp: 200,
      sprite: "crystal"
    }
  },
  {
    id: "mundo_4",
    number: 4,
    name: "El Abismo de la Gran Balanza",
    theme: "scale",
    topic: "ecuaciones_aleatorio",
    targetScore: 1200,
    requiredCorrect: 4,
    lore: {
      intro: "¡Cuidado Manuel! Estamos flotando sobre el Abismo del Despeje. Para activar el puente de luz, las dos bandejas de la balanza deben permanecer en perfecto equilibrio. Despeja el valor exacto de la incógnita x.",
      cleared: "¡Equilibrio perfecto! Restamos en ambos lados, dividimos por el coeficiente y la balanza no osciló ni un milímetro. ¡Solo queda enfrentar la torre del jefe final!"
    },
    enemy: {
      name: "Guardián del Equilibrio",
      hp: 250,
      sprite: "guardian"
    }
  },
  {
    id: "mundo_5",
    number: 5,
    name: "La Torre del Dr. Monomio (Batalla Final)",
    theme: "tower",
    topic: "simce_1medio",
    targetScore: 1800,
    requiredCorrect: 5,
    lore: {
      intro: "¡Ja, ja, ja! ¡Manuel, jamás podrás graduarte de 1° Medio! -grita el malévolo Dr. Monomio desde lo alto de su trono-. Lanzaré hechizos de ecuaciones con paréntesis, fracciones y productos notables combinados. ¡Demuestra si eres digno del título de Guardián del Álgebra!",
      cleared: "¡VICTORIA TOTAL! Derrotaste al Dr. Monomio con tus conocimientos de álgebra. Manuel despierta en su pupitre justo a tiempo para sacar un 7.0 en la prueba del liceo. ¡Eres una leyenda de las matemáticas!"
    },
    enemy: {
      name: "Dr. Monomio",
      hp: 350,
      sprite: "boss"
    }
  }
];

export const CHEATSHEET = [
  {
    id: "cuadrado_binomio_suma",
    titulo: "Cuadrado de Binomio (Suma)",
    formula: "(a + b)² = a² + 2ab + b²",
    regla: "El primer término al cuadrado, más el doble producto del primero por el segundo, más el segundo al cuadrado.",
    ejemplo: "(x + 4)² = x² + 2·x·4 + 4² = x² + 8x + 16"
  },
  {
    id: "cuadrado_binomio_resta",
    titulo: "Cuadrado de Binomio (Resta)",
    formula: "(a - b)² = a² - 2ab + b²",
    regla: "El primer término al cuadrado, MENOS el doble producto del primero por el segundo, MÁS el segundo al cuadrado.",
    ejemplo: "(x - 5)² = x² - 2·x·5 + 5² = x² - 10x + 25"
  },
  {
    id: "suma_por_diferencia",
    titulo: "Suma por Diferencia",
    formula: "(a + b)(a - b) = a² - b²",
    regla: "El cuadrado del término con igual signo MENOS el cuadrado del término con signo opuesto. ¡Los términos medios se anulan!",
    ejemplo: "(x + y)(x - y) = x² - y²"
  },
  {
    id: "termino_comun",
    titulo: "Binomio con Término Común",
    formula: "(x + a)(x + b) = x² + (a + b)x + ab",
    regla: "Cuadrado del término común, más la SUMA de los no comunes por x, más el PRODUCTO de los no comunes.",
    ejemplo: "(x + 3)(x + 5) = x² + (3+5)x + (3·5) = x² + 8x + 15"
  },
  {
    id: "trinomio_factor",
    titulo: "Factorización de Trinomio x² + px + q",
    formula: "x² + px + q = (x + a)(x + b)",
    regla: "Buscar dos números 'a' y 'b' que MULTIPLICADOS den 'q' y SUMADOS den 'p'.",
    ejemplo: "x² + 7x + 12: números 3 y 4 (3·4 = 12 y 3+4 = 7) => (x + 3)(x + 4)"
  },
  {
    id: "ecuacion_balanza",
    titulo: "Ecuaciones Lineales (Propiedad de la Balanza)",
    formula: "ax + b = c  =>  ax = c - b  =>  x = (c - b) / a",
    regla: "Lo que se suma a un lado se resta al otro; lo que multiplica pasa dividiendo. Siempre mantener la igualdad equilibrada.",
    ejemplo: "3x + 6 = 21 => 3x = 21 - 6 => 3x = 15 => x = 15/3 => x = 5"
  }
];

export const ACHIEVEMENTS = [
  { id: "primer_paso", name: "Primer Paso", desc: "Resuelve tu primer ejercicio con Manuel", icon: "🌱" },
  { id: "rey_binomio", name: "Rey del Binomio", desc: "Resuelve 5 Cuadrados de Binomio sin fallar", icon: "👑" },
  { id: "balanza_zen", name: "Balanza Zen", desc: "Despeja 5 ecuaciones lineales con precisión", icon: "⚖️" },
  { id: "ojo_factor", name: "Ojo de Factorizador", desc: "Factoriza 5 trinomios correctamente", icon: "💎" },
  { id: "vencedor_monomio", name: "Héroe del Liceo", desc: "Derrota al Dr. Monomio en la batalla final", icon: "🏆" },
  { id: "puntaje_nacional", name: "Puntaje Nacional", desc: "Obtén más de 2000 puntos en Modo Desafío", icon: "🌟" }
];
