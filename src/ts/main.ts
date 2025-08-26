import Phaser from 'phaser';
import { SCENE_KEYS } from './scenes/scene-keys';
import { PreloadScene } from './scenes/preload-scene';
import { GameScene } from './scenes/game-scene';
import { UiScene } from './scenes/ui-scene';
import { GameOverScene } from './scenes/game-over-scene';
import { PHYSICS_DEBUG } from './common/config';
// import { UiScene } from './scenes/ui-scene';
// import { GameOverScene } from './scenes/game-over-scene';

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  pixelArt: true,
  roundPixels: true,
  scale: {
    parent: 'game-container',
    // width: window.innerWidth,
    // height: window.innerHeight,
    width: 256,
    height: 224,
    autoCenter: Phaser.Scale.CENTER_BOTH, // 화면 중심 정렬
    // mode: Phaser.Scale.ScaleModes.RESIZE, // 브라우저 창 크기에 맞게 자동 리사이즈
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    // mode: Phaser.Scale.FIT,
    // mode: Phaser.Scale.NONE,
  },
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: PHYSICS_DEBUG,
    },
  },
};

const game = new Phaser.Game(gameConfig);

game.scene.add(SCENE_KEYS.PRELOAD_SCENE, PreloadScene);
game.scene.add(SCENE_KEYS.GAME_SCENE, GameScene);
game.scene.add(SCENE_KEYS.UI_SCENE, UiScene);
game.scene.add(SCENE_KEYS.GAME_OVER_SCENE, GameOverScene);
game.scene.start(SCENE_KEYS.PRELOAD_SCENE);
