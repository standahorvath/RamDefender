import { Container, Graphics, Assets, Texture, Sprite } from 'pixi.js';
import { centerObjects } from '../utils/general';
import Keyboard from '../Keyboard';
import Mouse from '../Mouse';

export class Player extends Container {


  private graphics = new Graphics()
  private playerSprite = null as Sprite | null;
  private cannonSprite = null as Sprite | null;
  private keyboard = Keyboard.getInstance();
  private mouse = Mouse.getInstance();

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

    this.mouse.on('MOVE', ({ action, x, y }) => {
      this.onMouseMove(x, y)
    });

    Promise.resolve(Assets.load('/assets/images/player.png')).then((texture:Texture) => {
      this.playerSprite = new Sprite(texture)
      this.playerSprite.anchor.set(0.5, 0.5)
      this.addChild(this.playerSprite)	

      Promise.resolve(Assets.load('/assets/images/cannon.png')).then((texture:Texture) => {
        this.cannonSprite = new Sprite(texture)
        if(!this.playerSprite) return
        this.playerSprite.addChild(this.cannonSprite)	
        this.cannonSprite.position.set(0, 0)
        this.cannonSprite.anchor.set(0.5, 0.5)
      })
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

  private onMouseMove(x: number, y: number){
    const mouseX = x
    const mouseY = y
    const playerX = this.x || 0
    const playerY = this.y || 0
    const angle = Math.atan2(mouseY - playerY, mouseX - playerX)
    if(!this.cannonSprite) return
    this.cannonSprite.rotation = angle + Math.PI / 2
  }

  private move(delta: number){
    if(!this.playerSprite) return
    this.x += this.state.moveX * delta * window.playerSpeed
    this.y += this.state.moveY * delta * window.playerSpeed
    this.onMouseMove(Mouse.x, Mouse.y)
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

  public getCannonRotation(){
    if(!this.cannonSprite) return 0
    return this.cannonSprite.rotation
  }

}