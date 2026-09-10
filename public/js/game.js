/**
 * game.js
 * Lógica principal del videojuego "Manuel: Guardián del Álgebra" (1° Medio Chile)
 * Integra el Modo Aventura RPG estilo Final Fantasy, Práctica Libre y SIMCE.
 */

import { sound } from './audio.js';
import { BalanceScale } from './balanceView.js';
import { AlgebraTilesVisualizer } from './algebraTiles.js';
import { getManuelAvatarSvg, getEnemyAvatarSvg, launchConfetti, renderDiploma } from './ui.js';
import { CURRICULUM_INFO, WORLDS, CHEATSHEET, ACHIEVEMENTS } from './curriculumData.js';
import { generateExercise, verifyAnswer } from './algebraEngine.js';
import { RPGEngine } from './rpgEngine.js';

class GameController {
  constructor() {
    // Datos curriculares inmediatos
    this.curriculumData = {
      curriculum: CURRICULUM_INFO,
      worlds: WORLDS,
      cheatsheet: CHEATSHEET,
      achievements: ACHIEVEMENTS
    };
    this.currentMode = 'menu'; // menu, story, practice, simce, rpg
    this.currentWorldIndex = 0;
    this.playerName = localStorage.getItem('manuel_player_name') || 'Manuel';
    
    // Estado de partida clásica
    this.score = 0;
    this.lives = 3;
    this.worldProgress = 0;
    this.currentExercise = null;
    this.enemyHp = 100;
    this.enemyMaxHp = 100;

    // Modo SIMCE
    this.simceQuestionCount = 0;
    this.simceMaxQuestions = 10;
    this.simceTimer = 0;
    this.simceInterval = null;

    // Componentes interactivos
    this.balanceScale = null;
    this.tilesVisualizer = null;

    // Motor de Aventura RPG estilo Final Fantasy
    this.rpgEngine = new RPGEngine(this);
    window.rpgEngine = this.rpgEngine;
  }

  async init() {
    this.setupDOMElements();
    this.bindEvents();
    this.populateCheatsheet(this.curriculumData.cheatsheet);
    this.renderManuelAvatars('normal');
    this.balanceScale = new BalanceScale(document.getElementById('balance-container'));
    this.tilesVisualizer = new AlgebraTilesVisualizer(document.getElementById('tiles-container'));
    
    // Inicializar Motor RPG
    this.rpgEngine.init();

    // Mostrar nombre del jugador en el HUD de la navbar
    const hudName = document.getElementById('user-hud-name');
    if (hudName) hudName.textContent = this.playerName;
    this.loadCurriculum();
  }

  setupDOMElements() {
    this.views = {
      menu: document.getElementById('view-menu'),
      game: document.getElementById('view-game'),
      practiceSelect: document.getElementById('view-practice-select'),
      cheatsheet: document.getElementById('view-cheatsheet'),
      leaderboard: document.getElementById('view-leaderboard'),
      rpgMap: document.getElementById('view-rpg-map'),
      rpgBattle: document.getElementById('view-rpg-battle'),
      rpgEvent: document.getElementById('view-rpg-event')
    };

    this.scoreEl = document.getElementById('stat-score');
    this.livesEl = document.getElementById('stat-lives');
    this.worldNameEl = document.getElementById('world-title');
    this.worldBadgeEl = document.getElementById('world-badge');
    this.progressBar = document.getElementById('game-progress-fill');
    this.dialogueText = document.getElementById('dialogue-content');
    this.dialogueSpeaker = document.getElementById('dialogue-speaker');
    this.formulaEl = document.getElementById('problem-formula');
    this.promptEl = document.getElementById('problem-prompt');
    this.optionsContainer = document.getElementById('options-grid');
    this.feedbackBox = document.getElementById('feedback-box');
    this.stepsList = document.getElementById('steps-list');
    this.nextBtn = document.getElementById('btn-next-exercise');
    this.enemyHpFill = document.getElementById('enemy-hp-fill');
    this.enemyNameEl = document.getElementById('enemy-name');
    this.enemySpriteWrap = document.getElementById('enemy-sprite-wrap');
    this.simceTimerEl = document.getElementById('simce-timer-display');
  }

