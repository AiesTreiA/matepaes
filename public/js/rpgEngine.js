/**
 * rpgEngine.js
 * Motor de Aventura RPG: Las Crónicas del Álgebra (Estilo Final Fantasy)
 * Incluye Sistema de Mapas 2D Caminables, Combate por Turnos JRPG, Eventos de Mazmorra e Inventario.
 */

import { sound } from './audio.js';
import { RPG_HEROES, RPG_WORLDS, RPG_ITEMS } from './rpgData.js';
import { getHeroAvatarSvg, getEnemyAvatarSvg, createFloatingCombatText, launchConfetti } from './ui.js';
import { generateExercise, verifyAnswer } from './algebraEngine.js';
import { OverworldMapCanvas } from './rpgWorldMap.js';

export class RPGEngine {
  constructor(gameController) {
    this.game = gameController;
    this.worlds = RPG_WORLDS;
    this.currentWorldIndex = 0;
    this.currentNode = null;
    this.mapCanvas = null;

    // Estado del Jugador / Party
    this.party = JSON.parse(JSON.stringify(RPG_HEROES));
    this.gold = 100;
    this.inventory = [
      { id: 'pocion_hp', count: 3 },
      { id: 'elixir_mp', count: 2 },
      { id: 'pergamino_pista', count: 1 }
    ];
    this.unlockedNodes = new Set(['node_1_1']);
    this.completedNodes = new Set();
    this.nodeStars = {};

    // Estado de Combate
    this.inBattle = false;
    this.currentEnemy = null;
    this.activeHeroIndex = 0;
    this.battleExercise = null;
    this.pendingAction = null;
    this.heroDefending = [false, false, false];

    // Cargar partida guardada si existe
    this.loadSavedState();
  }

  // -------------------------------------------------------------
  // PERSISTENCIA (LOCAL STORAGE)
  // -------------------------------------------------------------
  saveState() {
    try {
      const state = {
        party: this.party,
        gold: this.gold,
        inventory: this.inventory,
        unlockedNodes: Array.from(this.unlockedNodes),
        completedNodes: Array.from(this.completedNodes),
        nodeStars: this.nodeStars,
        currentWorldIndex: this.currentWorldIndex
      };
      localStorage.setItem('manuel_rpg_save_v1', JSON.stringify(state));
    } catch (e) {
      console.warn('No se pudo guardar la partida RPG:', e);
    }
  }

  loadSavedState() {
    try {
      const saved = localStorage.getItem('manuel_rpg_save_v1');
      if (saved) {
        const state = JSON.parse(saved);
        if (state.party && Array.isArray(state.party)) this.party = state.party;
        if (typeof state.gold === 'number') this.gold = state.gold;
        if (Array.isArray(state.inventory)) this.inventory = state.inventory;
        if (Array.isArray(state.unlockedNodes)) this.unlockedNodes = new Set(state.unlockedNodes);
        if (Array.isArray(state.completedNodes)) this.completedNodes = new Set(state.completedNodes);
        if (state.nodeStars) this.nodeStars = state.nodeStars;
        if (typeof state.currentWorldIndex === 'number') this.currentWorldIndex = state.currentWorldIndex;
      }
    } catch (e) {
      console.warn('No se pudo cargar la partida RPG:', e);
    }
  }

  resetSave() {
    this.party = JSON.parse(JSON.stringify(RPG_HEROES));
    this.gold = 100;
    this.inventory = [
      { id: 'pocion_hp', count: 3 },
      { id: 'elixir_mp', count: 2 },
      { id: 'pergamino_pista', count: 1 }
    ];
    this.unlockedNodes = new Set(['node_1_1']);
    this.completedNodes = new Set();
    this.nodeStars = {};
    this.currentWorldIndex = 0;
    this.saveState();
  }

  // -------------------------------------------------------------
  // INICIALIZACIÓN Y VISTAS
  // -------------------------------------------------------------
  init() {
    this.bindEvents();
    const canvasEl = document.getElementById('rpg-overworld-canvas');
    if (canvasEl) {
      this.mapCanvas = new OverworldMapCanvas(canvasEl, this);
    }
    this.renderWorldSelector();
    this.updateHUD();
  }

