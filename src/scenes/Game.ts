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
  text = null as Text | null;

  private stats = new Stats();
  private player = new Player();
  private shoots = [] as Shoot[];
  private enemies = [] as Enemy[];
  
  private mouse = Mouse.getInstance();

  async load() {

    this.text = new Text('Game', {
      fontFamily: 'Verdana',
      fontSize: 50,
      fill: 'white',
    });

    this.text.resolution = 2;

    centerObjects(this.text, this.player);

    this.addChild(this.text, this.stats, this.player);

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
    this.shoots.forEach((shoot) => shoot.resize(width));
    this.enemies.forEach((enemy) => enemy.resize(width));
    return
  }
  async update(delta: number) {
    this.player.update(delta)
    this.shoots.forEach((shoot) => shoot.update(delta));
    this.enemies.forEach((enemy) => enemy.update(delta, this.player));
    if(!this.text) return
    //const x = Math.cos(delta / 1000) * Math.random() * 1000
    //const y = Math.cos(delta / 1000) * Math.random() * 1000
    //this.text?.position.set(x, y)

    this.shoots.forEach((shoot:Shoot) => {
      this.enemies.forEach((enemy:Enemy) => {
        if(isIntersecting(shoot.shootSprite, enemy.background)){
          this.removeChild(shoot)
          this.removeChild(enemy)
          this.shoots = this.shoots.filter((s) => s !== shoot)
          this.enemies = this.enemies.filter((e) => e !== enemy)
        }
      })
    })
    return
  }

  onMouseDown(button: number) {
    if(button === 0){
      const shoot = new Shoot(this.player.position.x, this.player.position.y, this.player.getCannonRotation())
      this.shoots.push(shoot)
      this.addChild(shoot)
    }
  }
  onMouseUp(button: number) {
    //
  }
}