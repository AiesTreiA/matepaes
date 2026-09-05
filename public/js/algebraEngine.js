/**
 * algebraEngine.js
 * Motor matemático para 1° Medio (MINEDUC Chile)
 * - Productos notables (Cuadrado de binomio, Suma por diferencia, Binomio con término común, Cubo de binomio)
 * - Factorización (Factor común, Trinomio cuadrado perfecto, Diferencia de cuadrados, Trinomio x^2+px+q)
 * - Ecuaciones lineales de 1° grado (enteras, con paréntesis, fraccionarias, problemas de planteo)
 * - Operaciones algebraicas (Términos semejantes, Monomio por polinomio, Producto de polinomios, Potencias)
 * - Fracciones algebraicas (Simplificación y ecuaciones con fracciones)
 */

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
// 1. PRODUCTOS NOTABLES (OA 3)
// -------------------------------------------------------------

export function generateSquareOfBinomial(level = 1) {
  const a = level === 1 ? 1 : getRandomInt(1, 3);
  const b = getRandomInt(1, level === 1 ? 6 : 9) * (Math.random() < 0.4 ? -1 : 1);
  const variable = 'x';

  const term1 = a === 1 ? variable : `${a}${variable}`;
  const binomStr = b > 0 ? `(${term1} + ${b})²` : `(${term1} - ${Math.abs(b)})²`;

  const c2 = a * a;
  const c1 = 2 * a * b;
  const c0 = b * b;

  const correct = formatPolynomial([
    { coef: c2, variable, power: 2 },
    { coef: c1, variable, power: 1 },
    { coef: c0, variable: '', power: 0 }
  ]);

  const d1 = formatPolynomial([
    { coef: c2, variable, power: 2 },
    { coef: c0, variable: '', power: 0 }
  ]);
  const d2 = formatPolynomial([
    { coef: c2, variable, power: 2 },
    { coef: -c1, variable, power: 1 },
    { coef: c0, variable: '', power: 0 }
  ]);
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
    title: 'Cuadrado de Binomio: (a ± b)²',
    question: `Desarrolla el siguiente cuadrado de binomio:`,
    expression: binomStr,
    correctAnswer: correct,
    options: shuffle(options),
    steps,
    hint: `Regla de 1° Medio: "El primero al cuadrado, más o menos el doble del primero por el segundo, más el segundo al cuadrado".`,
    visualData: {
      type: 'area_square',
      a: a,
      b: b,
      variable: 'x'
    }
  };
}

