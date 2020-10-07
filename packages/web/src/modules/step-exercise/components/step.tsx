import React, { useCallback, useMemo } from 'react';
import {
  createStep as coreCreateStep,
  updateStepState,
} from '@chess-tent/models';
import { ExerciseModule, ExerciseStep, ExerciseTypes, FEN } from '@types';
import { components, ui } from '@application';
import ExerciseToolbox from './toolbox';
import ExerciseEditor from './editor';
import ExercisePlayground from './playground';

const { Col, Row, Container, Dropdown } = ui;
const { StepTag, StepToolbox } = components;

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
    exerciseType: 'variation',
    exerciseState: {},
    ...(initialState || {}),
  });

const Editor: ExerciseModule['Editor'] = ExerciseEditor;

const Playground: ExerciseModule['Playground'] = ExercisePlayground;

const exerciseTypes: { text: string; type: ExerciseTypes }[] = [
  { text: 'Questionnaire', type: 'questionnaire' },
  { text: 'Question', type: 'question' },
  { text: 'Arrange pieces', type: 'arrange-pieces' },
  { text: 'Select square or pieces', type: 'select-squares-pieces' },
  { text: 'Play variation', type: 'variation' },
];
const StepperStep: ExerciseModule['StepperStep'] = ({
  step,
  setActiveStep,
  activeStep,
  chapter,
  lesson,
  removeStep,
  updateStep,
}) => {
  const selectedTypeDescriptor = useMemo(
    () => exerciseTypes.find(({ type }) => type === step.state.exerciseType),
    [step.state.exerciseType],
  );
  const removeExerciseStep = useCallback(() => {
    removeStep(step);
  }, [step, removeStep]);
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
              updateStep(
                updateStepState(step, {
                  exerciseType,
                } as { exerciseType: ExerciseTypes }),
              );
            }}
          >
            <Dropdown.Toggle id="exercises" size="small" variant="secondary">
              {selectedTypeDescriptor?.text || 'Choose type'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {exerciseTypes.map(typeDescriptor => (
                <Dropdown.Item
                  key={typeDescriptor.type}
                  active={step.state.exerciseType === typeDescriptor.type}
                  eventKey={typeDescriptor.type}
                >
                  {typeDescriptor.text}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <ExerciseToolbox
            step={step}
            lesson={lesson}
            chapter={chapter}
            updateStep={updateStep}
          />
          <StepToolbox
            deleteStepHandler={removeExerciseStep}
            active={activeStep === step}
            showInput={false}
          />
        </Col>
      </Row>
    </Container>
  );
};

const Module: ExerciseModule = {
  Editor,
  Playground,
  StepperStep,
  createStep,
  stepType,
};

export default Module;
