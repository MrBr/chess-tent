import React from 'react';
import { ui } from '@application';
import { ActivityFooterProps } from '@types';
import styled from '@emotion/styled';

const { Container, Button } = ui;

const ActivityPagination = styled(
  ({
    prev,
    next,
    className,
  }: {
    prev?: () => void;
    next?: () => void;
    className?: string;
  }) => {
    return (
      <Container className={className}>
        <Button onClick={prev} variant="regular" size="extra-small">
          Prev
        </Button>
        <Button onClick={next} variant="regular" size="extra-small">
          Next
        </Button>
      </Container>
    );
  },
)({
  boxShadow: ' 0px 1px 8px 1px rgba(24, 34, 53, 0.05), 0px 1px 0px #ECECEC',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 4,
  borderRadius: 10,
});

const ActivityFooter = ({ next, prev, className }: ActivityFooterProps) => (
  <Container className={className}>
    <ActivityPagination next={next} prev={prev} />
  </Container>
);

export default ActivityFooter;