export function generateSumByDifference(level = 1) {
  const variant = Math.floor(Math.random() * 4);

  if (variant === 0) {
    const isReverse = Math.random() < 0.5;
    if (isReverse) {
      const expression = `x² - y²`;
      const correct = `(x + y)(x - y)`;
      const d1 = `(x - y)²`;
      const d2 = `(x + y)²`;
      const d3 = `x² - 2xy + y²`;
      return {
        id: `pn-spd-lit-rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        category: 'productos_notables',
        subType: 'suma_por_diferencia',
        title: 'Suma por Diferencia: (x + y)(x - y) = x² - y²',
        question: `Expresa la diferencia de cuadrados x² - y² como producto de una suma por su diferencia:`,
        expression,
        correctAnswer: correct,
        options: shuffle([correct, d1, d2, d3]),
        steps: [
          `Fórmula fundamental: a² - b² = (a + b)(a - b)`,
          `Raíces: √(x²) = x  y  √(y²) = y`,
          `Expresión como producto de suma por diferencia: (x + y)(x - y)`
        ],
        hint: `x² - y² = (x + y)(x - y). La resta de cuadrados proviene siempre de una suma por su diferencia.`,
        visualData: { type: 'area_difference', a: 1, b: 1, var1: 'x', var2: 'y' }
      };
    } else {
      const expression = `(x + y)(x - y)`;
      const correct = `x² - y²`;
      const d1 = `x² + y²`;
      const d2 = `x² - 2xy + y²`;
      const d3 = `x² - 2y`;
      return {
        id: `pn-spd-lit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        category: 'productos_notables',
        subType: 'suma_por_diferencia',
        title: 'Suma por Diferencia: (x + y)(x - y) = x² - y²',
        question: `Desarrolla el producto notable de la suma por su diferencia:`,
        expression,
        correctAnswer: correct,
        options: shuffle([correct, d1, d2, d3]),
        steps: [
          `Fórmula: (x + y)(x - y) = x² - y²`,
          `Multiplicando término a término: x² - xy + yx - y²`,
          `Los términos cruzados se anulan (-xy + xy = 0).`,
          `Resultado: x² - y²`
        ],
        hint: `Los términos centrales se cancelan mutuamente: solo queda el cuadrado del primero menos el cuadrado del segundo.`,
        visualData: { type: 'area_difference', a: 1, b: 1, var1: 'x', var2: 'y' }
      };
    }
  }

  const a = level === 1 ? 1 : getRandomInt(1, 3);
  const b = getRandomInt(2, level === 1 ? 8 : 10);
  const term1 = a === 1 ? 'x' : `${a}x`;
  const c2 = a * a;
  const c0 = b * b;

  if (Math.random() < 0.4) {
    const expression = `${c2 === 1 ? 'x²' : `${c2}x²`} - ${c0}`;
    const correct = `(${term1} + ${b})(${term1} - ${b})`;
    const d1 = `(${term1} - ${b})²`;
    const d2 = `(${term1} + ${b})²`;
    const d3 = `(${term1} + ${b * 2})(${term1} - ${b * 2})`;
    return {
      id: `pn-spd-num-rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category: 'productos_notables',
      subType: 'suma_por_diferencia',
      title: 'Suma por Diferencia: (a + b)(a - b) = a² - b²',
      question: `Factoriza la diferencia de cuadrados en suma por su diferencia:`,
      expression,
      correctAnswer: correct,
      options: shuffle(Array.from(new Set([correct, d1, d2, d3]))),
      steps: [
        `Forma a² - b²:`,
        `1) √(${c2 === 1 ? 'x²' : `${c2}x²`}) = ${term1}`,
        `2) √(${c0}) = ${b}`,
        `3) Producto (suma por diferencia): (${term1} + ${b})(${term1} - ${b})`
      ],
      hint: `a² - b² = (a + b)(a - b).`,
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
        `(${term1})² = ${c2 === 1 ? 'x²' : `${c2}x²`}`,
        `-(${b}²) = -${c0}`,
        `Resultado: ${correct}`
      ],
      hint: `Al multiplicar una suma por su diferencia, los términos medios se anulan: m² - n².`,
      visualData: { type: 'area_difference', a: a, b: b, var1: 'x', var2: `${b}` }
    };
  }
}

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

  const d1 = formatPolynomial([
    { coef: c2, variable, power: 2 },
    { coef: a * b, variable, power: 1 },
    { coef: a + b, variable: '', power: 0 }
  ]);
  const d2 = formatPolynomial([
    { coef: c2, variable, power: 2 },
    { coef: -(a + b), variable, power: 1 },
    { coef: a * b, variable, power: 0 }
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
      { coef: c0 + getRandomInt(1, 4), variable, power: 0 }
    ]));
  }

  const steps = [
    `Fórmula de binomios con término común: (x + a)(x + b) = x² + (a + b)x + ab`,
    `Términos no comunes: a = ${a}, b = ${b}`,
    `1) Cuadrado del término común: x²`,
    `2) Suma de no comunes por x: (${a} + ${b})x = ${c1 >= 0 ? `+${c1}x` : `${c1}x`}`,
    `3) Multiplicación de no comunes: (${a}) · (${b}) = ${c0 >= 0 ? `+${c0}` : `${c0}`}`,
    `Resultado final: ${correct}`
  ];

  return {
    id: `pn-btc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'productos_notables',
    subType: 'termino_comun',
    title: 'Binomios con Término Común: (x + a)(x + b)',
    question: `Desarrolla el producto de binomios con término común:`,
    expression,
    correctAnswer: correct,
    options: shuffle(options),
    steps,
    hint: `El coeficiente de x es la SUMA (${a} + ${b}) y el término independiente es la MULTIPLICACIÓN (${a} · ${b}).`,
    visualData: {
      type: 'area_rect',
      a: a,
      b: b,
      variable: 'x'
    }
  };
}

