import React from 'react';
import { DescriptionModule } from '@types';
import { components, ui } from '@application';

const { Icon, Row, Col } = ui;
const { LessonToolboxText, LessonPlaygroundStepTag } = components;

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
}) => {
  const {
    state: { description },
  } = step;

  return (
    <Row>
      <Col className="col-auto">
        <LessonPlaygroundStepTag active>
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
  );
};
