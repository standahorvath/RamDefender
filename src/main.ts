import SceneManager from './SceneManager';

window.playerSpeed = 0.1

const sceneManager = new SceneManager();
await sceneManager.switchScene('Loading');
await sceneManager.switchScene('Game');