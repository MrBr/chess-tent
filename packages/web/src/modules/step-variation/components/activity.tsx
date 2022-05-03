import React from 'react';
import { FEN, VariationModule } from '@types';
import { components, ui } from '@application';
import { isActivityStepSolving } from '../../lesson/service';

const {
  StepMove,
  LessonToolboxText,
  LessonPlaygroundCard,
  LessonPlaygroundStepTag,
} = components;
const { Row, Col, Icon } = ui;

const ActivityBoard: VariationModule['ActivityBoard'] = ({
  Chessboard,
  step,
}) => {
  const {
    state: { move, shapes },
  } = step;
  const position = move ? move.position : (step.state.position as FEN);
  return <Chessboard fen={position} autoShapes={shapes} />;
};

const ActivitySidebar: VariationModule['ActivitySidebar'] = ({
  step,
  stepActivityState,
}) => {
  const isActive = isActivityStepSolving(stepActivityState);
  return (
    <LessonPlaygroundCard active={isActive}>
      <Row>
        <Col className="col-auto">
          <LessonPlaygroundStepTag active={isActive}>
            {step.state.move ? (
              <StepMove move={step.state.move} className="ps-1 pe-1" />
            ) : (
              <Icon type="board" size="extra-small" />
            )}
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
