// src/controls/CameraControls.ts
import Phaser from "phaser";

export class CameraControls {
  private scene: Phaser.Scene;
  private camera: Phaser.Cameras.Scene2D.Camera;
  private controls: Phaser.Cameras.Controls.FixedKeyControl;

  constructor(
    scene: Phaser.Scene,
    camera: Phaser.Cameras.Scene2D.Camera,
    map: Phaser.Tilemaps.Tilemap
  ) {
    this.scene = scene;
    this.camera = camera;

    // 방향키 입력 생성
    const cursors = scene.input.keyboard!.createCursorKeys();
    const controlConfig: Phaser.Types.Cameras.Controls.FixedKeyControlConfig = {
      camera: this.camera,
      left: cursors.left!,
      right: cursors.right!,
      up: cursors.up!,
      down: cursors.down!,
      speed: 0.5,
    };
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);

    // 마우스 휠 줌 이벤트
    scene.input.on(
      "wheel",
      (
        _pointer: Phaser.Input.Pointer,
        _gameObjects: Phaser.GameObjects.GameObject[],
        _deltaX: number,
        deltaY: number
      ) => {
        if (deltaY > 0) {
          this.camera.zoom = Math.max(this.camera.zoom - 0.1, 0.5);
        } else {
          this.camera.zoom = Math.min(this.camera.zoom + 0.1, 2);
        }

        // 카메라 경계 재설정 (줌 변경 후)
        this.scene.cameras.main.setBounds(
          0,
          0,
          map.widthInPixels,
          map.heightInPixels
        );
      }
    );
  }

  /** 매 프레임마다 호출 */
  update(delta: number) {
    this.controls.update(delta);
  }
}
