import React, { useState, useEffect } from 'react';
import { hooks, requests, ui } from '@application';
import { LessonActivity, LessonActivityRole, Role } from '@chess-tent/models';
import { useCreateNewTraining } from '../hooks/activity';

const { useParams, useApi } = hooks;
const { Col, Button, Container, Text, Modal, Row, Check } = ui;

interface TrainingCompleteProps {
  close: () => void;
  allowNew?: boolean;
  activity: LessonActivity;
}

const TrainingComplete = ({
  close,
  allowNew,
  activity,
}: TrainingCompleteProps) => {
  const { activityId } = useParams<{ activityId: string }>();
  const {
    fetch: patchActivity,
    response: patchResponse,
    error: patchError,
  } = useApi(requests.activityPatch);
  const { user: owner } = activity.roles.find(
    role => role.role === LessonActivityRole.OWNER,
  ) as Role<unknown>;

  const createTraining = useCreateNewTraining(owner);
  const [completeAndCreate, setCompleteAndCreate] = useState(false);

  const handleComplete = () => {
    patchActivity(activityId, { completed: true });
  };

  useEffect(() => {
    if (patchResponse && !patchError) {
      close();
    }
    if (!patchResponse || patchError || !completeAndCreate) {
      return;
    }
    const students = activity.roles
      .filter(({ role }) => role === LessonActivityRole.STUDENT)
      .map(({ user }) => user);
    const coaches = activity.roles
      .filter(({ role }) => role === LessonActivityRole.COACH)
      .map(({ user }) => user);
    createTraining({
      title: `${activity.title} (new)`,
      date: activity.date,
      weekly: activity.weekly,
      students,
      coaches,
    });
  }, [
    patchResponse,
    patchError,
    completeAndCreate,
    activity,
    createTraining,
    close,
  ]);

  return (
    <Modal close={close}>
      <Modal.Header>Complete study</Modal.Header>
      <Modal.Body>
        <Text fontSize="extra-small">
          You can still access completed studies in archive.
        </Text>
        {allowNew && (
          <>
            <Text weight={500} fontSize="extra-small" className="mb-0">
              PRO TIP!
            </Text>
            <Text fontSize="extra-small" className="mb-0">
              Check "Create new" to copy settings to the new training.
            </Text>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Container>
          <Row className="justify-content-between align-items-center">
            <Col className="col-auto">
              <Button size="extra-small" variant="ghost">
                Cancel
              </Button>
            </Col>
            <Col className="col-auto">
              {allowNew && (
                <>
                  <Text fontSize="extra-small" weight={400} inline>
                    Create new
                  </Text>
                  <Check
                    checked={completeAndCreate}
                    className="d-inline-block ms-2 me-3"
                    onChange={() => setCompleteAndCreate(!completeAndCreate)}
                  />
                </>
              )}
              <Button
                size="extra-small"
                variant="secondary"
                onClick={handleComplete}
              >
                Complete
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal.Footer>
    </Modal>
  );
};

export default TrainingComplete;
