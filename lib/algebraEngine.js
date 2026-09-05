/**
 * algebraEngine.js
 * Motor matemático para 1° Medio (MINEDUC Chile)
 * - Reducción de términos semejantes
 * - Productos notables (Cuadrado de binomio, Suma por diferencia, Binomio con término común)
 * - Factorización (Factor común, Trinomio cuadrado perfecto, Diferencia de cuadrados, Trinomio x^2+px+q)
 * - Ecuaciones lineales de 1° grado (enteras, con paréntesis, fraccionarias)
 */

// Utilidades auxiliares
export function getRandomInt(min, max, excludeZero = true) {
  let val = 0;
  while (val === 0 && excludeZero) {
    val = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return val;
}

export function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

export function formatTerm(coef, variable = '', power = 1, isFirst = false) {
  if (coef === 0) return '';
  const sign = coef > 0 ? (isFirst ? '' : ' + ') : (isFirst ? '-' : ' - ');
  const abs = Math.abs(coef);
  let powerStr = '';
  if (variable) {
    if (power === 1) powerStr = variable;
    else if (power === 2) powerStr = `${variable}²`;
    else if (power === 3) powerStr = `${variable}³`;
    else if (power > 3) powerStr = `${variable}^${power}`;
  }
  
  if (variable && abs === 1) {
    return `${sign}${powerStr}`;
  }
  if (!variable) {
    return `${sign}${abs}`;
  }
  return `${sign}${abs}${powerStr}`;
}

export function formatPolynomial(terms) {
  // terms: [{ coef, variable, power }]
  let str = '';
  let first = true;
  for (const t of terms) {
    if (t.coef === 0) continue;
    const formatted = formatTerm(t.coef, t.variable, t.power, first);
    if (formatted) {
      str += formatted;
      first = false;
    }
  }
  return str || '0';
}

// -------------------------------------------------------------
// 1. PRODUCTOS NOTABLES
// -------------------------------------------------------------

/**
 * Cuadrado de Binomio: (ax + b)^2 = a^2 x^2 + 2abx + b^2
 */
export function generateSquareOfBinomial(level = 1) {
  const a = level === 1 ? 1 : getRandomInt(1, 3);
  const b = getRandomInt(1, level === 1 ? 6 : 9) * (Math.random() < 0.4 ? -1 : 1);
  const variable = 'x';

  // Expresión binomio
  const term1 = a === 1 ? variable : `${a}${variable}`;
  const binomStr = b > 0 ? `(${term1} + ${b})²` : `(${term1} - ${Math.abs(b)})²`;

  const c2 = a * a;
  const c1 = 2 * a * b;
  const c0 = b * b;

  const expansionTerms = [
    { coef: c2, variable, power: 2 },
    { coef: c1, variable, power: 1 },
    { coef: c0, variable: '', power: 0 }
  ];
  const correct = formatPolynomial(expansionTerms);

  // Errores frecuentes chilenos (distractores para el juego)
  // Error 1: Olvidar el término doble (a^2 x^2 + b^2)
  const d1 = formatPolynomial([
    { coef: c2, variable, power: 2 },
    { coef: c0, variable: '', power: 0 }
  ]);
  // Error 2: Signo incorrecto en término central
  const d2 = formatPolynomial([
    { coef: c2, variable, power: 2 },
    { coef: -c1, variable, power: 1 },
    { coef: c0, variable: '', power: 0 }
  ]);
  // Error 3: No elevar al cuadrado el segundo término (2b en vez de b^2) o no multiplicar por 2
  const d3 = formatPolynomial([
    { coef: c2, variable, power: 2 },
    { coef: a * b, variable, power: 1 },
    { coef: c0, variable: '', power: 0 }
  ]);

  const options = Array.from(new Set([correct, d1, d2, d3]));
  while (options.length < 4) {
    options.push(formatPolynomial([
      { coef: c2, variable, power: 2 },
      { coef: c1 + getRandomInt(1, 4), variable, power: 1 },
      { coef: c0, variable: '', power: 0 }
    ]));
  }

  const steps = [
    `Fórmula del cuadrado de binomio: (m ± n)² = m² ± 2mn + n²`,
    `Identificamos los términos: Primer término m = ${term1}, Segundo término n = ${Math.abs(b)}`,
    `1) Primer término al cuadrado: (${term1})² = ${c2 === 1 ? 'x²' : `${c2}x²`}`,
    `2) Doble del primero por el segundo: 2 · (${term1}) · (${b}) = ${c1 > 0 ? `+${c1}x` : `${c1}x`}`,
    `3) Segundo término al cuadrado: (${b})² = +${c0}`,
    `Uniendo todo obtenemos: ${correct}`
  ];

  return {
    id: `pn-cb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'productos_notables',
    subType: 'cuadrado_binomio',
    title: 'Cuadrado de Binomio',
    question: `Desarrolla el siguiente cuadrado de binomio:`,
    expression: binomStr,
    correctAnswer: correct,
    options: shuffle(options),
    steps,
    hint: `Recuerda la regla: "El primero al cuadrado, más o menos el doble del primero por el segundo, más el segundo al cuadrado".`,
    visualData: {
      type: 'area_square',
      a: a,
      b: b,
      variable: 'x'
    }
  };
}

/**
 * Suma por Diferencia: (x + y)(x - y) = x² - y²
 * O en ambas direcciones: expansión y factorización
 */
export function generateSumByDifference(level = 1) {
  // Variantes:
  // 1. Literal con dos variables: (x + y)(x - y) = x² - y²
  // 2. Variable y constante: (x + b)(x - b) = x² - b²
  // 3. Coeficientes en ambas: (ax + by)(ax - by) = a²x² - b²y²
  // 4. Inversa (diferencia a producto): x² - y² = (x + y)(x - y)

  const variant = Math.floor(Math.random() * 4);

  if (variant === 0) {
    // Literal con x e y directo (como lo describió el usuario: x*x - y*y = (x-y)*(x+y))
    const isReverse = Math.random() < 0.5;
    if (isReverse) {
      const expression = `x² - y²`;
      const correct = `(x + y)(x - y)`;
      const d1 = `(x - y)²`;
      const d2 = `(x + y)²`;
      const d3 = `x² - 2xy + y²`;
      const options = shuffle([correct, d1, d2, d3]);

      return {
        id: `pn-spd-lit-rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        category: 'productos_notables',
        subType: 'suma_por_diferencia',
        title: 'Suma por Diferencia: (x + y)(x - y) = x² - y²',
        question: `Expresa la diferencia de cuadrados x² - y² como producto de una suma por su diferencia:`,
        expression,
        correctAnswer: correct,
        options,
        steps: [
          `Fórmula fundamental de Suma por Diferencia: (m + n)(m - n) = m² - n²`,
          `Identificamos los términos cuyas raíces se restan: √(x²) = x  y  √(y²) = y`,
          `Escribimos el producto de su suma por su diferencia: (x + y)(x - y)`,
          `Comprobación multiplicando: x·x - x·y + y·x - y·y = x² - y²`
        ],
        hint: `Recuerda: x² - y² = (x + y)(x - y). La resta de cuadrados proviene siempre de una suma por su diferencia.`,
        visualData: { type: 'area_difference', a: 1, b: 1, var1: 'x', var2: 'y' }
      };
    } else {
      const expression = `(x + y)(x - y)`;
      const correct = `x² - y²`;
      const d1 = `x² + y²`;
      const d2 = `x² - 2xy + y²`;
      const d3 = `x² - 2y`;
      const options = shuffle([correct, d1, d2, d3]);

      return {
        id: `pn-spd-lit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        category: 'productos_notables',
        subType: 'suma_por_diferencia',
        title: 'Suma por Diferencia: (x + y)(x - y) = x² - y²',
        question: `Desarrolla el producto notable de la suma por su diferencia:`,
        expression,
        correctAnswer: correct,
        options,
        steps: [
          `Fórmula fundamental: (x + y)(x - y) = x² - y²`,
          `Multiplicamos término a término:`,
          `1) x · x = x²`,
          `2) x · (-y) = -xy`,
          `3) y · x = +xy`,
          `4) y · (-y) = -y²`,
          `Los términos centrales se cancelan: -xy + xy = 0`,
          `Resultado final: x² - y²`
        ],
        hint: `Los términos cruzados (+xy y -xy) se cancelan entre sí, quedando solo x² - y².`,
        visualData: { type: 'area_difference', a: 1, b: 1, var1: 'x', var2: 'y' }
      };
    }
  }

  if (variant === 1 || variant === 2) {
    // Variable y número: (x + b)(x - b) = x² - b²
    const a = level === 1 ? 1 : getRandomInt(1, 3);
    const b = getRandomInt(2, level === 1 ? 8 : 10);
    const term1 = a === 1 ? 'x' : `${a}x`;
    const c2 = a * a;
    const c0 = b * b;

    const isReverse = Math.random() < 0.4;
    if (isReverse) {
      const expression = `${c2 === 1 ? 'x²' : `${c2}x²`} - ${c0}`;
      const correct = `(${term1} + ${b})(${term1} - ${b})`;
      const d1 = `(${term1} - ${b})²`;
      const d2 = `(${term1} + ${b})²`;
      const d3 = `(${term1} + ${b * 2})(${term1} - ${b * 2})`;
      const options = shuffle(Array.from(new Set([correct, d1, d2, d3])));

      return {
        id: `pn-spd-num-rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        category: 'productos_notables',
        subType: 'suma_por_diferencia',
        title: 'Suma por Diferencia: (a + b)(a - b) = a² - b²',
        question: `Factoriza la diferencia de cuadrados en suma por su diferencia:`,
        expression,
        correctAnswer: correct,
        options,
        steps: [
          `Identificamos la forma a² - b²:`,
          `1) Raíz cuadrada del primer término: √(${c2 === 1 ? 'x²' : `${c2}x²`}) = ${term1}`,
          `2) Raíz cuadrada del segundo término: √(${c0}) = ${b}`,
          `3) Escribimos el producto (suma por diferencia): (${term1} + ${b})(${term1} - ${b})`
        ],
        hint: `Aplica la regla inversa: a² - b² = (a + b)(a - b).`,
        visualData: { type: 'area_difference', a: a, b: b, var1: 'x', var2: `${b}` }
      };
    } else {
      const expression = `(${term1} + ${b})(${term1} - ${b})`;
      const correct = `${c2 === 1 ? 'x²' : `${c2}x²`} - ${c0}`;
      const d1 = `${c2 === 1 ? 'x²' : `${c2}x²`} + ${c0}`;
      const d2 = `${c2 === 1 ? 'x²' : `${c2}x²`} - ${2 * a * b}x + ${c0}`;
      const d3 = `${c2 === 1 ? 'x²' : `${c2}x²`} - ${2 * b}`;
      const options = shuffle(Array.from(new Set([correct, d1, d2, d3])));
      while (options.length < 4) {
        options.push(`${c2 === 1 ? 'x²' : `${c2}x²`} - ${c0 + getRandomInt(1, 5)}`);
      }

      return {
        id: `pn-spd-num-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        category: 'productos_notables',
        subType: 'suma_por_diferencia',
        title: 'Suma por Diferencia: (a + b)(a - b) = a² - b²',
        question: `Calcula el producto notable de la suma por su diferencia:`,
        expression,
        correctAnswer: correct,
        options,
        steps: [
          `Fórmula: (m + n)(m - n) = m² - n²`,
          `Término común: m = ${term1}  =>  (${term1})² = ${c2 === 1 ? 'x²' : `${c2}x²`}`,
          `Término que cambia de signo: n = ${b}  =>  -(${b}²) = -${c0}`,
          `Los términos cruzados (+${a * b}x y -${a * b}x) se cancelan mutuamente.`,
          `Resultado final: ${correct}`
        ],
        hint: `Al multiplicar una suma por su diferencia, los términos centrales se anulan. Queda siempre el primero al cuadrado menos el segundo al cuadrado.`,
        visualData: { type: 'area_difference', a: a, b: b, var1: 'x', var2: `${b}` }
      };
    }
  }

  // Variante 3: Con dos variables y coeficientes (ax + by)(ax - by) = a²x² - b²y²
  const a = getRandomInt(2, 4);
  const b = getRandomInt(2, 5);
  const expression = `(${a}x + ${b}y)(${a}x - ${b}y)`;
  const correct = `${a * a}x² - ${b * b}y²`;
  const d1 = `${a * a}x² + ${b * b}y²`;
  const d2 = `${a * a}x² - ${2 * a * b}xy + ${b * b}y²`;
  const d3 = `${a}x² - ${b}y²`;
  const options = shuffle([correct, d1, d2, d3]);

  return {
    id: `pn-spd-2var-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'productos_notables',
    subType: 'suma_por_diferencia',
    title: 'Suma por Diferencia: (ax + by)(ax - by) = a²x² - b²y²',
    question: `Desarrolla la suma por diferencia con dos variables:`,
    expression,
    correctAnswer: correct,
    options,
    steps: [
      `Fórmula: (m + n)(m - n) = m² - n²`,
      `Primer término: m = ${a}x  =>  (${a}x)² = ${a * a}x²`,
      `Segundo término: n = ${b}y  =>  -(${b}y)² = -${b * b}y²`,
      `Los términos cruzados (+${a * b}xy y -${a * b}xy) se anulan.`,
      `Resultado final: ${correct}`
    ],
    hint: `Eleva cada monomio al cuadrado y coloca un signo menos entre ellos: (${a}x)² - (${b}y)².`,
    visualData: { type: 'area_difference', a: a, b: b, var1: `${a}x`, var2: `${b}y` }
  };
}

