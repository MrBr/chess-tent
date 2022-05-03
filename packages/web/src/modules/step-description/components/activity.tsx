import React from 'react';
import { DescriptionModule } from '@types';
import { components, ui } from '@application';
import { isActivityStepSolving } from '../../lesson/service';

const { Icon, Row, Col } = ui;
const { LessonToolboxText, LessonPlaygroundCard, LessonPlaygroundStepTag } =
  components;

export const ActivityBoard: DescriptionModule['ActivityBoard'] = ({
  Chessboard,
  step,
}) => {
  const {
    state: { position, shapes },
  } = step;
  return <Chessboard fen={position} autoShapes={shapes} />;
};

export const ActivitySidebar: DescriptionModule['ActivitySidebar'] = ({
  step,
  stepActivityState,
}) => {
  const {
    state: { description },
  } = step;
  const isActive = isActivityStepSolving(stepActivityState);

  return (
    <LessonPlaygroundCard active={isActive}>
      <Row>
        <Col className="col-auto">
          <LessonPlaygroundStepTag active={isActive}>
            <Icon type="comment" size="extra-small" />
          </LessonPlaygroundStepTag>
        </Col>
        <Col>
          <LessonToolboxText
            text={description}
            placeholder="Comment should be here :o"
          />
        </Col>
      </Row>
    </LessonPlaygroundCard>
  );
};
