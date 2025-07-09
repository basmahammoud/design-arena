// src/components/Streaming/Streaming.jsx
import React from 'react';
import useStreaming from '../../../hooks/useStream';
import './stream.css';

const Streaming = () => {
  const { roomName, isStreaming, startStream, stopStream } = useStreaming();

  return (
    <div className={isStreaming ? 'streaming-screen' : 'stream-container'}>
      {!isStreaming ? (
        <button className="stream-button" onClick={startStream}>
            start streaming 🎥
        </button>
      ) : (
        <div>
          <h2>غرفة: {roomName}</h2>
          <p>أنت الآن تبث شاشتك 🔴</p>
          <button className="stream-button" onClick={stopStream}>
            إيقاف البث 🛑
          </button>
        </div>
      )}
    </div>
  );
};

export default Streaming;
