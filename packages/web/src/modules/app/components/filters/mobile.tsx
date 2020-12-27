import React, { ReactElement, useState } from 'react';
import { components, ui } from '@application';
import { Components } from '@types';

const { MobilePortal, Layout } = components;
const { Button, Container, Headline3 } = ui;

const Filters: Components['Filters'] = ({ children }): ReactElement => {
  const [showFilters, setShowFilters] = useState(false);
  if (!showFilters) {
    return (
      <Button onClick={() => setShowFilters(true)} size="extra-small">
        Show filters
      </Button>
    );
  }
  return (
    <MobilePortal>
      <Layout
        header={
          <Container className="d-flex align-items-center justify-content-between h-100 p-0">
            <Headline3 className="m-0">Filters</Headline3>
            <Button size="extra-small" onClick={() => setShowFilters(false)}>
              Apply
            </Button>
          </Container>
        }
      >
        <Container className="mt-5">{children}</Container>
      </Layout>
    </MobilePortal>
  );
};

export default Filters;