export function generateCubicBinomial(level = 1) {
  const b = getRandomInt(1, 4) * (Math.random() < 0.5 ? 1 : -1);
  const expression = b > 0 ? `(x + ${b})³` : `(x - ${Math.abs(b)})³`;

  const c3 = 1;
  const c2 = 3 * b;
  const c1 = 3 * b * b;
  const c0 = b * b * b;

  const correct = formatPolynomial([
    { coef: c3, variable: 'x', power: 3 },
    { coef: c2, variable: 'x', power: 2 },
    { coef: c1, variable: 'x', power: 1 },
    { coef: c0, variable: '', power: 0 }
  ]);

  const d1 = `${b > 0 ? `x³ + ${b * b * b}` : `x³ - ${Math.abs(b * b * b)}`}`;
  const d2 = formatPolynomial([
    { coef: c3, variable: 'x', power: 3 },
    { coef: -c2, variable: 'x', power: 2 },
    { coef: c1, variable: 'x', power: 1 },
    { coef: -c0, variable: '', power: 0 }
  ]);
  const d3 = formatPolynomial([
    { coef: c3, variable: 'x', power: 3 },
    { coef: b, variable: 'x', power: 2 },
    { coef: b * b, variable: 'x', power: 1 },
    { coef: c0, variable: '', power: 0 }
  ]);

  const options = shuffle(Array.from(new Set([correct, d1, d2, d3])));

  return {
    id: `pn-cub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'productos_notables',
    subType: 'cubo_binomio',
    title: 'Cubo de Binomio: (a ± b)³',
    question: `Aplica la fórmula del cubo de binomio:`,
    expression,
    correctAnswer: correct,
    options,
    steps: [
      `Fórmula del Cubo de Binomio: (a ± b)³ = a³ ± 3a²b + 3ab² ± b³`,
      `1) Primer término al cubo: x³`,
      `2) Triple del primero al cuadrado por el segundo: 3 · x² · (${b}) = ${c2 >= 0 ? `+${c2}x²` : `${c2}x²`}`,
      `3) Triple del primero por el segundo al cuadrado: 3 · x · (${b}²) = +${c1}x`,
      `4) Segundo término al cubo: (${b})³ = ${c0 >= 0 ? `+${c0}` : `${c0}`}`,
      `Resultado final: ${correct}`
    ],
    hint: `Regla: "El cubo del primero, más o menos el triple del cuadrado del primero por el segundo, más el triple del primero por el cuadrado del segundo, más o menos el cubo del segundo".`
  };
}

// -------------------------------------------------------------
// 2. OPERACIONES ALGEBRAICAS Y POTENCIAS DE 1° MEDIO
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
    `3) Agrupar constantes: (${c0_1} + (${c0_2})) = ${total0 >= 0 ? `+${total0}` : `${total0}`}`,
    `Resultado final: ${correct}`
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
    hint: `Solo se pueden sumar o restar monomios que tengan exactamente las mismas letras y exponentes.`
  };
}

export function generateMonomialByPolynomial(level = 1) {
  const m = getRandomInt(2, 5);
  const a = getRandomInt(1, 4);
  const b = getRandomInt(1, 6) * (Math.random() < 0.5 ? 1 : -1);
  const c = getRandomInt(1, 5) * (Math.random() < 0.5 ? 1 : -1);

  const polyInner = `${a === 1 ? 'x²' : `${a}x²`} ${b > 0 ? `+ ${b}x` : `- ${Math.abs(b)}x`} ${c > 0 ? `+ ${c}` : `- ${Math.abs(c)}`}`;
  const expression = `${m}x(${polyInner})`;

  const res3 = m * a;
  const res2 = m * b;
  const res1 = m * c;

  const correct = formatPolynomial([
    { coef: res3, variable: 'x', power: 3 },
    { coef: res2, variable: 'x', power: 2 },
    { coef: res1, variable: 'x', power: 1 }
  ]);

  const d1 = formatPolynomial([
    { coef: res3, variable: 'x', power: 3 },
    { coef: -res2, variable: 'x', power: 2 },
    { coef: res1, variable: 'x', power: 1 }
  ]);
  const d2 = formatPolynomial([
    { coef: res3, variable: 'x', power: 2 },
    { coef: res2, variable: 'x', power: 1 },
    { coef: res1, variable: '', power: 0 }
  ]);
  const d3 = `${res3}x³ + ${b}x² + ${c}x`;

  const options = shuffle(Array.from(new Set([correct, d1, d2, d3])));

  return {
    id: `alg-mxp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'algebra_basica',
    subType: 'monomio_por_polinomio',
    title: 'Multiplicación: Monomio por Polinomio',
    question: `Aplica la propiedad distributiva y multiplica:`,
    expression,
    correctAnswer: correct,
    options,
    steps: [
      `Multiplicamos el monomio ${m}x por cada término del paréntesis:`,
      `1) (${m}x) · (${a === 1 ? 'x²' : `${a}x²`}) = ${res3}x³ (sumamos exponentes 1 + 2 = 3)`,
      `2) (${m}x) · (${b}x) = ${res2 >= 0 ? `+${res2}x²` : `${res2}x²`}`,
      `3) (${m}x) · (${c}) = ${res1 >= 0 ? `+${res1}x` : `${res1}x`}`,
      `Resultado final: ${correct}`
    ],
    hint: `Multiplica los coeficientes numéricos y suma los exponentes de las letras iguales: x · x² = x³.`
  };
}

