import React, {
  useCallback,
  useMemo,
  ComponentProps,
  FunctionComponent,
} from 'react';

import {
  addStepToRightOf,
  Chapter,
  getParentStep,
  isStep,
  updateStepState,
} from '@chess-tent/models';
import { ExerciseModule, ExerciseTypes, MoveStep, VariationStep } from '@types';
import { components, constants, services, ui } from '@application';

import QuestionnaireEditorBoard from './questionnaire/editor-board';
import QuestionEditorBoard from './question/editor-board';
import VariationEditorBoard from './variation/editor-board';
import SelectSquaresPiecesEditorBoard from './select-squares-pieces/editor-board';
import ArrangePiecesEditorBoard from './arrange-pieces/editor-board';

import QuestionnaireEditorSidebar from './questionnaire/editor-sidebar';
import QuestionEditorSidebar from './question/editor-sidebar';
import VariationEditorSidebar from './variation/editor-sidebar';
import SelectSquaresPiecesEditorSidebar from './select-squares-pieces/editor-sidebar';
import ArrangePiecesEditorSidebar from './arrange-pieces/editor-sidebar';

const { Col, Row, Dropdown } = ui;
const { StepTag } = components;
const { START_FEN } = constants;

const EditorBoard: FunctionComponent<ComponentProps<
  ExerciseModule['EditorBoard']
>> = props => {
  switch (props.step.state.exerciseType) {
    case 'variation':
      return <VariationEditorBoard {...props} />;
    case 'question':
      return <QuestionEditorBoard {...props} />;
    case 'questionnaire':
      return <QuestionnaireEditorBoard {...props} />;
    case 'select-squares-pieces':
      return <SelectSquaresPiecesEditorBoard {...props} />;
    case 'arrange-pieces':
      return <ArrangePiecesEditorBoard {...props} />;
    default:
      return null;
  }
};

const getEditorSidebar = (exerciseType: ExerciseTypes) => {
  switch (exerciseType) {
    case 'variation':
      return VariationEditorSidebar;
    case 'question':
      return QuestionEditorSidebar;
    case 'questionnaire':
      return QuestionnaireEditorSidebar;
    case 'select-squares-pieces':
      return SelectSquaresPiecesEditorSidebar;
    case 'arrange-pieces':
      return ArrangePiecesEditorSidebar;
    default:
      return null;
  }
};

const exerciseTypes: { text: string; type: ExerciseTypes }[] = [
  { text: 'Questionnaire', type: 'questionnaire' },
  { text: 'Question', type: 'question' },
  { text: 'Arrange pieces', type: 'arrange-pieces' },
  { text: 'Select square or pieces', type: 'select-squares-pieces' },
  { text: 'Play variation', type: 'variation' },
];
const EditorSidebar: ExerciseModule['EditorSidebar'] = ({
  step,
  setActiveStep,
  activeStep,
  updateStep,
  stepRoot,
  updateChapter,
  renderToolbox: StepToolbox,
}) => {
  const selectedTypeDescriptor = useMemo(
    () => exerciseTypes.find(({ type }) => type === step.state.exerciseType),
    [step.state.exerciseType],
  );
  const addExerciseStep = useCallback(() => {
    const parent = getParentStep(stepRoot, step) as
      | VariationStep
      | MoveStep
      | Chapter;
    let exerciseStep;
    if (isStep(parent)) {
      exerciseStep = services.createStep('exercise', {
        position:
          parent.state.move?.position ||
          (parent as VariationStep).state.position ||
          START_FEN,
      });
      updateStep(addStepToRightOf(parent, step, exerciseStep));
    } else {
      exerciseStep = services.createStep('exercise', {
        position: step.state.position,
      });
      updateChapter(addStepToRightOf(parent, step, exerciseStep));
    }
    setActiveStep(exerciseStep);
  }, [stepRoot, setActiveStep, step, updateStep, updateChapter]);

  const TypeEditor = getEditorSidebar(step.state.exerciseType);

  return (
    <>
      <Row>
        <Col className="col-auto">
          <StepTag step={step} active={activeStep === step}>
            E
          </StepTag>
        </Col>
        <Col>
          <Dropdown
            onSelect={exerciseType => {
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
          {TypeEditor && <TypeEditor step={step} updateStep={updateStep} />}
          <StepToolbox
            add={false}
            active={activeStep === step}
            step={step}
            exercise={addExerciseStep}
            comment={false}
            showInput={false}
          />
        </Col>
      </Row>
    </>
  );
};

export { EditorBoard, EditorSidebar };
