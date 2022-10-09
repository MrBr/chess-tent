import React, {
  useCallback,
  useMemo,
  ComponentProps,
  FunctionComponent,
} from 'react';

import { addStepToRightOf, isStep } from '@chess-tent/models';
import {
  ChessboardProps,
  ExerciseModule,
  ExerciseToolboxProps,
  ExerciseTypes,
} from '@types';
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
import EditorBoards from './editor-boards';

const { Col, Row, Dropdown, Icon } = ui;
const { StepTag } = components;

class EditorBoard extends React.Component<
  ComponentProps<ExerciseModule['EditorBoard']>
> {
  renderChessboard = (chessboardProps: ChessboardProps) => {
    const { Chessboard, step, updateStep } = this.props;
    return (
      <Chessboard
        {...chessboardProps}
        header={
          <EditorBoards
            activeSegment={step.state.activeSegment}
            step={step}
            updateStep={updateStep}
          />
        }
      />
    );
  };

  render() {
    const { step } = this.props;
    const editorProps = { ...this.props, Chessboard: this.renderChessboard };

    if (isVariationExerciseStep(step)) {
      return <VariationEditorBoard {...editorProps} step={step} />;
    }
    if (isQuestionExerciseStep(step)) {
      return <QuestionEditorBoard {...editorProps} step={step} />;
    }
    if (isQuestionnaireExerciseStep(step)) {
      return <QuestionnaireEditorBoard {...editorProps} step={step} />;
    }
    if (isSelectSquarePiecesExerciseStep(step)) {
      return <SelectSquaresPiecesEditorBoard {...editorProps} step={step} />;
    }
    if (isArrangePiecesExerciseStep(step)) {
      return <ArrangePiecesEditorBoard {...editorProps} step={step} />;
    }
    return null;
  }
}

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
  const addVariationStep = useCallback(() => {
    const {
      state: {
        task: { position },
        orientation,
      },
    } = step;
    const parent = getParent(stepRoot, step);
    const variationStep = services.createStep('variation', {
      position,
      orientation,
    });
    if (isStep(parent)) {
      updateStep(addStepToRightOf(parent, step, variationStep));
    } else {
      updateChapter(addStepToRightOf(parent, step, variationStep));
    }
    setActiveStep(variationStep);
  }, [stepRoot, setActiveStep, step, updateStep, updateChapter]);

  return (
    <>
      <Row onClick={() => setActiveStep(step)}>
        <StepToolbox
          add={addVariationStep}
          active={activeStep === step}
          step={step}
          exercise={addExerciseStep}
          comment={false}
          remove={removeExerciseStep}
        />
        <Col className="col-auto">
          <StepTag active={activeStep === step}>
            <Icon type="exercise" textual />
          </StepTag>
        </Col>
        <Col>
          <Dropdown
            onSelect={exerciseType => {
              if (!exerciseType) {
                return;
              }
              updateStep(changeExercise(step, exerciseType as ExerciseTypes));
            }}
          >
            <Dropdown.Toggle id="exercises" className="mb-2">
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
        </Col>
      </Row>
    </>
  );
};

export { EditorBoard, EditorSidebar };
