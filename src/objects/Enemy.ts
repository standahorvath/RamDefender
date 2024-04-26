
import { Container, Graphics, Assets, Texture, Sprite } from 'pixi.js';
import { Player } from './Player';
export class Enemy extends Container {

  public background = null as Sprite | null;
  private icon = null as Sprite | null;
  constructor(x: number, y: number, angle: number) {
    super();
    this.x = x
    this.y = y
    this.angle = angle
    Promise.resolve(Assets.load('/assets/images/enemy_bg.png')).then((texture:Texture) => {
      this.background = new Sprite(texture)
      this.addChild(this.background)
      this.background.position.set(0, 0)
      this.background.anchor.set(0.5, 0.5)
      this.background.rotation = angle
      Promise.resolve(Assets.load('/assets/images/enemy.png')).then((texture:Texture) => {
        this.icon = new Sprite(texture)
        this.icon.width = 32
        this.icon.height = 32
        this.addChild(this.icon)
        this.icon.position.set(0, 0)
        this.icon.anchor.set(0.5, 0.5)
        this.icon.rotation = angle
      })
  
    })
  }
  public update(delta: number, player: Player) {
    // Go closer to player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const angle = Math.atan2(dy, dx);
    const speed = window.enemySpeed;
    this.x += Math.cos(angle) * speed * delta;
    this.y += Math.sin(angle) * speed * delta;
    
  }

  public resize(width: number) {
    //
  }

  public render(width: number) {
    //
  }
}