import { RegisterOptions } from '@chess-tent/types';
import { RegistrationTipsProps } from './components/registration-tips';

export const registrationFlows: Record<
  Required<RegisterOptions>['flow'],
  {
    title: string;
    subtitle: string;
    tips: RegistrationTipsProps;
  }
> = {
  teach: {
    title: 'Register as a Coach',
    subtitle: 'Help people exceed in the game of chess',
    tips: {
      title: 'Be a coach',
      subtitle:
        'Our platform offers a variety of tools to help you teach in the best possible way',
      tips: [
        {
          sign: '👨‍🎓',
          tip: 'Create private individual or group trainings',
        },
        {
          sign: '📚',
          tip: 'Publish public lessons for wide audience',
        },
        {
          sign: '📩',
          tip: 'Stay in touch with your students',
        },
      ],
    },
  },
  practice: {
    title: 'Register as a Student',
    subtitle: "You're few steps away from getting better in chess",
    tips: {
      title: 'Start learning',
      subtitle: 'Create account and explore lessons created by the Community',
      tips: [
        {
          sign: '📚',
          tip: 'Explore various chess lessons to improve',
        },
        {
          sign: '📖',
          tip: 'Go through content with real life examples',
        },
        {
          sign: '💡',
          tip: 'Solve tasks and learn by your own',
        },
      ],
    },
  },
  student: {
    title: 'Register as a Student',
    subtitle: 'Find a guide for your chess endeavours',
    tips: {
      title: 'Connect with a coach',
      subtitle:
        'Create your account to start searching a coach and improve your chess skills',
      tips: [
        {
          sign: '🎓',
          tip: 'The fastest way to learn, practice with coach in real time',
        },
        {
          sign: '📙',
          tip: 'Get a custom tailored lesson for more relaxed approach',
        },
        {
          sign: '📩',
          tip: 'Communicate with a coach to resolve difficulties',
        },
      ],
    },
  },
};
