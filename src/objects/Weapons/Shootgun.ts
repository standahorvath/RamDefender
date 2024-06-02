import { Container } from 'pixi.js';
import { Weapon } from '../Weapon';
import { Player } from '../Player';
import { Shoot } from '../Shoot';

/**
 * Class representing a Shootgun.
 * @extends Weapon
 */
export class Shootgun extends Weapon {
  /**
   * Create a Shootgun.
   * @param {number} [damage=8] - The damage caused by the Shootgun.
   */
  constructor(damage = 8) {
    super(damage, 'assets/images/shootgun.png');
    this.weaponName = 'Shootgun';
  }

  /**
   * Shoot the Shootgun.
   * @param {Player} player - The player who is shooting.
   * @param {Container} game - The game where the shooting is happening.
   */
  public shoot(player: Player, game: Container) {
    if(this.ammo <= 0) return; // Check if the player has enough ammo 
    this.ammo -= 5;
    for(let i = 0; i < 10; i++){
      const shoot = new Shoot(player.position.x, player.position.y, this.rotation + (i * (Math.PI / 180) * 2) + (Math.PI * -0.05), this.damage)
      this.shoots.push(shoot)
      game.addChild(shoot)
    }
  }
}