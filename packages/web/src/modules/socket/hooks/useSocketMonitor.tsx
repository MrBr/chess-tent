import React, { useMemo } from 'react';
import { hooks, ui } from '@application';
import { Hooks } from '@types';
import { useSocketConnected } from './index';

const { Button, Modal, Text, Dot, OverlayTrigger, Tooltip } = ui;
const { useHistory } = hooks;

const useSocketMonitor: Hooks['useSocketMonitor'] = (
  container?: () => HTMLElement,
) => {
  const history = useHistory();
  const [connected] = useSocketConnected();

  const statusTooltip = (
    <Tooltip>{connected ? 'Socket connected' : 'Socket disconnected'}</Tooltip>
  );
  const status = (
    <OverlayTrigger overlay={statusTooltip} placement="bottom">
      <span>
        <Dot variant={connected ? 'success' : 'error'} />
      </span>
    </OverlayTrigger>
  );
  const alert = useMemo(
    () => (
      <Modal
        show={!connected}
        className="position-absolute"
        backdropClassName="position-absolute mw-100 mh-100"
        container={container}
      >
        <Modal.Header>
          <Text weight={400} className="mb-0">
            Socket connection lost
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Text fontSize="small" className="mb-0">
            Please wait until socket reconnects or try refreshing the page.
          </Text>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="ghost"
            size="extra-small"
            onClick={() => history.push('/')}
          >
            Leave
          </Button>
          <Button
            variant="primary"
            size="extra-small"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </Modal.Footer>
      </Modal>
    ),
    // ignore container as dependency
    // eslint-disable-next-line
    [connected, history],
  );

  return [status, alert];
};

export default useSocketMonitor;
