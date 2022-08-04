import React, { ComponentType, useEffect, useRef } from 'react';
import { components, hooks, requests, state, ui } from '@application';
import { ApiStatus, FormikProps } from '@types';
import {
  createRole,
  LessonActivity,
  LessonActivityRole,
} from '@chess-tent/models';
import { RecordValue } from '@chess-tent/redux-record/types';
import ActivityForm, { ActivityData } from './activity-form';

const { Offcanvas, Container, Button, Headline5, Row, Col, Confirm, Modal } =
  ui;
const { useApi, useDispatch, useHistory, usePrompt } = hooks;
const {
  actions: { deleteEntity },
} = state;
const { ApiStatusLabel } = components;

const ActivitySettingsCoach: ComponentType<{
  activity: RecordValue<LessonActivity>;
  close: () => void;
  save: (patch: Partial<LessonActivity>) => void;
  status: ApiStatus;
}> = ({ activity, close, save, status }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const activityFormRef = useRef<FormikProps<ActivityData>>(null);
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

  const updateActivity = () => {
    if (!activityFormRef.current) {
      return;
    }
    const data = activityFormRef.current.values;
    const studentRoles =
      data.students?.map(createRole(LessonActivityRole.STUDENT)) || [];
    const roles = [
      ...studentRoles,
      ...activity.roles.filter(
        ({ role }) => role !== LessonActivityRole.STUDENT,
      ),
    ];

    const title = data.title || activity.title;
    const date = data.date || activity.date;
    const weekly = data.weekly || activity.weekly;
    // Activity (component, not page) saves all the changes gradually
    // If needed, updateActivity function can be extracted outside the ActivitySettings
    save({
      roles,
      title,
      date,
      weekly,
      state: { ...activity.state, ...data.state },
    });
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
            <ActivityForm activity={activity} formRef={activityFormRef} />
            <Row className="mt-5">
              <Col>
                <Button size="small" onClick={updateActivity}>
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
            <Row className="justify-content-center mt-4">
              <Col className="col-auto">
                <ApiStatusLabel status={status} />
              </Col>
            </Row>
          </Container>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default ActivitySettingsCoach;
