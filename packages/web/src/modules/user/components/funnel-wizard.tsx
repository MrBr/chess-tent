import React from 'react';
import { hooks, ui } from '@application';
import { RegistrationWizardStep } from '../types';

const { useWizard } = hooks;
const { Modal, Headline5, WizardStepper, Text, Row } = ui;

interface PostRegistrationWizardProps {
  steps: RegistrationWizardStep[];
  close: () => void;
  title: string;
  subtitle: string;
}

const FunnelWizard = ({
  steps,
  close,
  title,
  subtitle,
}: PostRegistrationWizardProps) => {
  const wizard = useWizard(
    steps,
    {
      state: {
        studentEloMax: 1200,
        studentEloMin: 500,
      },
    },
    close,
  );
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
      {wizard.node}
    </Modal>
  );
};

export default FunnelWizard;
