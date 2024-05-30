import { Container, Graphics, Assets, Texture, Sprite } from 'pixi.js';
import { Player } from './Player';
import { isIntersecting } from '../utils/general';
import { Drop } from './Drops/Drop';
import { LaserGunDrop } from './Drops/LaserGunDrop';
import { ShootGunDrop } from './Drops/ShootGunDrop';
import { MachinegunDrop } from './Drops/MachinegunDrop';

/**
 * Class representing an enemy in the game.
 */
export class Enemy extends Container {
  public background: Sprite | null = null;
  private healthBar: Graphics | null = null;
  private icon: Sprite | null = null;
  private score = 30;
  private health = 30;
  private maxHealth = 30;
  private isHited = false;
  private damage = 26;

  /**
   * Creates an instance of Enemy.
   * @param {number} x - The x coordinate.
   * @param {number} y - The y coordinate.
   * @param {number} angle - The rotation angle.
   * @param {number} [score=30] - The score value of the enemy.
   * @param {number} [health=30] - The health value of the enemy.
   */
  constructor(x: number, y: number, angle: number, score = 30, health = 30) {
    super();
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.score = score;
    this.health = health;
    this.maxHealth = health;

    // Load and set the background sprite
    Promise.resolve(Assets.load('/assets/images/enemy_bg.png')).then((texture: Texture) => {
      this.background = new Sprite(texture);
      this.addChild(this.background);
      this.background.position.set(0, 0);
      this.background.anchor.set(0.5, 0.5);
      this.background.rotation = angle;

      // Load and set the icon sprite
      Promise.resolve(Assets.load('/assets/images/enemy.png')).then((texture: Texture) => {
        this.icon = new Sprite(texture);
        this.icon.width = 32;
        this.icon.height = 32;
        this.addChild(this.icon);
        this.icon.position.set(0, 0);
        this.icon.anchor.set(0.5, 0.5);
        this.icon.rotation = angle;
      });
    });

    // Initialize the health bar
    this.healthBar = new Graphics();
    this.healthBar.circle(0, 0, 30).fill('white');
    this.addChild(this.healthBar);
  }

  /**
   * Updates the enemy's state.
   * @param {number} delta - The time delta for the update.
   * @param {Player} player - The player instance.
   * @param {number} score - The current score.
   */
  public update(delta: number, player: Player, score: number) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    let angle = 0;
    let speed = window.enemySpeed * (1 + (score / 4500));

    if (!this.isHited) {
      // Move closer to the player
      angle = Math.atan2(dy, dx);
    } else {
      // Move away from the player
      angle = Math.atan2(dy, dx) + Math.PI;
      this.isHited = false;
      speed *= 3;
    }

    // Update position
    this.x += Math.cos(angle) * speed * delta;
    this.y += Math.sin(angle) * speed * delta;

    // Check for collision with the player
    if (isIntersecting(this.background, player.playerSprite)) {
      player.hit(this.damage + Math.random() * 10, this);
    }

    // Render the enemy
    this.render(window.innerWidth);
  }

  /**
   * Resizes the enemy based on the screen width.
   * @param {number} width - The new width of the screen.
   */
  public resize(width: number) {
    // Currently not implemented
  }

  /**
   * Renders the enemy's health bar.
   * @param {number} width - The width of the screen.
   */
  public render(width: number) {
    const health = this.health;
    const healthPercent = 1 - (health / this.maxHealth);

    this.healthBar?.clear()
      .circle(0, 0, 28)
      .fill('white')
      .arc(0, 0, 29, 0, Math.PI * 2 * healthPercent)
      .fill('red')
      .circle(0, 0, 1)
      .cut();
  }

  /**
   * Gets the score value of the enemy.
   * @returns {number} The score value.
   */
  public getScore(): number {
    return this.score;
  }

  /**
   * Gets the health value of the enemy.
   * @returns {number} The health value.
   */
  public getHealth(): number {
    return this.health;
  }

  /**
   * Applies damage to the enemy.
   * @param {number} damage - The amount of damage to apply.
   * @returns {boolean} True if the enemy is defeated, false otherwise.
   */
  public hit(damage: number): boolean {
    this.isHited = true;
    this.health -= damage;
    return this.health <= 0;
  }

  public drop(): Drop | null {
    if(Math.random() < 0.1){
      const randomWeaponNumber = Math.floor(Math.random() * 100);
      if (randomWeaponNumber < 24) {
        return new LaserGunDrop();
      } else if (randomWeaponNumber < 70) {
        return new MachinegunDrop();
      } else {
        return new ShootGunDrop();
      }
    }
    return null;
  }
}
