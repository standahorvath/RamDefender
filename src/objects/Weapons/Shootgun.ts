import { Container, Graphics, Assets, Texture, Sprite } from 'pixi.js';
import { Weapon } from '../Weapon';
import { Player } from '../Player';
import { Shoot } from '../Shoot';
export class Shootgun extends Weapon {
  constructor(damage = 8) {
    super(damage, '/assets/images/shootgun.png');
    this.weaponName = 'Shootgun';
  }
  public shoot(player: Player, game: Container) {
    for(let i = 0; i < 10; i++){
      const shoot = new Shoot(player.position.x, player.position.y, this.rotation + (i * (Math.PI / 180) * 2) + (Math.PI * -0.05), this.damage)
      this.shoots.push(shoot)
      game.addChild(shoot)
    }
  }
  
}