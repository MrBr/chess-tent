import { MoveStep } from '@types';

describe('promoteVariation', () => {
  test('diff between string and object', async () => {
    const { promoteVariation } = await import('../service');
    const { createStepModuleStep } = await import('../model');
    const moveD5Variation = createStepModuleStep('variation', {
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
    const moveE4 = createStepModuleStep('move', {
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
    const moveE5 = createStepModuleStep('move', {
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
    const mainLine = createStepModuleStep('variation', {
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
