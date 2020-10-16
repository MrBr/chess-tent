import React, { useCallback, useMemo } from 'react';
import {
  addStepRightToSame,
  createStep as coreCreateStep,
  getChapterParentStep,
  updateStepState,
} from '@chess-tent/models';
import {
  ExerciseModule,
  ExerciseStep,
  ExerciseTypes,
  MoveStep,
  VariationStep,
} from '@types';
import { components, constants, services, ui } from '@application';
import ExerciseToolbox from './toolbox';
import ExerciseEditor from './editor';
import ExercisePlayground from './playground';

const { Col, Row, Container, Dropdown } = ui;
const { StepTag, StepToolbox } = components;
const { START_FEN } = constants;

const stepType = 'exercise';

const createStep: ExerciseModule['createStep'] = (id, initialState) =>
  coreCreateStep<ExerciseStep>(id, stepType, {
    shapes: [],
    steps: [],
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
  const addExerciseStep = useCallback(() => {
    const parentStep = getChapterParentStep(chapter, step) as
      | VariationStep
      | MoveStep;
    const exerciseStep = services.createStep('exercise', {
      position:
        parentStep.state.move?.position ||
        (parentStep as VariationStep).state.position ||
        START_FEN,
    });
    updateStep(addStepRightToSame(parentStep, exerciseStep));
    setActiveStep(exerciseStep);
  }, [chapter, setActiveStep, step, updateStep]);
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
            <Dropdown.Toggle id="exercises" size="extra-small" className="mb-2">
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
            addExerciseHandler={addExerciseStep}
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
