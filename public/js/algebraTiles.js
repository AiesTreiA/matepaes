/**
 * algebraTiles.js
 * Visualizador geométrico de áreas para Productos Notables (MINEDUC 1° Medio OA 3)
 */

export class AlgebraTilesVisualizer {
  constructor(containerElement) {
    this.container = containerElement;
  }

  render(visualData) {
    if (!this.container) return;

    if (!visualData) {
      this.container.innerHTML = '';
      this.container.style.display = 'none';
      return;
    }

    this.container.style.display = 'block';
    const { type, a = 1, b = 2 } = visualData;
    const absA = Math.abs(a);
    const absB = Math.abs(b);

    if (type === 'area_square') {
      // Cuadrado de Binomio (x + b)^2 = x^2 + 2bx + b^2
      this.container.innerHTML = `
        <div style="font-weight: 700; color: #38bdf8; margin-bottom: 0.6rem; font-size: 0.95rem;">
          📐 Representación Geométrica de Áreas (MINEDUC OA 3)
        </div>
        <div style="display: flex; justify-content: center; align-items: center; margin: 0.8rem 0;">
          <svg viewBox="0 0 320 320" style="width: 240px; height: 240px; background: #0b1120; border-radius: 12px; border: 1px solid #334155;">
            <!-- Cuadrado x^2 -->
            <rect x="20" y="20" width="160" height="160" fill="#2563eb" fill-opacity="0.75" stroke="#60a5fa" stroke-width="2" />
            <text x="100" y="105" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle" font-family="monospace">x²</text>
            
            <!-- Rectángulo superior bx -->
            <rect x="180" y="20" width="90" height="160" fill="#0d9488" fill-opacity="0.75" stroke="#2dd4bf" stroke-width="2" />
            <text x="225" y="105" fill="#ffffff" font-size="15" font-weight="bold" text-anchor="middle" font-family="monospace">${absB}x</text>
            
            <!-- Rectángulo inferior bx -->
            <rect x="20" y="180" width="160" height="90" fill="#0d9488" fill-opacity="0.75" stroke="#2dd4bf" stroke-width="2" />
            <text x="100" y="230" fill="#ffffff" font-size="15" font-weight="bold" text-anchor="middle" font-family="monospace">${absB}x</text>
            
            <!-- Cuadrado b^2 -->
            <rect x="180" y="180" width="90" height="90" fill="#d97706" fill-opacity="0.75" stroke="#fbbf24" stroke-width="2" />
            <text x="225" y="230" fill="#ffffff" font-size="15" font-weight="bold" text-anchor="middle" font-family="monospace">${absB * absB}</text>
          </svg>
        </div>
        <div style="font-size: 0.85rem; color: #cbd5e1;">
          Área Total = <strong style="color: #60a5fa;">x²</strong> + <strong style="color: #2dd4bf;">2·(${absB}x)</strong> + <strong style="color: #fbbf24;">${absB}²</strong> = <strong>x² + ${2 * absB}x + ${absB * absB}</strong>
        </div>
      `;
    } else if (type === 'area_rect') {
      // Binomio con Término Común (x + a)(x + b) = x^2 + (a+b)x + ab
      this.container.innerHTML = `
        <div style="font-weight: 700; color: #38bdf8; margin-bottom: 0.6rem; font-size: 0.95rem;">
          📐 Representación Geométrica de Áreas: (x + ${a})(x + ${b})
        </div>
        <div style="display: flex; justify-content: center; align-items: center; margin: 0.8rem 0;">
          <svg viewBox="0 0 320 320" style="width: 240px; height: 240px; background: #0b1120; border-radius: 12px; border: 1px solid #334155;">
            <!-- Cuadrado x^2 -->
            <rect x="20" y="20" width="150" height="150" fill="#2563eb" fill-opacity="0.75" stroke="#60a5fa" stroke-width="2" />
            <text x="95" y="100" fill="#ffffff" font-size="18" font-weight="bold" text-anchor="middle" font-family="monospace">x²</text>
            
            <!-- Rectángulo bx -->
            <rect x="170" y="20" width="100" height="150" fill="#0d9488" fill-opacity="0.75" stroke="#2dd4bf" stroke-width="2" />
            <text x="220" y="100" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle" font-family="monospace">${absB}x</text>
            
            <!-- Rectángulo ax -->
            <rect x="20" y="170" width="150" height="80" fill="#8b5cf6" fill-opacity="0.75" stroke="#c084fc" stroke-width="2" />
            <text x="95" y="215" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle" font-family="monospace">${absA}x</text>
            
            <!-- Rectángulo ab -->
            <rect x="170" y="170" width="100" height="80" fill="#d97706" fill-opacity="0.75" stroke="#fbbf24" stroke-width="2" />
            <text x="220" y="215" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle" font-family="monospace">${absA * absB}</text>
          </svg>
        </div>
        <div style="font-size: 0.85rem; color: #cbd5e1;">
          Suma de las 4 áreas: x² + ${absB}x + ${absA}x + ${absA * absB} = <strong>x² + ${absA + absB}x + ${absA * absB}</strong>
        </div>
      `;
    } else if (type === 'area_difference') {
      // Suma por Diferencia: (x + y)(x - y) = x² - y²
      const var1 = visualData.var1 || 'x';
      const var2 = visualData.var2 || 'y';

      this.container.innerHTML = `
        <div style="font-weight: 700; color: #38bdf8; margin-bottom: 0.6rem; font-size: 0.95rem;">
          📐 Demostración Geométrica de Suma por Diferencia (MINEDUC OA 3)
        </div>
        <div style="display: flex; justify-content: center; align-items: center; gap: 1rem; margin: 0.8rem 0; flex-wrap: wrap;">
          <!-- Cuadrado grande con recorte del cuadrado menor -->
          <svg viewBox="0 0 240 240" style="width: 200px; height: 200px; background: #0b1120; border-radius: 12px; border: 1px solid #334155;">
            <!-- Cuadrado base x^2 -->
            <rect x="20" y="20" width="200" height="200" fill="#2563eb" fill-opacity="0.5" stroke="#60a5fa" stroke-width="2" />
            
            <!-- Pieza A (rectángulo de (x-y) por x) -->
            <rect x="20" y="80" width="200" height="140" fill="#3b82f6" fill-opacity="0.8" stroke="#93c5fd" stroke-width="1.5" />
            <text x="120" y="155" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle" font-family="monospace">Área A: ${var1}(${var1} - ${var2})</text>
            
            <!-- Pieza B (rectángulo de (x-y) por y) -->
            <rect x="20" y="20" width="140" height="60" fill="#0d9488" fill-opacity="0.8" stroke="#2dd4bf" stroke-width="1.5" />
            <text x="90" y="55" fill="#ffffff" font-size="13" font-weight="bold" text-anchor="middle" font-family="monospace">Área B</text>
            
            <!-- Cuadrado extraído y^2 -->
            <rect x="160" y="20" width="60" height="60" fill="#ef4444" fill-opacity="0.4" stroke="#f87171" stroke-width="2" stroke-dasharray="4 4" />
            <text x="190" y="55" fill="#fca5a5" font-size="13" font-weight="bold" text-anchor="middle" font-family="monospace">-${var2}²</text>
          </svg>

          <!-- Flecha de equivalencia -->
          <div style="font-size: 1.5rem; color: #fbbf24; font-weight: bold;">➔</div>

          <!-- Rectángulo unificado (x+y) * (x-y) -->
          <svg viewBox="0 0 280 160" style="width: 230px; height: 130px; background: #0b1120; border-radius: 12px; border: 1px solid #334155;">
            <!-- Pieza A -->
            <rect x="20" y="30" width="150" height="100" fill="#3b82f6" fill-opacity="0.8" stroke="#93c5fd" stroke-width="1.5" />
            <text x="95" y="85" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle" font-family="monospace">Pieza A</text>
            
            <!-- Pieza B reubicada al lado -->
            <rect x="170" y="30" width="70" height="100" fill="#0d9488" fill-opacity="0.8" stroke="#2dd4bf" stroke-width="1.5" />
            <text x="205" y="85" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle" font-family="monospace">Pieza B</text>

            <!-- Cotas de dimensiones -->
            <text x="130" y="20" fill="#fbbf24" font-size="12" font-weight="bold" text-anchor="middle" font-family="monospace">Base: (${var1} + ${var2})</text>
            <text x="250" y="85" fill="#38bdf8" font-size="12" font-weight="bold" text-anchor="start" font-family="monospace">(${var1} - ${var2})</text>
          </svg>
        </div>
        <div style="font-size: 0.85rem; color: #cbd5e1; text-align: center;">
          Área con recorte: <strong style="color: #60a5fa;">${var1}²</strong> - <strong style="color: #f87171;">${var2}²</strong> = Rectángulo unificado: <strong style="color: #fbbf24;">(${var1} + ${var2})</strong> · <strong style="color: #38bdf8;">(${var1} - ${var2})</strong>
        </div>
      `;
    } else {
      this.container.innerHTML = '';
      this.container.style.display = 'none';
    }
  }
}
