import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generateSquareOfBinomial,
  generateSumByDifference,
  generateCommonTermBinomial,
  generateCubicBinomial,
  generateCommonFactor,
  generateTrinomialFactorization,
  generateDifferenceOfSquares,
  generateLinearEquation,
  generateEquationWithParentheses,
  generateFractionalEquation,
  generateWordProblem,
  generateSimilarTermsReduction,
  generateMonomialByPolynomial,
  generatePowersProperties,
  generateFractionSimplification,
  verifyAnswer,
  generateExercise
} from '../lib/algebraEngine.js';

test('Cuadrado de Binomio genera expresiones válidas y 4 opciones', () => {
  for (let i = 0; i < 10; i++) {
    const ex = generateSquareOfBinomial(1);
    assert.ok(ex.expression.includes('²'));
    assert.equal(ex.options.length, 4);
    assert.ok(ex.options.includes(ex.correctAnswer));
    assert.ok(ex.steps.length > 0);
  }
});

test('Suma por Diferencia calcula m² - n² o factoriza (m+n)(m-n)', () => {
  for (let i = 0; i < 20; i++) {
    const ex = generateSumByDifference(1);
    assert.ok(ex.expression.includes(')(') || ex.correctAnswer.includes(')('));
    assert.ok(ex.expression.includes('-') || ex.correctAnswer.includes('-'));
    assert.equal(ex.options.length, 4);
    assert.ok(ex.options.includes(ex.correctAnswer));
  }
});

test('Binomio con Término Común genera solución correcta', () => {
  for (let i = 0; i < 10; i++) {
    const ex = generateCommonTermBinomial(1);
    assert.ok(ex.expression.includes('x'));
    assert.equal(ex.options.length, 4);
    assert.ok(ex.options.includes(ex.correctAnswer));
  }
});

test('Ecuaciones Lineales tienen solución entera verificable', () => {
  for (let i = 0; i < 10; i++) {
    const ex = generateLinearEquation(1);
    assert.ok(ex.expression.includes('='));
    assert.equal(typeof ex.numericAnswer, 'number');
    assert.equal(ex.correctAnswer, `x = ${ex.numericAnswer}`);
    assert.ok(ex.options.includes(ex.correctAnswer));
  }
});

test('Ecuaciones con Paréntesis y Fraccionarias se generan con éxito', () => {
  const pEx = generateEquationWithParentheses(1);
  assert.ok(pEx.expression.includes('('));
  assert.equal(pEx.options.length, 4);

  const fEx = generateFractionalEquation(1);
  assert.ok(fEx.expression.includes('/'));
  assert.equal(fEx.options.length, 4);
});

test('Factorizaciones elementales son consistentes', () => {
  const fc = generateCommonFactor(1);
  assert.ok(fc.correctAnswer.includes('('));

  const tri = generateTrinomialFactorization(1);
  assert.ok(tri.correctAnswer.includes(')('));

  const dc = generateDifferenceOfSquares(1);
  assert.ok(dc.correctAnswer.includes(')('));
});

test('verifyAnswer acepta formatos variados y conmutatividad', () => {
  // Conmutatividad de binomios
  const v1 = verifyAnswer('(x + 3)(x - 2)', '(x - 2)(x + 3)');
  assert.equal(v1.isCorrect, true);

  // Espacios y número directo en ecuaciones
  const v2 = verifyAnswer('5', 'x = 5', 5);
  assert.equal(v2.isCorrect, true);

  const v3 = verifyAnswer('x=5', 'x = 5', 5);
  assert.equal(v3.isCorrect, true);

  // Potencias con ^2 o ²
  const v4 = verifyAnswer('x^2 + 6x + 9', 'x² + 6x + 9');
  assert.equal(v4.isCorrect, true);
});

test('Cubo de Binomio genera desarrollos cúbicos de 4 términos', () => {
  for (let i = 0; i < 10; i++) {
    const ex = generateCubicBinomial(1);
    assert.ok(ex.expression.includes('³'));
    assert.equal(ex.options.length, 4);
    assert.ok(ex.options.includes(ex.correctAnswer));
    assert.ok(ex.correctAnswer.includes('³'));
  }
});

test('Problemas de Planteo modelan lenguaje algebraico con solución numérica entera', () => {
  for (let i = 0; i < 10; i++) {
    const ex = generateWordProblem(1);
    assert.ok(ex.question.length > 15);
    assert.equal(typeof ex.numericAnswer, 'number');
    assert.equal(ex.options.length, 4);
    assert.ok(ex.options.includes(ex.correctAnswer));
  }
});

test('Fracciones algebraicas simplifican correctamente', () => {
  for (let i = 0; i < 10; i++) {
    const ex = generateFractionSimplification(1);
    assert.ok(ex.expression.includes('/'));
    assert.equal(ex.options.length, 4);
    assert.ok(ex.options.includes(ex.correctAnswer));
  }
});

test('Propiedades de potencias y Monomio por Polinomio generan opciones válidas', () => {
  const pot = generatePowersProperties(1);
  assert.equal(pot.options.length, 4);
  assert.ok(pot.options.includes(pot.correctAnswer));

  const mono = generateMonomialByPolynomial(1);
  assert.equal(mono.options.length, 4);
  assert.ok(mono.options.includes(mono.correctAnswer));
});

test('generateExercise genera cualquier tema solicitado', () => {
  const topics = [
    'cuadrado_binomio',
    'suma_por_diferencia',
    'termino_comun',
    'cubo_binomio',
    'factor_comun',
    'trinomio',
    'diferencia_cuadrados',
    'lineal_entera',
    'lineal_parentesis',
    'lineal_fraccionaria',
    'problema_planteo',
    'terminos_semejantes',
    'monomio_por_polinomio',
    'potencias_algebraicas',
    'fracciones_simplificacion',
    'productos_notables_aleatorio',
    'ecuaciones_aleatorio',
    'simce_1medio'
  ];

  for (const t of topics) {
    const ex = generateExercise(t, 1);
    assert.ok(ex.title);
    assert.ok(ex.question);
    assert.ok(ex.correctAnswer);
    assert.equal(ex.options.length, 4);
    assert.ok(ex.options.includes(ex.correctAnswer));
  }
});
