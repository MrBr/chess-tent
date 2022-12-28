import { MoveStep } from '@types';
import application from '@application';

describe('promoteVariation', () => {
  test('promotes a move to a variation', async () => {
    const { createStep, promoteVariation } = application.services;
    const moveD5Variation = createStep('variation', {
      move: {
        position: '',
        move: ['d7', 'd5'],
        piece: {
          color: 'black',
          role: 'pawn',
        },
        index: 1,
      },
    });
    const moveE4 = createStep('move', {
      move: {
        position: '',
        move: ['e2', 'e4'],
        piece: {
          color: 'white',
          role: 'pawn',
        },
        index: 1,
      },
      steps: [moveD5Variation],
    });
    const moveE5 = createStep('move', {
      move: {
        position: '',
        move: ['e7', 'e5'],
        piece: {
          color: 'black',
          role: 'pawn',
        },
        index: 1,
      },
    });
    const mainLine = createStep('variation', {
      steps: [moveE4, moveE5],
    });
    const newMainLine = promoteVariation(mainLine, moveD5Variation);
    expect(
      (newMainLine.state.steps[0].state.steps[0] as MoveStep).state.move,
    ).toEqual(moveE5.state.move);
    expect((newMainLine.state.steps[1] as MoveStep).state.move).toEqual(
      moveD5Variation.state.move,
    );
  });
});

export {};