/**
 * Binomio con Término Común: (x + a)(x + b) = x^2 + (a+b)x + ab
 */
export function generateCommonTermBinomial(level = 1) {
  let a = getRandomInt(-6, 7);
  let b = getRandomInt(-6, 7);
  while (Math.abs(a) === Math.abs(b)) {
    b = getRandomInt(-6, 7);
  }

  const variable = 'x';
  const strA = a > 0 ? `+ ${a}` : `- ${Math.abs(a)}`;
  const strB = b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  const expression = `(${variable} ${strA})(${variable} ${strB})`;

  const c2 = 1;
  const c1 = a + b;
  const c0 = a * b;

  const correct = formatPolynomial([
    { coef: c2, variable, power: 2 },
    { coef: c1, variable, power: 1 },
    { coef: c0, variable: '', power: 0 }
  ]);

  // Distractores
  const d1 = formatPolynomial([
    { coef: c2, variable, power: 2 },
    { coef: a * b, variable, power: 1 },
    { coef: a + b, variable: '', power: 0 }
  ]);
  const d2 = formatPolynomial([
    { coef: c2, variable, power: 2 },
    { coef: -(a + b), variable, power: 1 },
    { coef: a * b, variable: '', power: 0 }
  ]);
  const d3 = formatPolynomial([
    { coef: c2, variable, power: 2 },
    { coef: c1, variable, power: 1 },
    { coef: -c0, variable: '', power: 0 }
  ]);

  const options = Array.from(new Set([correct, d1, d2, d3]));
  while (options.length < 4) {
    options.push(formatPolynomial([
      { coef: c2, variable, power: 2 },
      { coef: c1 + getRandomInt(1, 3), variable, power: 1 },
      { coef: c0 + getRandomInt(1, 4), variable: '', power: 0 }
    ]));
  }

  const steps = [
    `Fórmula de binomios con término común: (x + a)(x + b) = x² + (a + b)x + (a · b)`,
    `Identificamos los valores no comunes: a = ${a}, b = ${b}`,
    `1) Cuadrado del término común: x²`,
    `2) Suma de los términos no comunes multiplicada por x: (${a} + ${b}) · x = ${c1 >= 0 ? `+${c1}x` : `${c1}x`}`,
    `3) Producto de los términos no comunes: (${a}) · (${b}) = ${c0 >= 0 ? `+${c0}` : `${c0}`}`,
    `Expresión final desarrollada: ${correct}`
  ];

  return {
    id: `pn-btc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'productos_notables',
    subType: 'termino_comun',
    title: 'Binomios con Término Común',
    question: `Desarrolla el producto de binomios con término común:`,
    expression,
    correctAnswer: correct,
    options: shuffle(options),
    steps,
    hint: `El coeficiente de x es la SUMA (${a} + ${b}) y el término constante es la MULTIPLICACIÓN (${a} · ${b}).`,
    visualData: {
      type: 'area_rect',
      a: a,
      b: b,
      variable: 'x'
    }
  };
}

// -------------------------------------------------------------
// 2. FACTORIZACIÓN (1° MEDIO)
// -------------------------------------------------------------

/**
 * Factorización por Factor Común: kx(ax + b) o k(ax + b)
 */
export function generateCommonFactor(level = 1) {
  const k = getRandomInt(2, 6);
  const a = getRandomInt(1, 4);
  const b = getRandomInt(1, 5) * (Math.random() < 0.5 ? 1 : -1);

  const termA = k * a;
  const termB = k * b;
  const expression = `${termA}x ${termB > 0 ? `+ ${termB}` : `- ${Math.abs(termB)}`}`;

  const inner = `${a === 1 ? 'x' : `${a}x`} ${b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`}`;
  const correct = `${k}(${inner})`;

  const d1 = `${k === 2 ? 3 : 2}(${inner})`;
  const d2 = `${k}(${a === 1 ? 'x' : `${a}x`} ${b > 0 ? `- ${b}` : `+ ${Math.abs(b)}`})`;
  const d3 = `${k}x(${inner})`;

  const options = shuffle(Array.from(new Set([correct, d1, d2, d3])));
  while (options.length < 4) {
    options.push(`${k + 1}(${inner})`);
  }

  const steps = [
    `Buscamos el Máximo Común Divisor (M.C.D.) de los coeficientes ${termA} y ${Math.abs(termB)}: M.C.D. = ${k}`,
    `Extraemos el factor común ${k} fuera del paréntesis:`,
    `${termA}x ÷ ${k} = ${a === 1 ? 'x' : `${a}x`}`,
    `${termB} ÷ ${k} = ${b > 0 ? `+${b}` : `${b}`}`,
    `Factorización final: ${correct}`
  ];

  return {
    id: `fac-fc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'factorizacion',
    subType: 'factor_comun',
    title: 'Factor Común Monomio',
    question: `Factoriza la siguiente expresión extrayendo el factor común:`,
    expression,
    correctAnswer: correct,
    options,
    steps,
    hint: `Calcula el M.C.D. numérico entre ${termA} y ${Math.abs(termB)} y escríbelo fuera del paréntesis.`
  };
}

/**
 * Factorización de Trinomio de la forma x^2 + px + q = (x+a)(x+b)
 */
export function generateTrinomialFactorization(level = 1) {
  let a = getRandomInt(-5, 6);
  let b = getRandomInt(-5, 6);
  while (a === 0 || b === 0) {
    a = getRandomInt(-5, 6);
    b = getRandomInt(-5, 6);
  }

  const p = a + b;
  const q = a * b;

  const polyTerms = [
    { coef: 1, variable: 'x', power: 2 },
    { coef: p, variable: 'x', power: 1 },
    { coef: q, variable: '', power: 0 }
  ];
  const expression = formatPolynomial(polyTerms);

  const bin1 = `(x ${a > 0 ? `+ ${a}` : `- ${Math.abs(a)}`})`;
  const bin2 = `(x ${b > 0 ? `+ ${b}` : `- ${Math.abs(b)}`})`;
  const correct = `${bin1}${bin2}`;

  // Distractores
  const d1 = `(x ${a > 0 ? `- ${a}` : `+ ${Math.abs(a)}`})(x ${b > 0 ? `- ${b}` : `+ ${Math.abs(b)}`})`;
  const d2 = `(x ${p > 0 ? `+ ${p}` : `- ${Math.abs(p)}`})(x ${q > 0 ? `+ ${q}` : `- ${Math.abs(q)}`})`;
  const d3 = a === b ? `(x ${a > 0 ? `+ ${a}` : `- ${Math.abs(a)}`})²` : `(x + ${Math.abs(a + b)})(x - 1)`;

  const options = Array.from(new Set([correct, d1, d2, d3]));
  while (options.length < 4) {
    options.push(`(x + ${a + 1})(x + ${b - 1})`);
  }

  const steps = [
    `Buscamos dos números m y n que cumplan simultáneamente:`,
    `1) m · n = ${q} (el término independiente)`,
    `2) m + n = ${p} (el coeficiente de x)`,
    `Comprobamos: (${a}) · (${b}) = ${q} y (${a}) + (${b}) = ${p}`,
    `Por lo tanto, la factorización en binomios con término común es: ${correct}`
  ];

  return {
    id: `fac-tri-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'factorizacion',
    subType: 'trinomio_termino_comun',
    title: 'Factorización de Trinomio',
    question: `Factoriza el siguiente trinomio:`,
    expression,
    correctAnswer: correct,
    options: shuffle(options),
    steps,
    hint: `Pregúntate: ¿Qué dos números multiplicados dan ${q} y sumados dan ${p}?`
  };
}