export function generatePowersProperties(level = 1) {
  const types = ['mult', 'div', 'pot'];
  const t = types[Math.floor(Math.random() * types.length)];

  if (t === 'mult') {
    const a = getRandomInt(2, 4);
    const b = getRandomInt(2, 5);
    const exp1 = getRandomInt(2, 6);
    const exp2 = getRandomInt(2, 6);

    const expression = `(${a}x^${exp1}) · (${b}x^${exp2})`.replace(/\^2/g, '²').replace(/\^3/g, '³');
    const coef = a * b;
    const finalExp = exp1 + exp2;
    const correct = `${coef}x^${finalExp}`.replace(/\^2/g, '²').replace(/\^3/g, '³');

    const d1 = `${coef}x^${exp1 * exp2}`;
    const d2 = `${a + b}x^${finalExp}`;
    const d3 = `${coef}x^${exp1}`;
    const options = shuffle([correct, d1, d2, d3]);

    return {
      id: `alg-pow-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category: 'algebra_basica',
      subType: 'potencias_algebraicas',
      title: 'Propiedades de Potencias con Monomios',
      question: `Resuelve el producto de monomios aplicando propiedades de potencias:`,
      expression,
      correctAnswer: correct,
      options,
      steps: [
        `1) Multiplicar los coeficientes: ${a} · ${b} = ${coef}`,
        `2) Aplicar propiedad de potencias de igual base (se mantiene la base y se suman los exponentes): x^${exp1} · x^${exp2} = x^(${exp1} + ${exp2}) = x^${finalExp}`,
        `Resultado: ${correct}`
      ],
      hint: `Multiplica los números y SUMA los exponentes de la x.`
    };
  } else if (t === 'div') {
    const coefB = getRandomInt(2, 4);
    const quotient = getRandomInt(2, 5);
    const coefA = coefB * quotient;
    const exp2 = getRandomInt(2, 4);
    const exp1 = exp2 + getRandomInt(1, 4);

    const expression = `(${coefA}x^${exp1}) ÷ (${coefB}x^${exp2})`.replace(/\^2/g, '²').replace(/\^3/g, '³');
    const finalExp = exp1 - exp2;
    const expStr = finalExp === 1 ? 'x' : `x^${finalExp}`.replace(/\^2/g, '²').replace(/\^3/g, '³');
    const correct = `${quotient}${expStr}`;

    const d1 = `${quotient}x^${exp1 + exp2}`;
    const d2 = `${coefA - coefB}${expStr}`;
    const d3 = `${quotient}`;
    const options = shuffle([correct, d1, d2, d3]);

    return {
      id: `alg-div-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category: 'algebra_basica',
      subType: 'potencias_algebraicas',
      title: 'División de Monomios',
      question: `Simplifica la división aplicando propiedades de potencias:`,
      expression,
      correctAnswer: correct,
      options,
      steps: [
        `1) Dividir los coeficientes: ${coefA} ÷ ${coefB} = ${quotient}`,
        `2) Restar los exponentes de las letras iguales: ${exp1} - ${exp2} = ${finalExp}`,
        `Resultado final: ${correct}`
      ],
      hint: `Divide los números y RESTA los exponentes de la x.`
    };
  } else {
    const coef = getRandomInt(2, 3);
    const exp1 = getRandomInt(2, 4);
    const exp2 = getRandomInt(2, 3);

    const expression = `(${coef}x^${exp1})^${exp2}`.replace(/\^2/g, '²').replace(/\^3/g, '³');
    const finalCoef = Math.pow(coef, exp2);
    const finalExp = exp1 * exp2;
    const correct = `${finalCoef}x^${finalExp}`.replace(/\^2/g, '²').replace(/\^3/g, '³');

    const d1 = `${coef * exp2}x^${finalExp}`;
    const d2 = `${finalCoef}x^${exp1 + exp2}`;
    const d3 = `${finalCoef}x^${exp1}`;
    const options = shuffle([correct, d1, d2, d3]);

    return {
      id: `alg-pot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category: 'algebra_basica',
      subType: 'potencias_algebraicas',
      title: 'Potencia de una Potencia',
      question: `Resuelve la potencia del monomio:`,
      expression,
      correctAnswer: correct,
      options,
      steps: [
        `1) Elevar el coeficiente a la potencia: ${coef}^${exp2} = ${finalCoef}`,
        `2) Multiplicar los exponentes de la variable: (x^${exp1})^${exp2} = x^(${exp1} · ${exp2}) = x^${finalExp}`,
        `Resultado: ${correct}`
      ],
      hint: `Eleva el número y MULTIPLICA los exponentes.`
    };
  }
}

// -------------------------------------------------------------
// 3. FACTORIZACIÓN ELEMENTAL (OA 2)
// -------------------------------------------------------------

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
    `Buscamos el M.C.D. numérico de ${termA} y ${Math.abs(termB)}: M.C.D. = ${k}`,
    `Extraemos ${k} fuera del paréntesis dividiendo cada término:`,
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
    hint: `Calcula el M.C.D. numérico entre los coeficientes y escríbelo fuera del paréntesis.`
  };
}

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

  const d1 = `(x ${a > 0 ? `- ${a}` : `+ ${Math.abs(a)}`})(x ${b > 0 ? `- ${b}` : `+ ${Math.abs(b)}`})`;
  const d2 = `(x ${p > 0 ? `+ ${p}` : `- ${Math.abs(p)}`})(x ${q > 0 ? `+ ${q}` : `- ${Math.abs(q)}`})`;
  const d3 = a === b ? `(x ${a > 0 ? `+ ${a}` : `- ${Math.abs(a)}`})²` : `(x + ${Math.abs(a + b)})(x - 1)`;

  const options = Array.from(new Set([correct, d1, d2, d3]));
  while (options.length < 4) {
    options.push(`(x + ${a + 1})(x + ${b - 1})`);
  }

  const steps = [
    `Buscamos dos números m y n tales que:`,
    `1) m · n = ${q} (término independiente)`,
    `2) m + n = ${p} (coeficiente de x)`,
    `Comprobamos: (${a}) · (${b}) = ${q}  y  (${a}) + (${b}) = ${p}`,
    `Resultado: ${correct}`
  ];

  return {
    id: `fac-tri-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'factorizacion',
    subType: 'trinomio',
    title: 'Factorización de Trinomios: x² + px + q',
    question: `Factoriza el siguiente trinomio:`,
    expression,
    correctAnswer: correct,
    options: shuffle(options),
    steps,
    hint: `¿Qué dos números multiplicados dan ${q} y sumados dan ${p}?`
  };
}

