import { Container, Graphics } from 'pixi.js';
import { Weapon } from '../Weapon';
import { Player } from '../Player';
import { Shoot } from '../Shoot';
import { Enemy } from '../Enemy';
import Game from '../../scenes/Game';

export class Lasergun extends Weapon {
  laserShot = new Graphics();

  constructor(damage = 100) {
    super(damage, 'assets/images/lasergun.png');
    this.weaponName = 'Lasergun';
  }

  public shoot(player: Player, game: Container) {
    if(this.ammo <= 0) return; // Check if the player has enough ammo 
    this.ammo -= 3;
    // Configure the laser shot's appearance and position
    this.laserShot
      .rect(-3, 0, 4, 2000)
      .fill('db3df7');
    this.laserShot.rotation = this.rotation + -Math.PI;
    this.laserShot.position.set(player.position.x, player.position.y);
    game.addChild(this.laserShot);

    setTimeout(() => {
      // Change the laser shot's color and reset its position and rotation
      this.laserShot
        .rect(-3, 0, 4, 2000)
        .fill('ffffff');
      this.laserShot.rotation = this.rotation + -Math.PI;
      this.laserShot.position.set(player.position.x, player.position.y);
      this.laserShot.zIndex = -1;

      const gameInstance = game as Game;

      // Check for collisions with enemies
      gameInstance.enemies.forEach((enemy: Enemy) => {
        const bounds = enemy.background?.getBounds();
        for (let i = 0; i < 2000; i++) {
          const x = player.position.x + Math.cos(this.rotation - Math.PI / 2) * i;
          const y = player.position.y + Math.sin(this.rotation - Math.PI / 2) * i;
          
          // If the laser shot intersects with an enemy, trigger the onEnemyShoot method
          if (bounds?.containsPoint(x, y)) {
            gameInstance.onEnemyShoot(new Shoot(x, y, this.rotation, this.damage), enemy);
            break;
          }
        }
      });

      // Remove the laser shot from the game after 100 milliseconds
      setTimeout(() => {
        game.removeChild(this.laserShot);
      }, 100);
    }, 100);
  }
}