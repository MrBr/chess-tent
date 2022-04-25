import React, { useCallback } from 'react';
import { hooks, ui } from '@application';
import { ChessboardContext, Evaluation, FEN, NotableMove } from '@types';
import EvaluationEngine from './evaluation-engine';
import EvaluationBar from './evaluation-bar';
import EvaluationLines from './evaluation-lines';

const { useChessboardContext } = hooks;
const { Container, Row, Col, Text, Check } = ui;

interface EditorSidebarEvaluationProps {
  fen: FEN;
  onMoveClick?: (moves: NotableMove[]) => void;
}

const EvaluationComponent = ({
  fen,
  onMoveClick,
}: EditorSidebarEvaluationProps) => {
  const { evaluate, evaluations, update } = useChessboardContext();
  const bestEvaluation = evaluations[1];

  const toggleEvaluation = useCallback(
    () => update({ evaluate: !evaluate }),
    [evaluate, update],
  );
  const updateEvaluation = useCallback(
    (evaluation: Evaluation) => {
      if (!evaluate) {
        return;
      }

      const newEvaluations: ChessboardContext['evaluations'] = {
        ...evaluations,
        [evaluation.lineIndex]: evaluation,
      };

      update({ evaluations: newEvaluations, evaluate });
    },
    [evaluate, evaluations, update],
  );

  return (
    <Container>
      <Row>
        <Col>
          <Text weight={500}>Engine</Text>
        </Col>
        <Col className="col-auto">
          <Check type="switch" checked={evaluate} onChange={toggleEvaluation} />
        </Col>
      </Row>
      <EvaluationEngine
        position={fen}
        evaluate={evaluate}
        onEvaluationChange={updateEvaluation}
      />
      {evaluate && (
        <Row>
          <Col>
            {Object.values(evaluations).map(evaluation => (
              <EvaluationLines
                evaluation={evaluation}
                key={evaluation.lineIndex}
                onMoveClick={onMoveClick}
              />
            ))}
            {bestEvaluation && <EvaluationBar evaluation={bestEvaluation} />}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default EvaluationComponent;
