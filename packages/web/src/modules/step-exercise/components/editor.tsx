import React, {
  useCallback,
  useMemo,
  ComponentProps,
  FunctionComponent,
} from 'react';

import { addStepToRightOf, isStep } from '@chess-tent/models';
import { ExerciseModule, ExerciseToolboxProps, ExerciseTypes } from '@types';
import { components, services, ui } from '@application';

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
import {
  isArrangePiecesExerciseStep,
  isQuestionExerciseStep,
  isQuestionnaireExerciseStep,
  isSelectSquarePiecesExerciseStep,
  isVariationExerciseStep,
  getParent,
  getPositionAndOrientation,
  changeExercise,
} from '../service';

const { Col, Row, Dropdown } = ui;
const { StepTag } = components;

const EditorBoard: FunctionComponent<
  ComponentProps<ExerciseModule['EditorBoard']>
> = props => {
  if (isVariationExerciseStep(props.step)) {
    return <VariationEditorBoard {...props} step={props.step} />;
  }
  if (isQuestionExerciseStep(props.step)) {
    return <QuestionEditorBoard {...props} step={props.step} />;
  }
  if (isQuestionnaireExerciseStep(props.step)) {
    return <QuestionnaireEditorBoard {...props} step={props.step} />;
  }
  if (isSelectSquarePiecesExerciseStep(props.step)) {
    return <SelectSquaresPiecesEditorBoard {...props} step={props.step} />;
  }
  if (isArrangePiecesExerciseStep(props.step)) {
    return <ArrangePiecesEditorBoard {...props} step={props.step} />;
  }
  return null;
};

const ExerciseToolbox: FunctionComponent<ExerciseToolboxProps> = props => {
  if (isVariationExerciseStep(props.step)) {
    return <VariationEditorSidebar {...props} step={props.step} />;
  }
  if (isQuestionExerciseStep(props.step)) {
    return <QuestionEditorSidebar {...props} step={props.step} />;
  }
  if (isQuestionnaireExerciseStep(props.step)) {
    return <QuestionnaireEditorSidebar {...props} step={props.step} />;
  }
  if (isSelectSquarePiecesExerciseStep(props.step)) {
    return <SelectSquaresPiecesEditorSidebar {...props} step={props.step} />;
  }
  if (isArrangePiecesExerciseStep(props.step)) {
    return <ArrangePiecesEditorSidebar {...props} step={props.step} />;
  }
  return null;
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
  removeStep,
  renderToolbox: StepToolbox,
}) => {
  const selectedTypeDescriptor = useMemo(
    () => exerciseTypes.find(({ type }) => type === step.state.exerciseType),
    [step.state.exerciseType],
  );
  const removeExerciseStep = useCallback(() => {
    removeStep(step, false);
  }, [removeStep, step]);
  const addExerciseStep = useCallback(() => {
    const { position, orientation } = getPositionAndOrientation(stepRoot, step);
    const parent = getParent(stepRoot, step);
    const exerciseStep = services.createStep('exercise', {
      position,
      orientation,
    });
    if (isStep(parent)) {
      updateStep(addStepToRightOf(parent, step, exerciseStep));
    } else {
      updateChapter(addStepToRightOf(parent, step, exerciseStep));
    }
    setActiveStep(exerciseStep);
  }, [stepRoot, setActiveStep, step, updateStep, updateChapter]);

  return (
    <>
      <Row>
        <Col className="col-auto">
          <StepTag active={activeStep === step}>E</StepTag>
        </Col>
        <Col>
          <Dropdown
            onSelect={exerciseType => {
              if (!exerciseType) {
                return;
              }
              updateStep(
                changeExercise(step, stepRoot, exerciseType as ExerciseTypes),
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
          <ExerciseToolbox step={step} updateStep={updateStep} />
          <StepToolbox
            add={false}
            active={activeStep === step}
            step={step}
            exercise={addExerciseStep}
            comment={false}
            remove={removeExerciseStep}
            showInput={false}
          />
        </Col>
      </Row>
    </>
  );
};

export { EditorBoard, EditorSidebar };
