import * as Phaser from "phaser";
import { GameObject } from "../../common/types";
// 확장 가능한 GameObject 타입
type ExtendedGameObject = GameObject & {
  [key: string]: any;
};

export class BaseGameObjectComponent {
  protected scene: Phaser.Scene;
  protected gameObject: GameObject;

  constructor(gameObject: GameObject) {
    this.scene = gameObject.scene;
    this.gameObject = gameObject;
    this.assignComponentToObject(gameObject);
  }

  static getComponent<T>(gameObject: ExtendedGameObject): T | undefined {
    const key = `_${this.name}`;
    return gameObject[key] as T | undefined;
  }

  static removeComponent(gameObject: ExtendedGameObject): void {
    const key = `_${this.name}`;
    delete gameObject[key];
  }

  protected assignComponentToObject(object: ExtendedGameObject | Phaser.Physics.Arcade.Body): void {
    const key = `_${this.constructor.name}`;
    (object as ExtendedGameObject)[key] = this;
  }
}
