import React, { ComponentType, ReactElement, useEffect, useMemo } from 'react';
import { hooks, components, ui, services } from '@application';
import { DateTime } from 'luxon';
import { updateSubjectState, User } from '@chess-tent/models';

const { usePrompt, useActiveUserRecord } = hooks;
const { Modal, Headline5, Text, Button } = ui;
const { Link } = components;
const { addProvider } = services;

const DocsLastUpdated = DateTime.fromMillis(
  parseInt(process.env.REACT_APP_DOCS_DATE as string),
);

// Validate if user have accepted ToS and PP
const Provider: ComponentType = ({ children }) => {
  const { value: user, update, save } = useActiveUserRecord(null);

  const hasAcceptedDocs = useMemo(
    () =>
      user?.state.acceptedDocsDate &&
      DateTime.fromJSDate(
        new Date(user.state.acceptedDocsDate as unknown as string),
      ) >= DocsLastUpdated,
    [user?.state.acceptedDocsDate],
  );

  const [modal, promptDocsModal] = usePrompt(() => (
    <Modal>
      <Modal.Header>
        <Headline5>Terms updated</Headline5>
      </Modal.Header>
      <Modal.Body>
        <Text>
          <Link to="/privacy-policy.txt" target="_blank">
            Privacy policy
          </Link>{' '}
          and{' '}
          <Link to="/terms-of-services.txt" target="_blank">
            Terms of Services
          </Link>{' '}
          have been updated. Please read them and accept before continuing.
        </Text>
      </Modal.Body>
      <Modal.Footer>
        <Button
          size="small"
          onClick={() => {
            update(
              updateSubjectState(user as User, {
                acceptedDocsDate: new Date(),
              }),
            );
            save();
          }}
        >
          Accept
        </Button>
      </Modal.Footer>
    </Modal>
  ));

  useEffect(() => {
    if (!!user?.id && !hasAcceptedDocs) {
      promptDocsModal();
    }
  }, [hasAcceptedDocs, user?.id, promptDocsModal]);

  return (
    <>
      {!hasAcceptedDocs && modal}
      {children as ReactElement}
    </>
  );
};

addProvider(Provider);
