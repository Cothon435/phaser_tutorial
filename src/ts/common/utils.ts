import * as Phaser from 'phaser';
import { DIRECTION, LEVEL_NAME } from './common';
import { CustomGameObject, Direction, GameObject, LevelName, Position } from './types';

/**
 * Utility function to ensure we handle the full possible range of types when checking a variable for a possible
 * type in a union.
 *
 * A good example of this is when we check for all of the possible values in a `switch` statement, and we want
 * to ensure we check for all possible values in an enum type object.
 */
export function exhaustiveGuard(_value: never): never {
    throw new Error(`Error! Reached forbidden guard function with unexpected value: ${JSON.stringify(_value)}`);
}

export function isArcadePhysicsBody(
    body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | MatterJS.BodyType | null
): body is Phaser.Physics.Arcade.Body {
    if (body === undefined || body === null) {
        return false;
    }
    return body instanceof Phaser.Physics.Arcade.Body;
}

export function isDirection(direction: string): direction is Direction {
    return DIRECTION[direction as Direction] !== undefined;
}

export function isCustomGameObject(gameObject: GameObject): gameObject is GameObject & CustomGameObject {
    return hasProperties<GameObject & CustomGameObject>(gameObject, 'disableObject', 'enableObject');
}

export function getDirectionOfObjectFromAnotherObject(object: Position, targetObject: Position): Direction {
    if (object.y < targetObject.y) {
        return DIRECTION.DOWN;
    }
    if (object.y > targetObject.y) {
        return DIRECTION.UP;
    }
    if (object.x < targetObject.x) {
        return DIRECTION.RIGHT;
    }
    return DIRECTION.LEFT;
}

export function isLevelName(levelName: string): levelName is LevelName {
    return LEVEL_NAME[levelName as LevelName] !== undefined;
}

// 공통 타입 가드 유틸
export function hasProperties<T>(obj: unknown, ...keys: (keyof any)[]): obj is T {
    return typeof obj === 'object' && obj !== null && keys.every((key) => (obj as any)[key] !== undefined);
}

export function isNullOrUndefined<T>(value: T | null | undefined): value is null | undefined {
    return value === null || value === undefined;
}

export function assertNonNull<T>(value: T | null | undefined, name: string): T {
    if (value === null || value === undefined) {
        throw new Error(`${name}가 null 또는 undefined입니다.`);
    }
    return value;
}
