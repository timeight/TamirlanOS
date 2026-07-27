export interface Bullet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export interface Enemy {
  x: number;
  y: number;
  r: number;
  hp: number;
  speed: number;
}

export interface Player {
  x: number;
  y: number;
  hp: number;
  cooldown: number;
  aim: number;
}

export interface World {
  w: number;
  h: number;
  player: Player;
  bullets: Bullet[];
  enemies: Enemy[];
  score: number;
  wave: number;
  time: number;
  spawnTimer: number;
  over: boolean;
}

export interface Input {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  aimX: number;
  aimY: number;
  firing: boolean;
  follow: { x: number; y: number } | null;
}

const PLAYER_SPEED = 195;
const PLAYER_R = 12;
const PLAYER_MAX_HP = 100;
const BULLET_SPEED = 470;
const BULLET_R = 4;
const FIRE_COOLDOWN = 0.16;
const ENEMY_R = 12;
const CONTACT_DAMAGE = 16;

export function createWorld(w: number, h: number): World {
  return {
    w,
    h,
    player: { x: w / 2, y: h / 2, hp: PLAYER_MAX_HP, cooldown: 0, aim: 0 },
    bullets: [],
    enemies: [],
    score: 0,
    wave: 1,
    time: 0,
    spawnTimer: 0.6,
    over: false,
  };
}

export const PLAYER_RADIUS = PLAYER_R;
export const MAX_HP = PLAYER_MAX_HP;

function spawnEnemy(world: World): void {
  const edge = Math.floor(Math.random() * 4);
  let x = 0;
  let y = 0;
  if (edge === 0) {
    x = Math.random() * world.w;
    y = -ENEMY_R;
  } else if (edge === 1) {
    x = world.w + ENEMY_R;
    y = Math.random() * world.h;
  } else if (edge === 2) {
    x = Math.random() * world.w;
    y = world.h + ENEMY_R;
  } else {
    x = -ENEMY_R;
    y = Math.random() * world.h;
  }
  const tough = Math.random() < Math.min(0.35, world.wave * 0.05);
  world.enemies.push({
    x,
    y,
    r: ENEMY_R,
    hp: tough ? 2 : 1,
    speed: 55 + world.wave * 6 + Math.random() * 20,
  });
}

export function updateWorld(world: World, input: Input, dt: number): void {
  if (world.over) return;
  const { player } = world;

  let mx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  let my = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  if (input.follow) {
    const dx = input.follow.x - player.x;
    const dy = input.follow.y - player.y;
    const dist = Math.hypot(dx, dy);
    if (dist > 6) {
      mx = dx / dist;
      my = dy / dist;
    } else {
      mx = 0;
      my = 0;
    }
  }
  const len = Math.hypot(mx, my) || 1;
  player.x += (mx / len) * PLAYER_SPEED * dt;
  player.y += (my / len) * PLAYER_SPEED * dt;
  player.x = Math.max(PLAYER_R, Math.min(world.w - PLAYER_R, player.x));
  player.y = Math.max(PLAYER_R, Math.min(world.h - PLAYER_R, player.y));
  player.aim = Math.atan2(input.aimY - player.y, input.aimX - player.x);

  player.cooldown -= dt;
  if (input.firing && player.cooldown <= 0) {
    player.cooldown = FIRE_COOLDOWN;
    world.bullets.push({
      x: player.x + Math.cos(player.aim) * PLAYER_R,
      y: player.y + Math.sin(player.aim) * PLAYER_R,
      vx: Math.cos(player.aim) * BULLET_SPEED,
      vy: Math.sin(player.aim) * BULLET_SPEED,
      life: 1.1,
    });
  }

  for (const bullet of world.bullets) {
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;
  }

  world.time += dt;
  world.wave = Math.floor(world.time / 15) + 1;
  world.spawnTimer -= dt;
  if (world.spawnTimer <= 0) {
    spawnEnemy(world);
    world.spawnTimer = Math.max(0.32, 1.3 - world.wave * 0.06);
  }

  for (const enemy of world.enemies) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.hypot(dx, dy) || 1;
    enemy.x += (dx / dist) * enemy.speed * dt;
    enemy.y += (dy / dist) * enemy.speed * dt;
  }

  for (const bullet of world.bullets) {
    for (const enemy of world.enemies) {
      if (enemy.hp <= 0) continue;
      if (
        Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) <
        enemy.r + BULLET_R
      ) {
        enemy.hp -= 1;
        bullet.life = 0;
        if (enemy.hp <= 0) world.score += 10;
      }
    }
  }

  for (const enemy of world.enemies) {
    if (enemy.hp <= 0) continue;
    if (
      Math.hypot(player.x - enemy.x, player.y - enemy.y) <
      enemy.r + PLAYER_R
    ) {
      player.hp -= CONTACT_DAMAGE;
      enemy.hp = 0;
    }
  }

  world.bullets = world.bullets.filter(
    (bullet) =>
      bullet.life > 0 &&
      bullet.x > -10 &&
      bullet.x < world.w + 10 &&
      bullet.y > -10 &&
      bullet.y < world.h + 10,
  );
  world.enemies = world.enemies.filter((enemy) => enemy.hp > 0);

  if (player.hp <= 0) {
    player.hp = 0;
    world.over = true;
  }
}