  bindEvents() {
    // Botones de cambio de mundo en el mapa
    const prevWorldBtn = document.getElementById('rpg-prev-world');
    const nextWorldBtn = document.getElementById('rpg-next-world');
    if (prevWorldBtn) {
      prevWorldBtn.addEventListener('click', () => {
        sound.playClick();
        if (this.currentWorldIndex > 0) {
          this.currentWorldIndex--;
          this.renderWorldSelector();
          this.saveState();
        }
      });
    }
    if (nextWorldBtn) {
      nextWorldBtn.addEventListener('click', () => {
        sound.playClick();
        if (this.currentWorldIndex < this.worlds.length - 1) {
          this.currentWorldIndex++;
          this.renderWorldSelector();
          this.saveState();
        }
      });
    }

    // Botón de menú de Party / Inventario
    const btnPartyMenu = document.getElementById('btn-rpg-party');
    if (btnPartyMenu) {
      btnPartyMenu.addEventListener('click', () => {
        sound.playClick();
        this.openPartyModal();
      });
    }

    // Botones del Menú de Comandos en Batalla JRPG
    const btnCmdAttack = document.getElementById('btn-cmd-attack');
    const btnCmdSkill = document.getElementById('btn-cmd-skill');
    const btnCmdDefend = document.getElementById('btn-cmd-defend');
    const btnCmdItem = document.getElementById('btn-cmd-item');

    if (btnCmdAttack) {
      btnCmdAttack.addEventListener('click', () => {
        sound.playClick();
        this.prepareAttackCommand();
      });
    }
    if (btnCmdSkill) {
      btnCmdSkill.addEventListener('click', () => {
        sound.playClick();
        this.showSkillsSubmenu();
      });
    }
    if (btnCmdDefend) {
      btnCmdDefend.addEventListener('click', () => {
        sound.playClick();
        this.prepareDefendCommand();
      });
    }
    if (btnCmdItem) {
      btnCmdItem.addEventListener('click', () => {
        sound.playClick();
        this.showItemsSubmenu();
      });
    }

    // Botón de huir / salir de batalla
    const btnBattleFlee = document.getElementById('btn-battle-flee');
    if (btnBattleFlee) {
      btnBattleFlee.addEventListener('click', () => {
        sound.playClick();
        if (confirm('¿Deseas retirarte de la batalla y regresar al mapa?')) {
          this.exitBattle();
        }
      });
    }
  }

  updateHUD() {
    const goldEl = document.getElementById('rpg-stat-gold');
    if (goldEl) goldEl.textContent = `${this.gold} 🪙`;
    const partyLvlEl = document.getElementById('rpg-stat-party-level');
    if (partyLvlEl && this.party[0]) {
      partyLvlEl.textContent = `Nv. ${this.party[0].level} Héroe`;
    }
  }

  // -------------------------------------------------------------
  // MAPA DE MUNDOS Y SELECCIÓN
  // -------------------------------------------------------------
  renderWorldSelector() {
    const world = this.worlds[this.currentWorldIndex];
    const worldTitle = document.getElementById('rpg-world-title');
    const worldSubtitle = document.getElementById('rpg-world-subtitle');
    const prevBtn = document.getElementById('rpg-prev-world');
    const nextBtn = document.getElementById('rpg-next-world');

    if (worldTitle) worldTitle.innerHTML = `${world.icon} Mundo ${world.worldNumber}: <span>${world.name}</span>`;
    if (worldSubtitle) worldSubtitle.textContent = world.subtitle;

    if (prevBtn) prevBtn.disabled = this.currentWorldIndex === 0;
    if (nextBtn) nextBtn.disabled = this.currentWorldIndex === this.worlds.length - 1;
  }

  startOverworldMap() {
    this.renderWorldSelector();
    this.updateHUD();
    if (!this.mapCanvas) {
      const canvasEl = document.getElementById('rpg-overworld-canvas');
      if (canvasEl) {
        this.mapCanvas = new OverworldMapCanvas(canvasEl, this);
      }
    }
    if (this.mapCanvas) {
      this.mapCanvas.start();
    }
  }

  renderOverworldMap() {
    this.startOverworldMap();
  }

  interactWithNode(node) {
    this.currentNode = node;
    if (node.type === 'battle' || node.type === 'boss') {
      this.startBattle(node);
    } else if (node.type === 'door') {
      this.startDoorEvent(node);
    } else if (node.type === 'chest') {
      this.startChestEvent(node);
    } else if (node.type === 'shrine') {
      this.triggerShrineEvent(node);
    }
  }

