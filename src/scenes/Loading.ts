import { Text } from 'pixi.js';
import Scene from '../Scene';
import { centerObjects } from '../utils/general';

export default class Loading extends Scene {
  name = 'Loading';

  async load() {
    await this.utils.assetLoader.loadAssetsGroup('assets');

    const text = new Text('Loading...', {
      fontFamily: 'Verdana',
      fontSize: 50,
      fill: 'white',
    });

    text.resolution = 2;

    centerObjects(text);

    this.addChild(text);
  }

  async start() {
    //
  }
}