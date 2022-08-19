import application from '@application';

import useWizard from './hooks';
import WizardStepper from './Stepper';

application.hooks.useWizard = useWizard;
application.ui.WizardStepper = WizardStepper;