  bindEvents() {
    // Modo Aventura RPG (Final Fantasy Style)
    const btnStartRpg = document.getElementById('btn-start-rpg');
    if (btnStartRpg) {
      btnStartRpg.addEventListener('click', () => {
        sound.playClick();
        this.currentMode = 'rpg';
        this.switchView('rpgMap');
      });
    }

    // Navegación del menú clásico
    document.getElementById('btn-start-story').addEventListener('click', () => {
      sound.playClick();
      this.startStoryMode();
    });

    document.getElementById('btn-start-practice').addEventListener('click', () => {
      sound.playClick();
      this.switchView('practiceSelect');
    });

    document.getElementById('btn-start-simce').addEventListener('click', () => {
      sound.playClick();
      this.startSimceMode();
    });

    document.getElementById('btn-show-cheatsheet').addEventListener('click', () => {
      sound.playClick();
      this.showCheatsheet();
    });

    document.getElementById('btn-show-leaderboard').addEventListener('click', () => {
      sound.playClick();
      this.showLeaderboard();
    });

    // Volver al menú
    document.querySelectorAll('.btn-back-menu').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        if (this.simceInterval) clearInterval(this.simceInterval);
        this.currentMode = 'menu';
        this.switchView('menu');
      });
    });

    // Siguiente ejercicio
    this.nextBtn.addEventListener('click', () => {
      sound.playClick();
      this.loadNextExercise(this.currentMode === 'practice' ? this.practiceTopic : null);
    });

    // Audio & BGM
    const btnMute = document.getElementById('btn-toggle-mute');
    btnMute.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      btnMute.innerHTML = isMuted ? '🔇' : '🔊';
    });

    const btnBgm = document.getElementById('btn-toggle-bgm');
    btnBgm.addEventListener('click', () => {
      const isPlaying = sound.toggleBgm();
      btnBgm.classList.toggle('active', isPlaying);
      btnBgm.title = isPlaying ? 'Música: Encendida' : 'Música: Apagada';
    });

    // Cierre de modales
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playClick();
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      });
    });

    // Modal diploma
    document.getElementById('btn-close-diploma').addEventListener('click', () => {
      document.getElementById('modal-diploma').classList.remove('active');
      this.switchView('menu');
    });

    // Descargar diploma
    document.getElementById('btn-download-diploma').addEventListener('click', () => {
      sound.playClick();
      const canvas = document.getElementById('diploma-canvas');
      const link = document.createElement('a');
      link.download = `Diploma_Matematicas_1Medio_${this.playerName}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });

    // Actualizar nombre en diploma
    const btnUpdateName = document.getElementById('btn-update-diploma-name');
    const inputDiplomaName = document.getElementById('input-diploma-name');
    if (btnUpdateName && inputDiplomaName) {
      btnUpdateName.addEventListener('click', () => {
        sound.playClick();
        const newName = inputDiplomaName.value.trim();
        if (newName) {
          this.playerName = newName;
          localStorage.setItem('manuel_player_name', newName);
          let medal = 'Bronce';
          if (this.score >= 1800) medal = 'Oro';
          else if (this.score >= 1200) medal = 'Plata';
          const canvas = document.getElementById('diploma-canvas');
          renderDiploma(canvas, this.playerName, this.score, medal);
        }
      });
    }

    // Selección de práctica por tema
    document.querySelectorAll('.practice-topic-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sound.playClick();
        const card = e.currentTarget;
        const topic = card.dataset.topic;
        this.startPracticeTopic(topic);
      });
    });

    // Botón directo de Balanza Algebraica Dinámica
    const btnBalance = document.getElementById('btn-start-balance');
    if (btnBalance) {
      btnBalance.addEventListener('click', () => {
        sound.playClick();
        this.startPracticeTopic('lineal_entera');
      });
    }

    // Botón del Footer para el Cuaderno
    const footerCheatsheet = document.getElementById('footer-btn-cheatsheet');
    if (footerCheatsheet) {
      footerCheatsheet.addEventListener('click', (e) => {
        e.preventDefault();
        sound.playClick();
        this.showCheatsheet();
      });
    }

    // Filtros Curriculares OA de 1° Medio
    document.querySelectorAll('.oa-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        sound.playClick();
        document.querySelectorAll('.oa-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const topic = btn.dataset.topic;
        if (topic === 'all') {
          this.switchView('practiceSelect');
        } else if (topic === 'balanza') {
          this.startPracticeTopic('lineal_entera');
        } else {
          this.startPracticeTopic(topic);
        }
      });
    });

    // Desafío Relámpago del Día
    const puzzleOptions = document.querySelectorAll('#puzzle-daily-options .puzzle-option-btn');
    const puzzleFeedback = document.getElementById('puzzle-daily-feedback');
    let puzzleSolved = false;

    puzzleOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        if (puzzleSolved) return;
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        puzzleOptions.forEach(b => b.classList.remove('correct', 'wrong'));
        
        if (isCorrect) {
          puzzleSolved = true;
          btn.classList.add('correct');
          sound.playCorrect();
          launchConfetti();
          this.score += 50;
          this.updateStats();
          if (puzzleFeedback) {
            puzzleFeedback.className = 'puzzle-feedback-msg success';
            puzzleFeedback.innerHTML = '<strong>¡Correcto! 🎉 (+50 XP)</strong> Al desarrollar: (4x² + 12x + 9) - (4x² - 12x + 9) = 12x - (-12x) = <strong>24x</strong>. ¡Excelente comprensión de los signos y binomios!';
          }
        } else {
          btn.classList.add('wrong');
          sound.playWrong();
          if (puzzleFeedback) {
            puzzleFeedback.className = 'puzzle-feedback-msg error';
            puzzleFeedback.innerHTML = '<strong>¡Cuidado con el signo menos!</strong> Recuerda que: -(4x² - 12x + 9) invierte todos los signos internos: -4x² + 12x - 9. Los términos cuadráticos y numéricos se anulan, sumando 12x + 12x = 24x.';
          }
        }
      });
    });

    // Botón de pista pedagógica
    document.getElementById('btn-show-hint').addEventListener('click', () => {
      sound.playClick();
      if (this.currentExercise && this.currentExercise.hint) {
        this.setDialogue('Manuel', `💡 PISTA: ${this.currentExercise.hint}`);
        this.renderManuelAvatars('thinking');
      }
    });
  }

  async loadCurriculum() {
    try {
      const res = await fetch('/api/curriculum');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.worlds) && data.worlds.length > 0) {
          this.curriculumData = data;
          this.populateCheatsheet(this.curriculumData.cheatsheet);
        }
      }
    } catch (err) {
      console.warn('Aviso: usando base curricular local incorporada.', err);
    }
  }

  switchView(viewName) {
    Object.keys(this.views).forEach(k => {
      if (this.views[k]) this.views[k].classList.remove('active');
    });
    if (this.views[viewName]) {
      this.views[viewName].classList.add('active');
    }
    this.currentView = viewName;

    // Control del bucle del Canvas del Mapa RPG
    if (viewName === 'rpgMap' && this.rpgEngine) {
      this.rpgEngine.startOverworldMap();
    } else if (this.rpgEngine && this.rpgEngine.mapCanvas) {
      this.rpgEngine.mapCanvas.stop();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderManuelAvatars(mood) {
    const svg = getManuelAvatarSvg(mood);
    const wraps = document.querySelectorAll('.manuel-avatar-wrap');
    wraps.forEach(w => {
      w.innerHTML = svg;
    });
  }

  setDialogue(speaker, text) {
    if (this.dialogueSpeaker) this.dialogueSpeaker.textContent = speaker;
    if (this.dialogueText) this.dialogueText.textContent = text;
  }

  updateStats() {
    if (this.scoreEl) this.scoreEl.textContent = this.score;
    if (this.livesEl) {
      let hearts = '';
      for (let i = 0; i < 3; i++) {
        hearts += i < this.lives ? '❤️' : '🖤';
      }
      this.livesEl.textContent = hearts;
    }
  }

  // -------------------------------------------------------------
  // MODO HISTORIA CLÁSICA
  // -------------------------------------------------------------
  startStoryMode() {
    this.currentMode = 'story';
    this.score = 0;
    this.lives = 3;
    this.currentWorldIndex = 0;
    this.simceTimerEl.style.display = 'none';
    this.startWorld(this.currentWorldIndex);
  }

  startWorld(worldIndex) {
    this.currentWorldIndex = worldIndex;
    const world = this.curriculumData.worlds[worldIndex];
    if (!world) {
      this.triggerGameVictory();
      return;
    }

    this.worldProgress = 0;
    this.enemyMaxHp = world.enemy.hp;
    this.enemyHp = world.enemy.hp;

    this.worldNameEl.textContent = world.name;
    this.worldBadgeEl.textContent = `Mundo ${world.number}/5 - 1° Medio`;
    this.enemyNameEl.textContent = world.enemy.name;
    this.enemySpriteWrap.innerHTML = getEnemyAvatarSvg(world.enemy.sprite);
    this.updateEnemyHp();

    this.setDialogue('Manuel', world.lore.intro);
    this.renderManuelAvatars('thinking');
    this.updateProgressBar(0, world.requiredCorrect);

    this.switchView('game');
    this.updateStats();
    this.loadNextExercise();
  }

  // -------------------------------------------------------------
  // MODO PRÁCTICA LIBRE
  // -------------------------------------------------------------
  startPracticeTopic(topic) {
    this.practiceTopic = topic;
    this.currentMode = 'practice';
    this.lives = 999;
    this.worldProgress = 0;
    this.simceTimerEl.style.display = 'none';

    const topicLabels = {
      cuadrado_binomio: 'Cuadrado de Binomio: (a ± b)²',
      suma_por_diferencia: 'Suma por Diferencia: (x + y)(x - y) = x² - y²',
      termino_comun: 'Binomio con Término Común: (x + a)(x + b)',
      cubo_binomio: 'Cubo de Binomio: (a ± b)³',
      factor_comun: 'Factor Común Monomio',
      trinomio: 'Factorización de Trinomios: x² + px + q',
      diferencia_cuadrados: 'Diferencia de Cuadrados: a² - b²',
      lineal_entera: 'Ecuaciones Lineales Enteras: ax + b = cx + d',
      lineal_parentesis: 'Ecuaciones con Paréntesis: a(x + b) = c',
      lineal_fraccionaria: 'Ecuaciones Fraccionarias: (x + a)/b = c',
      problema_planteo: 'Problemas de Planteo: Lenguaje Algebraico',
      terminos_semejantes: 'Reducción de Términos Semejantes',
      monomio_por_polinomio: 'Monomio por Polinomio',
      potencias_algebraicas: 'Propiedades de Potencias',
      fracciones_simplificacion: 'Fracciones Algebraicas (Simplificación)'
    };

    const displayTopic = topicLabels[topic] || (topic ? topic.replace(/_/g, ' ').toUpperCase() : 'ÁLGEBRA');
    this.worldNameEl.textContent = `Laboratorio: ${displayTopic}`;
    this.worldBadgeEl.textContent = `Práctica Libre 1° Medio`;
    this.enemyNameEl.textContent = `Objetivo de Entrenamiento`;
    this.enemySpriteWrap.innerHTML = getEnemyAvatarSvg('crystal');
    this.enemyMaxHp = 100;
    this.enemyHp = 100;
    this.updateEnemyHp();

    this.setDialogue('Manuel', `¡Excelente! En este laboratorio practicamos: ${displayTopic}. Tienes explicaciones paso a paso sin límite de vidas.`);
    this.renderManuelAvatars('normal');

    this.switchView('game');
    this.loadNextExercise(topic);
  }

  // -------------------------------------------------------------
  // MODO DESAFÍO CONTRARRELOJ (SIMCE 1° MEDIO)
  // -------------------------------------------------------------
  startSimceMode() {
    this.currentMode = 'simce';
    this.score = 0;
    this.lives = 3;
    this.simceQuestionCount = 0;
    this.simceTimer = 180;
    this.simceTimerEl.style.display = 'inline-flex';

    this.worldNameEl.textContent = "Desafío Contrarreloj 1° Medio (SIMCE)";
    this.worldBadgeEl.textContent = "Test Oficial Simulador";
    this.enemyNameEl.textContent = "Cronómetro & Precisión";
    this.enemySpriteWrap.innerHTML = getEnemyAvatarSvg('boss');

    if (this.simceInterval) clearInterval(this.simceInterval);
    this.simceInterval = setInterval(() => {
      this.simceTimer--;
      const min = Math.floor(this.simceTimer / 60);
      const sec = this.simceTimer % 60;
      this.simceTimerEl.textContent = `⏱️ ${min}:${sec < 10 ? '0' : ''}${sec}`;

      if (this.simceTimer <= 0) {
        clearInterval(this.simceInterval);
        this.finishSimceMode(false);
      }
    }, 1000);

    this.setDialogue('Manuel', '¡Modo Desafío activado! 10 preguntas con todo el álgebra de 1° Medio contra el reloj. ¡Concéntrate!');
    this.renderManuelAvatars('thinking');

    this.switchView('game');
    this.loadNextExercise();
  }

  finishSimceMode(cleared = true) {
    if (this.simceInterval) clearInterval(this.simceInterval);
    sound.playFanfare();
    launchConfetti();

    let medal = 'Bronce';
    if (this.score >= 1800) medal = 'Oro';
    else if (this.score >= 1200) medal = 'Plata';

    // Guardar puntuación
    fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player: this.playerName,
        score: this.score,
        world: 5
      })
    }).catch(() => {});

    const inputDiplomaName = document.getElementById('input-diploma-name');
    if (inputDiplomaName) {
      inputDiplomaName.value = this.playerName;
    }

    const canvas = document.getElementById('diploma-canvas');
    renderDiploma(canvas, this.playerName, this.score, medal);
    document.getElementById('modal-diploma').classList.add('active');
  }

  // -------------------------------------------------------------
  // CARGA Y VALIDACIÓN DE EJERCICIOS
  // -------------------------------------------------------------
  loadNextExercise(topicOverride = null) {
    this.feedbackBox.classList.remove('active');
    this.nextBtn.style.display = 'none';

    let topic = topicOverride;
    let level = 2;

    if (!topic) {
      if (this.currentMode === 'practice' && this.practiceTopic) {
        topic = this.practiceTopic;
        level = 2;
      } else if (this.currentMode === 'story') {
        const world = this.curriculumData.worlds[this.currentWorldIndex];
        topic = world.topic;
        level = this.currentWorldIndex >= 3 ? 2 : 1;
      } else if (this.currentMode === 'simce') {
        topic = 'simce_1medio';
        level = 2;
      } else if (this.practiceTopic) {
        topic = this.practiceTopic;
        level = 2;
      } else {
        topic = 'cuadrado_binomio';
        level = 1;
      }
    }

    try {
      const exercise = generateExercise(topic, level);
      this.renderExercise(exercise);
    } catch (err) {
      console.error('Error generando ejercicio localmente:', err);
      try {
        const fallbackEx = generateExercise('cuadrado_binomio', 1);
        this.renderExercise(fallbackEx);
      } catch (e2) {
        console.error('Error en fallback:', e2);
      }
    }
  }

  renderExercise(exercise) {
    this.currentExercise = exercise;
    this.promptEl.textContent = exercise.question;
    this.formulaEl.textContent = exercise.expression;

    if (exercise.balanceData) {
      this.balanceScale.render(exercise.balanceData);
      if (this.tilesVisualizer) this.tilesVisualizer.render(null);
    } else if (exercise.visualData) {
      this.tilesVisualizer.render(exercise.visualData);
      if (this.balanceScale) this.balanceScale.render(null);
    } else {
      if (this.balanceScale) this.balanceScale.render(null);
      if (this.tilesVisualizer) this.tilesVisualizer.render(null);
    }

    this.optionsContainer.innerHTML = '';
    exercise.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => this.handleAnswer(opt, btn));
      this.optionsContainer.appendChild(btn);
    });

    this.renderManuelAvatars('thinking');
  }

  handleAnswer(selectedOption, clickedButton) {
    const allButtons = this.optionsContainer.querySelectorAll('.option-btn');
    allButtons.forEach(b => b.disabled = true);

    try {
      const result = verifyAnswer(
        selectedOption,
        this.currentExercise.correctAnswer,
        this.currentExercise.numericAnswer ?? null
      );

      if (result && result.isCorrect) {
        this.onCorrectAnswer(clickedButton);
      } else {
        this.onWrongAnswer(clickedButton);
      }

      if (this.score > 0) {
        fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            player: this.playerName,
            score: this.score,
            world: this.currentWorldIndex + 1
          })
        }).catch(() => {});
      }
    } catch (err) {
      console.error('Error al verificar:', err);
      if (selectedOption === this.currentExercise.correctAnswer) {
        this.onCorrectAnswer(clickedButton);
      } else {
        this.onWrongAnswer(clickedButton);
      }
    }
  }

  onCorrectAnswer(button) {
    button.classList.add('correct');
    sound.playCorrect();
    sound.playAttack();
    this.renderManuelAvatars('happy');

    this.score += 100;
    this.updateStats();

    if (this.currentExercise.balanceData) {
      this.balanceScale.setBalancedState(true);
    }

    this.enemyHp = Math.max(0, this.enemyHp - 35);
    this.updateEnemyHp();

    if (this.enemyHp <= 0) {
      sound.playBossDamage();
    }

    this.setDialogue('Manuel', '¡Seco! ¡Respuesta correcta! Tu razonamiento algebraico fue impecable.');
    this.showFeedback(true);

    this.worldProgress++;
    if (this.currentMode === 'story') {
      const world = this.curriculumData.worlds[this.currentWorldIndex];
      this.updateProgressBar(this.worldProgress, world.requiredCorrect);

      if (this.worldProgress >= world.requiredCorrect) {
        setTimeout(() => this.worldCleared(world), 800);
        return;
      }
    } else if (this.currentMode === 'simce') {
      this.simceQuestionCount++;
      this.updateProgressBar(this.simceQuestionCount, this.simceMaxQuestions);
      if (this.simceQuestionCount >= this.simceMaxQuestions) {
        setTimeout(() => this.finishSimceMode(true), 800);
        return;
      }
    }

    this.nextBtn.style.display = 'inline-flex';
  }

  onWrongAnswer(button) {
    button.classList.add('wrong');
    sound.playWrong();
    this.renderManuelAvatars('hurt');

    const allButtons = this.optionsContainer.querySelectorAll('.option-btn');
    allButtons.forEach(b => {
      if (b.textContent === this.currentExercise.correctAnswer) {
        b.classList.add('correct');
      }
    });

    if (this.currentExercise.balanceData) {
      this.balanceScale.setBalancedState(false);
    }

    if (this.currentMode !== 'practice') {
      this.lives--;
      this.updateStats();
    }

    this.setDialogue('Manuel', '¡Pucha, no era esa! No te preocupes, revisa la explicación paso a paso para aprender el truco.');
    this.showFeedback(false);

    if (this.lives <= 0 && this.currentMode !== 'practice') {
      setTimeout(() => this.gameOver(), 1000);
      return;
    }

    this.nextBtn.style.display = 'inline-flex';
  }

  showFeedback(isSuccess) {
    this.feedbackBox.classList.add('active');
    const titleEl = document.getElementById('feedback-title');
    titleEl.textContent = isSuccess ? '✨ ¡Paso a Paso de la Solución!' : '📖 Revisión y Explicación Paso a Paso';
    titleEl.style.color = isSuccess ? '#34d399' : '#f87171';

    this.stepsList.innerHTML = '';
    (this.currentExercise.steps || []).forEach(step => {
      const li = document.createElement('li');
      li.textContent = step;
      this.stepsList.appendChild(li);
    });
  }

  updateEnemyHp() {
    const pct = Math.max(0, (this.enemyHp / this.enemyMaxHp) * 100);
    this.enemyHpFill.style.width = `${pct}%`;
    if (pct < 30) {
      this.enemyHpFill.style.background = '#ef4444';
    } else if (pct < 60) {
      this.enemyHpFill.style.background = '#f59e0b';
    } else {
      this.enemyHpFill.style.background = '#10b981';
    }
  }

  updateProgressBar(current, total) {
    const pct = Math.min(100, (current / total) * 100);
    this.progressBar.style.width = `${pct}%`;
  }

  worldCleared(world) {
    sound.playFanfare();
    launchConfetti();
    this.renderManuelAvatars('victory');
    this.setDialogue('Manuel', world.lore.cleared);

    setTimeout(() => {
      if (this.currentWorldIndex + 1 < this.curriculumData.worlds.length) {
        alert(`🎉 ¡Superaste ${world.name}! Pasamos al siguiente mundo.`);
        this.startWorld(this.currentWorldIndex + 1);
      } else {
        this.triggerGameVictory();
      }
    }, 1500);
  }

  triggerGameVictory() {
    sound.playFanfare();
    launchConfetti();
    alert(`🏆 ¡FELICITACIONES! Has completado la Odisea de Manuel y derrotado al Dr. Monomio.`);
    this.finishSimceMode(true);
  }

  gameOver() {
    sound.playWrong();
    alert(`💀 ¡Manuel ha perdido sus 3 vidas! La balanza cayó. Inténtalo de nuevo para repasar los contenidos de 1° Medio.`);
    this.switchView('menu');
  }

  // -------------------------------------------------------------
  // VISTA FORMULARIO
  // -------------------------------------------------------------
  showCheatsheet() {
    this.switchView('cheatsheet');
  }

  populateCheatsheet(sheets) {
    const grid = document.getElementById('cheatsheet-grid');
    if (!grid || !sheets) return;
    grid.innerHTML = '';

    sheets.forEach(s => {
      const card = document.createElement('div');
      card.className = 'sheet-card';
      card.innerHTML = `
        <h3>${s.titulo}</h3>
        <div class="sheet-formula">${s.formula}</div>
        <p style="font-size: 0.9rem; margin-bottom: 0.5rem; color: #e2e8f0;">${s.regla}</p>
        <div class="sheet-example"><strong>Ejemplo:</strong> ${s.ejemplo}</div>
      `;
      grid.appendChild(card);
    });
  }

  // -------------------------------------------------------------
  // VISTA LEADERBOARD
  // -------------------------------------------------------------
  async showLeaderboard() {
    this.switchView('leaderboard');
    try {
      const res = await fetch('/api/scores');
      const scores = await res.json();
      const tbody = document.getElementById('leaderboard-tbody');
      tbody.innerHTML = '';

      scores.forEach((s, idx) => {
        const tr = document.createElement('tr');
        const medalIcon = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '🎖️';
        tr.innerHTML = `
          <td><strong>${idx + 1}</strong> ${medalIcon}</td>
          <td>${s.player}</td>
          <td><span style="color: #34d399; font-weight: bold;">${s.score}</span> pts</td>
          <td>Mundo ${s.world}</td>
          <td><span class="curriculum-pill" style="padding: 2px 8px;">${s.medal}</span></td>
        `;
        tbody.appendChild(tr);
      });
    } catch (err) {
      console.error('Error cargando leaderboard:', err);
    }
  }
}

// Inicialización cuando carga el DOM
window.addEventListener('DOMContentLoaded', () => {
  const game = new GameController();
  game.init();
});
