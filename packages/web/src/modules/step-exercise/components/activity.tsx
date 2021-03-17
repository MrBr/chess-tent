import React, { ComponentProps, FunctionComponent } from 'react';
import { ExerciseModule } from '@types';

import VariationActivityBoard from './variation/activity-board';
import QuestionActivityBoard from './question/activity-board';
import QuestionnaireActivityBoard from './questionnaire/activity-board';
import SelectSquaresPiecesActivityBoard from './select-squares-pieces/activity-board';
import ArrangePiecesActivityBoard from './arrange-pieces/activity-board';

import VariationActivitySidebar from './variation/activity-sidebar';
import QuestionActivitySidebar from './question/activity-sidebar';
import QuestionnaireActivitySidebar from './questionnaire/activity-sidebar';
import SelectSquaresPiecesActivitySidebar from './select-squares-pieces/activity-sidebar';
import ArrangePiecesActivitySidebar from './arrange-pieces/activity-sidebar';
import {
  isArrangePiecesExerciseStep,
  isQuestionExerciseStep,
  isQuestionnaireExerciseStep,
  isSelectSquarePiecesExerciseStep,
  isVariationExerciseStep,
} from '../service';

const ActivityBoard: FunctionComponent<
  ComponentProps<ExerciseModule['ActivityBoard']>
> = props => {
  if (isVariationExerciseStep(props.step)) {
    return <VariationActivityBoard {...props} step={props.step} />;
  }
  if (isQuestionExerciseStep(props.step)) {
    return <QuestionActivityBoard {...props} step={props.step} />;
  }
  if (isQuestionnaireExerciseStep(props.step)) {
    return <QuestionnaireActivityBoard {...props} step={props.step} />;
  }
  if (isSelectSquarePiecesExerciseStep(props.step)) {
    return <SelectSquaresPiecesActivityBoard {...props} step={props.step} />;
  }
  if (isArrangePiecesExerciseStep(props.step)) {
    return <ArrangePiecesActivityBoard {...props} step={props.step} />;
  }
  return null;
};

const ActivitySidebar: FunctionComponent<
  ComponentProps<ExerciseModule['ActivitySidebar']>
> = props => {
  if (isVariationExerciseStep(props.step)) {
    return <VariationActivitySidebar {...props} step={props.step} />;
  }
  if (isQuestionExerciseStep(props.step)) {
    return <QuestionActivitySidebar {...props} step={props.step} />;
  }
  if (isQuestionnaireExerciseStep(props.step)) {
    return <QuestionnaireActivitySidebar {...props} step={props.step} />;
  }
  if (isSelectSquarePiecesExerciseStep(props.step)) {
    return <SelectSquaresPiecesActivitySidebar {...props} step={props.step} />;
  }
  if (isArrangePiecesExerciseStep(props.step)) {
    return <ArrangePiecesActivitySidebar {...props} step={props.step} />;
  }
  return null;
};

export { ActivityBoard, ActivitySidebar };
