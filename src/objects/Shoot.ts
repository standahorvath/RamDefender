
import { Container, Graphics, Assets, Texture, Sprite } from 'pixi.js';
export class Shoot extends Container {

  private shootSprite = null as Sprite | null;
  private x = 0
  private y = 0
  private angle = 0
  constructor(x: number, y: number, angle: number) {
    super();
    this.x = x
    this.y = y
    this.angle = angle
    Promise.resolve(Assets.load('/assets/images/shoot.png')).then((texture:Texture) => {
      this.shootSprite = new Sprite(texture)
      this.addChild(this.shootSprite)
      this.shootSprite.position.set(x, y)
    })
  }
  public update(delta: number) {
    //
  }

  public resize(width: number) {
    //
  }

  public render(width: number) {
    //
  }
}