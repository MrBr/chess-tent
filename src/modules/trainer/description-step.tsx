import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import _ from 'lodash';
import { DrawShape } from 'chessground/draw';

import { Step, FEN, Move, StepComponent, StepModule } from '../app/types';
import Chessboard from '../chessboard';
import { Action } from './step';
import { updateStepStateAction } from './redux';
import { Button } from '../ui/Button';
import { useDispatchBatched } from '../app/hooks';
import * as Service from './service';
import { createFen } from '../chess';

const type = 'description';

type DescriptionStepState = {
  moves: Move[];
  shapes: DrawShape[];
  position: FEN; // Step end position - position once step is finished
  description?: string;
  hoverShape?: DrawShape;
  activeMove?: Move;
};
type DescriptionStep = Step<DescriptionStepState, typeof type>;

type DescriptionModule = StepModule<DescriptionStep, typeof type>;

const getMovesToMove = (step: DescriptionStep, move: Move) => {
  const moveIndex = step.state.moves.findIndex(stepMove => stepMove === move);
  return step.state.moves.slice(0, moveIndex + 1);
};

const Editor: StepComponent<DescriptionStep> = ({
  step,
  addSection,
  addStep,
  prevPosition,
}) => {
  const {
    state: { moves, activeMove, position, shapes, description },
  } = step;
  const [livePosition, setLivePosition] = useState<FEN>(position);
  const dispatch = useDispatchBatched();

  // Live position synchronization
  useEffect(() => {
    let activePosition = position;
    if (activeMove) {
      const activeMoves = activeMove ? getMovesToMove(step, activeMove) : moves;
      activePosition = createFen(prevPosition, activeMoves);
    }
    if (activePosition !== livePosition) {
      // Don't update state if nothing changed
      setLivePosition(activePosition);
    }
  }, [
    prevPosition,
    activeMove,
    moves,
    setLivePosition,
    position,
    step,
    livePosition,
  ]);

  const updateShapes = useCallback(
    (shapes: DrawShape[]) => dispatch(updateStepStateAction(step, { shapes })),
    [dispatch, step],
  );

  const updateMoves = useCallback(
    (position: FEN, move: Move | undefined) => {
      if (move) {
        dispatch(
          updateStepStateAction(step, {
            position: position,
            moves: [...moves, move],
          }),
        );
      }
    },
    [dispatch, moves, step],
  );

  const updateDescriptionDebounced = useCallback(
    _.debounce((description: string) => {
      dispatch(updateStepStateAction(step, { description }));
    }, 500),
    [dispatch],
  );

  const updateDescription = useCallback(
    e => {
      updateDescriptionDebounced(e.target.value);
    },
    [updateDescriptionDebounced],
  );

  const BoardHeader = () => (
    <div>
      <Button onClick={addSection}>Add section</Button>
      <Button onClick={addStep}>Add step</Button>
    </div>
  );
  return (
    <Container>
      <Row>
        <Col>
          <FormGroup>
            <Form.Label>Description:</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              placeholder="Describe next few steps"
              onChange={updateDescription}
              defaultValue={description}
            />
          </FormGroup>
        </Col>
        <Col>
          <Chessboard
            fen={livePosition}
            header={<BoardHeader />}
            onChange={updateMoves}
            onShapesChange={updateShapes}
            shapes={shapes}
          />
        </Col>
      </Row>
    </Container>
  );
};

const Picker: FunctionComponent = () => {
  return <>Description</>;
};

const Playground: StepComponent<DescriptionStep> = ({ step }) => {
  return <>{'Basic step playground'}</>;
};

const Exercise: StepComponent<DescriptionStep> = ({ step }) => {
  return <>{'Description'}</>;
};

const ActionsComponent: StepComponent<DescriptionStep> = ({ step }) => {
  const dispatch = useDispatchBatched();
  const setActiveMove = useCallback(
    (activeMove: Move) =>
      dispatch(
        updateStepStateAction(step, {
          activeMove:
            activeMove === _.last(step.state.moves) ? undefined : activeMove,
        }),
      ),
    [dispatch, step],
  );
  return (
    <>
      Actions
      <div>
        {step.state.moves.map(move => (
          <Action onClick={() => setActiveMove(move)}>{move}</Action>
        ))}
        {step.state.shapes.map(shape => (
          <Action>{shape.brush}</Action>
        ))}
      </div>
    </>
  );
};

const createStep: DescriptionModule['createStep'] = (
  id,
  prevPosition,
  initialState,
) =>
  Service.createStep<DescriptionStep>(id, type, {
    moves: [],
    shapes: [],
    position: prevPosition,
    ...initialState,
  });

const getEndSetup: DescriptionModule['getEndSetup'] = ({
  state,
}: DescriptionStep) => ({
  position: state.position,
  shapes: state.shapes,
});

const Module: DescriptionModule = {
  Editor,
  Picker,
  Playground,
  Exercise,
  Actions: ActionsComponent,
  createStep,
  getEndSetup,
  type,
};

export default Module;
