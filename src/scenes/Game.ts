import { Text } from 'pixi.js';
import Scene from '../Scene';
import { Stats } from '../objects/Stats';
import { Player } from '../objects/Player';
import { centerObjects } from '../utils/general';

export default class Game extends Scene {
  name = 'Game';
  text = null as Text | null;

  private stats = new Stats();
  private player = new Player();

  async load() {

    this.text = new Text('Game', {
      fontFamily: 'Verdana',
      fontSize: 50,
      fill: 'white',
    });

    this.text.resolution = 2;

    centerObjects(this.text);

    this.addChild(this.text, this.stats, this.player);
  }

  async start() {
    //
  }
  async onResize(width: number, height: number) {
    this.stats.resize(width);
    return
  }
  async update(delta: number) {
    this.player.update(delta)
    if(!this.text) return
    //const x = Math.cos(delta / 1000) * Math.random() * 1000
    //const y = Math.cos(delta / 1000) * Math.random() * 1000
    //this.text?.position.set(x, y)
    return
  }
}