export function generateDifferenceOfSquares(level = 1) {
  const a = getRandomInt(2, 9);
  const expression = `x² - ${a * a}`;
  const correct = `(x + ${a})(x - ${a})`;

  const d1 = `(x - ${a})²`;
  const d2 = `(x + ${a})²`;
  const d3 = `(x + ${a * 2})(x - ${a * 2})`;

  const options = shuffle(Array.from(new Set([correct, d1, d2, d3])));

  const steps = [
    `Diferencia de Cuadrados: a² - b² = (a + b)(a - b)`,
    `Raíz cuadrada del primer término: √(x²) = x`,
    `Raíz cuadrada del segundo término: √(${a * a}) = ${a}`,
    `Resultado: ${correct}`
  ];

  return {
    id: `fac-dc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'factorizacion',
    subType: 'diferencia_cuadrados',
    title: 'Diferencia de Cuadrados: a² - b²',
    question: `Factoriza la diferencia de cuadrados:`,
    expression,
    correctAnswer: correct,
    options,
    steps,
    hint: `Obtén la raíz cuadrada de cada término y escribe (x + a)(x - a).`
  };
}

// -------------------------------------------------------------
// 4. ECUACIONES LINEALES DE 1° MEDIO (OA 4)
// -------------------------------------------------------------

export function generateLinearEquation(level = 1) {
  const solution = getRandomInt(-8, 9);

  let a = getRandomInt(2, 5);
  let c = getRandomInt(1, 4);
  if (a === c) a += 1;

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
    `Paso 1: Restar ${c}x en ambos miembros: (${a}x - ${c}x) ${bFormatted} = ${d}  =>  ${acFormatted} ${bFormatted} = ${d}`,
    `Paso 2: Pasar el número al lado derecho restando ${b}: ${acFormatted} = ${d} - (${b})  =>  ${acFormatted} = ${d - b}`,
    `Paso 3: Dividir ambos miembros por ${a - c}: x = ${d - b} ÷ ${a - c}  =>  x = ${solution}`,
    `Comprobación: ${a}(${solution}) ${bFormatted} = ${a * solution + b} y ${c}(${solution}) ${d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`} = ${c * solution + d}. ¡Equilibrio total!`
  ];

  return {
    id: `ec-lin-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'ecuaciones',
    subType: 'lineal_entera',
    title: 'Ecuaciones Lineales: ax + b = cx + d',
    question: `Resuelve la ecuación lineal y despeja x:`,
    expression,
    correctAnswer: correct,
    numericAnswer: solution,
    options,
    steps,
    hint: `Principio de la balanza: agrupa las x a la izquierda y los números a la derecha aplicando la operación inversa.`,
    balanceData: {
      leftX: a,
      leftNum: b,
      rightX: c,
      rightNum: d,
      solution
    }
  };
}

export function generateEquationWithParentheses(level = 2) {
  const solution = getRandomInt(-5, 7);
  const k = getRandomInt(2, 4);
  const b = getRandomInt(-4, 5);
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
    `Ecuación con paréntesis: ${expression}`,
    `Paso 1: Aplicar propiedad distributiva: ${k} · x + ${k} · (${b}) = ${rightSide}  =>  ${k}x ${k * b >= 0 ? `+ ${k * b}` : `- ${Math.abs(k * b)}`} = ${rightSide}`,
    `Paso 2: Restar ${k * b} a ambos lados: ${k}x = ${rightSide - k * b}`,
    `Paso 3: Dividir entre ${k}: x = ${rightSide - k * b} ÷ ${k}  =>  x = ${solution}`
  ];

  return {
    id: `ec-par-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'ecuaciones',
    subType: 'lineal_parentesis',
    title: 'Ecuaciones con Paréntesis: a(x + b) = c',
    question: `Aplica distributividad y resuelve la ecuación:`,
    expression,
    correctAnswer: correct,
    numericAnswer: solution,
    options,
    steps,
    hint: `Multiplica el factor exterior por cada término dentro del paréntesis: ${k}·x y ${k}·(${b}).`
  };
}

export function generateFractionalEquation(level = 2) {
  const b = getRandomInt(2, 5);
  const a = getRandomInt(-8, 8);
  const c = getRandomInt(1, 6);
  const calculatedSolution = b * c - a;

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
    `Ecuación fraccionaria: ${displayExpression}`,
    `Paso 1: El denominador ${b} que divide pasa multiplicando a la derecha: x ${a >= 0 ? `+ ${a}` : `- ${Math.abs(a)}`} = ${c} · ${b} = ${c * b}`,
    `Paso 2: Despejar x restando ${a}: x = ${c * b} - (${a})  =>  x = ${calculatedSolution}`
  ];

  return {
    id: `ec-frac-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    category: 'ecuaciones',
    subType: 'lineal_fraccionaria',
    title: 'Ecuaciones Fraccionarias: (x + a)/b = c',
    question: `Resuelve la ecuación despejando el denominador:`,
    expression: displayExpression,
    correctAnswer: correct,
    numericAnswer: calculatedSolution,
    options,
    steps,
    hint: `Multiplica ambos miembros de la ecuación por el denominador ${b}.`
  };
}

export function generateWordProblem(level = 1) {
  const problemType = Math.floor(Math.random() * 3);

  if (problemType === 0) {
    // "El triple de un número aumentado en B es igual a C"
    const k = getRandomInt(2, 4);
    const x = getRandomInt(3, 12);
    const b = getRandomInt(2, 9);
    const c = k * x + b;

    const prefix = k === 2 ? 'El doble' : k === 3 ? 'El triple' : 'El cuádruple';
    const questionText = `${prefix} de un número aumentado en ${b} es igual a ${c}. ¿Cuál es el número?`;
    const expression = `${k}x + ${b} = ${c}`;
    const correct = `x = ${x}`;
    const options = shuffle([correct, `x = ${x + 1}`, `x = ${x - 2}`, `x = ${x + 3}`]);

    return {
      id: `ec-wp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category: 'ecuaciones',
      subType: 'problema_planteo',
      title: 'Problemas de Planteo (Lenguaje Algebraico)',
      question: questionText,
      expression,
      correctAnswer: correct,
      numericAnswer: x,
      options,
      steps: [
        `Traducción al lenguaje algebraico:`,
        `"${prefix} de un número" => ${k}x`,
        `"aumentado en ${b}" => + ${b}`,
        `"es igual a ${c}" => = ${c}`,
        `Ecuación planteada: ${k}x + ${b} = ${c}`,
        `Despejamos: ${k}x = ${c} - ${b} = ${c - b}`,
        `x = ${c - b} ÷ ${k} = ${x}`,
        `El número buscado es ${x}.`
      ],
      hint: `Traduce paso a paso: 'doble' es 2x, 'triple' es 3x, 'aumentado' es sumar (+).`
    };
  } else if (problemType === 1) {
    // Edades
    const edadHermano = getRandomInt(6, 14);
    const diff = getRandomInt(3, 8);
    const edadManuel = edadHermano + diff;
    const suma = edadManuel + edadHermano;

    const questionText = `Manuel tiene ${diff} años más que su hermano. Si la suma de sus edades es ${suma} años, ¿qué edad tiene el hermano?`;
    const expression = `x + (x + ${diff}) = ${suma}`;
    const correct = `x = ${edadHermano}`;
    const options = shuffle([correct, `x = ${edadManuel}`, `x = ${edadHermano + 2}`, `x = ${edadHermano - 1}`]);

    return {
      id: `ec-wp-age-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category: 'ecuaciones',
      subType: 'problema_planteo',
      title: 'Problema de Edades en 1° Medio',
      question: questionText,
      expression,
      correctAnswer: correct,
      numericAnswer: edadHermano,
      options,
      steps: [
        `Sea x la edad del hermano.`,
        `Manuel tiene x + ${diff} años.`,
        `Suma de las edades: x + (x + ${diff}) = ${suma}`,
        `2x + ${diff} = ${suma}  =>  2x = ${suma - diff}`,
        `x = ${suma - diff} ÷ 2 = ${edadHermano}`,
        `El hermano tiene ${edadHermano} años (y Manuel tiene ${edadManuel} años).`
      ],
      hint: `Plantea: x + (x + ${diff}) = ${suma} y despeja x.`
    };
  } else {
    // Perímetro
    const ancho = getRandomInt(4, 10);
    const largo = ancho + getRandomInt(2, 6);
    const perimetro = 2 * (largo + ancho);
    const diff = largo - ancho;

    const questionText = `El largo de una cancha rectangular mide ${diff} metros más que su ancho. Si el perímetro es ${perimetro} m, ¿cuánto mide el ancho?`;
    const expression = `2x + 2(x + ${diff}) = ${perimetro}`;
    const correct = `x = ${ancho}`;
    const options = shuffle([correct, `x = ${largo}`, `x = ${ancho + 1}`, `x = ${ancho - 2}`]);

    return {
      id: `ec-wp-per-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category: 'ecuaciones',
      subType: 'problema_planteo',
      title: 'Problema Geométrico de Planteo',
      question: questionText,
      expression,
      correctAnswer: correct,
      numericAnswer: ancho,
      options,
      steps: [
        `Sea x el ancho del rectángulo. El largo mide x + ${diff}.`,
        `Perímetro = 2 · (ancho + largo) = 2 · (x + x + ${diff}) = ${perimetro}`,
        `4x + ${2 * diff} = ${perimetro}`,
        `4x = ${perimetro - 2 * diff}  =>  x = ${ancho}`,
        `El ancho mide ${ancho} metros.`
      ],
      hint: `El perímetro de un rectángulo es 2·ancho + 2·largo.`
    };
  }
}

