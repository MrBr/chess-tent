import React, { useCallback } from 'react';
import { createStep as coreCreateStep } from '@chess-tent/models';
import { ExerciseModule, ExerciseStep, FEN } from '@types';
import { components, hooks, state, ui } from '@application';
import ExerciseToolbox from './toolbox';
import ExerciseEditor from './editor';

const {
  actions: { updateStepState },
} = state;
const { Col, Row, Container, Dropdown } = ui;
const { StepTag } = components;
const { useDispatchBatched } = hooks;

const stepType = 'exercise';

const createStep = (
  id: string,
  prevPosition: FEN,
  initialState?: Partial<ExerciseStep['state']>,
) =>
  coreCreateStep<ExerciseStep>(id, stepType, {
    shapes: [],
    steps: [],
    position: prevPosition,
    exerciseType: 'board',
    exerciseState: {},
    ...(initialState || {}),
  });

const Editor: ExerciseModule['Editor'] = ExerciseEditor;

const Playground: ExerciseModule['Playground'] = ({
  Chessboard,
  step,
  footer,
}) => {
  const {
    state: { position, shapes },
  } = step;
  return <Chessboard fen={position} shapes={shapes} footer={footer} />;
};

const Exercise: ExerciseModule['Exercise'] = () => {
  return <>{'Description'}</>;
};

const StepperStep: ExerciseModule['StepperStep'] = ({
  step,
  setActiveStep,
  activeStep,
}) => {
  const dispatch = useDispatchBatched();

  const handleStepClick = useCallback(
    event => {
      event.stopPropagation();
      activeStep !== step && setActiveStep(step);
    },
    [step, activeStep, setActiveStep],
  );

  return (
    <Container onClick={handleStepClick} fluid className="p-0">
      <Row>
        <Col className="col-auto">
          <StepTag step={step} active={activeStep === step}>
            E
          </StepTag>
        </Col>
        <Col>
          <Dropdown
            onSelect={(exerciseType: string) => {
              dispatch(updateStepState(step, { exerciseType }));
            }}
          >
            <Dropdown.Toggle id="dropdown-basic" size="sm" variant="secondary">
              {step.state.exerciseType || 'Choose type'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item
                active={step.state.exerciseType === 'question'}
                eventKey="question"
              >
                Question
              </Dropdown.Item>
              <Dropdown.Item
                active={step.state.exerciseType === 'select'}
                eventKey="select"
              >
                Select
              </Dropdown.Item>
              <Dropdown.Item
                active={step.state.exerciseType === 'board'}
                eventKey="board"
              >
                Board
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <ExerciseToolbox step={step} />
        </Col>
      </Row>
    </Container>
  );
};

const Module: ExerciseModule = {
  Editor,
  Playground,
  Exercise,
  StepperStep,
  createStep,
  stepType,
};

export default Module;
