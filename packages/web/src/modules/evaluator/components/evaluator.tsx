import React, { ComponentType } from 'react';
import { Components, UciMove } from '@types';
import { ui } from '@application';

const { ToggleButton } = ui;

type EvaluatorProps = Components['Evaluator'] extends ComponentType<infer U>
  ? U
  : never;

type InfoParam = 'score' | 'depth' | 'pv' | 'multipv';
type ScoreParam = 'cp' | 'mate';
type BestMoveParam = 'bestmove' | 'ponder';
type EngineAction = 'info' | 'bestmove';
type EngineLine = string;

const getInfoValues = (data: EngineLine, param: InfoParam): string[] => {
  const params = data.split(' ');
  const paramIndex = params.findIndex(item => item === param);
  switch (param) {
    case 'depth':
      return [params[paramIndex + 1]];
    case 'multipv':
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
): UciMove | undefined => {
  const params = data.split(' ');
  const paramIndex = params.findIndex(item => item === param);

  if (paramIndex === -1) {
    return;
  }

  return params[paramIndex + 1];
};

const isLineValuation = (data: EngineLine) => {
  return / pv /.test(data);
};

const isBestMove = (data: EngineLine) => {
  return /^bestmove/.test(data);
};

const getScore = (data: EngineLine): [number, boolean] => {
  const [scoreType, scoreValue] = getInfoValues(data, 'score');
  if (scoreType === 'mate') {
    return [parseInt(scoreValue), true];
  }
  const cp = parseInt(scoreValue);
  return [parseFloat((cp / 100).toFixed(2)), false];
};

const getDepth = (data: EngineLine) => {
  return parseInt(getInfoValues(data, 'depth')[0]);
};

const getLineIndex = (data: EngineLine) => {
  return parseInt(getInfoValues(data, 'multipv')[0]);
};

const getVariation = (data: EngineLine): UciMove[] => {
  return getInfoValues(data, 'pv');
};

class Evaluator extends React.Component<EvaluatorProps> {
  static defaultProps = {
    evaluate: true,
    depth: 18,
    lines: 2,
  };

  worker: Worker;
  constructor(props: EvaluatorProps) {
    super(props);
    this.worker = new Worker('/stockfish.js');
    this.worker.onmessage = this.onEngineMessage;
    this.worker.postMessage('uci');
    this.sync();
  }

  componentWillUnmount() {
    this.worker.terminate();
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

    if (onEvaluationChange && isLineValuation(data)) {
      const [score, isMate] = getScore(data);
      const depth = getDepth(data);
      const variation = getVariation(data);
      const lineIndex = getLineIndex(data);
      console.log(data);
      onEvaluationChange({
        score,
        isMate,
        variation,
        lineIndex,
        depth,
      });
    } else if (onBestMoveChange && isBestMove(data)) {
      const bestMove = getBestMoveValue(data, 'bestmove');
      const ponder = getBestMoveValue(data, 'ponder');
      bestMove && onBestMoveChange(bestMove, ponder);
    }
  };

  sync = () => {
    const { position, evaluate, depth, lines } = this.props;
    this.worker.postMessage('ucinewgame');
    this.worker.postMessage(`position fen ${position}`);
    this.worker.postMessage(`setoption name MultiPV value ${lines}`);
    evaluate && this.worker.postMessage(`go depth ${depth}`);
  };

  stopEvaluation() {
    this.worker.postMessage('stop');
  }

  render() {
    const { evaluate, onToggle } = this.props;

    if (!onToggle) {
      return null;
    }

    return (
      <ToggleButton checked={evaluate} onChange={onToggle} size="extra-small">
        Engine
      </ToggleButton>
    );
  }
}

export default Evaluator;