  // -------------------------------------------------------------
  // SISTEMA DE COMBATE POR TURNOS ESTILO FINAL FANTASY
  // -------------------------------------------------------------
  startBattle(node) {
    this.inBattle = true;
    if (this.mapCanvas) this.mapCanvas.stop();

    sound.playBattleStart();
    this.currentEnemy = JSON.parse(JSON.stringify(node.enemy));
    this.activeHeroIndex = this.getFirstAliveHeroIndex();
    this.heroDefending = [false, false, false];

    // Cambiar a vista de combate
    this.game.switchView('rpgBattle');

    // Configurar información de batalla
    const enemyNameEl = document.getElementById('rpg-enemy-name');
    const enemySpriteEl = document.getElementById('rpg-enemy-sprite');
    if (enemyNameEl) enemyNameEl.textContent = this.currentEnemy.name;
    if (enemySpriteEl) {
      enemySpriteEl.innerHTML = getEnemyAvatarSvg(this.currentEnemy.sprite);
    }

    this.updateBattleUI();
    this.setBattleLog(`¡Apareció ${this.currentEnemy.name}! ¡Prepárate para combatir aplicando álgebra!`);
    this.showCommandWindow();
  }

  getFirstAliveHeroIndex() {
    const idx = this.party.findIndex(h => h.hp > 0);
    return idx !== -1 ? idx : 0;
  }

  updateBattleUI() {
    // Actualizar barras de HP/MP del Enemigo
    if (this.currentEnemy) {
      const enemyHpFill = document.getElementById('rpg-enemy-hp-fill');
      const enemyHpText = document.getElementById('rpg-enemy-hp-text');
      const pct = Math.max(0, (this.currentEnemy.hp / this.currentEnemy.maxHp) * 100);
      if (enemyHpFill) {
        enemyHpFill.style.width = `${pct}%`;
        enemyHpFill.style.background = pct < 30 ? '#ef4444' : pct < 60 ? '#f59e0b' : '#10b981';
      }
      if (enemyHpText) {
        enemyHpText.textContent = `${this.currentEnemy.hp} / ${this.currentEnemy.maxHp} HP`;
      }
    }

    // Actualizar Party de Héroes
    const partyContainer = document.getElementById('rpg-battle-party-cards');
    if (!partyContainer) return;

    partyContainer.innerHTML = '';
    this.party.forEach((hero, idx) => {
      const isTurn = idx === this.activeHeroIndex;
      const isDead = hero.hp <= 0;
      const card = document.createElement('div');
      card.className = `rpg-hero-battle-card ${isTurn ? 'active-turn' : ''} ${isDead ? 'dead' : ''}`;

      const hpPct = Math.max(0, (hero.hp / hero.maxHp) * 100);
      const mpPct = Math.max(0, (hero.mp / hero.maxMp) * 100);

      card.innerHTML = `
        <div class="hero-battle-avatar-wrap">
          ${getHeroAvatarSvg(hero.id, isDead ? 'hurt' : isTurn ? 'thinking' : 'normal')}
        </div>
        <div class="hero-battle-info">
          <div class="hero-battle-name-row">
            <strong>${hero.name}</strong>
            <span class="hero-role-tag">${hero.role.split('/')[0]}</span>
          </div>
          <div class="hero-bars">
            <div class="mini-bar-row">
              <span class="bar-lbl">HP</span>
              <div class="mini-bar-track"><div class="mini-bar-fill hp" style="width: ${hpPct}%;"></div></div>
              <span class="bar-val">${hero.hp}/${hero.maxHp}</span>
            </div>
            <div class="mini-bar-row">
              <span class="bar-lbl">MP</span>
              <div class="mini-bar-track"><div class="mini-bar-fill mp" style="width: ${mpPct}%;"></div></div>
              <span class="bar-val">${hero.mp}/${hero.maxMp}</span>
            </div>
          </div>
        </div>
      `;
      partyContainer.appendChild(card);
    });
  }

  setBattleLog(msg) {
    const logEl = document.getElementById('rpg-battle-log-text');
    if (logEl) logEl.textContent = msg;
  }

  showCommandWindow() {
    const cmdWindow = document.getElementById('rpg-battle-commands');
    const skillWindow = document.getElementById('rpg-battle-skills-sub');
    const itemWindow = document.getElementById('rpg-battle-items-sub');
    const exerciseWindow = document.getElementById('rpg-battle-exercise-panel');

    if (cmdWindow) cmdWindow.style.display = 'grid';
    if (skillWindow) skillWindow.style.display = 'none';
    if (itemWindow) itemWindow.style.display = 'none';
    if (exerciseWindow) exerciseWindow.style.display = 'none';

    const activeHero = this.party[this.activeHeroIndex];
    if (activeHero) {
      this.setBattleLog(`Turno de ${activeHero.name} (${activeHero.title}). Selecciona una acción:`);
    }
  }

