import { db, service } from '@application';
import { LessonActivity, LessonActivityBoardState } from '@chess-tent/models';
import { AppDocument } from '@types';

const activityBoardStateAdapter = async (
  entity: AppDocument<LessonActivity>,
) => {
  if (!entity || (entity.v !== 0 && !!entity.v) || !entity.state) {
    return false;
  }
  const mainBoard = {
    // Previously, activity state was board state
    ...(entity.state as unknown as LessonActivityBoardState),
    // Previously, activity.completedSteps on the root was place for completed steps -> now in the boardState
    completedSteps: ((entity as any).completedSteps as string[]) || [],
    id: service.generateIndex(),
  };
  delete entity.state;
  entity.state = {
    mainBoardId: mainBoard.id,
    boards: {
      [mainBoard.id]: mainBoard,
    },
    userSettings: {},
  };

  entity.v = 1;
  entity.markModified('state');
  return entity;
};

export const activityAdapter = db.createAdapter(activityBoardStateAdapter);
