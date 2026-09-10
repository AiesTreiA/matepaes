/**
 * ui.js
 * Generador de avatares SVG de Héroes (Manuel, Sofía, Nico) y Enemigos RPG,
 * efectos de daño flotante, partículas de combate y diploma de honor.
 */

export function getManuelAvatarSvg(mood = 'normal') {
  let eyes = `<circle cx="42" cy="45" r="4" fill="#0f172a"/><circle cx="58" cy="45" r="4" fill="#0f172a"/>`;
  let mouth = `<path d="M 42,62 Q 50,70 58,62" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>`;
  let extra = ``;

  if (mood === 'thinking') {
    eyes = `<circle cx="42" cy="43" r="4" fill="#0f172a"/><circle cx="58" cy="43" r="4" fill="#0f172a"/>`;
    mouth = `<ellipse cx="50" cy="62" rx="4" ry="3" fill="#0f172a"/>`;
    extra = `<text x="70" y="30" font-size="16" fill="#38bdf8" font-weight="bold">?</text>`;
  } else if (mood === 'happy') {
    eyes = `<path d="M 38,45 Q 42,40 46,45" fill="none" stroke="#0f172a" stroke-width="3"/><path d="M 54,45 Q 58,40 62,45" fill="none" stroke="#0f172a" stroke-width="3"/>`;
    mouth = `<path d="M 40,58 Q 50,72 60,58 Z" fill="#ef4444"/>`;
    extra = `<text x="70" y="30" font-size="14">✨</text>`;
  } else if (mood === 'hurt') {
    eyes = `<path d="M 39,42 L 45,48 M 45,42 L 39,48" stroke="#0f172a" stroke-width="3"/><path d="M 55,42 L 61,48 M 61,42 L 55,48" stroke="#0f172a" stroke-width="3"/>`;
    mouth = `<path d="M 42,65 Q 50,57 58,65" fill="none" stroke="#0f172a" stroke-width="3" stroke-linecap="round"/>`;
    extra = `<text x="15" y="35" font-size="16">💥</text>`;
  } else if (mood === 'victory') {
    eyes = `<circle cx="42" cy="45" r="4" fill="#0f172a"/><circle cx="58" cy="45" r="4" fill="#0f172a"/>`;
    mouth = `<path d="M 38,58 Q 50,75 62,58 Z" fill="#ef4444"/>`;
    extra = `<polygon points="35,18 42,28 50,15 58,28 65,18 62,32 38,32" fill="#f59e0b" stroke="#b45309" stroke-width="1.5"/>`;
  }

  return `
    <svg viewBox="0 0 100 100" class="avatar-svg hero-manuel-svg">
      <!-- Fondo y Capa/Cuerpo -->
      <circle cx="50" cy="50" r="48" fill="#1e293b"/>
      <!-- Mochila / Armadura de Manuel -->
      <rect x="25" y="70" width="50" height="25" rx="8" fill="#3b82f6" stroke="#60a5fa" stroke-width="2"/>
      <circle cx="50" cy="78" r="5" fill="#fbbf24"/>
      
      <!-- Cabeza y Cabello -->
      <circle cx="50" cy="50" r="28" fill="#fed7aa"/>
      <path d="M 23,45 C 23,26 40,20 50,20 C 60,20 77,26 77,45 C 72,32 58,30 50,32 C 40,30 28,34 23,45 Z" fill="#78350f"/>
      
      <!-- Ojos y Boca -->
      ${eyes}
      ${mouth}
      ${extra}
    </svg>
  `;
}

