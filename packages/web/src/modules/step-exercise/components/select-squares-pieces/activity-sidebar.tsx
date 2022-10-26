import React, { ComponentProps, FunctionComponent } from 'react';
import { ui } from '@application';
import {
  ExerciseActivitySelectSquaresAndPiecesState,
  ExerciseModule,
  ExerciseSelectSquaresAndPiecesStep,
} from '@types';
import { getCorrectSelectionsCount } from './utils';
import { SegmentActivitySidebar } from '../segment';

const { Text, Row, Col } = ui;

const Playground: FunctionComponent<
  ComponentProps<
    ExerciseModule<ExerciseSelectSquaresAndPiecesStep>['ActivitySidebar']
  >
> = props => {
  const { step, stepActivityState } = props;
  const { task } = step.state;
  const { selectedShapes, completed } =
    stepActivityState as ExerciseActivitySelectSquaresAndPiecesState;
  const shapes = task.shapes || [];
  const correctSelectionsCount = getCorrectSelectionsCount(
    shapes,
    selectedShapes,
  );
  return (
    <SegmentActivitySidebar title="Select targets" {...props}>
      <Row>
        <Col className="col-auto">
          <Text fontSize="smallest" className="m-0">
            {!completed
              ? `You have ${
                  shapes.length - correctSelectionsCount
                } selections more to go.`
              : 'Correct!'}
          </Text>
        </Col>
      </Row>
    </SegmentActivitySidebar>
  );
};

export default Playground;
