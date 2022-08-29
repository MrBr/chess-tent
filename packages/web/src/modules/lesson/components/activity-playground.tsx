import React, { ComponentProps } from 'react';
import { Components } from '@types';
import { utils } from '@application';
import { css } from '@chess-tent/styled-props';
import PlaygroundCard from './activity-playground-card';

const { mobileCss } = utils;

const { className } = css`
  .playground-board {
    grid-area: board;
    border-right: 1px solid var(--grey-400-color);
  }

  .playground-actions {
    grid-area: actions;
  }

  .playground-sidebar {
    grid-area: sidebar;
    padding-top: 24px;
    ${PlaygroundCard} {
      margin-bottom: 24px;
    }
  }

  .playground-navigation {
    grid-area: navigation;
    background: var(--light-color);
  }

  .playground-stepper {
    grid-area: stepper;

    :empty {
      display: none;
    }

    border-left: 1px solid var(--grey-400-color);
    padding: 0;
    overflow: hidden;
  }

  display: grid;
  grid-template-rows: min-content 1fr min-content;
  grid-template-columns: 6fr 3.5fr 1.5fr;
  grid-template-areas:
    'board actions stepper'
    'board sidebar stepper'
    'board navigation stepper';
  width: 100%;
  height: 100%;

  ${mobileCss`
    .playground-navigation {
      border-top: 1px solid var(--grey-400-color);
      position: sticky;
      width: 100%;
      left: 0;
      bottom: 0;
    }

    grid-template-rows: 10px 75% auto min-content auto;
    grid-template-columns: 1fr;
    grid-template-areas:
    'stepper'
    'board'
    'sidebar'
    'actions'
    'navigation';
  `}
`;

const ActivityPlayground = ({
  children,
}: ComponentProps<Components['LessonPlayground']>) => {
  return <div className={className}>{children}</div>;
};

ActivityPlayground.Board = (({ children }) => (
  <div className="playground-board">{children}</div>
)) as Components['LessonPlayground']['Board'];

ActivityPlayground.Sidebar = (({ children }) => (
  <div className="playground-sidebar">{children}</div>
)) as Components['LessonPlayground']['Sidebar'];

ActivityPlayground.Actions = (({ children }) => (
  <div className="playground-actions">{children}</div>
)) as Components['LessonPlayground']['Actions'];

ActivityPlayground.Navigation = (({ children }) => (
  <div className="playground-navigation">{children}</div>
)) as Components['LessonPlayground']['Navigation'];

ActivityPlayground.Stepper = (({ children }) => (
  <div className="playground-stepper">{children}</div>
)) as Components['LessonPlayground']['Stepper'];

export default ActivityPlayground;
