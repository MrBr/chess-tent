import { User } from '@chess-tent/models';
import { WizardStep } from '@types';

export type RegistrationWizardStep = WizardStep<Partial<User>>;
