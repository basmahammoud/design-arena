import React, { useRef, useEffect } from 'react';
import useStreaming from '../../../hooks/useStream';
import './stream.css';

const Streaming = () => {
  const videoRef = useRef(null);
  const { roomName, isStreaming, startStream, stopStream, stream } = useStreaming();

  useEffect(() => {
    if (videoRef.current && stream) {
      const hasVideo = stream.getVideoTracks().length > 0;
      console.log("هل يوجد فيديو بالبث؟", hasVideo);

      if (hasVideo) {
        videoRef.current.srcObject = stream;
      } else {
        console.warn(" لا يوجد تراك فيديو في MediaStream");
      }
    }
  }, [stream]);

  return (
    <div className={isStreaming ? 'streaming-screen' : 'stream-container'}>
      {!isStreaming ? (
        <button className="stream-button" onClick={startStream}>
          start streaming 
        </button>
      ) : (
        <div>
          <h2>غرفة: {roomName}</h2>
          <p>أنت الآن تبث شاشتك 🔴</p>
<video
  ref={videoRef}
  autoPlay
  playsInline
  muted
  style={{ width: '100%', height: '80vh', backgroundColor: '#000' }} // أضف خلفية للتمييز
  onLoadedMetadata={() => {
    console.log("📼 Video metadata loaded");
    videoRef.current?.play();
  }}
/>
          <button className="stream-button" onClick={stopStream}>
            إيقاف البث 🛑
          </button>
        </div>
      )}
    </div>
  );
};

export default Streaming;
