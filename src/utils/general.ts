import { DisplayObject, Sprite, Text } from 'pixi.js';

export function centerObjects(...toCenter: DisplayObject[]) {
  const center = (obj: DisplayObject) => {
    obj.x = window.innerWidth / 2;
    obj.y = window.innerHeight / 2;

    if (obj instanceof Sprite) {
      obj.anchor.set(0.5);
    }
    if(obj instanceof Text){
      obj.anchor.set(0.5);
    }
  };

  toCenter.forEach(center);
}

export function wait(seconds: number) {
  return new Promise<void>((res) => setTimeout(res, seconds * 1000));
}

export async function after(
  seconds: number,
  callback: (...args: unknown[]) => unknown
) {
  await wait(seconds);
  return callback();
}

export function isIntersecting(a: DisplayObject, b: DisplayObject) {
  const boundsA = a.getBounds();
  const boundsB = b.getBounds();
  return (
    boundsA.x + boundsA.width > boundsB.x &&
    boundsA.x < boundsB.x + boundsB.width &&
    boundsA.y + boundsA.height > boundsB.y &&
    boundsA.y < boundsB.y + boundsB.height
  );
}