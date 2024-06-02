import { Container, Graphics, Text, Assets, Texture, Sprite } from 'pixi.js';

export class Stats extends Container {

  private state = {
    score: 0,
    lives: 3,
  }

  private graphics = new Graphics()
  private scoreText = null as Text | null;
  private livesSprites = [] as Sprite[];

  constructor() {
    super();

    Promise.resolve(Assets.load('assets/images/ram.png')).then((texture:Texture) => {
      for(let i = 0; i < this.state.lives; i++){
        const sprite = new Sprite(texture)
        sprite.x = 15 + i * 45
        sprite.y = 10
        this.addChild(sprite)
        this.livesSprites.push(sprite)
      }
    })

    this.scoreText = new Text({
      style: {
        fontFamily: 'Arial',
        fontSize: 20,
        fill: 'white',
        align: 'right',
      },
      x: window.innerWidth - 15,
      y: 12,
      anchor: { x: 1, y: 0 },
    });

    this.render(window.innerWidth)
    this.addChild(this.graphics)
    this.addChild(this.scoreText)
  }

  resize(width: number) {
    this.render(width)
  }
  
  render(width: number) {
    this.graphics.clear();
    this.graphics
      .rect(0, 0, width, 50)
      .fill(0x340083)

    if(this.scoreText){
      this.scoreText.x = width - 15
      this.scoreText.text = `You saved ${this.state.score}MB`
    }
  }

  setScore(score: number) {
    this.state.score = score
    this.render(window.innerWidth)
  }
  addScore(score: number) {
    this.state.score += score
    this.render(window.innerWidth)
  }
  getScore() {
    return this.state.score
  }

  setLives(lives: number) {
    this.state.lives = lives
    this.livesSprites.forEach((sprite, i) => {
      sprite.visible = i < lives
    })
  }
  getLives() {
    return this.state.lives
  }

}