/**
 * Diferencia de Cuadrados a Suma por Diferencia: x^2 - a^2 = (x+a)(x-a)
 */
export function generateDifferenceOfSquares(level = 1) {
  const a = getRandomInt(2, 9);
  const expression = `x² - ${a * a}`;
  const correct = `(x + ${a})(x - ${a})`;

  const d1 = `(x - ${a})²`;
  const d2 = `(x + ${a})²`;
  const d3 = `(x + ${a * 2})(x - ${a * 2})`;

  const options = shuffle(Array.from(new Set([correct, d1, d2, d3])));

  const steps = [
    `Reconocemos una Diferencia de Cuadrados: m² - n² = (m + n)(m - n)`,
    `Raíz cuadrada del primer término: √(x²) = x`,
    `Raíz cuadrada del segundo término: √(${a * a}) = ${a}`,
    `Escribimos como el producto de la suma por la diferencia: (x + ${a})(x - ${a})`
  ];

  return {
    id: `fac-dc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'factorizacion',
    subType: 'diferencia_cuadrados',
    title: 'Diferencia de Cuadrados',
    question: `Factoriza la diferencia de cuadrados:`,
    expression,
    correctAnswer: correct,
    options,
    steps,
    hint: `Obtén la raíz cuadrada de cada término y escribe (x + a)(x - a).`
  };
}

// -------------------------------------------------------------
// 3. ECUACIONES LINEALES DE 1° GRADO (1° MEDIO)
// -------------------------------------------------------------

/**
 * Ecuación Lineal Entera: ax + b = cx + d
 */
export function generateLinearEquation(level = 1) {
  // Elegimos x entero para una experiencia pedagógica limpia
  const solution = getRandomInt(-8, 9);

  let a = getRandomInt(2, 5);
  let c = getRandomInt(1, 4);
  if (a === c) a += 1;

  // ax + b = cx + d
  // (a - c)x = d - b  =>  d - b = (a - c) * solution
  const diff = (a - c) * solution;
  const b = getRandomInt(-10, 10);
  const d = b + diff;

  const left = `${a === 1 ? 'x' : `${a}x`} ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}`;
  const right = `${c === 1 ? 'x' : `${c}x`} ${d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`}`;
  const expression = `${left} = ${right}`;

  const correct = `x = ${solution}`;
  const d1 = `x = ${-solution}`;
  const d2 = `x = ${solution + (Math.random() < 0.5 ? 1 : -1)}`;
  const d3 = `x = ${solution + 2}`;

  const options = shuffle(Array.from(new Set([correct, d1, d2, d3])));
  while (options.length < 4) {
    options.push(`x = ${solution + getRandomInt(3, 6)}`);
  }

  const bFormatted = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
  const acFormatted = (a - c === 1) ? 'x' : (a - c === -1) ? '-x' : `${a - c}x`;

  const steps = [
    `Ecuación inicial: ${expression}`,
    `Paso 1: Agrupar términos con la incógnita x a la izquierda (restando ${c}x en ambos miembros):`,
    `(${a}x - ${c}x) ${bFormatted} = ${d}  =>  ${acFormatted} ${bFormatted} = ${d}`,
    `Paso 2: Pasar los números al lado derecho (restando ${b} en ambos miembros):`,
    `${acFormatted} = ${d} - (${b})  =>  ${acFormatted} = ${d - b}`,
    `Paso 3: Despejar x dividiendo ambos miembros por ${a - c}:`,
    `x = ${d - b} ÷ ${a - c}  =>  x = ${solution}`,
    `Comprobación: ${a}(${solution}) ${bFormatted} = ${a * solution + b} y ${c}(${solution}) ${d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`} = ${c * solution + d}. ¡Equilibrio perfecto!`
  ];

  return {
    id: `ec-lin-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'ecuaciones',
    subType: 'lineal_entera',
    title: 'Ecuación Lineal de Primer Grado',
    question: `Resuelve la ecuación y halla el valor de x:`,
    expression,
    correctAnswer: correct,
    numericAnswer: solution,
    options,
    steps,
    hint: `Usa la metáfora de la balanza: agrupa las "x" a la izquierda y los números a la derecha respetando la operación inversa.`,
    balanceData: {
      leftX: a,
      leftNum: b,
      rightX: c,
      rightNum: d,
      solution
    }
  };
}

