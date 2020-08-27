import React from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  Step,
  createStep as coreCreateStep,
  getLessonParentStep,
} from '@chess-tent/models';
import { FEN, Move, Piece, StepModule } from '@types';
import { components, state, stepModules, ui } from '@application';

const {
  actions: { updateStepState },
} = state;
const { Container, Col, Row } = ui;
const { Chessboard } = components;

const stepType = 'description';

type DescriptionStepState = {
  shapes: DrawShape[];
  position: FEN; // Step end position - position once step is finished
  description?: string;
  steps: Step[];
};
type DescriptionStep = Step<DescriptionStepState, typeof stepType>;

type DescriptionModule = StepModule<DescriptionStep, typeof stepType>;

const createStep = (
  id: string,
  prevPosition: FEN,
  initialState?: Partial<DescriptionStep['state']>,
) =>
  coreCreateStep<DescriptionStep>(id, stepType, {
    shapes: [],
    steps: [],
    position: prevPosition,
    ...(initialState || {}),
  });

const changeReactor: DescriptionModule['changeReactor'] = (lesson, step) => (
  newPosition: FEN,
  newMove?: Move,
  movedPiece?: Piece,
) => {
  const parentStep = getLessonParentStep(lesson, step) as Step;
  return stepModules
    .getStepModule(parentStep.stepType)
    .changeReactor(lesson, parentStep)(newPosition, newMove, movedPiece);
};

const shapesReactor: DescriptionModule['shapesReactor'] = (
  lesson,
  step,
) => shapes => [updateStepState(step, { shapes })];
const getEndSetup: DescriptionModule['getEndSetup'] = ({
  state,
}: DescriptionStep) => ({
  position: state.position,
  shapes: state.shapes,
});

const Editor: DescriptionModule['Editor'] = ({ step, lesson, ...props }) => {
  const parentStep = getLessonParentStep(lesson, step) as Step;
  const ParentEditor = stepModules.getStepModule(parentStep.stepType).Editor;
  return <ParentEditor {...props} lesson={lesson} step={parentStep} />;
};

const Picker: DescriptionModule['Picker'] = () => {
  return <>Description</>;
};

const Playground: DescriptionModule['Playground'] = ({ step, footer }) => {
  const {
    state: { position, shapes },
  } = step;
  return (
    <Container>
      <Row>
        <Col>
          <Chessboard fen={position} shapes={shapes} footer={footer} />
        </Col>
      </Row>
    </Container>
  );
};

const Exercise: DescriptionModule['Exercise'] = () => {
  return <>{'Description'}</>;
};

const ActionsComponent: DescriptionModule['Actions'] = ({
  step,
  setActiveStep,
}) => {
  // const updateDescriptionDebounced = useCallback(
  //     _.debounce((description: string) => {
  //         dispatch(updateStepState(step, { description }));
  //     }, 500),
  //     [dispatch],
  // );
  //
  // const updateDescription = useCallback(
  //     e => {
  //         updateDescriptionDebounced(e.target.value);
  //     },
  //     [updateDescriptionDebounced],
  // );

  return <div onClick={() => setActiveStep(step)}>Comment</div>;
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
  changeReactor,
  shapesReactor,
};

export default Module;