export function getSofiaAvatarSvg(mood = 'normal') {
  let eyes = `<circle cx="42" cy="46" r="4" fill="#0f172a"/><circle cx="58" cy="46" r="4" fill="#0f172a"/>`;
  let mouth = `<path d="M 44,62 Q 50,68 56,62" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>`;

  if (mood === 'happy' || mood === 'victory') {
    eyes = `<path d="M 38,46 Q 42,41 46,46" fill="none" stroke="#0f172a" stroke-width="3"/><path d="M 54,46 Q 58,41 62,46" fill="none" stroke="#0f172a" stroke-width="3"/>`;
    mouth = `<path d="M 42,58 Q 50,70 58,58 Z" fill="#ec4899"/>`;
  } else if (mood === 'hurt') {
    eyes = `<path d="M 40,43 L 46,49 M 46,43 L 40,49" stroke="#0f172a" stroke-width="2.5"/><path d="M 54,43 L 60,49 M 60,43 L 54,49" stroke="#0f172a" stroke-width="2.5"/>`;
    mouth = `<ellipse cx="50" cy="63" rx="4" ry="2" fill="#0f172a"/>`;
  }

  return `
    <svg viewBox="0 0 100 100" class="avatar-svg hero-sofia-svg">
      <circle cx="50" cy="50" r="48" fill="#2e1065"/>
      <!-- Túnica mágica púrpura -->
      <path d="M 22,95 Q 50,68 78,95 Z" fill="#8b5cf6" stroke="#c4b5fd" stroke-width="2"/>
      <circle cx="50" cy="74" r="5" fill="#f43f5e"/>
      
      <!-- Cabello largo castaño/púrpura -->
      <path d="M 20,40 C 18,70 25,85 30,90 C 35,65 30,45 30,35 Z" fill="#4c1d95"/>
      <path d="M 80,40 C 82,70 75,85 70,90 C 65,65 70,45 70,35 Z" fill="#4c1d95"/>
      
      <!-- Cabeza -->
      <circle cx="50" cy="50" r="27" fill="#fde68a"/>
      <!-- Flequillo -->
      <path d="M 25,42 C 25,25 40,22 50,22 C 60,22 75,25 75,42 C 65,34 58,34 50,34 C 42,34 32,34 25,42 Z" fill="#4c1d95"/>
      <!-- Diadema de hechicera con gema -->
      <path d="M 26,36 Q 50,30 74,36" fill="none" stroke="#fbbf24" stroke-width="3"/>
      <polygon points="50,28 54,34 50,40 46,34" fill="#38bdf8"/>
      
      ${eyes}
      ${mouth}
    </svg>
  `;
}

export function getNicoAvatarSvg(mood = 'normal') {
  let eyes = `<circle cx="42" cy="46" r="3.5" fill="#0f172a"/><circle cx="58" cy="46" r="3.5" fill="#0f172a"/>`;
  let mouth = `<path d="M 44,63 Q 50,67 56,63" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round"/>`;

  if (mood === 'happy' || mood === 'victory') {
    eyes = `<path d="M 38,46 Q 42,42 46,46" fill="none" stroke="#0f172a" stroke-width="2.5"/><path d="M 54,46 Q 58,42 62,46" fill="none" stroke="#0f172a" stroke-width="2.5"/>`;
    mouth = `<path d="M 44,60 Q 50,70 56,60 Z" fill="#10b981"/>`;
  } else if (mood === 'hurt') {
    eyes = `<path d="M 40,44 L 45,49 M 45,44 L 40,49" stroke="#0f172a" stroke-width="2.5"/><path d="M 55,44 L 60,49 M 60,44 L 55,49" stroke="#0f172a" stroke-width="2.5"/>`;
    mouth = `<path d="M 44,65 Q 50,59 56,65" fill="none" stroke="#0f172a" stroke-width="2.5"/>`;
  }

  return `
    <svg viewBox="0 0 100 100" class="avatar-svg hero-nico-svg">
      <circle cx="50" cy="50" r="48" fill="#064e3b"/>
      <!-- Capa de pícaro esmeralda -->
      <path d="M 20,95 Q 50,65 80,95 Z" fill="#059669" stroke="#34d399" stroke-width="2"/>
      
      <!-- Cabeza -->
      <circle cx="50" cy="50" r="27" fill="#fed7aa"/>
      <!-- Cabello verde rebelde y bandana -->
      <path d="M 22,40 C 20,20 40,15 50,15 C 62,15 78,20 78,40 C 70,30 60,28 50,28 C 40,28 30,30 22,40 Z" fill="#1e293b"/>
      <rect x="23" y="32" width="54" height="8" rx="3" fill="#10b981" stroke="#34d399" stroke-width="1"/>
      <!-- Mechón rebelde -->
      <polygon points="50,12 55,24 45,24" fill="#1e293b"/>
      
      ${eyes}
      ${mouth}
    </svg>
  `;
}

export function getHeroAvatarSvg(heroId, mood = 'normal') {
  if (heroId === 'sofia') return getSofiaAvatarSvg(mood);
  if (heroId === 'nico') return getNicoAvatarSvg(mood);
  return getManuelAvatarSvg(mood);
}

