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
    padding: 0 calc(3.5vw) 0 calc(5.5vw); // left padding is a bit large for spare pieces
  }

  .playground-actions {
    grid-area: actions;
  }

  .playground-cardbar {
    grid-area: cardbar;
    padding-top: 24px;
    overflow-y: scroll;
    ${PlaygroundCard} {
      margin-bottom: 24px;
    }
  }

  .playground-navigation {
    grid-area: navigation;
    background: var(--light-color);
    position: sticky;
    border-top: 1px solid var(--grey-400-color);
  }

  .playground-sidebar {
    grid-area: sidebar;
    position: relative;

    :empty {
      display: none;
    }

    border-left: 1px solid var(--grey-400-color);
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  display: grid;
  grid-template-rows: min-content 1fr min-content;
  grid-template-columns: 6fr 5fr;
  grid-template-areas:
    'board sidebar'
    'board sidebar'
    'board sidebar';
  width: 100%;
  height: 100%;

  ${mobileCss`
    .playground-board {
      padding: 25px 0;
      min-height: 100vw;
    }
    
    .playground-cardbar {
      overflow-y: unset;
    }
    
    .playground-navigation {
      width: 100%;
      left: 0;
      bottom: 0;
    }

    .playground-sidebar {
      flex-direction: row;
    }

    grid-template-rows: 10px min-content auto min-content auto;
    grid-template-columns: 1fr;
    grid-template-areas:
    'sidebar'
    'board'
    'cardbar'
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

ActivityPlayground.Cardbar = (({ children }) => (
  <div className="playground-cardbar">{children}</div>
)) as Components['LessonPlayground']['Sidebar'];

ActivityPlayground.Actions = (({ children }) => (
  <div className="playground-actions">{children}</div>
)) as Components['LessonPlayground']['Actions'];

ActivityPlayground.Navigation = (({ children }) => (
  <div className="playground-navigation">{children}</div>
)) as Components['LessonPlayground']['Navigation'];

ActivityPlayground.Sidebar = (({ children }) => (
  <div className="playground-sidebar">{children}</div>
)) as Components['LessonPlayground']['Sidebar'];

export default ActivityPlayground;
