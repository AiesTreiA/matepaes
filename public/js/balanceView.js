/**
 * balanceView.js
 * Simulador de Balanza Algebraica Dinámica para 1° Medio (MINEDUC OA 4)
 * Diseño inspirado en el Laboratorio Espacial de Stitch
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

    // Generar fichas de variables y constantes para el plato izquierdo
    let leftVarsHtml = '';
    for (let i = 0; i < Math.min(Math.abs(leftX), 5); i++) {
      leftVarsHtml += `
        <div style="background: rgba(0, 210, 255, 0.2); border: 1.5px solid #00d2ff; color: #a5e7ff; font-weight: 800; font-size: 0.85rem; padding: 4px 8px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 210, 255, 0.35);">
          x
        </div>
      `;
    }
    if (Math.abs(leftX) > 5) {
      leftVarsHtml += `<div style="font-size: 0.75rem; color: #38bdf8; font-weight: 700;">...${leftX}x</div>`;
    }

    let leftConstsHtml = '';
    const numLeft = Math.min(Math.abs(leftNum), 6);
    for (let i = 0; i < numLeft; i++) {
      leftConstsHtml += `
        <div style="background: rgba(245, 158, 11, 0.2); border: 1.5px solid #f59e0b; color: #fbbf24; font-weight: 700; font-size: 0.72rem; padding: 2px 6px; border-radius: 6px; box-shadow: 0 0 8px rgba(245, 158, 11, 0.25);">
          +1
        </div>
      `;
    }
    if (Math.abs(leftNum) > 6) {
      leftConstsHtml += `<div style="font-size: 0.72rem; color: #fbbf24; font-weight: 700;">...${leftNum >= 0 ? '+' : ''}${leftNum}</div>`;
    }

    // Generar fichas de variables y constantes para el plato derecho
    let rightVarsHtml = '';
    for (let i = 0; i < Math.min(Math.abs(rightX), 5); i++) {
      rightVarsHtml += `
        <div style="background: rgba(0, 210, 255, 0.2); border: 1.5px solid #00d2ff; color: #a5e7ff; font-weight: 800; font-size: 0.85rem; padding: 4px 8px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 210, 255, 0.35);">
          x
        </div>
      `;
    }
    if (Math.abs(rightX) > 5) {
      rightVarsHtml += `<div style="font-size: 0.75rem; color: #38bdf8; font-weight: 700;">...${rightX}x</div>`;
    }

    let rightConstsHtml = '';
    const numRight = Math.min(Math.abs(rightNum), 6);
    for (let i = 0; i < numRight; i++) {
      rightConstsHtml += `
        <div style="background: rgba(16, 185, 129, 0.2); border: 1.5px solid #10b981; color: #34d399; font-weight: 700; font-size: 0.72rem; padding: 2px 6px; border-radius: 6px; box-shadow: 0 0 8px rgba(16, 185, 129, 0.25);">
          +1
        </div>
      `;
    }
    if (Math.abs(rightNum) > 6) {
      rightConstsHtml += `<div style="font-size: 0.72rem; color: #34d399; font-weight: 700;">...${rightNum >= 0 ? '+' : ''}${rightNum}</div>`;
    }

    this.container.innerHTML = `
      <!-- Top HUD de la Balanza -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
        <div style="display: flex; align-items: center; gap: 0.4rem; background: rgba(0, 210, 255, 0.1); border: 1px solid rgba(0, 210, 255, 0.25); padding: 3px 10px; border-radius: 999px;">
          <span style="color: #00d2ff; font-weight: 800; font-size: 0.8rem;">⚖️ SIMULADOR OA 4</span>
          <span style="font-size: 0.75rem; color: #94a3b8;">· Equilibrio de Platillos</span>
        </div>

        <div id="scale-level-indicator" style="display: flex; align-items: center; gap: 0.4rem; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.3); padding: 3px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 700; color: #34d399;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981;"></span>
          <span id="scale-deviation-text">Nivel Óptimo: 0.00° (Equilibrio)</span>
        </div>
      </div>

      <!-- Visual Rig SVG con Estilo Laboratorio Cósmico -->
      <div style="position: relative; width: 100%; max-width: 540px; height: 210px; margin: 0 auto; user-select: none;">
        <svg viewBox="0 0 540 210" style="width: 100%; height: 100%; overflow: visible;">
          <defs>
            <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#0284c7" />
              <stop offset="50%" stop-color="#00d2ff" />
              <stop offset="100%" stop-color="#10b981" />
            </linearGradient>
            <linearGradient id="fulcrumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#38bdf8" />
              <stop offset="100%" stop-color="#0f172a" />
            </linearGradient>
          </defs>

          <!-- Fulcrum Central / Torre de Apoyo -->
          <polygon points="270,55 242,190 298,190" fill="url(#fulcrumGrad)" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
          <rect x="220" y="188" width="100" height="8" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="1" />
          
          <!-- Dial de Nivel Central (Spirit Level) -->
          <circle cx="270" cy="55" r="14" fill="#0f172a" stroke="#00d2ff" stroke-width="2.5" />
          <circle cx="270" cy="55" r="5" fill="#10b981" />

          <!-- Brazo Basculante Mecánico con Transform Origin Dinámico -->
          <g id="balance-beam" style="transform-origin: 270px 55px; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);">
            <!-- Barra horizontal -->
            <rect x="60" y="50" width="420" height="10" rx="5" fill="url(#beamGrad)" stroke="rgba(255,255,255,0.2)" stroke-width="1" />
            
            <!-- Articulaciones de pivote -->
            <circle cx="95" cy="55" r="7" fill="#00d2ff" stroke="#fff" stroke-width="1.5" />
            <circle cx="445" cy="55" r="7" fill="#10b981" stroke="#fff" stroke-width="1.5" />

            <!-- Cuerdas Platillo Izquierdo -->
            <line x1="95" y1="55" x2="65" y2="135" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3,2" />
            <line x1="95" y1="55" x2="125" y2="135" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3,2" />
            <!-- Platillo Izquierdo (LHS) -->
            <path d="M 55,135 Q 95,158 135,135 Z" fill="#131f38" stroke="#00d2ff" stroke-width="2.5" />
            
            <!-- Cuerdas Platillo Derecho -->
            <line x1="445" y1="55" x2="415" y2="135" stroke="#34d399" stroke-width="1.8" stroke-dasharray="3,2" />
            <line x1="445" y1="55" x2="475" y2="135" stroke="#34d399" stroke-width="1.8" stroke-dasharray="3,2" />
            <!-- Platillo Derecho (RHS) -->
            <path d="M 405,135 Q 445,158 485,135 Z" fill="#131f38" stroke="#10b981" stroke-width="2.5" />

            <!-- Etiqueta Expresión LHS -->
            <g transform="translate(95, 125)">
              <rect x="-42" y="-24" width="84" height="22" rx="6" fill="rgba(11, 18, 34, 0.9)" stroke="#00d2ff" stroke-width="1.2" />
              <text x="0" y="-8" fill="#a5e7ff" font-size="11" font-weight="bold" text-anchor="middle" font-family="'Outfit', sans-serif">
                ${leftX ? `${leftX}x` : ''} ${leftNum >= 0 ? `+${leftNum}` : leftNum}
              </text>
            </g>

            <!-- Etiqueta Expresión RHS -->
            <g transform="translate(445, 125)">
              <rect x="-42" y="-24" width="84" height="22" rx="6" fill="rgba(11, 18, 34, 0.9)" stroke="#10b981" stroke-width="1.2" />
              <text x="0" y="-8" fill="#34d399" font-size="11" font-weight="bold" text-anchor="middle" font-family="'Outfit', sans-serif">
                ${rightX ? `${rightX}x` : ''} ${rightNum >= 0 ? `+${rightNum}` : rightNum}
              </text>
            </g>
          </g>
        </svg>
      </div>

      <!-- Contenedor de Pesas e Incógnitas Desglosadas -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; max-width: 540px; margin: 0.5rem auto 0 auto;">
        <!-- Platillo Izquierdo Detalle -->
        <div style="background: rgba(11, 18, 34, 0.7); border: 1px solid rgba(0, 210, 255, 0.25); border-radius: 12px; padding: 0.6rem 0.8rem; text-align: center;">
          <div style="font-size: 0.72rem; color: #00d2ff; font-weight: 700; text-transform: uppercase; margin-bottom: 0.35rem;">
            Platillo Izquierdo (LHS)
          </div>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 4px;">
            ${leftVarsHtml}
            ${leftConstsHtml}
          </div>
        </div>

        <!-- Platillo Derecho Detalle -->
        <div style="background: rgba(11, 18, 34, 0.7); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 12px; padding: 0.6rem 0.8rem; text-align: center;">
          <div style="font-size: 0.72rem; color: #10b981; font-weight: 700; text-transform: uppercase; margin-bottom: 0.35rem;">
            Platillo Derecho (RHS)
          </div>
          <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 4px;">
            ${rightVarsHtml}
            ${rightConstsHtml}
          </div>
        </div>
      </div>

      <!-- Estado Pedagógico de la Balanza -->
      <div id="balance-status" style="font-size: 0.85rem; color: #94a3b8; margin-top: 0.75rem;">
        <strong>Principio de Igualdad:</strong> Toda operación debe aplicarse exactamente a ambos platillos para no quebrar el equilibrio.
      </div>
    `;
  }

  setBalancedState(isBalanced = true) {
    const beam = document.getElementById('balance-beam');
    const status = document.getElementById('balance-status');
    const levelInd = document.getElementById('scale-level-indicator');
    const devText = document.getElementById('scale-deviation-text');
    if (!beam) return;

    if (isBalanced) {
      beam.style.transform = 'rotate(0deg)';
      if (levelInd) {
        levelInd.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        levelInd.style.background = 'rgba(16, 185, 129, 0.2)';
        levelInd.style.color = '#34d399';
      }
      if (devText) devText.textContent = 'Nivel Óptimo: 0.00° (¡Equilibrio Exacto!)';
      if (status) {
        status.innerHTML = `<span style="color: #10b981; font-weight: 800;">✨ ¡BALANZA EN EQUILIBRIO PERFECTO! El valor de x satisface la ecuación.</span>`;
      }
    } else {
      beam.style.transform = 'rotate(-7deg)';
      if (levelInd) {
        levelInd.style.borderColor = 'rgba(239, 68, 68, 0.4)';
        levelInd.style.background = 'rgba(239, 68, 68, 0.2)';
        levelInd.style.color = '#f87171';
      }
      if (devText) devText.textContent = 'Desviación: -7.00° (Desbalance)';
      if (status) {
        status.innerHTML = `<span style="color: #ef4444; font-weight: 700;">⚠️ Balanza descalibrada. El valor seleccionado no mantiene la igualdad.</span>`;
      }
    }
  }
}