export function getEnemyAvatarSvg(spriteType) {
  if (spriteType === 'slime') {
    return `
      <svg viewBox="0 0 100 100" class="actor-sprite slime-anim">
        <defs>
          <radialGradient id="slimeGrad" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stop-color="#4edea3"/>
            <stop offset="100%" stop-color="#059669"/>
          </radialGradient>
        </defs>
        <!-- Cuerpo gelatinoso -->
        <path d="M 20,75 C 10,75 15,40 50,25 C 85,40 90,75 80,75 C 65,85 35,85 20,75 Z" fill="url(#slimeGrad)" stroke="#10b981" stroke-width="3"/>
        <ellipse cx="40" cy="52" rx="4" ry="7" fill="#0f172a"/>
        <circle cx="39" cy="49" r="2" fill="#fff"/>
        <ellipse cx="60" cy="52" rx="4" ry="7" fill="#0f172a"/>
        <circle cx="59" cy="49" r="2" fill="#fff"/>
        <path d="M 44,65 Q 50,70 56,65" stroke="#0f172a" stroke-width="2.5" fill="none"/>
        <text x="50" y="42" font-family="Outfit, sans-serif" font-weight="bold" font-size="14" fill="#064e3b" text-anchor="middle">3x</text>
      </svg>
    `;
  }

  if (spriteType === 'tree_monster') {
    return `
      <svg viewBox="0 0 100 100" class="actor-sprite">
        <circle cx="50" cy="50" r="44" fill="#14532d" stroke="#22c55e" stroke-width="2"/>
        <path d="M 25,85 L 35,45 L 20,30 L 35,35 L 50,15 L 65,35 L 80,30 L 65,45 L 75,85 Z" fill="#15803d"/>
        <circle cx="40" cy="48" r="5" fill="#facc15"/>
        <circle cx="60" cy="48" r="5" fill="#facc15"/>
        <line x1="35" y1="42" x2="45" y2="46" stroke="#000" stroke-width="2.5"/>
        <line x1="65" y1="42" x2="55" y2="46" stroke="#000" stroke-width="2.5"/>
        <text x="50" y="72" font-family="Outfit, sans-serif" font-weight="bold" font-size="13" fill="#bbf7d0" text-anchor="middle">x(a+b)</text>
      </svg>
    `;
  }

  if (spriteType === 'boss_golem' || spriteType === 'golem') {
    return `
      <svg viewBox="0 0 100 100" class="actor-sprite boss-anim">
        <polygon points="50,10 85,30 90,75 50,95 10,75 15,30" fill="#3f3f46" stroke="#a1a1aa" stroke-width="3"/>
        <polygon points="50,25 75,40 70,75 50,85 30,75 25,40" fill="#27272a"/>
        <!-- Ojos brillantes de runas -->
        <rect x="36" y="44" width="10" height="6" rx="2" fill="#00d2ff"/>
        <rect x="54" y="44" width="10" height="6" rx="2" fill="#00d2ff"/>
        <!-- Grietas de energía -->
        <path d="M 50,30 L 50,42 M 50,54 L 50,75 M 35,60 L 65,60" stroke="#00d2ff" stroke-width="2" stroke-dasharray="3,2"/>
        <text x="50" y="70" font-family="Outfit, sans-serif" font-weight="bold" font-size="12" fill="#38bdf8" text-anchor="middle">OA 2</text>
      </svg>
    `;
  }

  if (spriteType === 'specter') {
    return `
      <svg viewBox="0 0 100 100" class="actor-sprite float-anim">
        <path d="M 30,85 C 20,60 20,30 50,20 C 80,30 80,60 70,85 C 60,78 50,88 40,78 Z" fill="#854d0e" stroke="#eab308" stroke-width="2"/>
        <ellipse cx="42" cy="45" rx="5" ry="8" fill="#fef08a"/>
        <ellipse cx="58" cy="45" rx="5" ry="8" fill="#fef08a"/>
        <ellipse cx="50" cy="62" rx="6" ry="9" fill="#422006"/>
        <text x="50" y="36" font-family="Outfit, sans-serif" font-weight="bold" font-size="11" fill="#fef08a" text-anchor="middle">(a+b)²</text>
      </svg>
    `;
  }

  if (spriteType === 'boss_sphinx' || spriteType === 'sphinx') {
    return `
      <svg viewBox="0 0 100 100" class="actor-sprite boss-anim">
        <circle cx="50" cy="50" r="46" fill="#78350f" stroke="#fbbf24" stroke-width="3"/>
        <!-- Corona Egipcia de Esfinge -->
        <polygon points="50,15 75,35 80,65 50,60 20,65 25,35" fill="#d97706"/>
        <circle cx="50" cy="48" r="20" fill="#fef3c7"/>
        <!-- Ojos dorados -->
        <ellipse cx="42" cy="45" rx="4" ry="6" fill="#b45309"/>
        <ellipse cx="58" cy="45" rx="4" ry="6" fill="#b45309"/>
        <path d="M 40,58 Q 50,64 60,58" stroke="#78350f" stroke-width="2.5" fill="none"/>
        <polygon points="50,66 54,82 46,82" fill="#451a03"/>
        <text x="50" y="28" font-family="Outfit, sans-serif" font-weight="bold" font-size="10" fill="#fff" text-anchor="middle">a² - b²</text>
      </svg>
    `;
  }

  if (spriteType === 'crystal_gargoyle' || spriteType === 'boss_crystal' || spriteType === 'crystal') {
    return `
      <svg viewBox="0 0 100 100" class="actor-sprite crystal-anim">
        <polygon points="50,12 85,38 72,85 28,85 15,38" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2.5"/>
        <polygon points="50,22 75,44 65,78 35,78 25,44" fill="#3b82f6"/>
        <polygon points="50,32 65,48 58,70 42,70 35,48" fill="#93c5fd"/>
        <!-- Resplandor central -->
        <circle cx="50" cy="52" r="10" fill="#ffffff" opacity="0.8"/>
        <text x="50" y="56" font-family="Outfit, sans-serif" font-weight="900" font-size="13" fill="#1e3a8a" text-anchor="middle">x²</text>
      </svg>
    `;
  }

  if (spriteType === 'automaton' || spriteType === 'scale_colossus' || spriteType === 'boss_guardian' || spriteType === 'guardian') {
    return `
      <svg viewBox="0 0 100 100" class="actor-sprite">
        <rect x="20" y="20" width="60" height="60" rx="12" fill="#713f12" stroke="#f59e0b" stroke-width="3"/>
        <!-- Platillos de balanza en hombros -->
        <circle cx="20" cy="20" r="12" fill="#ca8a04"/>
        <circle cx="80" cy="20" r="12" fill="#ca8a04"/>
        <!-- Rostro de reloj de engranajes -->
        <circle cx="50" cy="50" r="20" fill="#451a03"/>
        <line x1="50" y1="50" x2="50" y2="36" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
        <line x1="50" y1="50" x2="60" y2="50" stroke="#fbbf24" stroke-width="3" stroke-linecap="round"/>
        <text x="50" y="86" font-family="Outfit, sans-serif" font-weight="bold" font-size="11" fill="#fde047" text-anchor="middle">ax + b = c</text>
      </svg>
    `;
  }

  if (spriteType === 'dragon') {
    return `
      <svg viewBox="0 0 100 100" class="actor-sprite dragon-anim">
        <circle cx="50" cy="50" r="46" fill="#4c0519" stroke="#f43f5e" stroke-width="3"/>
        <!-- Cuernos del dragón -->
        <path d="M 30,30 Q 15,10 10,5 Q 25,18 35,28 Z" fill="#e11d48"/>
        <path d="M 70,30 Q 85,10 90,5 Q 75,18 65,28 Z" fill="#e11d48"/>
        <!-- Ojos ardientes -->
        <polygon points="34,44 46,48 40,54" fill="#fbbf24"/>
        <polygon points="66,44 54,48 60,54" fill="#fbbf24"/>
        <!-- Fuego -->
        <polygon points="45,68 50,88 55,68" fill="#f97316"/>
        <text x="50" y="38" font-family="Outfit, sans-serif" font-weight="bold" font-size="11" fill="#fda4af" text-anchor="middle">DRAGÓN</text>
      </svg>
    `;
  }

  if (spriteType === 'boss' || spriteType === 'boss_monomio') {
    // Dr. Monomio Final Boss
    return `
      <svg viewBox="0 0 100 100" class="actor-sprite boss-monomio-anim">
        <circle cx="50" cy="50" r="46" fill="#450a0a" stroke="#ef4444" stroke-width="3.5"/>
        <!-- Capa oscura -->
        <path d="M 18,90 Q 50,55 82,90 Z" fill="#7f1d1d"/>
        <!-- Rostro hechicero -->
        <circle cx="50" cy="46" r="22" fill="#e2e8f0"/>
        <!-- Ojos siniestros -->
        <ellipse cx="42" cy="44" rx="4" ry="6" fill="#dc2626"/>
        <ellipse cx="58" cy="44" rx="4" ry="6" fill="#dc2626"/>
        <circle cx="42" cy="44" r="1.5" fill="#fef08a"/>
        <circle cx="58" cy="44" r="1.5" fill="#fef08a"/>
        <!-- Cejas malvadas -->
        <line x1="34" y1="36" x2="46" y2="41" stroke="#000" stroke-width="3"/>
        <line x1="66" y1="36" x2="54" y2="41" stroke="#000" stroke-width="3"/>
        <!-- Barba en punta -->
        <polygon points="42,58 58,58 50,80" fill="#1e293b"/>
        <!-- Corona monomio púrpura -->
        <polygon points="28,24 38,32 50,18 62,32 72,24 64,36 36,36" fill="#a855f7" stroke="#e9d5ff" stroke-width="2"/>
        <text x="50" y="94" font-family="Outfit, sans-serif" font-weight="900" font-size="9" fill="#f87171" text-anchor="middle">DR. MONOMIO</text>
      </svg>
    `;
  }

  // Enemigos estándar
  return `
    <svg viewBox="0 0 100 100" class="actor-sprite">
      <circle cx="50" cy="50" r="42" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>
      <polygon points="50,20 80,45 70,80 30,80 20,45" fill="#312e81"/>
      <circle cx="40" cy="50" r="5" fill="#38bdf8"/>
      <circle cx="60" cy="50" r="5" fill="#38bdf8"/>
      <text x="50" y="74" fill="#a5b4fc" font-size="16" font-weight="bold" text-anchor="middle" font-family="monospace">xⁿ</text>
    </svg>
  `;
}

