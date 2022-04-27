import React, { Suspense } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Components } from '@chess-tent/web/src/application/types';

import { withWebNamespace } from '../../utils';
import { lessonLoader } from '../../loaders';

export default {
  title: 'Components/ChaptersImport',
} as ComponentMeta<Components['CoachCard']>;

const ChaptersImport = React.lazy(() =>
  import('@chess-tent/web/src/modules/lesson/components/chapters-import').then(
    module => ({ default: module.ChaptersImport }),
  ),
);

export const Default: ComponentStory<Components['CoachCard']> =
  withWebNamespace('components', (args, { CoachCard }, { lesson }) => {
    return (
      <Suspense fallback={false}>
        <ChaptersImport
          close={() => {}}
          lessons={[lesson]}
          onImport={() => {}}
        />
      </Suspense>
    );
  });
Default.parameters = {
  docs: {
    source: {
      code: 'https://github.com/storybookjs/storybook/issues/11554#issuecomment-893438099',
    },
  },
};
Default.loaders = [lessonLoader];