  prepareAttackCommand() {
    const activeHero = this.party[this.activeHeroIndex];
    this.pendingAction = {
      type: 'attack',
      hero: activeHero,
      damageMultiplier: 1.0,
      topic: this.currentNode.topic || 'terminos_semejantes'
    };
    this.launchBattleExercise(`Ataque Físico: Canaliza el golpe de ${activeHero.name}`, this.pendingAction.topic);
  }

  showSkillsSubmenu() {
    const activeHero = this.party[this.activeHeroIndex];
    const cmdWindow = document.getElementById('rpg-battle-commands');
    const skillWindow = document.getElementById('rpg-battle-skills-sub');
    const skillsList = document.getElementById('rpg-skills-list');

    if (cmdWindow) cmdWindow.style.display = 'none';
    if (skillWindow) skillWindow.style.display = 'block';
    if (!skillsList) return;

    skillsList.innerHTML = '';
    activeHero.skills.forEach(skill => {
      const btn = document.createElement('button');
      btn.className = 'rpg-skill-btn';
      const canCast = activeHero.mp >= skill.mpCost;
      btn.disabled = !canCast;

      btn.innerHTML = `
        <div class="skill-name-row">
          <strong>${skill.name}</strong>
          <span class="skill-cost">${skill.mpCost} MP</span>
        </div>
        <div class="skill-desc">${skill.description}</div>
      `;

      btn.addEventListener('click', () => {
        sound.playClick();
        activeHero.mp -= skill.mpCost;
        this.pendingAction = {
          type: 'skill',
          hero: activeHero,
          skillData: skill,
          damageMultiplier: skill.damageMultiplier,
          healAmount: skill.healAmount || 0,
          topic: skill.topic
        };
        this.launchBattleExercise(`Habilidad Mágica: ${skill.name}`, skill.topic);
      });

      skillsList.appendChild(btn);
    });

    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.style.marginTop = '0.5rem';
    backBtn.textContent = '⬅️ Volver a Comandos';
    backBtn.addEventListener('click', () => {
      sound.playClick();
      this.showCommandWindow();
    });
    skillsList.appendChild(backBtn);
  }

  prepareDefendCommand() {
    const activeHero = this.party[this.activeHeroIndex];
    this.heroDefending[this.activeHeroIndex] = true;
    activeHero.mp = Math.min(activeHero.maxMp, activeHero.mp + 15);
    sound.playDefend();

    this.pendingAction = {
      type: 'defend',
      hero: activeHero,
      topic: 'terminos_semejantes'
    };
    this.launchBattleExercise(`Postura Defensiva: Concéntrate para restaurar MP y mitigar el daño`, 'terminos_semejantes');
  }

  showItemsSubmenu() {
    const cmdWindow = document.getElementById('rpg-battle-commands');
    const itemWindow = document.getElementById('rpg-battle-items-sub');
    const itemsList = document.getElementById('rpg-items-list');

    if (cmdWindow) cmdWindow.style.display = 'none';
    if (itemWindow) itemWindow.style.display = 'block';
    if (!itemsList) return;

    itemsList.innerHTML = '';
    const availableItems = this.inventory.filter(i => i.count > 0);

    if (availableItems.length === 0) {
      itemsList.innerHTML = '<p style="color: var(--text-muted); padding: 0.5rem;">No tienes objetos en la bolsa.</p>';
    } else {
      availableItems.forEach(itemEntry => {
        const itemInfo = RPG_ITEMS.find(i => i.id === itemEntry.id);
        if (!itemInfo) return;

        const btn = document.createElement('button');
        btn.className = 'rpg-skill-btn';
        btn.innerHTML = `
          <div class="skill-name-row">
            <strong>${itemInfo.icon} ${itemInfo.name}</strong>
            <span class="skill-cost">x${itemEntry.count}</span>
          </div>
          <div class="skill-desc">${itemInfo.effect}</div>
        `;

        btn.addEventListener('click', () => {
          sound.playClick();
          this.useItemInBattle(itemInfo, itemEntry);
        });

        itemsList.appendChild(btn);
      });
    }

    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.style.marginTop = '0.5rem';
    backBtn.textContent = '⬅️ Volver a Comandos';
    backBtn.addEventListener('click', () => {
      sound.playClick();
      this.showCommandWindow();
    });
    itemsList.appendChild(backBtn);
  }

