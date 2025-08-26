import { isArcadePhysicsBody } from '../../../../common/utils';
import { BaseCharacterState } from './base-character-state';
import { CHARACTER_STATES } from './character-states';
import { CharacterGameObject } from '../../../../game-objects/common/character-game-object';
import { HeldGameObjectComponent } from '../../../game-object/held-game-object-component';
import { ThrowableObjectComponent } from '../../../game-object/throwable-object-component';

export interface BoardDTO {
  boardNum: number;
  soldOut: string;
  category: string;
  title: string;
  price: number;
  memberId: string;
  inputDate: string; // 서버에서 오는 날짜 포맷에 맞게 타입 지정
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export async function fetchBoardList(page = 1, searchType = '', searchWord = ''): Promise<PageResponse<BoardDTO>> {
  const params = new URLSearchParams({
    page: page.toString(),
    searchType,
    searchWord,
  });

  const res = await fetch('/market/board/getList2?page=1', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP Error: ${res.status}`);
  }

  return await res.json();
}

export class IdleState extends BaseCharacterState {
  constructor(gameObject: CharacterGameObject) {
    super(CHARACTER_STATES.IDLE_STATE, gameObject);
  }

  public onEnter(): void {
    // play idle animation based on game object direction
    this._gameObject.animationComponent.playAnimation(`IDLE_${this._gameObject.direction}`);
    // reset game object velocity
    this._resetObjectVelocity();

    const heldComponent = HeldGameObjectComponent.getComponent<HeldGameObjectComponent>(this._gameObject);
    if (heldComponent !== undefined && heldComponent.object !== undefined) {
      const throwObjectComponent = ThrowableObjectComponent.getComponent<ThrowableObjectComponent>(
        heldComponent.object
      );
      if (throwObjectComponent !== undefined) {
        throwObjectComponent.drop();
      }
      heldComponent.drop();
    }
  }

  public onUpdate(): void {
    const controls = this._gameObject.controls;

    if (controls.isMovementLocked) {
      return;
    }

    if (controls.isEnterKeyJustDown) {
      const url = 'http://localhost:8888/market'; // 띄우고 싶은 링크로 변경
      // 새 창 또는 새 탭으로 링크 열기
      const popup = window.open(url, '_blank');
      if (popup) {
        const checkClose = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClose);
            console.log('팝업이 닫혔습니다! Phaser 게임에서 다른 로직 실행 가능');
          }
        }, 500);
      }
      return;
    }

    if (controls.isSpaceKeyJustDown) {
      this.testGet();
      return;
    }

    if (controls.isAttackKeyJustDown) {
      this._stateMachine.setState(CHARACTER_STATES.ATTACK_STATE);
      return;
    }

    // if no other input is provided, do nothing
    if (!controls.isDownDown && !controls.isUpDown && !controls.isLeftDown && !controls.isRightDown) {
      return;
    }

    this._stateMachine.setState(CHARACTER_STATES.MOVE_STATE);
  }

  public async testGet() {
    try {
      const boardPage = await fetchBoardList(1, '', '');
      console.log('받은 데이터:', boardPage);

      // Phaser에서 받은 데이터 처리 예시
      boardPage.content.forEach((board) => {
        console.log(`제목: ${board.title}, 작성자: ${board.memberId}`);
      });
    } catch (error) {
      console.error('게시판 불러오기 실패:', error);
    }
  }
}
