import { Container, Graphics, Assets, Texture, Sprite } from 'pixi.js';
import { Weapon } from '../Weapon';
import { Player } from '../Player';
import { Shoot } from '../Shoot';
export class Machinegun extends Weapon {
  constructor(damage = 12) {
    super(damage, '/assets/images/machinegun.png');
    this.weaponName = 'Machinegun';
  }
  public shoot(player: Player, game: Container) {
    this.ammo -= 4;
    for(let i = 0; i < 10; i++){
      setTimeout(() => {
        this.machineGunShoot(player, game)
      }, i * 100)
    }
  }
  private machineGunShoot(player: Player, game: Container){
    const shoot = new Shoot(player.position.x, player.position.y, this.rotation)
    this.shoots.push(shoot)
    game.addChild(shoot)
  }
  
}