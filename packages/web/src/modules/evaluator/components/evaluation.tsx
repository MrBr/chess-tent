import React, { useCallback } from 'react';
import { constants, hooks, ui } from '@application';
import { ChessboardContext, Components, Evaluation } from '@types';
import EvaluationEngine from './evaluation-engine';
import EvaluationBar from './evaluation-bar';
import EvaluationLines from './evaluation-lines';

const { useChessboardContext } = hooks;
const { Row, Col, Text, Check } = ui;
const { START_FEN } = constants;

const EvaluationComponent: Components['Evaluation'] = ({ onMoveClick }) => {
  const { evaluate, evaluations, update, board } = useChessboardContext();
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
    <>
      <Row>
        <Col>
          <Text weight={500} className="m-0">
            Engine
          </Text>
        </Col>
        <Col className="col-auto">
          <Check type="switch" checked={evaluate} onChange={toggleEvaluation} />
        </Col>
      </Row>
      <EvaluationEngine
        position={board?.chess.fen() || START_FEN}
        evaluate={evaluate}
        onEvaluationChange={updateEvaluation}
      />
      {evaluate && (
        <>
          <Row>
            <Col className="text-nowrap overflow-hidden">
              {Object.values(evaluations).map(evaluation => (
                <EvaluationLines
                  evaluation={evaluation}
                  key={evaluation.lineIndex}
                  onMoveClick={onMoveClick}
                />
              ))}
            </Col>
          </Row>
          <Row>
            <Col className="text-nowrap overflow-hidden">
              {bestEvaluation && <EvaluationBar evaluation={bestEvaluation} />}
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default EvaluationComponent;
