import React, { useCallback } from 'react';
import { DrawShape } from '@chess-tent/chessground/dist/draw';
import {
  createStep as coreCreateStep,
  addStep,
  getLastStep,
  Lesson,
  Chapter,
  updateStepState,
  Step,
  addStepToLeft,
} from '@chess-tent/models';
import {
  FEN,
  Move,
  MoveStep,
  Piece,
  VariationModule,
  VariationStep,
} from '@types';
import { components, services, ui } from '@application';
import Footer from './footer';
import BoardSrc from '../images/board.svg';

const { Col, Row, Container, Img } = ui;
const { Stepper, StepTag, StepToolbox, StepMove } = components;

const stepType = 'variation';

const createStep = (
  id: string,
  prevPosition: FEN,
  initialState?: Partial<VariationStep['state']>,
) =>
  coreCreateStep<VariationStep>(id, stepType, {
    shapes: [],
    steps: [],
    position: prevPosition,
    moveIndex: 1,
    ...(initialState || {}),
  });

const boardChange = (
  lesson: Lesson,
  chapter: Chapter,
  step: VariationStep,
  updateStep: (step: Step) => void,
  setActiveStep: (step: Step) => void,
  newPosition: FEN,
  newMove?: Move,
  movedPiece?: Piece,
) => {
  const {
    state: { editing },
  } = step;
  if (editing || !newMove || !movedPiece) {
    updateStep(
      updateStepState(step, {
        position: newPosition,
        editing: true,
        steps: [],
        move: undefined,
      }),
    );
    return;
  }

  const newMoveStep = services.createStep<MoveStep>('move', newPosition, {
    move: newMove,
    movedPiece,
    moveIndex: step.state.move
      ? step.state.moveIndex + 1
      : step.state.moveIndex,
  });

  const lastVariationStep = getLastStep(step, false);
  if (lastVariationStep?.stepType === 'move') {
    const newVariationStep = services.createStep<VariationStep>(
      'variation',
      newPosition,
      {
        steps: [newMoveStep],
      },
    );

    updateStep(addStep(step, newVariationStep));
    setActiveStep(newMoveStep);
    return;
  }

  updateStep(addStep(step, newMoveStep));
  setActiveStep(newMoveStep);
};

const Editor: VariationModule['Editor'] = ({
  Chessboard,
  step,
  lesson,
  status,
  chapter,
  updateStep,
  setActiveStep,
}) => {
  const {
    state: { position, shapes, editing },
  } = step;

  const updateEditing = useCallback(
    (editing: boolean) => updateStep(updateStepState(step, { editing })),
    [updateStep, step],
  );

  const updateShapes = useCallback(
    (shapes: DrawShape[]) => updateStep(updateStepState(step, { shapes })),
    [step, updateStep],
  );

  const onChangeHandle = useCallback(
    (newPosition: FEN, newMove?: Move, movedPiece?: Piece) =>
      boardChange(
        lesson,
        chapter,
        step,
        updateStep,
        setActiveStep,
        newPosition,
        newMove,
        movedPiece,
      ),
    [lesson, chapter, step, updateStep, setActiveStep],
  );

  return (
    <Chessboard
      edit
      sparePieces
      fen={position}
      onMove={onChangeHandle}
      onShapesChange={updateShapes}
      shapes={shapes}
      header={status}
      footer={<Footer updateEditing={updateEditing} editing={!!editing} />}
    />
  );
};

const Playground: VariationModule['Playground'] = ({
  Chessboard,
  step,
  Footer,
}) => {
  const {
    state: { position, shapes },
  } = step;
  return <Chessboard fen={position} shapes={shapes} footer={<Footer />} />;
};

const StepperStep: VariationModule['StepperStep'] = props => {
  const { step, setActiveStep, activeStep, updateStep, removeStep } = props;
  const addDescriptionStep = useCallback(() => {
    const descriptionStep = services.createStep(
      'description',
      step.state.position,
    );
    updateStep(addStepToLeft(step, descriptionStep));
  }, [step, updateStep]);
  const removeVariationStep = useCallback(() => {
    removeStep(step);
  }, [step, removeStep]);
  const addExerciseStep = useCallback(() => {
    const exerciseStep = services.createStep('exercise', step.state.position);
    updateStep(addStepToLeft(step, exerciseStep));
    setActiveStep(exerciseStep);
  }, [setActiveStep, step, updateStep]);
  const handleStepClick = useCallback(
    event => {
      event.stopPropagation();
      activeStep !== step && setActiveStep(step);
    },
    [step, activeStep, setActiveStep],
  );

  return (
    <Container onClick={handleStepClick} fluid className="p-0">
      <Row className="no-gutters">
        <Col className="col-auto">
          <StepTag step={step} active={activeStep === step}>
            {step.state.move ? (
              <StepMove
                move={step.state.move.move}
                captured={step.state.move.captured}
                piece={step.state.move.piece}
                index={step.state.move.index}
              />
            ) : (
              <Img src={BoardSrc} style={{ background: '#ffffff' }} />
            )}
          </StepTag>
        </Col>
        <Col>
          <StepToolbox
            text={step.state.description}
            active={activeStep === step}
            textChangeHandler={description =>
              updateStep(updateStepState(step, { description }))
            }
            addStepHandler={addDescriptionStep}
            deleteStepHandler={removeVariationStep}
            addExerciseHandler={addExerciseStep}
          />
        </Col>
      </Row>
      <Stepper {...props} steps={step.state.steps} />
    </Container>
  );
};

const Module: VariationModule = {
  Editor,
  Playground,
  StepperStep,
  createStep,
  stepType,
};

export default Module;
