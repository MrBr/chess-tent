import React, { ComponentType, useEffect } from 'react';
import { hooks, requests, state, ui } from '@application';
import { LessonActivity } from '@chess-tent/models';
import { RecordValue } from '@chess-tent/redux-record/types';
import { ApiStatus } from '@types';

const { Offcanvas, Container, Button, Headline5, Row, Col, Confirm, Modal } =
  ui;
const { useDispatch, useHistory, usePrompt, useActiveUserRecord, useApi } =
  hooks;
const {
  actions: { deleteEntity },
} = state;

const ActivitySettingsStudent: ComponentType<{
  activity: RecordValue<LessonActivity>;
  close: () => void;
  status: ApiStatus;
}> = ({ activity, close }) => {
  const { fetch: activityPatch, response: activityUpdateResponse } = useApi(
    requests.activityPatch,
  );
  const { value: user } = useActiveUserRecord();
  const dispatch = useDispatch();
  const history = useHistory();

  const leaveActivity = () => {
    if (!activity) {
      return;
    }
    const roles = activity.roles.filter(role => role.user.id !== user.id);
    // TODO - this is not ideal because the other possible users that are in the room atm aren't getting notified
    activityPatch(activity.id, {
      roles,
    });
  };

  useEffect(() => {
    if (!activity || !activityUpdateResponse) {
      return;
    }
    dispatch(deleteEntity(activity));
    history.replace('/');
  }, [activity, dispatch, history, activityUpdateResponse]);

  const [leaveConfirm, promptLeaveActivity] = usePrompt(close => (
    <Modal close={close}>
      <Confirm
        title="Leave activity"
        message={`Are you sure you want to leave ${
          activity?.title || 'activity'
        }?`}
        okText="Cancel"
        cancelText="Leave"
        onOk={close}
        onCancel={() => leaveActivity()}
      />
    </Modal>
  ));

  useEffect(() => {
    if (!activity) {
      close();
    }
  }, [activity, close]);

  if (!activity) {
    return null;
  }

  return (
    <>
      {leaveConfirm}
      <Offcanvas show onHide={close}>
        <Offcanvas.Header>
          <Headline5 className="m-0">Activity settings</Headline5>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Container>
            <Row className="mt-5">
              <Col className="col-auto">
                <Button
                  type="button"
                  size="small"
                  variant="tertiary"
                  onClick={promptLeaveActivity}
                >
                  Leave
                </Button>
              </Col>
            </Row>
          </Container>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ActivitySettingsStudent;
