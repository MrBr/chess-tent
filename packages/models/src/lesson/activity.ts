import { Activity } from '../activity';
import { Step } from '../step';
import { Chapter } from '../chapter';
import { Analysis } from '../analysis';
import { createService } from '../_helpers';

export const markStepCompleted = createService(
  <T extends Activity>(draft: T, step: Step): T => {
    draft.completedSteps.push(step.id);
    return draft;
  },
);

export const updateActivityActiveStep = createService(
  <T extends Activity>(draft: T, step: Step, initialState: {}): T => {
    if (!draft.state[step.id]) {
      draft.state[step.id] = initialState;
    }
    draft.state.activeStepId = step.id;
    return draft;
  },
);

export const updateActivityActiveChapter = createService(
  <T extends Activity>(draft: T, chapter: Chapter): T => {
    draft.state.activeChapterId = chapter.id;
    return draft;
  },
);

export const updateActivityStepAnalysis = createService(
  <T extends Activity>(
    draft: T,
    stepId: Step['id'],
    analysis: Analysis<any>,
  ): T => {
    draft.state[stepId].analysis = analysis;
    return draft;
  },
);
