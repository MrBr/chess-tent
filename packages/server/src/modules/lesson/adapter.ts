import { db, service } from '@application';
import { Lesson, Step } from '@chess-tent/models';
import { AppDocument } from '@types';

const migrateTaskState = (type: 'questionnaire', state: { options?: {}[] }) => {
  switch (type) {
    case 'questionnaire':
      return {
        ...state,
        options: state.options?.map(option => ({
          id: service.generateIndex(),
          ...option,
        })),
      };
    default:
      return state;
  }
};

const exerciseStepAdapter = async (entity: AppDocument<Lesson>) => {
  if (!entity || (entity.v !== 0 && !!entity.v) || !entity.state) {
    return false;
  }
  const updateExerciseSteps = (...args: [Step]): Step => {
    const step = args[0] as Step<{
      exerciseType: 'questionnaire';
      exerciseState: {
        explanation: string;
        question: string;
      };
      position: string;
      shapes: [];
      task: {};
      explanation: {};
      hint: {};
      activeSegment: string;
    }>;
    if (step.stepType === 'exercise') {
      const { exerciseState, position, shapes, exerciseType } = step.state;
      const { explanation, question, ...taskState } = exerciseState || {};
      step.state.task = {
        text: question,
        position: position,
        shapes,
        ...migrateTaskState(exerciseType, taskState),
      };
      step.state.explanation = {
        text: explanation,
      };
      step.state.hint = {};
      delete step.state.exerciseState;
    }
    step.state.steps.map(updateExerciseSteps);
    return step as Step;
  };

  entity.state.chapters = entity.state.chapters.map(chapter => ({
    ...chapter,
    state: {
      ...chapter.state,
      steps: chapter.state.steps.map(updateExerciseSteps),
    },
  }));

  entity.v = 1;
  entity.markModified('state.chapters');
  return entity;
};

const exerciseActiveSegmentAdapter = async (entity: AppDocument<Lesson>) => {
  if (!entity || entity.v !== 1 || !entity.state) {
    return false;
  }
  const updateExerciseSteps = (...args: [Step]): Step => {
    const step = args[0] as Step<{
      exerciseType: string;
      activeSegment: string;
    }>;
    if (step.stepType === 'exercise') {
      step.state.activeSegment = step.state.activeSegment || 'task';
    }
    step.state.steps.map(updateExerciseSteps);
    return step as Step;
  };

  entity.state.chapters = entity.state.chapters.map(chapter => ({
    ...chapter,
    state: {
      ...chapter.state,
      steps: chapter.state.steps.map(updateExerciseSteps),
    },
  }));

  entity.v = 2;
  entity.markModified('state.chapters');
  return entity;
};

export const lessonAdapter = db.createAdapter(
  exerciseStepAdapter,
  exerciseActiveSegmentAdapter,
);
