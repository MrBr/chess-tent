import { db } from '@application';
import { Lesson, Step } from '@chess-tent/models';
import { AppDocument } from '@types';

const exerciseStepAdapter = async (entity: AppDocument<Lesson>) => {
  console.log('TEST');
  if (entity.v !== 0 && !!entity.v) {
    return false;
  }
  console.log('TEST HOPE NOT');
  const updateExerciseSteps = (...args: [Step]): Step => {
    const step = args[0] as Step<{
      exerciseState: {
        explanation: string;
        question: string;
      };
      position: string;
      shapes: [];
      task: {};
      explanation: {};
      hint: {};
    }>;
    if (step.stepType === 'exercise') {
      const { exerciseState, position, shapes } = step.state;
      const { explanation, question, ...taskState } = exerciseState || {};
      step.state.task = {
        text: question,
        position: position,
        shapes,
        ...taskState,
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

export const lessonAdapter = db.createAdapter(exerciseStepAdapter);
