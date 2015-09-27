'use strict';

import Bullet from '../sprites/bullet';
import EnforcerBullet from '../sprites/enforcerBullet';
import Spear from '../sprites/spear';

const NUM_BULLETS = 50;
const SOUND_DELAY = 60;

export default class Shooting extends Phaser.Plugin {
  constructor(game, parent) {
    super(game, parent);
    game.shooting = this;
    this.shootSound = game.add.audio('shoot');
    this.shootSoundDelay = 0;
    this.enforcerShootSound = game.add.audio('enforcerShoot');
    this.spearSound = game.add.audio('spearShoot');
  }

  init() {
    this.playerBullets = this.game.add.group();
    this.enforcerBullets = this.game.add.group();
    this.spears = this.game.add.group();
    for (let x = 0; x < NUM_BULLETS; x++) {
      let bullet = new Bullet(this.game, 0, 0);
      bullet.alive = bullet.exists = bullet.visible = false;
      this.playerBullets.add(bullet)

      let enforcerBullet = new EnforcerBullet(this.game, 0, 0);
      enforcerBullet.alive = enforcerBullet.exists = enforcerBullet.visible = false;
      this.enforcerBullets.add(enforcerBullet);

      let spear = new Spear(this.game, 0, 0);
      spear.alive = spear.exists = spear.visible = false;
      this.spears.add(spear);
    }

    this.game.waves.onTransition.add(() => {
      this.playerBullets.callAll('kill');
      this.enforcerBullets.callAll('kill');
      this.spears.callAll('kill');
      // Set tint on bullets and spears.
      this.enforcerBullets.setAll('tint', this.game.tinting.currentTint);
      this.spears.setAll('tint', this.game.tinting.currentTint);
    });
  }

  playerShoot(sx, sy, vx, vy) {
    let bullet = this.playerBullets.getFirstExists(false);
    if (bullet) {
      bullet.reset(sx, sy);
      bullet.fire(vx, vy);
      if (this.shootSoundDelay <= 0) {
        this.shootSound.play();
        this.shootSoundDelay = SOUND_DELAY + Math.random() * 10;
      }
    }
  }

  enforcerShoot(sx, sy, vx, vy) {
    let bullet = this.enforcerBullets.getFirstExists(false);
    if (bullet) {
      bullet.reset(sx, sy);
      bullet.fire(vx, vy);
      this.enforcerShootSound.play();
    }
  }

  throwSpear(sx, sy, vx, vy) {
    let spear = this.spears.getFirstExists(false);
    if (spear) {
      spear.reset(sx, sy);
      spear.fire(vx, vy);
      this.spearSound.play();
    }
  }

  update() {
    this.shootSoundDelay -= this.game.time.physicsElapsedMS;
    this.game.physics.arcade.overlap(this.game.enemiesGroup, this.playerBullets, this.onOverlap, null, this);

    let player = this.game.player;
    if (player) {
      this.game.physics.arcade.overlap(player, this.enforcerBullets, this.onEnforcerBullet, null, this);
      this.game.physics.arcade.overlap(player, this.spears, this.onEnforcerBullet, null, this);
    }
  }

  onOverlap(enemy, bullet) {
    this.game.explosions.small(bullet.x, bullet.y);
    enemy.position.x -= enemy.body.overlapX / 2;
    enemy.position.y -= enemy.body.overlapY / 2;
    enemy.damage(bullet.attack);
    bullet.kill();
  }

  onEnforcerBullet(player, bullet) {
    this.game.explosions.small(bullet.x, bullet.y);
    player.onCollide(player, bullet);
    bullet.kill();
  }
};
