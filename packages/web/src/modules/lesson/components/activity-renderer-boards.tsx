import React, { useMemo } from 'react';
import { components, hooks, services, utils } from '@application';
import {
  Chapter,
  getChildStep,
  getLessonActivityUserSettings,
  getLessonChapter,
  LessonActivityRole,
  TYPE_ACTIVITY,
} from '@chess-tent/models';
import { ActivityRendererModuleProps, ChessboardProps, Steps } from '@types';

const { noopNoop, noop } = utils;
const { useActiveUserRecord, useSocketRoomUsers } = hooks;
const {
  Chessboard,
  ChessboardContextProvider,
  StepRenderer,
  AnalysisBoard,
  LessonPlaygroundCard,
} = components;

const renderChessboard = (props: ChessboardProps) => {
  return (
    <Chessboard
      {...props}
      footer={null}
      sparePieces={false}
      editing={false}
      allowAllMoves={false}
    />
  );
};

const ActivityRendererBoards = (props: ActivityRendererModuleProps<any>) => {
  const { activity } = props;
  const liveUsers = useSocketRoomUsers(`${TYPE_ACTIVITY}-${activity.id}`);
  const { value: activeUser } = useActiveUserRecord();
  const students = useMemo(
    () =>
      activity.roles.filter(
        ({ role, user }) =>
          role === LessonActivityRole.STUDENT &&
          activeUser.id !== user.id &&
          liveUsers?.some(({ id }) => id === user.id),
      ),
    [liveUsers, activity, activeUser],
  );

  return (
    <LessonPlaygroundCard>
      <ChessboardContextProvider>
        {students.map(({ user }) => {
          const { selectedBoardId } = getLessonActivityUserSettings(
            activity,
            user.id,
          );

          if (!selectedBoardId) {
            return null;
          }

          const userBoardState = activity.state.boards[selectedBoardId];

          const chapter = getLessonChapter(
            activity.subject,
            userBoardState.activeChapterId as string, // TODO - handle lesson without chapters?
          ) as Chapter;

          const step = getChildStep(
            chapter,
            userBoardState.activeStepId,
          ) as Steps;

          const activityStepState = userBoardState[userBoardState.activeStepId];

          if (userBoardState.analysing) {
            return (
              <AnalysisBoard
                active
                analysis={activityStepState.analysis}
                updateAnalysis={noopNoop}
                initialPosition={services.getStepPosition(step)}
                initialOrientation={step.state.orientation}
                Chessboard={renderChessboard}
                key={user.id}
              />
            );
          }

          return (
            <StepRenderer
              key={user.id}
              boardState={userBoardState}
              step={step}
              stepRoot={chapter}
              activeStep={step}
              component="ActivityBoard"
              stepActivityState={activityStepState}
              Chessboard={renderChessboard}
              setActiveStep={noop}
              setStepActivityState={noop}
              nextStep={noop}
              prevStep={noop}
              completeStep={noop}
            />
          );
        })}
      </ChessboardContextProvider>
    </LessonPlaygroundCard>
  );
};

export default ActivityRendererBoards;
