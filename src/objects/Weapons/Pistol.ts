import { Weapon } from '../Weapon';
import { Shoot } from '../Shoot';
import { Player } from '../Player';
export class Pistol extends Weapon {
  constructor(damage = 10) {
    super(damage, '/assets/images/cannon.png');
    this.weaponName = 'Pistol';

  }
  public shoot(player: Player, game: Container) {
    const shoot = new Shoot(player.position.x, player.position.y, this.rotation)
    this.shoots.push(shoot)
    game.addChild(shoot)
  }
}