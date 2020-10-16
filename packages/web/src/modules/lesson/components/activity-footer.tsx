import React from 'react';
import { ui } from '@application';
import { ActivityFooterProps } from '@types';
import styled from '@emotion/styled';

const { Container, Button, Text } = ui;

const ActivityPagination = styled(
  ({
    prev,
    next,
    currentStep,
    stepsCount,
    className,
  }: {
    prev?: () => void;
    next?: () => void;
    className?: string;
    currentStep: number;
    stepsCount: number;
  }) => {
    return (
      <Container className={className}>
        <Button onClick={prev} variant="regular" size="extra-small">
          Prev
        </Button>
        <Text inline className="mb-0" fontSize="extra-small" weight={700}>
          {currentStep} / {stepsCount}
        </Text>
        <Button onClick={next} variant="regular" size="extra-small">
          Next
        </Button>
      </Container>
    );
  },
)({
  boxShadow: ' 0px 1px 8px 1px rgba(24, 34, 53, 0.05), 0px 1px 0px #ECECEC',
  marginTop: '4em',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 4,
  borderRadius: 10,
});

export default ({
  next,
  prev,
  currentStep,
  stepsCount,
}: ActivityFooterProps) => {
  return (
    <Container>
      <ActivityPagination
        next={next}
        prev={prev}
        currentStep={currentStep}
        stepsCount={stepsCount}
      />
    </Container>
  );
};
