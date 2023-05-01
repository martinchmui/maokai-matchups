import React from 'react';
import '../styles/liveNotification.css';
import { useAppSelector } from '../redux/hooks';

const LiveNotification = () => {
  const isLive = useAppSelector((state) => state.data.isLive);

  return (
    <>
      {isLive ? (
        <a
          href="https://www.twitch.tv/aizolol"
          target="_blank"
          id="live-notification"
          rel="noreferrer"
        >
          <div className="circle" />
          twitch.tv/aizolol
        </a>
      ) : null}
    </>
  );
};

export default LiveNotification;
