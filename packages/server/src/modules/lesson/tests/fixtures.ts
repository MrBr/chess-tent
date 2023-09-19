import { Difficulty, Lesson } from '@chess-tent/models';
import { coaches } from '../../user/tests/fixtures';

const lessons: Lesson[] = [
  {
    id: '5ac91448-631a-4553-bcfe-98cdf796acfd',
    owner: coaches[0],
    state: {
      chapters: [],
      title: 'Template1',
    },
    showOnLanding: true,
    tags: [],
    type: 'lessons',
    published: true,
    users: [],
    difficulty: Difficulty.BEGINNER,
  },
  {
    id: '6e1c1d4e-72d2-4a61-8f2a-3e4b5c6d7e8f',
    owner: coaches[1],
    state: {
      chapters: [],
      title: 'Template2',
    },
    showOnLanding: true,
    tags: [],
    type: 'lessons',
    published: true,
    users: [],
    difficulty: Difficulty.ADVANCED,
  },
  {
    id: '9a8b7c6d-5e4f-3a2b-1c0d-9e8f7a6b5c4d',
    owner: coaches[2],
    state: {
      chapters: [],
      title: 'Template3',
    },
    showOnLanding: true,
    tags: [],
    type: 'lessons',
    published: true,
    users: [],
    difficulty: Difficulty.INTERMEDIATE,
  },
  {
    id: 'd1c2b3a4-5e6f-7c8d-9a0b-1c2d3e4f5a6b',
    owner: coaches[3],
    state: {
      chapters: [],
      title: 'Template4',
    },
    tags: [],
    type: 'lessons',
    published: true,
    users: [],
    difficulty: Difficulty.BEGINNER,
  },
];

export { lessons };
