import { Container, Assets, Texture, Sprite } from 'pixi.js';
import { Shoot } from './Shoot';
import { Player } from './Player';
export class Weapon extends Container {
  protected weaponSprite = null as Sprite | null;
  protected damage = 10;
  protected weaponName = 'Generetic';
  protected shoots = [] as Shoot[]
  protected ammo = 100;
  constructor(damage = 10, spritePath: string) {
    super();
    this.damage = damage;
    Promise.resolve(Assets.load(spritePath)).then((texture:Texture) => {
      this.weaponSprite = new Sprite(texture)
      if(!this.weaponSprite) return
      //this.playerSprite.addChild(this.weaponSprite)	
      this.weaponSprite.position.set(0, 0)
      this.weaponSprite.anchor.set(0.5, 0.5)
      this.addChild(this.weaponSprite)
    })
  }
  public getDamage() {
    return this.damage;
  }
  public getWeaponName() {
    return this.weaponName;
  }
  public shoot(player: Player, game: Container) {
    game
    player
  }
  public getShoots() {
    return this.shoots
  }
  public setShoots(shoots: Shoot[]) {
    this.shoots = shoots
  }
  public update(delta: number) {
    delta
  }
  public heal(){
    this.ammo = 100
  }
  public getAmmo(){
    return this.ammo
  }
}