import EventEmitter from 'eventemitter3';

export default class Mouse extends EventEmitter {
  private static instance: Mouse;

  static states = {
    ACTION: 'ACTION',
  };

  public static x = 0;
  public static y = 0;


  private constructor() {
    super();

    this.listenToKeyEvents();
  }

  private listenToKeyEvents() {
    document.addEventListener('mousemove', (e) => this.onMouseMove(e.clientX, e.clientY));
    document.addEventListener('mousedown', (e) => this.onMouseDown(e.button));
    document.addEventListener('mouseup', (e) => this.onMouseUp(e.button));
  }

  public static getInstance(): Mouse {
    if (!Mouse.instance) {
      Mouse.instance = new Mouse();
    }

    return Mouse.instance;
  }


  private onMouseMove(x: number, y: number): void {
    Mouse.x = x;
    Mouse.y = y;
    this.emit('MOVE', {
      action: 'MOVE',
      x,
      y,
    });
  }

  private onMouseDown(button: number): void {
    this.emit('CLICK', {
      action: 'CLICK',
      buttonState: 'pressed',
      button,
    });
  }

  private onMouseUp(button: number): void {
    this.emit('CLICK', {
      action: 'CLICK',
      buttonState: 'released',
      button,
    });
  }

}