// Generador de textos de daño flotante ("-180 HP!", "¡CRÍTICO!", "¡BLOQUEO!")
export function createFloatingCombatText(targetElement, text, type = 'damage') {
  if (!targetElement) return;
  const floating = document.createElement('div');
  floating.className = `floating-combat-text fct-${type}`;
  floating.textContent = text;
  
  targetElement.style.position = 'relative';
  targetElement.appendChild(floating);

  setTimeout(() => {
    if (floating.parentNode) {
      floating.parentNode.removeChild(floating);
    }
  }, 1200);
}

// Explosión de Confeti
export function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#38bdf8', '#818cf8', '#f59e0b', '#10b981', '#ec4899', '#a855f7'];

  for (let i = 0; i < 110; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.8) * 16,
      size: Math.random() * 9 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10
    });
  }

  let animId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // Gravedad
      p.alpha -= 0.012;
      p.rotation += p.vRot;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (alive) {
      animId = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animId);
    }
  }

  animate();
}

// Generador de Diploma de Honor en Canvas
export function renderDiploma(canvas, studentName, score, medal) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 800;
  canvas.height = 560;

  // Fondo pergamino elegante
  const grad = ctx.createLinearGradient(0, 0, 800, 560);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 560);

  // Marco dorado doble
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, 760, 520);
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.strokeRect(30, 30, 740, 500);

  // Título
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 36px "Segoe UI", sans-serif';
  ctx.fillText('DIPLOMA DE HONOR RPG', 400, 100);

  ctx.fillStyle = '#38bdf8';
  ctx.font = '600 20px "Segoe UI", sans-serif';
  ctx.fillText('MINISTERIO DE EDUCACIÓN - MATEMÁTICAS 1° MEDIO CHILE', 400, 135);

  // Subtexto
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '18px "Segoe UI", sans-serif';
  ctx.fillText('Se otorga con orgullo el presente reconocimiento a:', 400, 200);

  // Nombre del Estudiante
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px "Segoe UI", sans-serif';
  ctx.fillText(studentName.toUpperCase(), 400, 255);

  // Línea decorativa
  ctx.beginPath();
  ctx.moveTo(250, 275);
  ctx.lineTo(550, 275);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Mérito
  ctx.fillStyle = '#e2e8f0';
  ctx.font = '18px "Segoe UI", sans-serif';
  ctx.fillText('Por haber superado las Crónicas del Álgebra y los 5 Mundos:', 400, 320);
  ctx.font = 'italic 17px "Segoe UI", sans-serif';
  ctx.fillStyle = '#a5b4fc';
  ctx.fillText('Productos Notables, Factorización y Ecuaciones Lineales', 400, 350);

  // Estadísticas
  ctx.fillStyle = '#34d399';
  ctx.font = 'bold 22px "Segoe UI", sans-serif';
  ctx.fillText(`Puntaje Obtenido: ${score} pts  •  Medalla de ${medal}`, 400, 410);

  // Firmas
  ctx.font = '14px "Segoe UI", sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('_________________________', 250, 480);
  ctx.fillText('Manuel & Party de Héroes', 250, 502);

  ctx.fillText('_________________________', 550, 480);
  ctx.fillText('Profesor(a) de Matemáticas', 550, 502);
}
