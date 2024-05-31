import { Container, Graphics, Assets, Texture, Sprite } from 'pixi.js';
import Keyboard from '../Keyboard';
import Mouse from '../Mouse';
import { Weapon } from './Weapon';
import { Enemy } from './Enemy';
import { Pistol } from './Weapons/Pistol';

export class Player extends Container {

  private graphics = new Graphics();
  private healthBar = null as Graphics | null;
  public playerSprite = null as Sprite | null;
  private keyboard = Keyboard.getInstance();
  private mouse = Mouse.getInstance();
  private weapon = null as Weapon | null;

  private state = {
    moveX: 0,
    moveY: 0,
    health: 100
  }

  constructor() {
    super();

    // Keyboard action event listeners
    this.keyboard.onAction(({ action, buttonState }) => {
      if (buttonState === 'pressed') this.onActionPress(action);
      else if (buttonState === 'released') this.onActionRelease(action);
    });

    // Mouse move event listener
    this.mouse.on('MOVE', ({ action, x, y }) => {
      this.onMouseMove(x, y);
    });

    // Load player sprite
    Promise.resolve(Assets.load('/assets/images/player.png')).then((texture: Texture) => {
      this.playerSprite = new Sprite(texture);
      this.playerSprite.anchor.set(0.5, 0.5);
      this.addChild(this.playerSprite);

      // Initialize weapon
      this.weapon = new Pistol();
      this.addChild(this.weapon);
    });

    // Render initial graphics
    this.render(window.innerWidth);
    this.addChild(this.graphics);

    // Initialize health bar
    this.healthBar = new Graphics();
    this.healthBar.circle(0, 0, 40)
      .fill('white');
    this.addChild(this.healthBar);
  }

  // Handle key press actions
  private onActionPress(action: keyof typeof Keyboard.actions) {
    switch (action) {
      case 'UP':
        this.state.moveY = -1;
        break;
      case 'DOWN':
        this.state.moveY = 1;
        break;
      case 'LEFT':
        this.state.moveX = -1;
        break;
      case 'RIGHT':
        this.state.moveX = 1;
        break;
    }
  }

  public changeWeapon(weapon: Weapon | null){
    if (this.weapon) {
      this.removeChild(this.weapon);
    }
    this.weapon = weapon;
    if (!this.weapon) return;
    this.addChild(this.weapon);
  }

  // Handle key release actions
  private onActionRelease(action: keyof typeof Keyboard.actions) {
    switch (action) {
      case 'UP':
        if (this.state.moveY === -1) {
          this.state.moveY = 0;
        }
        break;
      case 'DOWN':
        if (this.state.moveY === 1) {
          this.state.moveY = 0;
        }
        break;
      case 'LEFT':
        if (this.state.moveX === -1) {
          this.state.moveX = 0;
        }
        break;
      case 'RIGHT':
        if (this.state.moveX === 1) {
          this.state.moveX = 0;
        }
        break;
    }
  }

  // Handle mouse movement
  private onMouseMove(x: number, y: number) {
    const mouseX = x;
    const mouseY = y;
    const playerX = this.x || 0;
    const playerY = this.y || 0;
    const angle = Math.atan2(mouseY - playerY, mouseX - playerX);
    if (!this.weapon) return;
    this.weapon.rotation = angle + Math.PI / 2;
  }

  // Move player based on state and delta time
  private move(delta: number) {
    if (!this.playerSprite) return;
    this.x += this.state.moveX * delta * window.playerSpeed;
    this.y += this.state.moveY * delta * window.playerSpeed;
    this.onMouseMove(Mouse.x, Mouse.y);
  }

  // Update player state
  public update(delta: number) {
    this.move(delta);
    if (this.weapon) {
      this.weapon.update(delta);
    }
    if(this.state.health < 100){
      this.state.health += (window.healingCoef * delta);
      if(this.state.health > 100){
        this.state.health = 100;
      }
      this.render(window.innerWidth);
    }
  }

  // Resize handler
  resize(width: number) {
    this.render(width);
  }

  // Render graphics
  render(width: number) {
    this.graphics.clear();

    const health = this.state.health;
    const healthPercent = 1 - (health / 100);

    this.healthBar?.clear()
      .circle(0, 0, 40)
      .fill('white')
      .arc(0, 0, 41, 0, Math.PI * 2 * healthPercent)
      .fill('red')
      .circle(0, 0, 1)
      .cut();

    if (!this.healthBar) return;
    this.addChild(this.healthBar);
    if (!this.weapon) return;
    this.addChild(this.weapon);
    if (!this.playerSprite) return;
    this.addChild(this.playerSprite);
  }

  // Get current weapon
  public getWeapon() {
    return this.weapon;
  }

  // Get current health
  public getHealth() {
    return this.state.health;
  }

  // Set current health
  public setHealth(health: number) {
    this.state.health = health;
    this.render(window.innerWidth);
  }

  // Handle player hit by enemy
  public hit(damage: number, enemy: Enemy) {
    this.state.health -= damage;
    const angle = Math.atan2(this.y - enemy.y, this.x - enemy.x);
    this.x += Math.cos(angle) * 50;
    this.y += Math.sin(angle) * 50;
    this.render(window.innerWidth);
  }

}
