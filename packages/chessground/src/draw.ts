import { State } from './state';
import { unselect, cancelMove, getKeyAtDomPos, whitePov } from './board';
import { eventPosition, isRightButton } from './util';
import * as cg from './types';

export interface DrawShape {
  orig: cg.Key;
  dest?: cg.Key;
  brush: string;
  modifiers?: DrawModifiers;
  piece?: DrawShapePiece;
}

export interface DrawShapePiece {
  role: cg.Role;
  color: cg.Color;
  scale?: number;
}

export interface DrawBrush {
  key: string;
  color: string;
  opacity: number;
  lineWidth: number;
}

export interface DrawBrushes {
  [name: string]: DrawBrush;
}

export interface DrawModifiers {
  lineWidth?: number;
}

export interface Drawable {
  enabled: boolean; // can draw
  visible: boolean; // can view
  eraseOnClick: boolean;
  validate?: (newDrawShape: DrawCurrent, curDrawShape?: DrawCurrent) => boolean;
  onChange?: (shapes: DrawShape[]) => void;
  onAdd?: (shape: DrawShape) => void;
  onRemove?: (shape: DrawShape) => void;
  shapes: DrawShape[]; // user shapes
  autoShapes: DrawShape[]; // computer shapes
  current?: DrawCurrent;
  brushes: DrawBrushes;
  // drawable SVG pieces; used for crazyhouse drop
  pieces: {
    baseUrl: string;
  };
  prevSvgHash: string;
}

export interface DrawCurrent {
  orig: cg.Key; // orig key of drawing
  dest?: cg.Key; // shape dest, or undefined for circle
  mouseSq?: cg.Key; // square being moused over
  pos: cg.NumberPair; // relative current position
  brush: string; // brush name for shape
}

const brushes = ['green', 'red', 'blue', 'yellow'];

export function start(state: State, e: cg.MouchEvent): void {
  if (e.touches && e.touches.length > 1) return; // support one finger touch only
  e.stopPropagation();
  e.preventDefault();
  e.ctrlKey ? unselect(state) : cancelMove(state);
  const pos = eventPosition(e) as cg.NumberPair,
    orig = getKeyAtDomPos(pos, whitePov(state), state.dom.bounds());
  if (!orig) return;
  const drawShape = {
    orig,
    pos,
    brush: eventBrush(e),
  };
  if (!validate(state, drawShape)) {
    return;
  }
  state.drawable.current = drawShape;
  processDraw(state);
}

export function processDraw(state: State): void {
  requestAnimationFrame(() => {
    const cur = state.drawable.current;
    if (!cur) {
      return;
    }
    const mouseSq = getKeyAtDomPos(
      cur.pos,
      whitePov(state),
      state.dom.bounds(),
    );
    const dest = mouseSq !== cur.orig ? mouseSq : undefined;
    const isValid =
      mouseSq !== cur.mouseSq &&
      validate(
        state,
        {
          ...cur,
          mouseSq,
          dest,
        },
        cur,
      );
    if (isValid) {
      cur.mouseSq = mouseSq;
      cur.dest = mouseSq !== cur.orig ? mouseSq : undefined;
      state.dom.redrawNow();
    }
    processDraw(state);
  });
}

export function move(state: State, e: cg.MouchEvent): void {
  if (state.drawable.current)
    state.drawable.current.pos = eventPosition(e) as cg.NumberPair;
}

export function validate(
  state: State,
  newDrawShape: DrawCurrent,
  curDrawShape?: DrawCurrent,
): boolean {
  return state.drawable.validate
    ? state.drawable.validate(newDrawShape, curDrawShape)
    : true;
}

export function end(state: State): void {
  const cur = state.drawable.current;
  if (cur) {
    if (cur.mouseSq) toggleShape(state.drawable, cur);
    cancel(state);
  }
}

export function cancel(state: State): void {
  if (state.drawable.current) {
    state.drawable.current = undefined;
    state.dom.redraw();
  }
}

export function clear(state: State): void {
  if (state.drawable.shapes.length) {
    state.drawable.shapes = [];
    state.dom.redraw();
    onChange(state.drawable);
  }
}

function eventBrush(e: cg.MouchEvent): string {
  const modA = (e.shiftKey || e.ctrlKey) && isRightButton(e);
  const modB = e.altKey || e.metaKey || e.getModifierState('AltGraph');
  return brushes[(modA ? 1 : 0) + (modB ? 2 : 0)];
}

export function toggleShape(
  drawable: Drawable,
  shape: DrawCurrent | DrawShape,
): void {
  const sameShape = (s: DrawShape) =>
    s.orig === shape.orig && s.dest === shape.dest;
  const similar = drawable.shapes.filter(sameShape)[0];
  if (similar) {
    drawable.shapes = drawable.shapes.filter(s => !sameShape(s));
    onRemove(drawable, similar);
  }
  if (!similar || similar.brush !== shape.brush) {
    drawable.shapes.push(shape);
    onAdd(drawable, shape);
  }
  onChange(drawable);
}

function onChange(drawable: Drawable): void {
  if (drawable.onChange) drawable.onChange(drawable.shapes);
}

function onAdd(drawable: Drawable, shape: DrawShape): void {
  if (drawable.onAdd) drawable.onAdd(shape);
}

function onRemove(drawable: Drawable, shape: DrawShape): void {
  if (drawable.onRemove) drawable.onRemove(shape);
}
