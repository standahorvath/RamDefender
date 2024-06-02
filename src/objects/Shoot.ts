
import { Container, Assets, Texture, Sprite } from 'pixi.js';
export class Shoot extends Container {

  public shootSprite = null as Sprite | null;
  private damage = 15;
  constructor(x: number, y: number, angle: number, damage = 15) {
    super();
    this.x = x + Math.cos(angle - Math.PI / 2) * 40
    this.y = y + Math.sin(angle - Math.PI / 2) * 40
    this.angle = angle
    this.damage = damage
    Promise.resolve(Assets.load('assets/images/shoot.png')).then((texture:Texture) => {
      this.shootSprite = new Sprite(texture)
      this.addChild(this.shootSprite)
      this.shootSprite.position.set(0, 0)
      this.shootSprite.anchor.set(0.5, 0.5)
      this.shootSprite.rotation = angle
    })
  }
  public update(delta: number) {
    const xDiff = Math.cos(this.angle - Math.PI / 2) * delta * window.shootSpeed
    const yDiff = Math.sin(this.angle - Math.PI / 2) * delta * window.shootSpeed
    this.x += xDiff
    this.y += yDiff
  }
  public getDamage() {
    const fromDamage = this.damage * 0.5
    const toDamage = this.damage * 1.2
    return Math.random() * (toDamage - fromDamage) + fromDamage
  }

  public resize(width: number) {
    //
  }

  public render(width: number) {
    //
  }
}