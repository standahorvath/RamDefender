// Import necessary modules and classes
import { Text } from 'pixi.js';
import Scene from '../Scene';
import { Stats } from '../objects/Stats';
import { Player } from '../objects/Player';
import { centerObjects } from '../utils/general';
import { Shoot } from '../objects/Shoot';
import { Enemy } from '../objects/Enemy';
import Mouse from '../Mouse';
import { isIntersecting } from '../utils/general';
import { Drop } from '../objects/Drops/Drop';
import { Inventory } from '../objects/Inventory';
import { Weapon } from '../objects/Weapon';

// Define the Game class extending Scene
export default class Game extends Scene {
  name = 'Game';

  // Initialize private and public properties
  private stats = new Stats();
  private inventory = new Inventory();
  private player = new Player();
  public enemies = [] as Enemy[];
  public drops = [] as Drop[];
  private mouse = Mouse.getInstance();
  private gameText = null as Text | null;
  private gameSubtext = null as Text | null;
  private gameIsPaused = false;

  // Load function to initialize game objects
  async load() {
    centerObjects(this.player);
    this.addChild(this.stats, this.player, this.inventory);

    // Mouse click event handling
    this.mouse.on('CLICK', ({ buttonState, button }) => {
      if (buttonState === 'pressed') {
        this.onMouseDown(button);
      } else {
        this.onMouseUp(button);
      }
    });

    // Spawn initial enemies
    for (let i = 0; i < 10; i++) {
      const enemy = new Enemy(i / 10 * Math.random() * window.innerWidth, i / 10 * Math.random() * window.innerHeight, 0);
      this.enemies.push(enemy);
      this.addChild(enemy);
    }
  }

  // Placeholder for start function
  async start() {
    //
  }

  // Handle resizing of game elements
  async onResize(width: number, height: number) {
    this.stats.resize(width);
    this.inventory.resize(width);

    const shoots = this.player.getWeapon()?.getShoots();
    if (shoots) {
      shoots.forEach((shoot: Shoot) => shoot.resize(width));
    }

    this.enemies.forEach((enemy) => enemy.resize(width));
  }

  // Update game state
  async update(delta: number) {
    this.player.update(delta);
    this.inventory.update(delta);
    this.enemies.forEach((enemy) => enemy.update(delta, this.player, this.stats.getScore()));

    const shoots = this.player.getWeapon()?.getShoots();
    if (shoots) {
      shoots.forEach((shoot: Shoot) => shoot.update(delta));

      // Check for shoot-enemy intersections
      shoots.forEach((shoot: Shoot) => {
        this.enemies.forEach((enemy: Enemy) => {
          if (shoot.shootSprite && enemy.background && isIntersecting(shoot.shootSprite, enemy.background)) {
            this.onEnemyShoot(shoot, enemy);
          }
        });
      });

      // Remove shoots out of bounds
      shoots.forEach((shoot: Shoot) => {
        if (shoot.position.x > window.innerWidth || shoot.position.x < 0 || shoot.position.y > window.innerHeight || shoot.position.y < 0) {
          this.removeChild(shoot);
          this.player.getWeapon()?.setShoots(shoots.filter((s) => s !== shoot));
        }
      });
    }


    this.drops.forEach((drop) => {
      drop.update(delta);
      if (isIntersecting(drop, this.player)) {
        this.removeChild(drop);
        this.drops = this.drops.filter((d) => d !== drop);
        const item = drop.give();
        if(item){
          this.inventory.pickup(item as Weapon);
        }
      }
      if(drop.isExpired()){
        this.removeChild(drop);
        this.drops = this.drops.filter((d) => d !== drop);
      }
    });

    // Spawn new enemies if needed
    if (this.enemies.length < 10 && !this.gameIsPaused) {
      const radiusFromPlayer = window.innerWidth / 2;
      const angle = Math.random() * Math.PI * 2;
      const x = this.player.x + Math.cos(angle) * radiusFromPlayer;
      const y = this.player.y + Math.sin(angle) * radiusFromPlayer;
      const enemy = new Enemy(x, y, 0);
      this.enemies.push(enemy);
      this.addChild(enemy);
    }

    this.checkGameEnd();
  }

  // Check if the game has ended
  private checkGameEnd() {
    if (this.player.getHealth() <= 0 && this.stats.getLives() > 0) {
      this.stats.setLives(this.stats.getLives() - 1);
      this.player.setHealth(100);
      this.enemies.forEach((enemy) => this.removeChild(enemy));
      this.enemies = [];
      this.gameIsPaused = true;
      this.gameText = new Text('You lose one of your lives.', {
        fontFamily: 'Verdana',
        fontSize: 50,
        fill: 'white',
      });
      this.gameSubtext = new Text('Press fire key to continue', {
        fontFamily: 'Verdana',
        fontSize: 20,
        fill: 'white',
      });
      this.gameText.resolution = 2;
      centerObjects(this.gameText);
      centerObjects(this.gameSubtext);
      this.gameText.y = window.innerHeight / 2 - 50;
      this.addChild(this.gameText);
      this.addChild(this.gameSubtext);
    } else if (this.stats.getLives() <= 0) {
      this.gameIsPaused = true;
      this.gameText = new Text('Game Over', {
        fontFamily: 'Verdana',
        fontSize: 50,
        fill: 'white',
      });
      this.gameSubtext = new Text('Press fire key to restart', {
        fontFamily: 'Verdana',
        fontSize: 20,
        fill: 'white',
      });
      this.gameText.resolution = 2;
      centerObjects(this.gameText);
      centerObjects(this.gameSubtext);
      this.gameText.y = window.innerHeight / 2 - 50;
      this.addChild(this.gameText);
      this.addChild(this.gameSubtext);
    }
  }

  // Handle shoot hitting an enemy
  public onEnemyShoot(shoot: Shoot, enemy: Enemy) {
    this.removeChild(shoot);

    const shoots = this.player.getWeapon()?.getShoots();
    if (shoots) {
      this.player.getWeapon()?.setShoots(shoots.filter((s) => s !== shoot));
    }

    // Hitting enemy with a shoot
    if (enemy.hit(shoot.getDamage())) {
      this.removeChild(enemy);
      this.enemies = this.enemies.filter((e) => e !== enemy);
      // Add score for that enemy
      this.stats.addScore(enemy.getScore());
      // Drop item
      const drop = enemy.drop();
      if(drop){
        drop.x = enemy.x;
        drop.y = enemy.y;
        this.drops.push(drop);
        this.addChild(drop);
      }
    }
  }

  // Handle mouse button down event
  onMouseDown(button: number) {
    if (button === 0) {
      const weapon = this.player.getWeapon();
      if (!weapon) return;
      weapon.shoot(this.player, this);

      // If game is paused, unpause it
      if (this.gameIsPaused && this.stats.getLives() > 0) {
        this.gameIsPaused = false;
        if (this.gameText && this.gameSubtext) {
          this.removeChild(this.gameText);
          this.removeChild(this.gameSubtext);
        }
      } else if (this.gameIsPaused && this.stats.getLives() <= 0) {
        // Restart game
        this.stats.setLives(3);
        this.stats.setScore(0);
        this.player.setHealth(100);
        this.enemies.forEach((enemy) => this.removeChild(enemy));
        this.enemies = [];
        this.gameIsPaused = false;
        if (this.gameText && this.gameSubtext) {
          this.removeChild(this.gameText);
          this.removeChild(this.gameSubtext);
        }
      }
    }
  }

  // Placeholder for mouse button up event
  onMouseUp(button: number) {
    //
  }
}
