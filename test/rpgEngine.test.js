import test from 'node:test';
import assert from 'node:assert/strict';
import { RPG_HEROES, RPG_WORLDS, RPG_ITEMS } from '../public/js/rpgData.js';
import { generateExercise, verifyAnswer } from '../lib/algebraEngine.js';

test('RPG Heroes define Manuel, Sofía y Nico con stats y habilidades completas', () => {
  assert.equal(RPG_HEROES.length, 3);
  const heroIds = RPG_HEROES.map(h => h.id);
  assert.deepEqual(heroIds, ['manuel', 'sofia', 'nico']);

  RPG_HEROES.forEach(hero => {
    assert.ok(hero.name);
    assert.ok(hero.title);
    assert.ok(hero.hp > 0);
    assert.ok(hero.mp > 0);
    assert.ok(hero.attack > 0);
    assert.ok(hero.defense >= 0);
    assert.ok(Array.isArray(hero.skills) && hero.skills.length >= 2);
    
    hero.skills.forEach(skill => {
      assert.ok(skill.id);
      assert.ok(skill.name);
      assert.ok(typeof skill.mpCost === 'number');
      assert.ok(skill.topic);
      // Comprobar que el topic de la habilidad genera ejercicios válidos
      const ex = generateExercise(skill.topic, 1);
      assert.ok(ex.correctAnswer);
    });
  });
});

test('RPG Worlds contiene 5 mundos con nodos de combate, puertas, cofres y santuarios', () => {
  assert.equal(RPG_WORLDS.length, 5);

  RPG_WORLDS.forEach((world, idx) => {
    assert.equal(world.worldNumber, idx + 1);
    assert.ok(world.name);
    assert.ok(world.subtitle);
    assert.ok(Array.isArray(world.nodes) && world.nodes.length >= 5);

    // Debe contener al menos un boss al final
    const bossNode = world.nodes.find(n => n.type === 'boss');
    assert.ok(bossNode, `El Mundo ${world.worldNumber} debe tener un nodo tipo 'boss'`);
    assert.ok(bossNode.enemy);
    assert.ok(bossNode.enemy.hp >= 200);

    // Verificar cada nodo
    world.nodes.forEach(node => {
      assert.ok(node.id);
      assert.ok(node.title);
      assert.ok(['battle', 'door', 'chest', 'shrine', 'boss'].includes(node.type));
      assert.ok(typeof node.x === 'number' && typeof node.y === 'number');

      if (node.type === 'battle' || node.type === 'boss') {
        assert.ok(node.enemy.hp > 0);
        assert.ok(node.enemy.attack > 0);
      } else if (node.type === 'door' || node.type === 'chest') {
        assert.ok(node.topic);
        assert.ok(node.puzzleDescription);
      } else if (node.type === 'shrine') {
        assert.ok(node.healFull);
        assert.ok(node.loreTip);
      }
    });
  });
});

test('RPG Items contiene consumibles válidos con efectos y precios', () => {
  assert.ok(RPG_ITEMS.length >= 3);
  RPG_ITEMS.forEach(item => {
    assert.ok(item.id);
    assert.ok(item.name);
    assert.ok(item.icon);
    assert.ok(item.effect);
    assert.ok(item.price > 0);
  });
});

test('Simulación de combate y canalización de habilidades algebraicas', () => {
  const manuel = RPG_HEROES[0];
  const golpeBinomio = manuel.skills.find(s => s.id === 'golpe_binomio');
  assert.ok(golpeBinomio);

  // Generar ejercicio asociado a la habilidad
  const exercise = generateExercise(golpeBinomio.topic, 2);
  assert.ok(exercise.options.includes(exercise.correctAnswer));

  // Simular acierto
  const verification = verifyAnswer(exercise.correctAnswer, exercise.correctAnswer);
  assert.equal(verification.isCorrect, true);

  // Simular cálculo de daño
  const baseAtk = manuel.attack + manuel.level * 4;
  const damage = Math.floor(baseAtk * golpeBinomio.damageMultiplier);
  assert.ok(damage > manuel.attack);
});
