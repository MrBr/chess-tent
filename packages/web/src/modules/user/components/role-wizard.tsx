import React from 'react';
import { hooks, ui } from '@application';
import { RegisterOptions } from '@chess-tent/types';

import { RegistrationWizardStep } from '../types';
import ChessDetailsStep from './steps/chess-details';
import TeachingStep from './steps/teaching';
import FinalizeStep from './steps/finalize';
import LessonStep from './steps/lesson';
import StudentStep from './steps/student';

const { useWizard } = hooks;
const { Modal, Headline5, WizardStepper, Text, Row } = ui;

export interface RoleWizardProps {
  close: () => void;
  flow: Required<RegisterOptions>['flow'];
}

const Steps: Record<RoleWizardProps['flow'], RegistrationWizardStep[]> = {
  teach: [ChessDetailsStep, TeachingStep, FinalizeStep],
  practice: [ChessDetailsStep, LessonStep, FinalizeStep],
  student: [ChessDetailsStep, StudentStep, FinalizeStep],
};

const RoleWizard = ({ close, flow }: RoleWizardProps) => {
  const wizard = useWizard(Steps[flow], {
    state: {
      studentEloMax: 1200,
      studentEloMin: 500,
    },
  });
  const title = 'Tell us a bit about yourself';
  const subtitle =
    flow === 'teach'
      ? 'This will help students find you more easily'
      : 'This will help the platform make better suggestions';

  return (
    <Modal close={close}>
      <Modal.Header className="border-0 pt-4 px-4">
        <Row className="g-0">
          <Headline5 className="mb-1">{title}</Headline5>
          <Text fontSize="extra-small" color="grey" className="mb-4">
            {subtitle}
          </Text>
          <WizardStepper {...wizard} />
        </Row>
      </Modal.Header>
      {<wizard.activeStep.Component {...wizard} close={close} />}
    </Modal>
  );
};

export default RoleWizard;
