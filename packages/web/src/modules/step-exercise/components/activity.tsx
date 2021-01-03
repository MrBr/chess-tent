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

const ActivityBoard: FunctionComponent<
  ComponentProps<ExerciseModule['ActivityBoard']>
> = props => {
  switch (props.step.state.exerciseType) {
    case 'variation':
      return <VariationActivityBoard {...props} />;
    case 'question':
      return <QuestionActivityBoard {...props} />;
    case 'questionnaire':
      return <QuestionnaireActivityBoard {...props} />;
    case 'select-squares-pieces':
      return <SelectSquaresPiecesActivityBoard {...props} />;
    case 'arrange-pieces':
      return <ArrangePiecesActivityBoard {...props} />;
    default:
      return null;
  }
};

const ActivitySidebar: FunctionComponent<
  ComponentProps<ExerciseModule['ActivitySidebar']>
> = props => {
  switch (props.step.state.exerciseType) {
    case 'variation':
      return <VariationActivitySidebar {...props} />;
    case 'question':
      return <QuestionActivitySidebar {...props} />;
    case 'questionnaire':
      return <QuestionnaireActivitySidebar {...props} />;
    case 'select-squares-pieces':
      return <SelectSquaresPiecesActivitySidebar {...props} />;
    case 'arrange-pieces':
      return <ArrangePiecesActivitySidebar {...props} />;
    default:
      return null;
  }
};

export { ActivityBoard, ActivitySidebar };
