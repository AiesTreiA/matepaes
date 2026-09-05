/**
 * balanceView.js
 * Componente visual de la Balanza de Ecuaciones Lineales para 1° Medio
 */

export class BalanceScale {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentAngle = 0;
  }

  render(balanceData) {
    if (!this.container) return;

    if (!balanceData) {
      this.container.innerHTML = '';
      this.container.style.display = 'none';
      return;
    }

    this.container.style.display = 'block';
    const { leftX = 0, leftNum = 0, rightX = 0, rightNum = 0 } = balanceData;

    this.container.innerHTML = `
      <div style="font-weight: 700; color: #38bdf8; margin-bottom: 0.5rem; font-size: 0.95rem;">
        ⚖️ Simulador de Balanza Algebraica (Plato Izquierdo = Plato Derecho)
      </div>
      <div style="position: relative; width: 100%; max-width: 460px; height: 170px; margin: 0 auto;">
        <svg viewBox="0 0 500 200" style="width: 100%; height: 100%;">
          <!-- Base y Pilar Central -->
          <polygon points="250,50 220,180 280,180" fill="#334155" stroke="#64748b" stroke-width="2" />
          <circle cx="250" cy="50" r="10" fill="#f59e0b" stroke="#ffffff" stroke-width="2" />
          
          <!-- Brazo basculante -->
          <g id="balance-beam" style="transform-origin: 250px 50px; transition: transform 0.5s ease-out;">
            <!-- Barra horizontal -->
            <rect x="70" y="46" width="360" height="8" rx="4" fill="#64748b" />
            
            <!-- Cuerdas plato izquierdo -->
            <line x1="100" y1="50" x2="70" y2="120" stroke="#94a3b8" stroke-width="2" />
            <line x1="100" y1="50" x2="130" y2="120" stroke="#94a3b8" stroke-width="2" />
            <!-- Plato izquierdo -->
            <path d="M 60,120 Q 100,140 140,120 Z" fill="#1e293b" stroke="#38bdf8" stroke-width="2" />
            
            <!-- Cuerdas plato derecho -->
            <line x1="400" y1="50" x2="370" y2="120" stroke="#94a3b8" stroke-width="2" />
            <line x1="400" y1="50" x2="430" y2="120" stroke="#94a3b8" stroke-width="2" />
            <!-- Plato derecho -->
            <path d="M 360,120 Q 400,140 440,120 Z" fill="#1e293b" stroke="#a855f7" stroke-width="2" />

            <!-- Cargas Plato Izquierdo -->
            <g transform="translate(100, 110)">
              <rect x="-35" y="-30" width="70" height="26" rx="6" fill="rgba(56, 189, 248, 0.25)" stroke="#38bdf8" stroke-width="1.5" />
              <text x="0" y="-12" fill="#e0f2fe" font-size="12" font-weight="bold" text-anchor="middle" font-family="monospace">
                ${leftX ? `${leftX}x` : ''} ${leftNum >= 0 ? `+${leftNum}` : leftNum}
              </text>
            </g>

            <!-- Cargas Plato Derecho -->
            <g transform="translate(400, 110)">
              <rect x="-35" y="-30" width="70" height="26" rx="6" fill="rgba(168, 85, 247, 0.25)" stroke="#c084fc" stroke-width="1.5" />
              <text x="0" y="-12" fill="#f3e8ff" font-size="12" font-weight="bold" text-anchor="middle" font-family="monospace">
                ${rightX ? `${rightX}x` : ''} ${rightNum >= 0 ? `+${rightNum}` : rightNum}
              </text>
            </g>
          </g>
        </svg>
      </div>
      <div id="balance-status" style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.4rem;">
        Mantén el principio de equilibrio: cualquier operación se aplica en ambos miembros.
      </div>
    `;
  }

  setBalancedState(isBalanced = true) {
    const beam = document.getElementById('balance-beam');
    const status = document.getElementById('balance-status');
    if (!beam) return;

    if (isBalanced) {
      beam.style.transform = 'rotate(0deg)';
      if (status) {
        status.innerHTML = `<span style="color: #10b981; font-weight: bold;">✨ ¡BALANZA EN EQUILIBRIO PERFECTO! (Valor de x verificado)</span>`;
      }
    } else {
      beam.style.transform = 'rotate(-8deg)';
      if (status) {
        status.innerHTML = `<span style="color: #ef4444; font-weight: bold;">⚠️ Balanza descalibrada. El valor no satisface la igualdad.</span>`;
      }
    }
  }
}
