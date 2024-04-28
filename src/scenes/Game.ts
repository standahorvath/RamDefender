import { Text } from 'pixi.js';
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
      const enemy = new Enemy(i * Math.random() * 500, i * Math.random() * 500, 0)
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

    this.enemies.forEach((enemy) => enemy.update(delta, this.player));

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

    if(this.enemies.length < 10){
      const enemy = new Enemy(Math.random() * 500, Math.random() * 500, 0)
      this.enemies.push(enemy)
      this.addChild(enemy)
    }

    return
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
    }
  }
  onMouseUp(button: number) {
    //
  }
}