/**
 * rpgWorldMap.js
 * Motor de Overworld 2D Caminable para "Las Crónicas del Álgebra"
 * Renderiza paisajes vivos con montañas al fondo, lagos y ríos animados, bosques, vegetación,
 * fauna (conejos, pájaros, mariposas), monstruos patrulleros y personaje controlable.
 */

import { sound } from './audio.js';

function drawSafeRoundRect(ctx, x, y, width, height, radius = 5) {
  if (ctx.roundRect) {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }
}

export class OverworldMapCanvas {
  constructor(canvasElement, rpgEngine) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.engine = rpgEngine;

    // Dimensiones virtuales del mapa (Mundo 2D)
    this.width = 1000;
    this.height = 620;

    // Estado del Jugador (Manuel)
    this.player = {
      x: 140,
      y: 420,
      targetX: 140,
      targetY: 420,
      speed: 3.5,
      direction: 'right', // 'down', 'up', 'left', 'right'
      isMoving: false,
      walkFrame: 0,
      frameTimer: 0
    };

    // Teclas presionadas
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      interact: false
    };

    // Fauna y entidades vivas
    this.animals = [];
    this.birds = [];
    this.butterflies = [];
    this.clouds = [];
    this.waveOffset = 0;
    this.time = 0;
    this.running = false;
    this.animId = null;

    // Objeto cercano para interactuar
    this.nearbyObject = null;

    // Inicializar listeners y entorno
    this.initEntities();
    this.bindControls();
    this.resizeCanvas();
  }

  initEntities() {
    // Nubes en las montañas
    this.clouds = [
      { x: 50, y: 40, speed: 0.25, size: 60 },
      { x: 350, y: 65, speed: 0.35, size: 85 },
      { x: 700, y: 30, speed: 0.2, size: 70 },
      { x: 920, y: 80, speed: 0.3, size: 50 }
    ];

    // Pájaros volando sobre la cordillera
    this.birds = [
      { x: 100, y: 90, vx: 1.8, vy: -0.2, wing: 0 },
      { x: 125, y: 105, vx: 1.8, vy: -0.2, wing: 0.5 },
      { x: 80, y: 110, vx: 1.8, vy: -0.2, wing: 0.8 },
      { x: 600, y: 70, vx: 1.4, vy: 0.1, wing: 0.2 },
      { x: 630, y: 85, vx: 1.4, vy: 0.1, wing: 0.6 }
    ];

    // Conejos en la pradera
    this.animals = [
      { x: 220, y: 480, state: 'idle', timer: 60, hopY: 0, dir: 1, color: '#f8fafc' },
      { x: 520, y: 510, state: 'idle', timer: 120, hopY: 0, dir: -1, color: '#d97706' },
      { x: 820, y: 460, state: 'idle', timer: 90, hopY: 0, dir: 1, color: '#fed7aa' }
    ];

    // Mariposas revoloteando cerca de flores
    this.butterflies = [
      { baseX: 160, baseY: 380, x: 160, y: 380, angle: 0, color: '#38bdf8' },
      { baseX: 390, baseY: 460, x: 390, y: 460, angle: 2, color: '#f43f5e' },
      { baseX: 680, baseY: 370, x: 680, y: 370, angle: 4, color: '#fbbf24' }
    ];
  }

  bindControls() {
    // Teclado
    window.addEventListener('keydown', (e) => {
      if (this.engine.inBattle) return;
      if (['ArrowUp', 'KeyW'].includes(e.code)) { this.keys.up = true; e.preventDefault(); }
      if (['ArrowDown', 'KeyS'].includes(e.code)) { this.keys.down = true; e.preventDefault(); }
      if (['ArrowLeft', 'KeyA'].includes(e.code)) { this.keys.left = true; e.preventDefault(); }
      if (['ArrowRight', 'KeyD'].includes(e.code)) { this.keys.right = true; e.preventDefault(); }
      if (['Space', 'Enter', 'KeyE'].includes(e.code)) {
        this.interactNearby();
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) this.keys.up = false;
      if (['ArrowDown', 'KeyS'].includes(e.code)) this.keys.down = false;
      if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = false;
      if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = false;
    });

    // Click / Tap to Move en el Canvas
    this.canvas.addEventListener('click', (e) => {
      if (this.engine.inBattle) return;
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.width / rect.width;
      const scaleY = this.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      if (clickY > 190) {
        this.player.targetX = clickX;
        this.player.targetY = clickY;
      }
    });

    // Botones del D-Pad Táctil en Pantalla
    this.bindTouchButton('btn-dpad-up', 'up');
    this.bindTouchButton('btn-dpad-down', 'down');
    this.bindTouchButton('btn-dpad-left', 'left');
    this.bindTouchButton('btn-dpad-right', 'right');

    const btnAction = document.getElementById('btn-dpad-action');
    if (btnAction) {
      btnAction.addEventListener('click', () => {
        sound.playClick();
        this.interactNearby();
      });
    }
  }

  bindTouchButton(elementId, direction) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const start = (e) => { e.preventDefault(); this.keys[direction] = true; };
    const end = (e) => { e.preventDefault(); this.keys[direction] = false; };
    el.addEventListener('mousedown', start);
    el.addEventListener('mouseup', end);
    el.addEventListener('mouseleave', end);
    el.addEventListener('touchstart', start);
    el.addEventListener('touchend', end);
  }

  start() {
    this.resizeCanvas();
    this.render();
    if (this.running) return;
    this.running = true;

    const loop = () => {
      if (!this.running) return;
      this.update();
      this.render();
      this.animId = requestAnimationFrame(loop);
    };
    this.animId = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  resizeCanvas() {
    if (this.canvas) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    }
  }

  // -------------------------------------------------------------
  // ACTUALIZACIÓN DE ESTADO (60 FPS)
  // -------------------------------------------------------------
  update() {
    this.time += 0.02;
    this.waveOffset += 0.05;

    // Actualizar Nubes
    this.clouds.forEach(c => {
      c.x += c.speed;
      if (c.x > this.width + 100) c.x = -120;
    });

    // Actualizar Pájaros
    this.birds.forEach(b => {
      b.x += b.vx;
      b.y += b.vy;
      b.wing += 0.2;
      if (b.x > this.width + 50) {
        b.x = -60;
        b.y = 60 + Math.random() * 80;
      }
    });

    // Actualizar Conejos
    this.animals.forEach(a => {
      a.timer--;
      if (a.state === 'idle') {
        a.hopY = 0;
        if (a.timer <= 0) {
          a.state = 'hop';
          a.timer = 30;
          a.dir = Math.random() < 0.5 ? -1 : 1;
        }
      } else if (a.state === 'hop') {
        a.x += a.dir * 0.8;
        a.hopY = Math.abs(Math.sin((30 - a.timer) * 0.2)) * 8;
        if (a.timer <= 0) {
          a.state = 'idle';
          a.timer = 60 + Math.floor(Math.random() * 80);
        }
      }
    });

    // Actualizar Mariposas
    this.butterflies.forEach(bf => {
      bf.angle += 0.05;
      bf.x = bf.baseX + Math.sin(bf.angle) * 20;
      bf.y = bf.baseY + Math.cos(bf.angle * 1.5) * 12;
    });

    // Movimiento del Jugador con Teclado
    let dx = 0;
    let dy = 0;

    if (this.keys.up) { dy -= this.player.speed; this.player.direction = 'up'; }
    if (this.keys.down) { dy += this.player.speed; this.player.direction = 'down'; }
    if (this.keys.left) { dx -= this.player.speed; this.player.direction = 'left'; }
    if (this.keys.right) { dx += this.player.speed; this.player.direction = 'right'; }

    // Click to move si no hay teclas activas
    if (dx === 0 && dy === 0) {
      const distTargetX = this.player.targetX - this.player.x;
      const distTargetY = this.player.targetY - this.player.y;
      const dist = Math.hypot(distTargetX, distTargetY);

      if (dist > 5) {
        dx = (distTargetX / dist) * this.player.speed;
        dy = (distTargetY / dist) * this.player.speed;
        if (Math.abs(dx) > Math.abs(dy)) {
          this.player.direction = dx > 0 ? 'right' : 'left';
        } else {
          this.player.direction = dy > 0 ? 'down' : 'up';
        }
      } else {
        this.player.isMoving = false;
      }
    } else {
      this.player.targetX = this.player.x;
      this.player.targetY = this.player.y;
    }

    if (dx !== 0 || dy !== 0) {
      this.player.isMoving = true;
      this.player.x += dx;
      this.player.y += dy;

      // Limitar a los bordes del mapa caminable
      this.player.x = Math.max(40, Math.min(this.width - 40, this.player.x));
      this.player.y = Math.max(220, Math.min(this.height - 40, this.player.y));

      // Animación de caminata
      this.player.frameTimer++;
      if (this.player.frameTimer > 8) {
        this.player.walkFrame = (this.player.walkFrame + 1) % 4;
        this.player.frameTimer = 0;
      }
    } else {
      this.player.isMoving = false;
      this.player.walkFrame = 0;
    }

    // Comprobar proximidad con objetos interactivos
    this.checkNearbyInteractions();
  }

  checkNearbyInteractions() {
    const world = this.engine.worlds[this.engine.currentWorldIndex];
    if (!world || !world.nodes) return;

    let closest = null;
    let minDist = 56;

    world.nodes.forEach(node => {
      const nodeX = (node.x / 100) * this.width;
      const nodeY = (node.y / 100) * this.height;
      const dist = Math.hypot(this.player.x - nodeX, this.player.y - nodeY);

      if (dist < minDist) {
        closest = node;
      }
    });

    this.nearbyObject = closest;

    const promptEl = document.getElementById('rpg-proximity-prompt');
    if (promptEl) {
      if (this.nearbyObject) {
        promptEl.style.display = 'flex';
        promptEl.innerHTML = `<span>💬 Presiona <strong>ESPACIO</strong> o toca Acción para interactuar con <em>${this.nearbyObject.title}</em></span>`;
      } else {
        promptEl.style.display = 'none';
      }
    }
  }

  interactNearby() {
    if (this.nearbyObject) {
      sound.playClick();
      this.engine.interactWithNode(this.nearbyObject);
    }
  }

  // -------------------------------------------------------------
  // RENDERIZADO GRÁFICO DEL MUNDO 2D
  // -------------------------------------------------------------
  render() {
    const ctx = this.ctx;
    if (!ctx) return;
    ctx.clearRect(0, 0, this.width, this.height);

    const world = this.engine.worlds[this.engine.currentWorldIndex];
    const theme = world ? world.id : 'world_1';

    // 1. CIELO Y NUBES
    this.renderSky(ctx, theme);

    // 2. CORDILLERA DE MONTAÑAS AL FONDO
    this.renderMountains(ctx, theme);

    // 3. TERRENO BASE CON TEXTURAS Y CAMINOS
    this.renderTerrainAndRoads(ctx, theme);

    // 4. CUERPOS DE AGUA ANIMADOS (LAGO Y RÍO)
    this.renderWater(ctx, theme);

    // 5. VEGETACIÓN, FLORES Y ÁRBOLES
    this.renderFloraAndProps(ctx, theme);

    // 6. FAUNA (CONEJOS, PÁJAROS, MARIPOSAS)
    this.renderFauna(ctx);

    // 7. OBJETOS DE AVENTURA (PUERTAS, COFRES, SANTUARIOS, MONSTRUOS)
    this.renderAdventureObjects(ctx, world);

    // 8. JUGADOR (MANUEL ANIMADO CON SOMBRA)
    this.renderPlayer(ctx);
  }

  renderSky(ctx, theme) {
    const grad = ctx.createLinearGradient(0, 0, 0, 200);
    if (theme === 'world_1') {
      grad.addColorStop(0, '#0c2238');
      grad.addColorStop(1, '#1e3a5f');
    } else if (theme === 'world_2') {
      grad.addColorStop(0, '#3b1803');
      grad.addColorStop(1, '#78350f');
    } else if (theme === 'world_3') {
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e1b4b');
    } else if (theme === 'world_4') {
      grad.addColorStop(0, '#311005');
      grad.addColorStop(1, '#5c2007');
    } else {
      grad.addColorStop(0, '#2d0612');
      grad.addColorStop(1, '#50071c');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, 220);

    // Nubes
    this.clouds.forEach(c => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size * 0.4, 0, Math.PI * 2);
      ctx.arc(c.x + c.size * 0.3, c.y - 8, c.size * 0.45, 0, Math.PI * 2);
      ctx.arc(c.x + c.size * 0.65, c.y, c.size * 0.35, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  renderMountains(ctx, theme) {
    // Cordillera Lejana
    ctx.fillStyle = theme === 'world_2' ? '#451a03' : theme === 'world_5' ? '#3b0718' : '#0f2942';
    ctx.beginPath();
    ctx.moveTo(0, 200);
    ctx.lineTo(80, 70);
    ctx.lineTo(190, 150);
    ctx.lineTo(310, 45); // Pico alto nevado
    ctx.lineTo(440, 160);
    ctx.lineTo(580, 60);
    ctx.lineTo(720, 150);
    ctx.lineTo(860, 50);
    ctx.lineTo(1000, 180);
    ctx.lineTo(1000, 220);
    ctx.lineTo(0, 220);
    ctx.fill();

    // Picos Nevados / Reflejos
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.moveTo(310, 45);
    ctx.lineTo(290, 75);
    ctx.lineTo(330, 75);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(860, 50);
    ctx.lineTo(840, 78);
    ctx.lineTo(880, 78);
    ctx.closePath();
    ctx.fill();

    // Colinas Intermedias (Foothills)
    ctx.fillStyle = theme === 'world_1' ? '#0d4022' : theme === 'world_2' ? '#78350f' : '#1e3a5f';
    ctx.beginPath();
    ctx.moveTo(0, 220);
    ctx.quadraticCurveTo(150, 140, 320, 210);
    ctx.quadraticCurveTo(500, 150, 680, 220);
    ctx.quadraticCurveTo(850, 140, 1000, 210);
    ctx.lineTo(1000, 240);
    ctx.lineTo(0, 240);
    ctx.fill();
  }

  renderTerrainAndRoads(ctx, theme) {
    let groundColor1 = '#14532d';
    let groundColor2 = '#166534';

    if (theme === 'world_2') {
      groundColor1 = '#78350f'; groundColor2 = '#92400e';
    } else if (theme === 'world_3') {
      groundColor1 = '#0f172a'; groundColor2 = '#1e293b';
    } else if (theme === 'world_4') {
      groundColor1 = '#451a03'; groundColor2 = '#582b05';
    } else if (theme === 'world_5') {
      groundColor1 = '#4c0519'; groundColor2 = '#650821';
    }

    const groundGrad = ctx.createLinearGradient(0, 220, 0, this.height);
    groundGrad.addColorStop(0, groundColor1);
    groundGrad.addColorStop(1, groundColor2);
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, 220, this.width, this.height - 220);

    // Textura de briznas de hierba / suelo
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let x = 30; x < this.width; x += 45) {
      for (let y = 240; y < this.height; y += 35) {
        ctx.fillRect(x + ((y * 13) % 17), y, 3, 4);
      }
    }

    // Senderos de Tierra / Adoquines
    ctx.strokeStyle = theme === 'world_2' ? '#b45309' : '#854d0e';
    ctx.lineWidth = 26;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(120, 420);
    ctx.bezierCurveTo(240, 360, 280, 290, 350, 270);
    ctx.bezierCurveTo(440, 250, 520, 340, 580, 270);
    ctx.bezierCurveTo(650, 230, 700, 360, 760, 360);
    ctx.bezierCurveTo(820, 360, 870, 310, 920, 290);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(350, 270);
    ctx.quadraticCurveTo(400, 440, 480, 480);
    ctx.stroke();

    ctx.strokeStyle = theme === 'world_2' ? '#d97706' : '#a16207';
    ctx.lineWidth = 14;
    ctx.stroke();
  }

  renderWater(ctx, theme) {
    const lakeX = 640;
    const lakeY = 490;
    const lakeW = 220;
    const lakeH = 95;

    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(lakeX, lakeY + 4, lakeW / 2 + 4, lakeH / 2 + 4, 0, 0, Math.PI * 2);
    ctx.fill();

    const waterGrad = ctx.createLinearGradient(lakeX - 100, lakeY - 40, lakeX + 100, lakeY + 40);
    waterGrad.addColorStop(0, '#0284c7');
    waterGrad.addColorStop(0.5, '#0369a1');
    waterGrad.addColorStop(1, '#075985');
    ctx.fillStyle = waterGrad;

    ctx.beginPath();
    ctx.ellipse(lakeX, lakeY, lakeW / 2, lakeH / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;

    for (let i = 0; i < 4; i++) {
      const waveY = lakeY - 25 + i * 16;
      const waveOffset = Math.sin(this.waveOffset + i) * 8;
      ctx.beginPath();
      ctx.moveTo(lakeX - 60 + waveOffset, waveY);
      ctx.quadraticCurveTo(lakeX + waveOffset, waveY + 4, lakeX + 60 + waveOffset, waveY);
      ctx.stroke();
    }

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(lakeX - 45, lakeY + 12, 7, 0, Math.PI * 1.7);
    ctx.arc(lakeX + 35, lakeY - 8, 6, 0, Math.PI * 1.7);
    ctx.fill();

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(lakeX - 45, lakeY + 10, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  renderFloraAndProps(ctx, theme) {
    const treePositions = [
      { x: 70, y: 280, type: 'oak' },
      { x: 190, y: 260, type: 'pine' },
      { x: 260, y: 390, type: 'oak' },
      { x: 80, y: 530, type: 'pine' },
      { x: 390, y: 220, type: 'pine' },
      { x: 440, y: 360, type: 'oak' },
      { x: 540, y: 400, type: 'pine' },
      { x: 710, y: 260, type: 'oak' },
      { x: 840, y: 240, type: 'pine' },
      { x: 890, y: 410, type: 'oak' },
      { x: 940, y: 520, type: 'pine' }
    ];

    treePositions.forEach(t => {
      this.drawTree(ctx, t.x, t.y, t.type, theme);
    });

    const flowers = [
      { x: 160, y: 380, color: '#facc15' },
      { x: 280, y: 470, color: '#f43f5e' },
      { x: 390, y: 460, color: '#38bdf8' },
      { x: 500, y: 320, color: '#ec4899' },
      { x: 780, y: 420, color: '#fbbf24' }
    ];

    flowers.forEach(f => {
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.arc(f.x, f.y, 4, 0, Math.PI * 2);
      ctx.arc(f.x + 3, f.y - 2, 3, 0, Math.PI * 2);
      ctx.arc(f.x - 3, f.y - 2, 3, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  drawTree(ctx, x, y, type, theme) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x, y + 16, 24, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#451a03';
    ctx.fillRect(x - 5, y - 10, 10, 24);

    if (type === 'pine') {
      const pineColor1 = theme === 'world_3' ? '#1e3a8a' : '#14532d';
      const pineColor2 = theme === 'world_3' ? '#3b82f6' : '#15803d';

      ctx.fillStyle = pineColor1;
      ctx.beginPath();
      ctx.moveTo(x, y - 50);
      ctx.lineTo(x - 22, y - 10);
      ctx.lineTo(x + 22, y - 10);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = pineColor2;
      ctx.beginPath();
      ctx.moveTo(x, y - 65);
      ctx.lineTo(x - 18, y - 28);
      ctx.lineTo(x + 18, y - 28);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = theme === 'world_3' ? '#93c5fd' : '#22c55e';
      ctx.beginPath();
      ctx.moveTo(x, y - 78);
      ctx.lineTo(x - 13, y - 46);
      ctx.lineTo(x + 13, y - 46);
      ctx.closePath();
      ctx.fill();
    } else {
      const oakColor1 = theme === 'world_3' ? '#1e3a8a' : '#166534';
      const oakColor2 = theme === 'world_3' ? '#60a5fa' : '#22c55e';

      ctx.fillStyle = oakColor1;
      ctx.beginPath();
      ctx.arc(x - 12, y - 28, 18, 0, Math.PI * 2);
      ctx.arc(x + 12, y - 28, 18, 0, Math.PI * 2);
      ctx.arc(x, y - 44, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = oakColor2;
      ctx.beginPath();
      ctx.arc(x - 6, y - 42, 14, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  renderFauna(ctx) {
    this.animals.forEach(a => {
      ctx.fillStyle = a.color;
      const cy = a.y - a.hopY;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.ellipse(a.x, a.y + 4, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = a.color;
      ctx.beginPath();
      ctx.ellipse(a.x, cy, 7, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(a.x + a.dir * 5, cy - 4, 4, 0, Math.PI * 2);
      ctx.ellipse(a.x + a.dir * 4, cy - 10, 2, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(a.x + a.dir * 6, cy - 4, 1, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    this.birds.forEach(b => {
      const wingY = Math.sin(b.wing) * 4;
      ctx.beginPath();
      ctx.moveTo(b.x - 6, b.y + wingY);
      ctx.lineTo(b.x, b.y);
      ctx.lineTo(b.x + 6, b.y + wingY);
      ctx.stroke();
    });

    this.butterflies.forEach(bf => {
      ctx.fillStyle = bf.color;
      ctx.beginPath();
      ctx.ellipse(bf.x - 3, bf.y, 4, 2, Math.PI / 4, 0, Math.PI * 2);
      ctx.ellipse(bf.x + 3, bf.y, 4, 2, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  renderAdventureObjects(ctx, world) {
    if (!world || !world.nodes) return;

    world.nodes.forEach(node => {
      const nx = (node.x / 100) * this.width;
      const ny = (node.y / 100) * this.height;
      const isCompleted = this.engine.completedNodes.has(node.id);
      const isUnlocked = this.engine.unlockedNodes.has(node.id);

      ctx.fillStyle = isCompleted ? 'rgba(16, 185, 129, 0.35)' : isUnlocked ? 'rgba(0, 210, 255, 0.35)' : 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(nx, ny, 26, 0, Math.PI * 2);
      ctx.fill();

      if (node.type === 'door') {
        ctx.fillStyle = isCompleted ? '#34d399' : '#e2e8f0';
        ctx.fillRect(nx - 14, ny - 24, 28, 30);
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(nx, ny - 8, 7, 0, Math.PI, true);
        ctx.fill();
        ctx.font = '16px "Segoe UI Emoji", sans-serif';
        ctx.fillText(isCompleted ? '🔓' : '🚪', nx - 10, ny + 2);
      } else if (node.type === 'chest') {
        ctx.fillStyle = '#b45309';
        ctx.fillRect(nx - 14, ny - 10, 28, 20);
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(nx - 16, ny - 14, 32, 7);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(nx - 3, ny - 7, 6, 6);
        ctx.font = '14px "Segoe UI Emoji", sans-serif';
        ctx.fillText(isCompleted ? '✨' : '📦', nx - 7, ny + 3);
      } else if (node.type === 'shrine') {
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(nx, ny - 6, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(nx, ny - 6, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '18px "Segoe UI Emoji", sans-serif';
        ctx.fillText('⛲', nx - 10, ny - 2);
      } else if (node.type === 'boss') {
        ctx.font = '28px "Segoe UI Emoji", sans-serif';
        ctx.fillText('👑', nx - 14, ny + 4);
      } else {
        ctx.font = '22px "Segoe UI Emoji", sans-serif';
        ctx.fillText('⚔️', nx - 11, ny + 4);
      }

      // Etiqueta del nodo con función segura
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      drawSafeRoundRect(ctx, nx - 55, ny + 28, 110, 18, 5);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.title.slice(0, 16), nx, ny + 41);
    });
  }

  renderPlayer(ctx) {
    const px = this.player.x;
    const py = this.player.y;
    const stepOffset = this.player.isMoving ? Math.sin(this.player.walkFrame * Math.PI / 2) * 2 : 0;

    // Sombra del héroe
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(px, py + 14, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Capa / Mochila escolar de Manuel
    ctx.fillStyle = '#3b82f6';
    drawSafeRoundRect(ctx, px - 11, py - 4 + stepOffset, 22, 16, 4);
    ctx.fill();

    // Cabeza
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(px, py - 14 + stepOffset, 11, 0, Math.PI * 2);
    ctx.fill();

    // Cabello de Manuel
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(px, py - 18 + stepOffset, 12, Math.PI, 0);
    ctx.fill();

    // Ojos según dirección
    ctx.fillStyle = '#0f172a';
    if (this.player.direction === 'right') {
      ctx.fillRect(px + 2, py - 15 + stepOffset, 2, 3);
    } else if (this.player.direction === 'left') {
      ctx.fillRect(px - 4, py - 15 + stepOffset, 2, 3);
    } else if (this.player.direction === 'down') {
      ctx.fillRect(px - 3, py - 14 + stepOffset, 2, 3);
      ctx.fillRect(px + 2, py - 14 + stepOffset, 2, 3);
    }

    // Indicador del héroe activo ("Manuel Nv.X")
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 10px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🧑‍🎓 Manuel', px, py - 30 + stepOffset);
  }
}
