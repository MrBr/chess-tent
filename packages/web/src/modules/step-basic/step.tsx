import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import FormGroup from 'react-bootstrap/FormGroup';
import _ from 'lodash';
import { DrawShape } from 'chessground/draw';
import uuid from 'uuid/v1';
import { Step, createStep as coreCreateStep } from '@chess-tent/models';
import {
  ChessboardInterface,
  FEN,
  Move,
  StepComponent,
  StepModule,
} from '@types';
import { services, ui, hooks, components, state } from '@application';

const { recreateFenWithMoves } = services;
const { useDispatchBatched } = hooks;
const { Chessboard, Action } = components;
const { Confirm, Button } = ui;
const {
  actions: { updateStepState },
} = state;

const stepType = 'description';

type DescriptionStepState = {
  moves: Move[];
  shapes: DrawShape[];
  position: FEN; // Step end position - position once step is finished
  description?: string;
  hoverShape?: DrawShape;
  activeMove?: Move;
};
type DescriptionStep = Step<DescriptionStepState, typeof stepType>;

type DescriptionModule = StepModule<DescriptionStep, typeof stepType>;

const getMovesToMove = (step: DescriptionStep, move: Move) => {
  const moveIndex = step.state.moves.findIndex(stepMove => stepMove === move);
  return step.state.moves.slice(0, moveIndex + 1);
};

const createStep: DescriptionModule['createStep'] = (
  id,
  prevPosition,
  initialState,
) =>
  coreCreateStep<DescriptionStep>(id, stepType, {
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
  const boardRef = useRef<ChessboardInterface>(null);

  // Live position synchronization
  useEffect(() => {
    let activePosition = position;
    if (activeMove) {
      const activeMoves = activeMove ? getMovesToMove(step, activeMove) : moves;
      activePosition = recreateFenWithMoves(prevPosition, activeMoves);
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
    (shapes: DrawShape[]) => dispatch(updateStepState(step, { shapes })),
    [dispatch, step],
  );

  const updateMoves = useCallback(
    (position: FEN, move: Move | undefined) => {
      if (!move) {
        return;
      }
      dispatch(
        updateStepState(step, {
          position: position,
          moves: [...moves, move],
        }),
      );
    },
    [dispatch, moves, step],
  );

  const alterMoves = useCallback(
    (newMove: Move) => {
      const moves = getMovesToMove(step, step.state.activeMove as Move);
      const newMoves = [...moves, newMove];
      const newPosition = recreateFenWithMoves(prevPosition, newMoves);
      dispatch(
        updateStepState(step, {
          position: newPosition,
          moves: newMoves,
          activeMove: null,
        }),
      );
    },
    [dispatch, prevPosition, step],
  );

  const addNewSection = useCallback(
    (move: Move) => {
      const moves = getMovesToMove(step, step.state.activeMove as Move);
      const livePosition = recreateFenWithMoves(prevPosition, moves);
      const newPosition = recreateFenWithMoves(livePosition, [move]);
      addSection([
        createStep(uuid(), livePosition, {
          moves: [move],
          position: newPosition,
        }),
      ]);
    },
    [addSection, prevPosition, step],
  );

  const validateMove = useCallback(
    (orig, dest) => {
      if (!activeMove) {
        return true;
      }
      boardRef.current &&
        boardRef.current.prompt((close: Function) => (
          <Confirm
            title="Altering live position"
            message="Changing variation in the middle is not possible. Either alter current step or create new section (variation)."
            onOk={() => {
              close();
              addNewSection([orig, dest]);
            }}
            okText="Create new section"
            onCancel={() => {
              close();
              alterMoves([orig, dest]);
            }}
            cancelText="Alter current step"
          />
        ));
      return false;
    },
    [activeMove, addNewSection, alterMoves],
  );

  const updateDescriptionDebounced = useCallback(
    _.debounce((description: string) => {
      dispatch(updateStepState(step, { description }));
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
      <Button onClick={() => addSection()}>Add section</Button>
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
              rows={3}
              placeholder="Describe next few steps"
              onChange={updateDescription}
              defaultValue={description}
            />
          </FormGroup>
        </Col>
        <Col>
          <Chessboard
            ref={boardRef}
            validateMove={validateMove}
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

const Playground: StepComponent<DescriptionStep> = () => {
  return <>{'Basic step playground'}</>;
};

const Exercise: StepComponent<DescriptionStep> = () => {
  return <>{'Description'}</>;
};

const ActionsComponent: StepComponent<DescriptionStep> = ({ step }) => {
  const dispatch = useDispatchBatched();
  const setActiveMove = useCallback(
    (activeMove: Move) =>
      dispatch(
        updateStepState(step, {
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
        {step.state.moves.map((move, index) => (
          <Action key={index} onClick={() => setActiveMove(move)}>
            {move}
          </Action>
        ))}
        {step.state.shapes.map((shape, index) => (
          <Action key={index}>{shape.brush}</Action>
        ))}
      </div>
    </>
  );
};

const Module: DescriptionModule = {
  Editor,
  Picker,
  Playground,
  Exercise,
  Actions: ActionsComponent,
  createStep,
  getEndSetup,
  stepType,
};

export default Module;
