import SceneManager from './SceneManager';

window.playerSpeed = 0.3
window.shootSpeed = 1
window.enemySpeed = 0.1

const sceneManager = new SceneManager();
await sceneManager.switchScene('Game');