// -------------------------------------------------------------
// 5. FRACCIONES ALGEBRAICAS DE 1° MEDIO
// -------------------------------------------------------------

export function generateFractionSimplification(level = 1) {
  const isDiff = Math.random() < 0.5;

  if (isDiff) {
    const a = getRandomInt(2, 8);
    const sign = Math.random() < 0.5 ? '+' : '-';
    const otherSign = sign === '+' ? '-' : '+';

    const expression = `(x² - ${a * a}) / (x ${sign} ${a})`;
    const correct = `x ${otherSign} ${a}`;
    const d1 = `x ${sign} ${a}`;
    const d2 = `x - ${a * a}`;
    const d3 = `x / ${a}`;
    const options = shuffle([correct, d1, d2, d3]);

    return {
      id: `fa-sim-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category: 'fracciones_algebraicas',
      subType: 'fracciones_simplificacion',
      title: 'Simplificación de Fracciones Algebraicas',
      question: `Factoriza el numerador y simplifica la fracción:`,
      expression,
      correctAnswer: correct,
      options,
      steps: [
        `1) Factorizar el numerador como Diferencia de Cuadrados: x² - ${a * a} = (x + ${a})(x - ${a})`,
        `2) Escribir la fracción factorizada: [(x + ${a})(x - ${a})] / (x ${sign} ${a})`,
        `3) Cancelar el factor común (x ${sign} ${a}) del numerador y denominador.`,
        `Resultado simplificado: ${correct}`
      ],
      hint: `Factoriza x² - ${a * a} como suma por su diferencia: (x + ${a})(x - ${a}) y simplifica.`
    };
  } else {
    let a = getRandomInt(1, 5);
    let b = getRandomInt(1, 6);
    const p = a + b;
    const q = a * b;

    const expression = `(x² + ${p}x + ${q}) / (x + ${a})`;
    const correct = `x + ${b}`;
    const d1 = `x - ${b}`;
    const d2 = `x + ${p}`;
    const d3 = `x + ${q}`;
    const options = shuffle([correct, d1, d2, d3]);

    return {
      id: `fa-sim-tri-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category: 'fracciones_algebraicas',
      subType: 'fracciones_simplificacion',
      title: 'Simplificación con Trinomio',
      question: `Factoriza el trinomio del numerador y simplifica:`,
      expression,
      correctAnswer: correct,
      options,
      steps: [
        `1) Factorizar el trinomio x² + ${p}x + ${q}: buscamos dos números que multiplicados den ${q} y sumados den ${p} => (x + ${a})(x + ${b})`,
        `2) Expresión: [(x + ${a})(x + ${b})] / (x + ${a})`,
        `3) Simplificamos (x + ${a}):`,
        `Resultado final: ${correct}`
      ],
      hint: `Factoriza el trinomio en producto de binomios y elimina el término común con el denominador.`
    };
  }
}

