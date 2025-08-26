import * as Phaser from 'phaser';
import { SCENE_KEYS } from './scene-keys';
import { ASSET_KEYS } from '../common/assets';
import { KeyboardComponent } from '../components/input/keyboard-component';
import { DataManager } from '../common/data-manager';
import { DEFAULT_UI_TEXT_STYLE } from '../common/common';

export class GameOverScene extends Phaser.Scene {
  #menuContainer!: Phaser.GameObjects.Container;
  #cursorGameObject!: Phaser.GameObjects.Image;
  #controls!: KeyboardComponent;
  #selectedMenuOptionIndex!: number;

  constructor() {
    super({
      key: SCENE_KEYS.GAME_OVER_SCENE,
    });
  }

  public create(): void {
    if (!this.input.keyboard) {
      return;
    }

    this.add.text(this.scale.width / 2, 100, 'Game Over', DEFAULT_UI_TEXT_STYLE).setOrigin(0.5);

    this.#menuContainer = this.add.container(32, 142, [
      this.add.image(0, 0, ASSET_KEYS.UI_DIALOG, 0).setOrigin(0),
      this.add.text(32, 16, 'Continue', DEFAULT_UI_TEXT_STYLE).setOrigin(0),
      this.add.text(32, 32, 'Quit', DEFAULT_UI_TEXT_STYLE).setOrigin(0),
    ]);
    this.#cursorGameObject = this.add.image(20, 14, ASSET_KEYS.UI_CURSOR, 0).setOrigin(0);
    this.#menuContainer.add(this.#cursorGameObject);

    this.#controls = new KeyboardComponent(this.input.keyboard);
    this.#selectedMenuOptionIndex = 0;
    DataManager.instance.resetPlayerHealthToMin();

    // this.scale.on('resize', this.adjustCameraView.bind(this));
    // this.adjustCameraView({ width: this.scale.width, height: this.scale.height });
    // this.onResize();
    // this.cameras.main.setPosition(this.scale.width / 2, this.scale.height / 2);
  }

  adjustCameraView(gameSize: { width: number; height: number }) {
    // 카메라 뷰포트 크기를 '실제 윈도우 크기'로 맞춤(zoom=1)
    this.cameras.main.setViewport(0, 0, gameSize.width, gameSize.height);
    this.cameras.main.setSize(gameSize.width, gameSize.height);
    // this.cameras.main.setZoom(3); // zoom 고정 (축소/확대 X)

    // (필요시) 중앙 맞추기
    this.cameras.main.centerOn(gameSize.width / 2, gameSize.height / 2);
  }
  onResize() {
    // 고정 게임 월드 크기
    const baseWidth = 256;
    const baseHeight = 224;

    // 실제 캔버스(보이는) 크기
    const width = window.innerWidth;
    const height = window.innerHeight;

    // 가로/세로 비율 유지, 크기에 맞춤
    const zoomX = width / baseWidth;
    const zoomY = height / baseHeight;
    const zoom = Math.min(zoomX, zoomY);

    this.cameras.main.setZoom(zoom);
  }

  public update(): void {
    if (this.#controls.isActionKeyJustDown || this.#controls.isAttackKeyJustDown || this.#controls.isEnterKeyJustDown) {
      if (this.#selectedMenuOptionIndex === 1) {
        // this option would be used to take the player back to the title screen for the game
        // instead of refreshing the current browser tab
        window.location.reload();
        return;
      }

      this.scene.start(SCENE_KEYS.GAME_SCENE);
      return;
    }

    if (this.#controls.isUpJustDown) {
      this.#selectedMenuOptionIndex -= 1;
      if (this.#selectedMenuOptionIndex < 0) {
        this.#selectedMenuOptionIndex = 0;
      }
    } else if (this.#controls.isDownJustDown) {
      this.#selectedMenuOptionIndex += 1;
      if (this.#selectedMenuOptionIndex > 1) {
        this.#selectedMenuOptionIndex = 1;
      }
    } else {
      return;
    }

    this.#cursorGameObject.setY(14 + this.#selectedMenuOptionIndex * 16);
  }
}
