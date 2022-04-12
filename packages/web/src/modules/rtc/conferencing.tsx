import React, { memo } from 'react';
import { ui } from '@application';

import type { ConferencingProps } from '@types';

import { DEFAULT_CONSTRAINTS, DEFAULT_ICE_SERVERS } from './constants';
import { ConferenceButton } from './components/conference-button';
import { RTCVideo } from './components/rtc-video';
import { usePeerConnection } from './hook';

const { Icon } = ui;

const Conferencing = memo(
  ({
    activityId,
    iceServerUrls,
    mediaConstraints = DEFAULT_CONSTRAINTS,
  }: ConferencingProps) => {
    const iceServers =
      iceServerUrls?.map(serverURL => ({ urls: serverURL })) ||
      DEFAULT_ICE_SERVERS;

    const {
      state,
      handleStartConferencing,
      handleMuteUnmute,
      handleStopConferencing,
      handleToggleCamera,
    } = usePeerConnection(activityId, iceServers, mediaConstraints);

    return (
      <>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <RTCVideo mediaStream={state.localMediaStream} muted />
          <RTCVideo mediaStream={state.remoteMediaStream} />
        </div>
        <div style={{ height: 10, width: '100%' }} />
        <section style={{ display: 'flex', gap: 10 }}>
          <ConferenceButton
            className="d-flex justify-content-center align-items-center"
            onClick={handleStartConferencing}
            style={{ background: 'rgba(0, 200, 0, 0.6)', paddingTop: 3 }}
            title="Start"
          >
            <Icon type="enter" />
          </ConferenceButton>
          <ConferenceButton
            className="d-flex justify-content-center align-items-center"
            style={{
              background: state.mutedAudio ? 'gray' : 'rgba(0, 0, 200, 0.6)',
              paddingTop: 3,
            }}
            onClick={handleMuteUnmute}
            title="Toggle Microphone"
          >
            <Icon type="microphone" />
          </ConferenceButton>
          <ConferenceButton
            className="d-flex justify-content-center align-items-center"
            style={{
              background: state.mutedVideo
                ? 'gray'
                : 'rgba(200, 100, 100, 0.6)',
              paddingTop: 3,
            }}
            onClick={handleToggleCamera}
            title="Toggle Camera"
          >
            <Icon type="camera" />
          </ConferenceButton>
          <ConferenceButton
            className="d-flex justify-content-center align-items-center"
            style={{ background: 'rgba(200, 0, 0, 0.6)', paddingTop: 3 }}
            onClick={handleStopConferencing}
            title="Stop"
          >
            <Icon type="exit" />
          </ConferenceButton>
        </section>
      </>
    );
  },
);

export default Conferencing;
