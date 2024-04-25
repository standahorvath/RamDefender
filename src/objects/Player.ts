import { Container, Graphics, Assets, Texture, Sprite } from 'pixi.js';
import { centerObjects } from '../utils/general';
import Keyboard from '../Keyboard';

export class Player extends Container {


  private graphics = new Graphics()
  private playerSprite = null as Sprite | null;
  private keyboard = Keyboard.getInstance();

  private state = {
    moveX: 0,
    moveY: 0,
  }

  constructor() {
    super();

    this.keyboard.onAction(({ action, buttonState }) => {
      if (buttonState === 'pressed') this.onActionPress(action);
      else if (buttonState === 'released') this.onActionRelease(action);
    });

    Promise.resolve(Assets.load('/assets/images/player.png')).then((texture:Texture) => {
      this.playerSprite = new Sprite(texture)
      centerObjects(this.playerSprite)
      this.addChild(this.playerSprite)	
    })


    this.render(window.innerWidth)
    this.addChild(this.graphics)
  }

  private onActionPress(action: keyof typeof Keyboard.actions) {
    switch(action){
      case 'UP':
        this.state.moveY = -1
        break
      case 'DOWN':
        this.state.moveY = 1
        break
      case 'LEFT':
        this.state.moveX = -1
        break
      case 'RIGHT':
        this.state.moveX = 1
        break
    }
  }
  private onActionRelease(action: keyof typeof Keyboard.actions) {
    switch(action){
      case 'UP':
        if(this.state.moveY === -1){
          this.state.moveY = 0
        }
        break
      case 'DOWN':
        if(this.state.moveY === 1){
          this.state.moveY = 0
        }
        break
      case 'LEFT':
        if(this.state.moveX === -1){
          this.state.moveX = 0	
        }
        break
      case 'RIGHT':
        if(this.state.moveX === 1){
          this.state.moveX = 0
        }
        break
    }
  }

  private move(delta: number){
    if(!this.playerSprite) return
    this.playerSprite.x += this.state.moveX * delta * window.playerSpeed
    this.playerSprite.y += this.state.moveY * delta * window.playerSpeed
  }

  public update(delta: number) {
    this.move(delta)
  }

  resize(width: number) {
    this.render(width)
  }
  
  render(width: number) {
    this.graphics.clear();
  }

}