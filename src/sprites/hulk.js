'use strict';

import Enemy from './enemy';
import FleeCenter from '../behaviors/fleeCenter';

export default class Hulk extends Enemy {
  constructor(game, x, y) {
    super(game, x, y, 'player', 7);

    this.addBehavior(new FleeCenter());

    this.anchor.set(0.5, 0.5);
    this.body.width = 30;
    this.body.height = 30;
    this.body.bounce.set(0.1);
    this.knockback = 0.2;

    this.health = 150;
    this.score = 1750;
  }
};
