import React, { ComponentType } from 'react';
import { Move, Key, Components } from '@types';
import { ui } from '@application';

const { ToggleButton } = ui;

type EvaluatorProps = Components['Evaluator'] extends ComponentType<infer U>
  ? U
  : never;

type InfoParam = 'score' | 'depth' | 'pv';
type ScoreParam = 'cp' | 'mate';
type BestMoveParam = 'bestmove' | 'ponder';
type EngineAction = 'info' | 'bestmove';
type EngineLine = string;

const engineMoveToMove = (engineMove: string): Move => {
  const from = (engineMove[0] + engineMove[1]) as Key;
  const to = (engineMove[2] + engineMove[3]) as Key;
  return [from, to];
};

const getInfoValues = (data: EngineLine, param: InfoParam): string[] => {
  const params = data.split(' ');
  const paramIndex = params.findIndex(item => item === param);
  switch (param) {
    case 'depth':
      return [params[paramIndex + 1]];
    case 'pv':
      const bmcIndex = params.findIndex(item => item === 'bmc');
      return params.slice(paramIndex + 1, bmcIndex); // Return the variation line moves
    case 'score':
      return [params[paramIndex + 1], params[paramIndex + 2]];
    default:
      throw Error(`Unknow param ${param}`);
  }
};

const getBestMoveValue = (
  data: EngineLine,
  param: BestMoveParam,
): Move | undefined => {
  const params = data.split(' ');
  const paramIndex = params.findIndex(item => item === param);

  if (paramIndex === -1) {
    return;
  }

  const paramValue = params[paramIndex + 1];
  return engineMoveToMove(paramValue);
};

const isInfo = (data: EngineLine) => {
  return /^info/.test(data);
};
const isBestMove = (data: EngineLine) => {
  return /^bestmove/.test(data);
};

const getScore = (data: EngineLine): [string, boolean] => {
  const [scoreType, scoreValue] = getInfoValues(data, 'score');
  if (scoreType === 'mate') {
    return [scoreValue, true];
  }
  const cp = parseInt(scoreValue);
  return [(cp / 100).toFixed(2), false];
};

const getDepth = (data: EngineLine) => {
  return parseInt(getInfoValues(data, 'depth')[0]);
};

const getVariation = (data: EngineLine): Move[] => {
  return getInfoValues(data, 'pv').map(engineMoveToMove);
};

class Evaluator extends React.Component<EvaluatorProps> {
  static defaultProps = {
    evaluate: true,
    depth: 18,
  };

  worker: Worker;
  constructor(props: EvaluatorProps) {
    super(props);
    this.worker = new Worker('/stockfish.js');
    this.worker.onmessage = this.onEngineMessage;
    this.worker.postMessage('uci');
    this.sync();
  }

  componentDidUpdate(prevProps: EvaluatorProps): void {
    const { evaluate, position } = this.props;
    if (prevProps.position !== position) {
      this.sync();
    }
    if (prevProps.evaluate !== evaluate) {
      evaluate ? this.sync() : this.stopEvaluation();
    }
  }

  onEngineMessage = ({ data }: MessageEvent) => {
    const { onBestMoveChange, onEvaluationChange } = this.props;
    if (onEvaluationChange && isInfo(data)) {
      const [score, isMate] = getScore(data);
      const depth = getDepth(data);
      const variation = getVariation(data);
      depth && score && onEvaluationChange(score, isMate, variation, depth);
    } else if (onBestMoveChange && isBestMove(data)) {
      const bestMove = getBestMoveValue(data, 'bestmove');
      const ponder = getBestMoveValue(data, 'ponder');
      bestMove && onBestMoveChange(bestMove, ponder);
    }
  };

  sync = () => {
    const { position, evaluate, depth } = this.props;
    this.worker.postMessage('ucinewgame');
    this.worker.postMessage(`position fen ${position}`);
    evaluate && this.worker.postMessage(`go depth ${depth}`);
  };

  stopEvaluation() {
    this.worker.postMessage('stop');
  }

  render() {
    const { evaluate } = this.props;
    return (
      <ToggleButton checked={evaluate} size="extra-small">
        Engine
      </ToggleButton>
    );
  }
}

export default Evaluator;
