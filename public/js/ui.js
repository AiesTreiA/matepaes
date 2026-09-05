/**
 * ui.js
 * Generador de avatares SVG de Manuel y enemigos, efectos de confeti y diploma
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
    <svg viewBox="0 0 100 100" class="avatar-svg">
      <!-- Fondo y Cuerpo -->
      <circle cx="50" cy="50" r="48" fill="#1e293b"/>
      <!-- Mochila escolar de Manuel -->
      <rect x="25" y="70" width="50" height="25" rx="8" fill="#4f46e5" stroke="#818cf8" stroke-width="2"/>
      <circle cx="50" cy="78" r="4" fill="#fbbf24"/>
      
      <!-- Cabeza y Cabello -->
      <circle cx="50" cy="50" r="28" fill="#fcd34d"/>
      <path d="M 23,45 C 23,26 40,20 50,20 C 60,20 77,26 77,45 C 72,32 58,30 50,32 C 40,30 28,34 23,45 Z" fill="#78350f"/>
      
      <!-- Ojos y Boca -->
      ${eyes}
      ${mouth}
      ${extra}
    </svg>
  `;
}

export function getEnemyAvatarSvg(spriteType) {
  if (spriteType === 'boss') {
    // Dr. Monomio
    return `
      <svg viewBox="0 0 100 100" class="actor-sprite">
        <circle cx="50" cy="50" r="45" fill="#450a0a" stroke="#ef4444" stroke-width="3"/>
        <!-- Capa oscura -->
        <path d="M 20,85 Q 50,60 80,85 Z" fill="#7f1d1d"/>
        <!-- Rostro hechicero -->
        <circle cx="50" cy="46" r="22" fill="#cbd5e1"/>
        <!-- Ojos siniestros -->
        <ellipse cx="42" cy="44" rx="4" ry="6" fill="#dc2626"/>
        <ellipse cx="58" cy="44" rx="4" ry="6" fill="#dc2626"/>
        <!-- Cejas malvadas -->
        <line x1="36" y1="36" x2="46" y2="40" stroke="#000" stroke-width="3"/>
        <line x1="64" y1="36" x2="54" y2="40" stroke="#000" stroke-width="3"/>
        <!-- Barba en punta -->
        <polygon points="42,58 58,58 50,76" fill="#1e293b"/>
        <!-- Corona monomio -->
        <polygon points="32,24 40,32 50,20 60,32 68,24 62,35 38,35" fill="#a855f7" stroke="#e9d5ff" stroke-width="1.5"/>
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

// Explosión de Confeti
export function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#38bdf8', '#818cf8', '#f59e0b', '#10b981', '#ec4899'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.8) * 14,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 8
    });
  }

  let animId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // Gravedad
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
  ctx.fillText('DIPLOMA DE HONOR', 400, 100);

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
  ctx.fillText('Por haber superado con valentía los desafíos algebraicos:', 400, 320);
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
  ctx.fillText('Manuel (Compañero 1° Medio)', 250, 502);

  ctx.fillText('_________________________', 550, 480);
  ctx.fillText('Profesor(a) de Matemáticas', 550, 502);
}