// -------------------------------------------------------------
// 6. GENERADOR MAESTRO POR TEMA
// -------------------------------------------------------------

export function generateExercise(topic, level = 1) {
  switch (topic) {
    // Productos notables
    case 'cuadrado_binomio':
      return generateSquareOfBinomial(level);
    case 'suma_por_diferencia':
      return generateSumByDifference(level);
    case 'termino_comun':
      return generateCommonTermBinomial(level);
    case 'cubo_binomio':
      return generateCubicBinomial(level);

    // Factorización
    case 'factor_comun':
      return generateCommonFactor(level);
    case 'trinomio':
      return generateTrinomialFactorization(level);
    case 'diferencia_cuadrados':
      return generateDifferenceOfSquares(level);

    // Ecuaciones
    case 'lineal_entera':
      return generateLinearEquation(level);
    case 'lineal_parentesis':
      return generateEquationWithParentheses(level);
    case 'lineal_fraccionaria':
      return generateFractionalEquation(level);
    case 'problema_planteo':
      return generateWordProblem(level);

    // Operaciones algebraicas
    case 'terminos_semejantes':
      return generateSimilarTermsReduction(level);
    case 'monomio_por_polinomio':
      return generateMonomialByPolynomial(level);
    case 'potencias_algebraicas':
      return generatePowersProperties(level);

    // Fracciones algebraicas
    case 'fracciones_simplificacion':
      return generateFractionSimplification(level);

    // Categorías aleatorias
    case 'productos_notables_aleatorio': {
      const pns = [generateSquareOfBinomial, generateSumByDifference, generateCommonTermBinomial, generateCubicBinomial];
      return pns[Math.floor(Math.random() * pns.length)](level);
    }
    case 'ecuaciones_aleatorio': {
      const ecs = [generateLinearEquation, generateEquationWithParentheses, generateFractionalEquation, generateWordProblem];
      return ecs[Math.floor(Math.random() * ecs.length)](level);
    }
    case 'algebra_operaciones_aleatorio': {
      const ops = [generateSimilarTermsReduction, generateMonomialByPolynomial, generatePowersProperties, generateFractionSimplification];
      return ops[Math.floor(Math.random() * ops.length)](level);
    }
    case 'simce_1medio': {
      const all = [
        () => generateSquareOfBinomial(2),
        () => generateSumByDifference(2),
        () => generateCommonTermBinomial(2),
        () => generateCubicBinomial(1),
        () => generateTrinomialFactorization(2),
        () => generateDifferenceOfSquares(2),
        () => generateLinearEquation(2),
        () => generateEquationWithParentheses(2),
        () => generateFractionalEquation(2),
        () => generateWordProblem(2),
        () => generateSimilarTermsReduction(2),
        () => generateMonomialByPolynomial(2),
        () => generatePowersProperties(2),
        () => generateFractionSimplification(2)
      ];
      return all[Math.floor(Math.random() * all.length)]();
    }
    default:
      return generateSquareOfBinomial(level);
  }
}

export function normalizeUserMath(input) {
  if (!input) return '';
  return input
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/\^2/g, '²')
    .replace(/\^3/g, '³')
    .replace(/x=/g, '')
    .trim();
}

export function verifyAnswer(userAnswer, correctAnswer, numericAnswer = null) {
  const normUser = normalizeUserMath(userAnswer);
  const normCorrect = normalizeUserMath(correctAnswer);

  if (normUser === normCorrect) {
    return { isCorrect: true };
  }

  if (numericAnswer !== null) {
    const numInput = Number(normUser);
    if (!isNaN(numInput) && numInput === numericAnswer) {
      return { isCorrect: true };
    }
  }

  // Conmutatividad en binomios
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
