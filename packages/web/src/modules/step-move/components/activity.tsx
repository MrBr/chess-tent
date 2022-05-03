import React from 'react';
import { MoveModule } from '@types';
import { components, ui } from '@application';
import { isActivityStepSolving } from '../../lesson/service';

const {
  StepMove,
  LessonToolboxText,
  LessonPlaygroundCard,
  LessonPlaygroundStepTag,
} = components;
const { Row, Col } = ui;

const ActivityBoard: MoveModule['ActivityBoard'] = ({ Chessboard, step }) => {
  const {
    state: {
      move: { position },
      shapes,
    },
  } = step;
  return <Chessboard fen={position} autoShapes={shapes} />;
};

const ActivitySidebar: MoveModule['ActivitySidebar'] = ({
  step,
  stepActivityState,
}) => {
  const isActive = isActivityStepSolving(stepActivityState);

  return (
    <LessonPlaygroundCard active={isActive}>
      <Row>
        <Col className="col-auto">
          <LessonPlaygroundStepTag active={isActive}>
            <StepMove move={step.state.move} className="ps-1 pe-1" />
          </LessonPlaygroundStepTag>
        </Col>
        <Col>
          <LessonToolboxText text={step.state.description} />
        </Col>
      </Row>
    </LessonPlaygroundCard>
  );
};

export { ActivityBoard, ActivitySidebar };
