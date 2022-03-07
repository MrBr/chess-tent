import React from 'react';
import { components, constants } from '@application';
import { LessonActivity } from '@chess-tent/models';

const { Chessboard } = components;
const { START_FEN } = constants;

const ActivityStudents = ({ activity }: { activity: LessonActivity }) => {
  // return Object.entries(
  //   activity.state.boards || {},
  // ).map(([userId, { position, shapes }]) => (
  //   <Chessboard fen={position || START_FEN} shapes={shapes} />
  // ));
  return null;
};
