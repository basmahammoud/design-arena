import React, { useEffect } from 'react';

// ✅ تأكد من توليد التوكن في Laravel مع صلاحيات canPublish=true
const PublisherRoom = ({ room, token }) => {
  useEffect(() => {
    const startPublishing = async () => {
      try {
        const { connect, createLocalVideoTrack } = await import("https://cdn.skypack.dev/livekit-client");

        const livekitRoom = await connect("wss://digitizer-6wnqoum4.livekit.cloud", token);

        const videoTrack = await createLocalVideoTrack();
        await livekitRoom.localParticipant.publishTrack(videoTrack);

        const videoElement = videoTrack.attach();
        document.getElementById("local-video").appendChild(videoElement);
      } catch (err) {
        console.error("فشل بدء البث:", err);
      }
    };

    startPublishing();
  }, [room, token]);

  return (
    <div>
      <h2>📡 أنت تبث إلى الغرفة: {room}</h2>
      <div id="local-video" style={{ width: '100%', height: '80vh', background: '#000' }}></div>
    </div>
  );
};

export default PublisherRoom;
