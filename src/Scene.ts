import { Container } from 'pixi.js';
import AssetLoader from './AssetLoader';

export interface SceneUtils {
	assetLoader: AssetLoader;
  }

export interface Scene {
  load?(): void | Promise<void>;
  unload?(): void | Promise<void>;
  start?(): void | Promise<void>;
  onResize?(width: number, height: number): void;
  update?(delta: number): void;
}

export abstract class Scene extends Container {
  abstract name: string;

  constructor(protected utils: SceneUtils) {
    super();
  }
}

export default Scene;