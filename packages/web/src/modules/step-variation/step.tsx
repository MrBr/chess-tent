import React, { FunctionComponent, useCallback } from 'react';
import { DrawShape } from 'chessground/draw';
import {
  Step,
  createStep as coreCreateStep,
  addStep,
  getLastStep,
} from '@chess-tent/models';
import { FEN, Move, Piece, StepComponent, StepModule } from '@types';
import { hooks, components, state, stepModules, ui } from '@application';

const { Check, Container, Col, Row } = ui;
const { useDispatchBatched } = hooks;
const { Chessboard, Stepper } = components;
const {
  actions: { updateStepState, setLessonActiveStep, updateEntities },
} = state;

const stepType = 'variation';

type VariationStepState = {
  shapes: DrawShape[];
  position: FEN; // Step end position - position once step is finished
  description?: string;
  steps: Step[];
  editing?: boolean;
};
type VariationStep = Step<VariationStepState, typeof stepType>;

type VariationModule = StepModule<VariationStep, typeof stepType>;

const createStep = (
  id: string,
  prevPosition: FEN,
  initialState?: Partial<VariationStep['state']>,
) =>
  coreCreateStep<VariationStep>(id, stepType, {
    shapes: [],
    steps: [],
    position: prevPosition,
    ...(initialState || {}),
  });

const getEndSetup: VariationModule['getEndSetup'] = ({
  state,
}: VariationStep) => ({
  position: state.position,
  shapes: state.shapes,
});

const changeReactor: VariationModule['changeReactor'] = (lesson, step) => (
  newPosition: FEN,
  newMove?: Move,
  movedPiece?: Piece,
) => {
  const {
    state: { editing },
  } = step;
  if (editing || !newMove || !movedPiece) {
    return [
      updateStepState(step, {
        position: newPosition,
        editing: true,
        steps: [],
      }),
    ];
  }

  const newMoveStep = stepModules.createStep('move', newPosition, {
    move: newMove,
  });

  const lastVariationStep = getLastStep(step);
  if (lastVariationStep?.stepType === 'move') {
    const newVariationStep = stepModules.createStep('variation', newPosition, {
      steps: [newMoveStep],
    });

    return [
      updateEntities(addStep(step, newVariationStep)),
      setLessonActiveStep(lesson, newMoveStep),
    ];
  }

  return [
    updateEntities(addStep(step, newMoveStep)),
    setLessonActiveStep(lesson, newMoveStep),
  ];
};

const shapesReactor: VariationModule['shapesReactor'] = (
  lesson,
  step,
) => shapes => [updateStepState(step, { shapes })];

const Editor: StepComponent<VariationStep> = ({ step, lesson }) => {
  const {
    state: { position, shapes, editing },
  } = step;
  const dispatch = useDispatchBatched();

  const toggleEditingMode = useCallback(
    () => dispatch(updateStepState(step, { editing: !editing })),
    [dispatch, step, editing],
  );

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

  const footer = (
    <div>
      Edit <Check onChange={toggleEditingMode} checked={!!editing} />
    </div>
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
            footer={footer}
          />
        </Col>
      </Row>
    </Container>
  );
};

const Picker: FunctionComponent = () => {
  return <>Variation</>;
};

const Playground: StepComponent<VariationStep> = () => {
  return <>{'Basic step playground'}</>;
};

const Exercise: StepComponent<VariationStep> = () => {
  return <>{'Variation'}</>;
};

const ActionsComponent: StepComponent<VariationStep> = ({
  step,
  setActiveStep,
  lesson,
  ...props
}) => {
  const dispatch = useDispatchBatched();
  return (
    <>
      <div onClick={() => setActiveStep(step)}>FEN</div>
      <div
        onClick={() => {
          const newDescriptionStep = stepModules.createStep(
            'description',
            step.state.position,
          );
          dispatch(
            updateEntities({
              ...step,
              state: {
                ...step.state,
                steps: [newDescriptionStep, ...step.state.steps],
              },
            }),
            setLessonActiveStep(lesson, newDescriptionStep),
          );
        }}
      >
        Add step
      </div>
      <Stepper
        {...props}
        steps={step.state.steps}
        setActiveStep={setActiveStep}
        lesson={lesson}
      />
    </>
  );
};

const Module: VariationModule = {
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