import { Container, Assets, Texture, Sprite } from 'pixi.js';

export class Drop extends Container {
  protected dropSprite = null as Sprite | null;
  protected dropName = 'Generic';
  public given = false;
  protected item = null as Container | null;
  protected time = 0;
  protected expired = false;

  constructor(item: Container, spritePath: string) {
    super();
    this.item = item;
    this.time = 1000 * 10;

    // Load the sprite texture and create a sprite
    Promise.resolve(Assets.load(spritePath)).then((texture: Texture) => {
      this.dropSprite = new Sprite(texture);
      if (!this.dropSprite) return;

      // Set the position and anchor point of the sprite
      this.dropSprite.position.set(0, 0);
      this.dropSprite.anchor.set(0.5, 0.5);

      // Add the sprite as a child of the container
      this.addChild(this.dropSprite);
    });
  }

  public update(delta: number) {
    // Rotate the sprite if it exists
    if (!this.dropSprite) {
      return;
    }
    this.dropSprite.rotation += 0.001 * delta;
    this.dropSprite.scale.x = 0.9 + Math.abs((0.2 * Math.sin(this.dropSprite.rotation) * Math.PI));
    this.dropSprite.scale.y = 0.9 + Math.abs((0.2 * Math.sin(this.dropSprite.rotation) * Math.PI));
    this.time -= delta;
    if(this.time <= 0) {
      this.expired = true;
    }
  }

  public give(): Container {
    // Mark as given and return the item
    if (!this.item) return new Container();
    this.given = true;
    return this.item;
  }

  public isExpired() {
    return this.expired;
  }
}