  useItemInBattle(itemInfo, itemEntry) {
    const activeHero = this.party[this.activeHeroIndex];
    itemEntry.count--;
    sound.playItemUse();

    if (itemInfo.id === 'pocion_hp') {
      activeHero.hp = Math.min(activeHero.maxHp, activeHero.hp + itemInfo.value);
      createFloatingCombatText(document.querySelector('.rpg-hero-battle-card.active-turn'), `+${itemInfo.value} HP!`, 'heal');
      this.setBattleLog(`¡${activeHero.name} bebió una ${itemInfo.name} y recuperó ${itemInfo.value} HP!`);
    } else if (itemInfo.id === 'elixir_mp') {
      activeHero.mp = Math.min(activeHero.maxMp, activeHero.mp + itemInfo.value);
      createFloatingCombatText(document.querySelector('.rpg-hero-battle-card.active-turn'), `+${itemInfo.value} MP!`, 'heal');
      this.setBattleLog(`¡${activeHero.name} bebió un ${itemInfo.name} y recuperó ${itemInfo.value} MP!`);
    } else if (itemInfo.id === 'pergamino_pista') {
      this.setBattleLog(`¡Pergamino leído! Obtendrás pistas directas para los siguientes desafíos.`);
    }

    this.updateBattleUI();
    this.saveState();
    setTimeout(() => this.passTurnToNext(), 900);
  }