/**
 * Ecuación Lineal con Paréntesis: a(x + b) = c(x + d) o k(x + b) = c
 */
export function generateEquationWithParentheses(level = 2) {
  const solution = getRandomInt(-5, 7);
  const k = getRandomInt(2, 4);
  const b = getRandomInt(-4, 5);
  // k(x + b) = result
  const rightSide = k * (solution + b);

  const expression = `${k}(x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}) = ${rightSide}`;
  const correct = `x = ${solution}`;

  const d1 = `x = ${-solution}`;
  const d2 = `x = ${solution + 1}`;
  const d3 = `x = ${solution - 2}`;

  const options = shuffle(Array.from(new Set([correct, d1, d2, d3])));
  while (options.length < 4) {
    options.push(`x = ${solution + getRandomInt(3, 5)}`);
  }

  const steps = [
    `Ecuación inicial: ${expression}`,
    `Paso 1: Aplicar propiedad distributiva para eliminar el paréntesis:`,
    `${k} · x + ${k} · (${b}) = ${rightSide}  =>  ${k}x ${k * b >= 0 ? `+ ${k * b}` : `- ${Math.abs(k * b)}`} = ${rightSide}`,
    `Paso 2: Despejar el término con x restando ${k * b} a ambos lados:`,
    `${k}x = ${rightSide} - (${k * b})  =>  ${k}x = ${rightSide - k * b}`,
    `Paso 3: Dividir entre ${k}:`,
    `x = ${rightSide - k * b} ÷ ${k}  =>  x = ${solution}`
  ];

  return {
    id: `ec-par-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'ecuaciones',
    subType: 'lineal_parentesis',
    title: 'Ecuación con Paréntesis',
    question: `Aplica distributividad y resuelve la ecuación:`,
    expression,
    correctAnswer: correct,
    numericAnswer: solution,
    options,
    steps,
    hint: `Recuerda multiplicar el número de afuera por CADA término dentro del paréntesis: ${k} · x y ${k} · (${b}).`
  };
}

/**
 * Ecuación Fraccionaria Simple: (x + a) / b = c
 */
export function generateFractionalEquation(level = 2) {
  const solution = getRandomInt(-6, 8);
  const b = getRandomInt(2, 5);
  const a = getRandomInt(-9, 9);
  // (solution + a) debe ser múltiplo de b
  // O mejor: c es entero, entonces c = (solution + a) / b  =>  solution = b * c - a
  const c = getRandomInt(1, 6);
  const calculatedSolution = b * c - a;

  const expression = `\\frac{x ${a >= 0 ? `+ ${a}` : `- ${Math.abs(a)}`}}{${b}} = ${c}`;
  const displayExpression = `(x ${a >= 0 ? `+ ${a}` : `- ${Math.abs(a)}`}) / ${b} = ${c}`;
  const correct = `x = ${calculatedSolution}`;

  const d1 = `x = ${-calculatedSolution}`;
  const d2 = `x = ${calculatedSolution + b}`;
  const d3 = `x = ${c * b}`;

  const options = shuffle(Array.from(new Set([correct, d1, d2, d3])));
  while (options.length < 4) {
    options.push(`x = ${calculatedSolution + getRandomInt(1, 4)}`);
  }

  const steps = [
    `Ecuación con denominador: ${displayExpression}`,
    `Paso 1: Eliminar el denominador multiplicando toda la ecuación por ${b}:`,
    `x ${a >= 0 ? `+ ${a}` : `- ${Math.abs(a)}`} = ${c} · ${b}`,
    `x ${a >= 0 ? `+ ${a}` : `- ${Math.abs(a)}`} = ${c * b}`,
    `Paso 2: Despejar x restando ${a} en ambos lados:`,
    `x = ${c * b} - (${a})  =>  x = ${calculatedSolution}`
  ];

  return {
    id: `ec-frac-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'ecuaciones',
    subType: 'lineal_fraccionaria',
    title: 'Ecuación Fraccionaria',
    question: `Resuelve la ecuación despejando el denominador:`,
    expression: displayExpression,
    correctAnswer: correct,
    numericAnswer: calculatedSolution,
    options,
    steps,
    hint: `El ${b} que está dividiendo en la balanza pasa multiplicando al otro lado: (${c} · ${b}).`
  };
}

