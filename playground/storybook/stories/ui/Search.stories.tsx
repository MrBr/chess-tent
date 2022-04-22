import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { UI } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';

export default {
  title: 'UI/Search',
} as ComponentMeta<UI['SearchBox']>;

export const Types: ComponentStory<UI['SearchBox']> = withWebNamespace(
  'ui',
  (args, { SearchBox, Icon }) => {
    const types = [
      { type: 'activities', prefix: <Icon type="lightbulb" /> },
      { type: 'lessons', prefix: <Icon type="template" /> },
      { type: 'users', prefix: <Icon type="profile" /> },
    ];

    return (
      <>
        <SearchBox onSearch={console.log} types={types} />
      </>
    );
  },
);

export const Plain: ComponentStory<UI['SearchBox']> = withWebNamespace(
  'ui',
  (args, { SearchBox }) => {
    return (
      <>
        <SearchBox onSearch={console.log} />
      </>
    );
  },
);