  launchBattleExercise(actionTitle, topic) {
    const exerciseWindow = document.getElementById('rpg-battle-exercise-panel');
    const titleEl = document.getElementById('rpg-exercise-title');
    const promptEl = document.getElementById('rpg-exercise-prompt');
    const formulaEl = document.getElementById('rpg-exercise-formula');
    const optionsContainer = document.getElementById('rpg-exercise-options');
    const feedbackEl = document.getElementById('rpg-exercise-feedback');

    if (titleEl) titleEl.textContent = actionTitle;
    if (feedbackEl) feedbackEl.innerHTML = '';

    const exercise = generateExercise(topic, 2);
    this.battleExercise = exercise;

    if (promptEl) promptEl.textContent = exercise.question;
    if (formulaEl) formulaEl.textContent = exercise.expression;

    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      exercise.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn rpg-opt-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => this.handleBattleAnswer(opt, btn));
        optionsContainer.appendChild(btn);
      });
    }

    if (exerciseWindow) exerciseWindow.style.display = 'block';
  }

  handleBattleAnswer(selectedOption, button) {
    const allButtons = document.querySelectorAll('.rpg-opt-btn');
    allButtons.forEach(b => b.disabled = true);

    const result = verifyAnswer(
      selectedOption,
      this.battleExercise.correctAnswer,
      this.battleExercise.numericAnswer ?? null
    );

    const isCorrect = result && result.isCorrect;
    const enemyWrap = document.getElementById('rpg-enemy-sprite');
    const feedbackEl = document.getElementById('rpg-exercise-feedback');

    if (isCorrect) {
      button.classList.add('correct');
      sound.playCorrect();

      const activeHero = this.party[this.activeHeroIndex];
      const isSkill = this.pendingAction.type === 'skill';

      if (isSkill) {
        sound.playMagicCast();
      } else if (this.pendingAction.type === 'attack') {
        sound.playSwordSlash();
      }

      const baseAtk = activeHero.attack + activeHero.level * 4;
      const rawDamage = Math.floor(baseAtk * (this.pendingAction.damageMultiplier || 1.0));
      const isCritical = Math.random() < 0.25;
      const finalDamage = isCritical ? Math.floor(rawDamage * 1.5) : rawDamage;

      this.currentEnemy.hp = Math.max(0, this.currentEnemy.hp - finalDamage);

      if (this.pendingAction.healAmount > 0) {
        activeHero.hp = Math.min(activeHero.maxHp, activeHero.hp + this.pendingAction.healAmount);
        createFloatingCombatText(document.querySelector('.rpg-hero-battle-card.active-turn'), `+${this.pendingAction.healAmount} HP!`, 'heal');
      }

      createFloatingCombatText(
        enemyWrap,
        `-${finalDamage} HP! ${isCritical ? '🔥 ¡CRÍTICO!' : ''}`,
        isCritical ? 'critical' : 'damage'
      );

      this.setBattleLog(`¡Excelente cálculo! ${activeHero.name} inflige ${finalDamage} de daño a ${this.currentEnemy.name}.`);
      this.updateBattleUI();

      setTimeout(() => {
        const exerciseWindow = document.getElementById('rpg-battle-exercise-panel');
        if (exerciseWindow) exerciseWindow.style.display = 'none';

        if (this.currentEnemy.hp <= 0) {
          this.handleEnemyDefeated();
        } else {
          this.passTurnToNext();
        }
      }, 1000);

    } else {
      button.classList.add('wrong');
      sound.playWrong();

      allButtons.forEach(b => {
        if (b.textContent === this.battleExercise.correctAnswer) b.classList.add('correct');
      });

      if (feedbackEl) {
        feedbackEl.innerHTML = `
          <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 0.6rem; margin-top: 0.6rem; font-size: 0.85rem; color: #fca5a5;">
            <strong>¡Respuesta Incorrecta!</strong> Solución correcta: <em>${this.battleExercise.correctAnswer}</em><br>
            ${(this.battleExercise.steps || []).join(' → ')}
          </div>
        `;
      }

      this.setBattleLog(`¡El cálculo falló! ${this.currentEnemy.name} aprovecha para contraatacar.`);

      setTimeout(() => {
        const exerciseWindow = document.getElementById('rpg-battle-exercise-panel');
        if (exerciseWindow) exerciseWindow.style.display = 'none';
        this.enemyCounterAttack();
      }, 1800);
    }
  }

  enemyCounterAttack() {
    const activeHero = this.party[this.activeHeroIndex];
    const isDefending = this.heroDefending[this.activeHeroIndex];
    sound.playBossDamage();

    const enemyAtk = this.currentEnemy.attack || 15;
    const mitigatedAtk = isDefending ? Math.floor(enemyAtk * 0.5) : enemyAtk;
    const finalDamage = Math.max(5, mitigatedAtk - Math.floor(activeHero.defense / 2));

    activeHero.hp = Math.max(0, activeHero.hp - finalDamage);
    const heroCard = document.querySelector('.rpg-hero-battle-card.active-turn');
    createFloatingCombatText(heroCard, `-${finalDamage} HP`, 'hero-damage');

    this.setBattleLog(`¡${this.currentEnemy.name} ataca a ${activeHero.name} causando ${finalDamage} de daño!`);
    this.updateBattleUI();

    const partyAlive = this.party.some(h => h.hp > 0);
    if (!partyAlive) {
      setTimeout(() => this.handlePartyDefeated(), 1200);
    } else {
      setTimeout(() => this.passTurnToNext(), 1200);
    }
  }

  passTurnToNext() {
    let nextIdx = (this.activeHeroIndex + 1) % this.party.length;
    let loops = 0;
    while (this.party[nextIdx].hp <= 0 && loops < this.party.length) {
      nextIdx = (nextIdx + 1) % this.party.length;
      loops++;
    }

    this.activeHeroIndex = nextIdx;
    this.heroDefending[this.activeHeroIndex] = false;
    this.updateBattleUI();
    this.showCommandWindow();
  }

  handleEnemyDefeated() {
    sound.playFanfare();
    launchConfetti();
    this.inBattle = false;

    const xpGained = this.currentEnemy.xpReward || 100;
    const goldGained = this.currentEnemy.goldReward || 50;
    this.gold += goldGained;

    let levelUpMsg = '';
    this.party.forEach(hero => {
      if (hero.hp > 0) {
        hero.hp = Math.min(hero.maxHp, hero.hp + 20);
      }
      hero.attack += 1;
      hero.maxHp += 10;
      hero.maxMp += 5;
      hero.level += 1;
      levelUpMsg += ` ¡${hero.name} subió a Nivel ${hero.level}!`;
    });
    sound.playLevelUp();

    this.completedNodes.add(this.currentNode.id);
    this.nodeStars[this.currentNode.id] = 3;
    (this.currentNode.nextNodes || []).forEach(nextId => {
      this.unlockedNodes.add(nextId);
    });

    this.saveState();
    this.updateHUD();

    alert(`🎉 ¡VICTORIA TOTAL!\n\nDerrotaste a ${this.currentEnemy.name}.\nRecompensas: +${xpGained} XP y +${goldGained} 🪙.${levelUpMsg}`);
    this.exitBattle();
  }

  handlePartyDefeated() {
    sound.playWrong();
    alert('💀 ¡Toda tu Party ha caído en combate! Manuel y sus amigos descansan en el santuario para recuperar energías.');
    this.party.forEach(h => {
      h.hp = Math.floor(h.maxHp * 0.5);
      h.mp = Math.floor(h.maxMp * 0.5);
    });
    this.saveState();
    this.exitBattle();
  }

  exitBattle() {
    this.inBattle = false;
    this.game.switchView('rpgMap');
    if (this.mapCanvas) this.mapCanvas.start();
    this.updateHUD();
  }

  // -------------------------------------------------------------
  // EVENTOS DE MAZMORRA: PUERTAS Y COFRES
  // -------------------------------------------------------------
  startDoorEvent(node) {
    const isCompleted = this.completedNodes.has(node.id);
    if (isCompleted) {
      alert(`🚪 El portón "${node.title}" ya está abierto de par en par. ¡Puedes pasar libremente!`);
      return;
    }

    if (this.mapCanvas) this.mapCanvas.stop();
    this.game.switchView('rpgEvent');

    const modalTitle = document.getElementById('rpg-event-title');
    const modalDesc = document.getElementById('rpg-event-desc');
    const modalIcon = document.getElementById('rpg-event-icon');
    const exerciseBox = document.getElementById('rpg-event-exercise');

    if (modalTitle) modalTitle.textContent = `🚪 ${node.title}`;
    if (modalDesc) modalDesc.textContent = node.puzzleDescription;
    if (modalIcon) modalIcon.textContent = '🔒';

    const exercise = generateExercise(node.topic || 'terminos_semejantes', 2);
    if (exerciseBox) {
      exerciseBox.innerHTML = `
        <div style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">${exercise.question}</div>
        <div class="problem-formula" style="font-size: 1.4rem; margin-bottom: 1.2rem;">${exercise.expression}</div>
        <div class="options-grid" id="rpg-door-options"></div>
        <div id="rpg-door-feedback" style="margin-top: 1rem;"></div>
      `;

      const optGrid = document.getElementById('rpg-door-options');
      exercise.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
          const res = verifyAnswer(opt, exercise.correctAnswer, exercise.numericAnswer ?? null);
          if (res && res.isCorrect) {
            btn.classList.add('correct');
            sound.playDoorUnlock();
            launchConfetti();
            if (modalIcon) modalIcon.textContent = '🔓✨';
            document.getElementById('rpg-door-feedback').innerHTML = `
              <div style="color: #34d399; font-weight: 800; font-size: 1.1rem;">
                ¡Sello mágico desactivado! Los engranajes giran y el portón se abre.
              </div>
            `;

            this.completedNodes.add(node.id);
            this.nodeStars[node.id] = 3;
            (node.nextNodes || []).forEach(nextId => this.unlockedNodes.add(nextId));
            this.saveState();

            setTimeout(() => {
              this.exitBattle();
            }, 1600);
          } else {
            btn.classList.add('wrong');
            sound.playWrong();
            document.getElementById('rpg-door-feedback').innerHTML = `
              <div style="color: #f87171; font-weight: 700;">
                El mecanismo rechina: la combinación es incorrecta. Inténtalo de nuevo.
              </div>
            `;
          }
        });
        optGrid.appendChild(btn);
      });
    }
  }

  startChestEvent(node) {
    const isCompleted = this.completedNodes.has(node.id);
    if (isCompleted) {
      alert(`📦 Este cofre ya fue saqueado. ¡Obtuviste todo su contenido!`);
      return;
    }

    if (this.mapCanvas) this.mapCanvas.stop();
    this.game.switchView('rpgEvent');

    const modalTitle = document.getElementById('rpg-event-title');
    const modalDesc = document.getElementById('rpg-event-desc');
    const modalIcon = document.getElementById('rpg-event-icon');
    const exerciseBox = document.getElementById('rpg-event-exercise');

    if (modalTitle) modalTitle.textContent = `📦 ${node.title}`;
    if (modalDesc) modalDesc.textContent = node.puzzleDescription;
    if (modalIcon) modalIcon.textContent = '🎁';

    const exercise = generateExercise(node.topic || 'factor_comun', 2);
    if (exerciseBox) {
      exerciseBox.innerHTML = `
        <div style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem;">${exercise.question}</div>
        <div class="problem-formula" style="font-size: 1.4rem; margin-bottom: 1.2rem;">${exercise.expression}</div>
        <div class="options-grid" id="rpg-chest-options"></div>
        <div id="rpg-chest-feedback" style="margin-top: 1rem;"></div>
      `;

      const optGrid = document.getElementById('rpg-chest-options');
      exercise.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => {
          const res = verifyAnswer(opt, exercise.correctAnswer, exercise.numericAnswer ?? null);
          if (res && res.isCorrect) {
            btn.classList.add('correct');
            sound.playChestOpen();
            launchConfetti();
            if (modalIcon) modalIcon.textContent = '✨💎📦';

            const rewards = node.rewards || { gold: 100, items: ['pocion_hp'] };
            this.gold += rewards.gold || 0;
            (rewards.items || []).forEach(itemId => {
              const entry = this.inventory.find(i => i.id === itemId);
              if (entry) entry.count++;
              else this.inventory.push({ id: itemId, count: 1 });
            });

            document.getElementById('rpg-chest-feedback').innerHTML = `
              <div style="color: #fbbf24; font-weight: 800; font-size: 1.15rem;">
                ¡Cofre abierto! 🎉 Recibiste +${rewards.gold} 🪙 y ${rewards.items.join(', ')}.
              </div>
            `;

            this.completedNodes.add(node.id);
            this.nodeStars[node.id] = 3;
            (node.nextNodes || []).forEach(nextId => this.unlockedNodes.add(nextId));
            this.saveState();
            this.updateHUD();

            setTimeout(() => {
              this.exitBattle();
            }, 1800);
          } else {
            btn.classList.add('wrong');
            sound.playWrong();
            document.getElementById('rpg-chest-feedback').innerHTML = `
              <div style="color: #f87171; font-weight: 700;">
                ¡La cerradura mágica no cede! Revisa la factorización.
              </div>
            `;
          }
        });
        optGrid.appendChild(btn);
      });
    }
  }

  triggerShrineEvent(node) {
    sound.playCorrect();
    this.party.forEach(hero => {
      hero.hp = hero.maxHp;
      hero.mp = hero.maxMp;
    });

    this.completedNodes.add(node.id);
    this.nodeStars[node.id] = 3;
    (node.nextNodes || []).forEach(nextId => this.unlockedNodes.add(nextId));
    this.saveState();
    alert(`⛲ ¡Santuario de Sabiduría activado!\n\n${node.loreTip}\n\n✨ Toda la Party ha recuperado su HP y MP al 100%.`);
  }

  // -------------------------------------------------------------
  // MODAL DE PARTY, EQUIPAMIENTO E INVENTARIO
  // -------------------------------------------------------------
  openPartyModal() {
    const modal = document.getElementById('modal-rpg-party');
    if (!modal) return;

    const heroesContainer = document.getElementById('rpg-party-heroes-list');
    const inventoryContainer = document.getElementById('rpg-party-inventory-list');
    const goldText = document.getElementById('rpg-party-gold-text');

    if (goldText) goldText.textContent = `${this.gold} 🪙 Monedas del Reino`;

    if (heroesContainer) {
      heroesContainer.innerHTML = '';
      this.party.forEach(hero => {
        const card = document.createElement('div');
        card.className = 'glass-panel rpg-party-member-card';
        card.innerHTML = `
          <div style="display: flex; gap: 1rem; align-items: center;">
            <div style="width: 60px; height: 60px;">${getHeroAvatarSvg(hero.id, 'normal')}</div>
            <div>
              <h4 style="font-family: var(--font-display); font-size: 1.1rem; color: #fff;">${hero.name} <span style="font-size: 0.8rem; color: var(--tertiary-gold);">Nv. ${hero.level}</span></h4>
              <div style="font-size: 0.75rem; color: var(--primary-cyan);">${hero.title} · ${hero.role}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">
                ❤️ HP: ${hero.hp}/${hero.maxHp} &nbsp; 💧 MP: ${hero.mp}/${hero.maxMp} &nbsp; ⚔️ ATK: ${hero.attack} &nbsp; 🛡️ DEF: ${hero.defense}
              </div>
              <div style="font-size: 0.75rem; color: #a5b4fc; margin-top: 2px;">
                🗡️ Arma: ${hero.equipment.weapon} | 🛡️ Armadura: ${hero.equipment.armor}
              </div>
            </div>
          </div>
        `;
        heroesContainer.appendChild(card);
      });
    }

    if (inventoryContainer) {
      inventoryContainer.innerHTML = '';
      this.inventory.forEach(itemEntry => {
        const itemInfo = RPG_ITEMS.find(i => i.id === itemEntry.id);
        if (!itemInfo) return;

        const card = document.createElement('div');
        card.className = 'glass-chip';
        card.style.display = 'flex';
        card.style.justifyContent = 'space-between';
        card.style.alignItems = 'center';
        card.style.padding = '0.6rem 0.8rem';
        card.innerHTML = `
          <div>
            <strong>${itemInfo.icon} ${itemInfo.name}</strong> (x${itemEntry.count})
            <div style="font-size: 0.75rem; color: var(--text-muted);">${itemInfo.effect}</div>
          </div>
        `;
        inventoryContainer.appendChild(card);
      });
    }

    modal.classList.add('active');
  }
}