// -------------------------------------------------------------
// 4. REDUCCIÓN DE TÉRMINOS SEMEJANTES (1° MEDIO)
// -------------------------------------------------------------

export function generateSimilarTermsReduction(level = 1) {
  const c2_1 = getRandomInt(1, 4);
  const c2_2 = getRandomInt(1, 4) * (Math.random() < 0.5 ? 1 : -1);
  const c1_1 = getRandomInt(1, 6) * (Math.random() < 0.5 ? 1 : -1);
  const c1_2 = getRandomInt(1, 6) * (Math.random() < 0.5 ? 1 : -1);
  const c0_1 = getRandomInt(1, 8) * (Math.random() < 0.5 ? 1 : -1);
  const c0_2 = getRandomInt(1, 8) * (Math.random() < 0.5 ? 1 : -1);

  const rawTerms = [
    `${c2_1}x²`,
    `${c1_1 > 0 ? `+ ${c1_1}x` : `- ${Math.abs(c1_1)}x`}`,
    `${c0_1 > 0 ? `+ ${c0_1}` : `- ${Math.abs(c0_1)}`}`,
    `${c2_2 > 0 ? `+ ${c2_2}x²` : `- ${Math.abs(c2_2)}x²`}`,
    `${c1_2 > 0 ? `+ ${c1_2}x` : `- ${Math.abs(c1_2)}x`}`,
    `${c0_2 > 0 ? `+ ${c0_2}` : `- ${Math.abs(c0_2)}`}`
  ];
  const expression = rawTerms.join(' ');

  const total2 = c2_1 + c2_2;
  const total1 = c1_1 + c1_2;
  const total0 = c0_1 + c0_2;

  const correct = formatPolynomial([
    { coef: total2, variable: 'x', power: 2 },
    { coef: total1, variable: 'x', power: 1 },
    { coef: total0, variable: '', power: 0 }
  ]);

  const d1 = formatPolynomial([
    { coef: total2 + 1, variable: 'x', power: 2 },
    { coef: total1, variable: 'x', power: 1 },
    { coef: total0, variable: '', power: 0 }
  ]);
  const d2 = formatPolynomial([
    { coef: total2, variable: 'x', power: 2 },
    { coef: total1 - 2, variable: 'x', power: 1 },
    { coef: total0, variable: '', power: 0 }
  ]);
  const d3 = formatPolynomial([
    { coef: total2, variable: 'x', power: 2 },
    { coef: total1, variable: 'x', power: 1 },
    { coef: -total0, variable: '', power: 0 }
  ]);

  const options = shuffle(Array.from(new Set([correct, d1, d2, d3])));
  while (options.length < 4) {
    options.push(`${total2}x² + ${total1 + 3}x + ${total0}`);
  }

  const steps = [
    `Expresión original: ${expression}`,
    `1) Agrupar términos con x²: (${c2_1} + (${c2_2}))x² = ${total2}x²`,
    `2) Agrupar términos con x: (${c1_1} + (${c1_2}))x = ${total1 >= 0 ? `+${total1}x` : `${total1}x`}`,
    `3) Agrupar términos constantes: (${c0_1} + (${c0_2})) = ${total0 >= 0 ? `+${total0}` : `${total0}`}`,
    `Expresión reducida final: ${correct}`
  ];

  return {
    id: `ts-red-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'algebra_basica',
    subType: 'terminos_semejantes',
    title: 'Reducción de Términos Semejantes',
    question: `Reduce los términos semejantes de la expresión:`,
    expression,
    correctAnswer: correct,
    options,
    steps,
    hint: `Solo puedes sumar o restar términos que tengan exactamente el mismo factor literal (las mismas letras y exponentes).`
  };
}

// -------------------------------------------------------------
// 5. GENERADOR MAESTRO POR MUNDO / TIPO
// -------------------------------------------------------------

export function generateExercise(topic, level = 1) {
  switch (topic) {
    case 'cuadrado_binomio':
      return generateSquareOfBinomial(level);
    case 'suma_por_diferencia':
      return generateSumByDifference(level);
    case 'termino_comun':
      return generateCommonTermBinomial(level);
    case 'factor_comun':
      return generateCommonFactor(level);
    case 'trinomio':
      return generateTrinomialFactorization(level);
    case 'diferencia_cuadrados':
      return generateDifferenceOfSquares(level);
    case 'lineal_entera':
      return generateLinearEquation(level);
    case 'lineal_parentesis':
      return generateEquationWithParentheses(level);
    case 'lineal_fraccionaria':
      return generateFractionalEquation(level);
    case 'terminos_semejantes':
      return generateSimilarTermsReduction(level);
    case 'productos_notables_aleatorio': {
      const pns = [generateSquareOfBinomial, generateSumByDifference, generateCommonTermBinomial];
      return pns[Math.floor(Math.random() * pns.length)](level);
    }
    case 'ecuaciones_aleatorio': {
      const ecs = [generateLinearEquation, generateEquationWithParentheses, generateFractionalEquation];
      return ecs[Math.floor(Math.random() * ecs.length)](level);
    }
    case 'simce_1medio': {
      const allGens = [
        () => generateSquareOfBinomial(2),
        () => generateSumByDifference(2),
        () => generateCommonTermBinomial(2),
        () => generateTrinomialFactorization(2),
        () => generateDifferenceOfSquares(2),
        () => generateLinearEquation(2),
        () => generateEquationWithParentheses(2),
        () => generateFractionalEquation(2)
      ];
      return allGens[Math.floor(Math.random() * allGens.length)]();
    }
    default:
      return generateSquareOfBinomial(level);
  }
}

// Normalizador flexible para comparar respuestas escritas libremente por el alumno
export function normalizeUserMath(input) {
  if (!input) return '';
  return input
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\^2/g, '²')
    .replace(/x=/g, '')
    .trim();
}

export function verifyAnswer(userAnswer, correctAnswer, numericAnswer = null) {
  const normUser = normalizeUserMath(userAnswer);
  const normCorrect = normalizeUserMath(correctAnswer);

  if (normUser === normCorrect) {
    return { isCorrect: true };
  }

  // Si tiene respuesta numérica (por ejemplo x = 5)
  if (numericAnswer !== null) {
    const numInput = Number(normUser);
    if (!isNaN(numInput) && numInput === numericAnswer) {
      return { isCorrect: true };
    }
  }

  // Verificación de conmutatividad en productos de binomios: (x+2)(x+3) === (x+3)(x+2)
  const regexTwoFactors = /^\(([^)]+)\)\(([^)]+)\)$/;
  const matchUser = normUser.match(regexTwoFactors);
  const matchCorrect = normCorrect.match(regexTwoFactors);
  if (matchUser && matchCorrect) {
    const u1 = matchUser[1];
    const u2 = matchUser[2];
    const c1 = matchCorrect[1];
    const c2 = matchCorrect[2];
    if ((u1 === c1 && u2 === c2) || (u1 === c2 && u2 === c1)) {
      return { isCorrect: true };
    }
  }

  return { isCorrect: false };
}
