import { Application, ImageSource, Sprite, Texture } from 'pixi.js';

const app = new Application();
app.init(
  {
    view: document.querySelector('#app') as HTMLCanvasElement,
    autoDensity: true,
    resizeTo: window,
    powerPreference: 'high-performance',
    backgroundColor: 0x23272b,
  }
);
const { renderer, stage } = app;


const image = new Image();

image.onload = function(){

  // create a texture source
  const source = new ImageSource({
    resource: image,
  });

  // create a texture
  const texture = new Texture({
    source
  });

  stage.addChild(new Sprite(texture));
}

image.src = '/images/player.png';