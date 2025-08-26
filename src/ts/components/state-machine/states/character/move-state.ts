import { PLAYER_ANIMATION_KEYS } from '../../../../common/assets';
import { BaseCharacterState } from './base-character-state';
import { CHARACTER_STATES } from './character-states';
import { exhaustiveGuard, isArcadePhysicsBody } from '../../../../common/utils';
import { Direction } from '../../../../common/types';
import { DIRECTION, INTERACTIVE_OBJECT_TYPE } from '../../../../common/common';
import { CharacterGameObject } from '../../../../game-objects/common/character-game-object';
import { BaseMoveState } from './base-move-state';
import { InputComponent } from '../../../input/input-component';
import { CollidingObjectsComponent } from '../../../game-object/colliding-objects-component';
import { InteractiveObjectComponent } from '../../../game-object/interactive-object-component';

export class MoveState extends BaseMoveState {
    constructor(gameObject: CharacterGameObject) {
        super(CHARACTER_STATES.MOVE_STATE, gameObject, 'WALK');
    }

    public onUpdate(): void {
        const controls = this._gameObject.controls;

        // if no input is provided transition back to idle state
        if (this.isNoInputMovement(controls)) {
            this._stateMachine.setState(CHARACTER_STATES.IDLE_STATE);
            return;
        }

        // if we interacted with an object and switched states, stop processing
        if (this.#checkIfObjectWasInteractedWith(controls)) {
            return;
        }

        // handle character movement
        this.handleCharacterMovement();
    }

    #checkIfObjectWasInteractedWith(controls: InputComponent): boolean {
        const collideComponent = CollidingObjectsComponent.getComponent<CollidingObjectsComponent>(this._gameObject);
        if (collideComponent === undefined || collideComponent.objects.length === 0) {
            return false;
        }

        const collisionObject = collideComponent.objects[0];
        if (!collisionObject) {
            return false;
        }
        const interactiveObjectComponent =
            InteractiveObjectComponent.getComponent<InteractiveObjectComponent>(collisionObject);
        if (interactiveObjectComponent === undefined) {
            return false;
        }

        if (!controls.isActionKeyJustDown) {
            return false;
        }

        // check if game object can be interacted with
        if (!interactiveObjectComponent.canInteractWith()) {
            return false;
        }
        interactiveObjectComponent.interact();

        // we can carry this item
        if (interactiveObjectComponent.objectType === INTERACTIVE_OBJECT_TYPE.PICKUP) {
            this._stateMachine.setState(CHARACTER_STATES.LIFT_STATE, collisionObject);
            return true;
        }

        // we can open this item
        if (interactiveObjectComponent.objectType === INTERACTIVE_OBJECT_TYPE.OPEN) {
            this._stateMachine.setState(CHARACTER_STATES.OPEN_CHEST_STATE, collisionObject);
            return true;
        }

        if (interactiveObjectComponent.objectType === INTERACTIVE_OBJECT_TYPE.AUTO) {
            return false;
        }

        // we should never hit this code block
        exhaustiveGuard(interactiveObjectComponent.objectType);
    }
}
