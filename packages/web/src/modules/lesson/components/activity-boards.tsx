import React, { useMemo } from 'react';
import { components, hooks, services } from '@application';
import {
  getChildStep,
  getLessonActivityUserSettings,
  getLessonChapter,
  LessonActivity,
  LessonActivityRole,
  User,
} from '@chess-tent/models';
import { ActivityStepMode, ChessboardProps, Steps } from '@types';

const { useActiveUserRecord } = hooks;
const { Chessboard, ChessboardContextProvider, StepRenderer, AnalysisBoard } =
  components;

const noop = () => {};
const noopNoop = () => () => {};

const renderChessboard = (props: ChessboardProps) => {
  return (
    <Chessboard
      {...props}
      footer={null}
      allowEvaluation={false}
      sparePieces={false}
      editing={false}
      allowAllMoves={false}
    />
  );
};

const ActivityBoards = ({
  activity,
  liveUsers,
}: {
  activity: LessonActivity;
  liveUsers?: User[];
}) => {
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
          userBoardState.activeChapterId,
        );

        const step = getChildStep(
          chapter,
          userBoardState.activeStepId,
        ) as Steps;

        const activityStepState = userBoardState[userBoardState.activeStepId];

        if (activityStepState.mode === ActivityStepMode.ANALYSING) {
          return (
            <AnalysisBoard
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
  );
};

export default ActivityBoards;
