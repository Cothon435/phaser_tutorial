import { CameraControls } from "../controls/CameraControls";

class Example extends Phaser.Scene {
  private cameraControls?: CameraControls;

  preload() {
    this.load.setBaseURL("");
    this.load.image("tiles", "assets/legacy_atlas.png");
    this.load.tilemapTiledJSON("map", "assets/mainMap.json");
  }

  create() {
    const map = this.make.tilemap({ key: "map" });

    // The first parameter is the name of the tileset in Tiled and the second parameter is the key
    // of the tileset image used when loading the file in preload.
    const tiles = map.addTilesetImage("main", "tiles");
    if (tiles == null) {
      throw new DOMException("타일이 없습니다.");
    }

    // You can load a layer from the map using the layer name from Tiled, or by using the layer
    // index (0 in this case).
    const layer1 = map.createLayer(0, tiles, 0, 0); // 첫 번째 레이어 (인덱스 0 또는 이름으로 지정 가능)
    const layer2 = map.createLayer(1, tiles, 0, 0); // 두 번째 레이어 (인덱스 1)

    // 카메라 제어 객체 생성
    this.cameraControls = new CameraControls(this, this.cameras.main, map);
    this.cameras.main.setBounds(
      0,
      0,
      map.widthInPixels,
      map.heightInPixels
    );
    const help = this.add.text(16, 16, "Arrow keys to scroll", {
      fontSize: "18px",
      padding: { x: 10, y: 5 },
      backgroundColor: "#000000",
      // fill: "#b61a1aff",
    });
    help.setScrollFactor(0);
  }

  update(time: number, delta: number) {
    this.cameraControls?.update(delta);
  }
}