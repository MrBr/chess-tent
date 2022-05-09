import React, { ComponentType, useEffect } from 'react';
import { hooks, requests, state, ui } from '@application';
import {
  LessonActivity,
  LessonActivityRole,
  updateSubject,
} from '@chess-tent/models';
import { RecordValue } from '@chess-tent/redux-record/types';
import { getActivityUserRole } from '@chess-tent/models';
import ActivityForm, { ActivityData } from './activity-form';

const { Offcanvas, Container, Button, Headline5, Row, Col, Confirm, Modal } =
  ui;
const { useDispatchService, useApi, useDispatch, useHistory, usePrompt } =
  hooks;
const {
  actions: { deleteEntity },
} = state;

const ActivitySettings: ComponentType<{
  activity: RecordValue<LessonActivity>;
  close: () => void;
}> = ({ activity, close }) => {
  const dispatchService = useDispatchService();
  const dispatch = useDispatch();
  const history = useHistory();
  const { fetch: activityDelete, response: activityDeleted } = useApi(
    requests.activityDelete,
  );

  const [deleteConfirm, promptDeleteActivity] = usePrompt(close => (
    <Modal close={close}>
      <Confirm
        title="Delete activity"
        message={`Are you sure you want to delete ${
          activity?.title || 'activity'
        }?`}
        okText="Cancel"
        cancelText="Delete"
        onOk={close}
        onCancel={() => activityDelete(activity?.id as string)}
      />
    </Modal>
  ));

  useEffect(() => {
    if (!activityDeleted || activityDeleted.error || !activity) {
      return;
    }
    dispatch(deleteEntity(activity));
    history.replace('/');
  }, [activity, activityDeleted, dispatch, history]);

  useEffect(() => {
    if (!activity) {
      close();
    }
  }, [activity, close]);

  if (!activity) {
    return null;
  }

  const updateActivity = (data: ActivityData) => {
    const studentRoles =
      data.students?.map(user => ({
        user,
        role: LessonActivityRole.STUDENT,
      })) || [];
    let roles = activity.roles;
    if (studentRoles.length > 0) {
      roles = studentRoles
        .filter(role => !getActivityUserRole(activity, role.user))
        .reduce(
          (res, newRole) => {
            res.push(newRole);
            return res;
          },
          [...roles],
        );
    }

    const title = data.title || activity.title;
    const date = data.date || activity.date;
    const weekly = data.weekly || activity.weekly;
    // Activity (component, not page) saves all the changes gradually
    // If needed, updateActivity function can be extracted outside the ActivitySettings
    dispatchService(updateSubject)(activity, { roles, title, date, weekly });
  };

  return (
    <>
      {deleteConfirm}
      <Offcanvas show onHide={close}>
        <Offcanvas.Header>
          <Headline5 className="m-0">Activity settings</Headline5>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Container>
            <ActivityForm
              activity={activity}
              onSubmit={updateActivity}
              submitButton={
                <Row className="mt-5">
                  <Col>
                    <Button type="submit" size="small">
                      Save
                    </Button>
                  </Col>
                  <Col className="col-auto">
                    <Button
                      type="button"
                      size="small"
                      variant="tertiary"
                      onClick={promptDeleteActivity}
                    >
                      Delete
                    </Button>
                  </Col>
                </Row>
              }
            />
          </Container>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ActivitySettings;
