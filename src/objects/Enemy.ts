
import { Container, Graphics, Assets, Texture, Sprite } from 'pixi.js';
import { Player } from './Player';
export class Enemy extends Container {

  public background = null as Sprite | null;
  private healthBar = null as Graphics | null;
  private icon = null as Sprite | null;
  private score = 30;
  private health = 30;
  private maxHealth = 30;
  private isHited = false;
  constructor(x: number, y: number, angle: number, score = 30, health = 30) {
    super();
    this.x = x
    this.y = y
    this.angle = angle
    this.score = score
    this.health = health
    this.maxHealth = health
    Promise.resolve(Assets.load('assets/images/enemy_bg.png')).then((texture:Texture) => {
      this.background = new Sprite(texture)
      this.addChild(this.background)
      this.background.position.set(0, 0)
      this.background.anchor.set(0.5, 0.5)
      this.background.rotation = angle
      Promise.resolve(Assets.load('assets/images/enemy.png')).then((texture:Texture) => {
        this.icon = new Sprite(texture)
        this.icon.width = 32
        this.icon.height = 32
        this.addChild(this.icon)
        this.icon.position.set(0, 0)
        this.icon.anchor.set(0.5, 0.5)
        this.icon.rotation = angle
      })
    })

    this.healthBar = new Graphics()
    this.healthBar.circle(0, 0, 30)
      .fill('white')
    this.addChild(this.healthBar)


  }
  public update(delta: number, player: Player) {
    
      
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    let angle = 0;
    let speed = window.enemySpeed;
    if(!this.isHited){
      // Go closer to player
      angle = Math.atan2(dy, dx);
    } else {
      // Go away from player
      angle = Math.atan2(dy, dx) + Math.PI;
      this.isHited = false
      speed *= 3
    } 

    this.x += Math.cos(angle) * speed * delta;
    this.y += Math.sin(angle) * speed * delta;
     
    this.render(window.innerWidth)
  }

  public resize(width: number) {
    //
  }

  public render(width: number) {
    const health = this.health
    const healthPercent = 1 - (health / this.maxHealth)
    
    this.healthBar?.clear()
      .circle(0, 0, 28)
      .fill('white')
      .arc(0, 0, 29, 0, Math.PI * 2 * healthPercent)
      .fill('red')
      .circle(0, 0, 1)
      .cut()
  }

  public getScore() {
    return this.score
  }
  public getHealth() {
    return this.health
  }
  public hit(damage: number): boolean {
    this.isHited = true
    this.health -= damage
    if(this.health <= 0){
      return true
    }
    return false
  }
}