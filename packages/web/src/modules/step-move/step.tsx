import React, { FunctionComponent, useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  Step,
  createStep as coreCreateStep,
  getLessonParentStep,
  isLastStep,
  addStep,
} from '@chess-tent/models';
import { FEN, Move, Piece, StepComponent, StepModule } from '@types';
import {
  services,
  hooks,
  components,
  state,
  stepModules,
  ui,
} from '@application';

const { Container, Col, Row } = ui;
const { getPiece } = services;
const { useDispatchBatched } = hooks;
const { Chessboard, Action, Stepper } = components;
const {
  actions: { updateStepState, updateEntities, setLessonActiveStep },
} = state;

const stepType = 'move';

type MoveStepState = {
  shapes: DrawShape[];
  position: FEN; // Step end position - position once step is finished
  description?: string;
  move?: Move;
  steps: Step[];
};

type MoveStep = Step<MoveStepState, typeof stepType>;

type MoveModule = StepModule<MoveStep, typeof stepType>;

const createStep = (
  id: string,
  prevPosition: FEN,
  initialState?: Partial<MoveStep['state']>,
) =>
  coreCreateStep<MoveStep>(id, stepType, {
    shapes: [],
    steps: [],
    position: prevPosition,
    ...(initialState || {}),
  });

const getEndSetup: MoveModule['getEndSetup'] = ({ state }: MoveStep) => ({
  position: state.position,
  shapes: state.shapes,
});

const changeReactor: MoveModule['changeReactor'] = (lesson, step) => (
  newPosition: FEN,
  newMove?: Move,
  movedPiece?: Piece,
) => {
  const {
    state: { move, position },
  } = step;
  if (!newMove || !movedPiece) {
    return [];
  }
  if (!move) {
    return [
      updateStepState(step, {
        position: newPosition,
        move: newMove,
      }),
    ];
  }

  const parentStep = getLessonParentStep(lesson, step) as MoveStep;
  const previousPiece = getPiece(position, move[1]) as Piece;
  const newMoveStep = stepModules.createStep('move', newPosition, {
    move: newMove,
  });

  if (movedPiece.color === previousPiece.color) {
    // New example
    const newVariationStep = stepModules.createStep('variation', newPosition, {
      editing: true,
    });
    return [
      updateEntities(addStep(step, newVariationStep)),
      setLessonActiveStep(lesson, newVariationStep),
    ];
  }

  if (!isLastStep(parentStep, step)) {
    // New variation
    const newVariationStep = stepModules.createStep('variation', newPosition, {
      steps: [newMoveStep],
    });
    return [
      updateEntities(addStep(step, newVariationStep)),
      setLessonActiveStep(lesson, newMoveStep),
    ];
  }

  // Continuing the current variation
  return [
    updateEntities(addStep(parentStep, newMoveStep)),
    setLessonActiveStep(lesson, newMoveStep),
  ];
};

const shapesReactor: MoveModule['shapesReactor'] = (lesson, step) => shapes => [
  updateStepState(step, { shapes }),
];

const Editor: StepComponent<MoveStep> = ({ step, lesson }) => {
  const {
    state: { position, shapes },
  } = step;
  const dispatch = useDispatchBatched();

  const updateShapes = useCallback(
    (shapes: DrawShape[]) => dispatch(...shapesReactor(lesson, step)(shapes)),
    [dispatch, step, lesson],
  );

  const onChangeHandle = useCallback(
    (newPosition: FEN, newMove?: Move, movedPiece?: Piece) =>
      dispatch(
        ...changeReactor(lesson, step)(newPosition, newMove, movedPiece),
      ),
    [dispatch, step, lesson],
  );

  return (
    <Container>
      <Row>
        <Col>
          <Chessboard
            fen={position}
            onChange={onChangeHandle}
            onShapesChange={updateShapes}
            shapes={shapes}
          />
        </Col>
      </Row>
    </Container>
  );
};

const Picker: FunctionComponent = () => {
  return <>Move</>;
};

const Playground: StepComponent<MoveStep> = () => {
  return <>{'Basic step playground'}</>;
};

const Exercise: StepComponent<MoveStep> = () => {
  return <>{'Move'}</>;
};

const ActionsComponent: StepComponent<MoveStep> = ({
  step,
  setActiveStep,
  ...props
}) => {
  // const updateMoveDebounced = useCallback(
  //     _.debounce((description: string) => {
  //         dispatch(updateStepState(step, { description }));
  //     }, 500),
  //     [dispatch],
  // );
  //
  // const updateMove = useCallback(
  //     e => {
  //         updateMoveDebounced(e.target.value);
  //     },
  //     [updateMoveDebounced],
  // );

  return (
    <>
      {step.state.move && (
        <Action onClick={() => setActiveStep(step)}>{step.state.move}</Action>
      )}
      <Stepper
        {...props}
        steps={step.state.steps}
        setActiveStep={setActiveStep}
      />
    </>
  );
};

const Module: MoveModule = {
  Editor,
  Picker,
  Playground,
  Exercise,
  Actions: ActionsComponent,
  createStep,
  getEndSetup,
  stepType,
  changeReactor,
  shapesReactor,
};

export default Module;
