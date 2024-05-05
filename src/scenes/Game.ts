import { Graphics, Text } from 'pixi.js';
import Scene from '../Scene';
import { Stats } from '../objects/Stats';
import { Player } from '../objects/Player';
import { centerObjects } from '../utils/general';
import { Shoot } from '../objects/Shoot';
import { Enemy } from '../objects/Enemy';
import Mouse from '../Mouse';
import {isIntersecting} from '../utils/general'
export default class Game extends Scene {
  name = 'Game';

  private stats = new Stats();
  private player = new Player();
  public enemies = [] as Enemy[];
  private mouse = Mouse.getInstance();
  private gameText = null as Text | null;
  private gameSubtext = null as Text | null;

  private gameIsPaused = false;

  async load() {

    centerObjects(this.player);

    this.addChild(this.stats, this.player);

    this.mouse.on('CLICK', ({ buttonState, button }) => {
      if (buttonState === 'pressed') {
        this.onMouseDown(button)
      } else {
        this.onMouseUp(button)
      }
    });

    for(let i = 0; i < 10; i++){
      const enemy = new Enemy(i/10 * Math.random() * window.innerWidth, i/10 * Math.random() * window.innerHeight, 0)
      this.enemies.push(enemy)
      this.addChild(enemy)
    }
  }

  async start() {
    //
  }
  async onResize(width: number, height: number) {
    this.stats.resize(width);

    const shoots = this.player.getWeapon()?.getShoots()
    if(shoots){
      shoots.forEach((shoot:Shoot) => shoot.resize(width));
    }
    
    this.enemies.forEach((enemy) => enemy.resize(width));
    return
  }
  async update(delta: number) {
    this.player.update(delta)

    this.enemies.forEach((enemy) => enemy.update(delta, this.player, this.stats.getScore()));

    const shoots = this.player.getWeapon()?.getShoots()
    if(shoots){
      shoots.forEach((shoot:Shoot) => shoot.update(delta));

      shoots.forEach((shoot:Shoot) => {
        this.enemies.forEach((enemy:Enemy) => {
          if(shoot.shootSprite && enemy.background && isIntersecting(shoot.shootSprite, enemy.background)){
            this.onEnemyShoot(shoot, enemy)
          }
        })
      })

      shoots.forEach((shoot:Shoot) => {
        if(shoot.position.x > window.innerWidth || shoot.position.x < 0 || shoot.position.y > window.innerHeight || shoot.position.y < 0){
          this.removeChild(shoot)
          this.player.getWeapon()?.setShoots(shoots.filter((s) => s !== shoot))
        }
      });
      
    }

    if(this.enemies.length < 10 && !this.gameIsPaused){
      const radiusFromPlayer = window.innerWidth / 2
      const angle = Math.random() * Math.PI * 2
      const x = this.player.x + Math.cos(angle) * radiusFromPlayer
      const y = this.player.y + Math.sin(angle) * radiusFromPlayer
      const enemy = new Enemy(x, y, 0)
      this.enemies.push(enemy)
      this.addChild(enemy)
    }

    this.checkGameEnd();

    return
  }
  private checkGameEnd(){
    if(this.player.getHealth() <= 0 && this.stats.getLives() > 0){
      this.stats.setLives(this.stats.getLives() - 1)
      this.player.setHealth(100)
      this.enemies.forEach((enemy) => {
        this.removeChild(enemy)
      });
      this.enemies = []
      this.gameIsPaused = true
      this.gameText = new Text('You loose one of your ram.', {
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
      this.gameText.y = window.innerHeight / 2 - 50
      this.addChild(this.gameText);
      this.addChild(this.gameSubtext);
    } else {
      if(this.stats.getLives() <= 0){
        this.gameIsPaused = true
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
        this.gameText.y = window.innerHeight / 2 - 50
        this.addChild(this.gameText);
        this.addChild(this.gameSubtext);
      }
    
    }
  }
  public onEnemyShoot(shoot: Shoot, enemy: Enemy){
    this.removeChild(shoot)
    
    const shoots = this.player.getWeapon()?.getShoots()
    if(shoots){
      this.player.getWeapon()?.setShoots(shoots.filter((s) => s !== shoot))
    }

    // Hitting enemy with a shoot
    if(enemy.hit(shoot.getDamage())){
      this.removeChild(enemy)
      this.enemies = this.enemies.filter((e) => e !== enemy)
      // Add score of that enemy
      this.stats.addScore(enemy.getScore())
    }
  }

  onMouseDown(button: number) {
    if(button === 0){
      const weapon = this.player.getWeapon()
      if(!weapon) return
      weapon.shoot(this.player, this)

      if(this.gameIsPaused && this.stats.getLives() > 0){
        this.gameIsPaused = false
        if(this.gameText && this.gameSubtext) {
          this.removeChild(this.gameText)
          this.removeChild(this.gameSubtext)
        }
      } else if(this.gameIsPaused && this.stats.getLives() <= 0){
        this.stats.setLives(3)
        this.stats.setScore(0)
        this.player.setHealth(100)
        this.enemies.forEach((enemy) => {
          this.removeChild(enemy)
        });
        this.enemies = []
        this.gameIsPaused = false
        if(this.gameText && this.gameSubtext) {
          this.removeChild(this.gameText)
          this.removeChild(this.gameSubtext)
        }
      }

    }
  }
  onMouseUp(button: number) {
    //
  }
}