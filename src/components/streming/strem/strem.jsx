import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Room, createLocalScreenTracks } from 'livekit-client';
import './strem.css';

const Streming = () => {
  const [token, setToken] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    // تنظيف الاتصال عند الخروج من الصفحة
    return () => {
      stopStream();
    };
  }, []);

 const startStream = async () => {
  try {
    const response = await axios.post('http://localhost:8000/streams', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = response.data;
    console.log("🎟️ Token:", data.access_token);
    console.log("📺 Room Name:", data.room_name);

    setToken(data.access_token);
    setRoomName(data.room_name);

    const newRoom = new Room();
    await newRoom.connect('wss://digitizer-a4odfmnb.livekit.cloud', data.access_token);
    console.log("✅ تم الاتصال بالغرفة LiveKit بنجاح!");

    setRoom(newRoom);

    const tracks = await createLocalScreenTracks({ audio: true });

    for (const track of tracks) {
      await newRoom.localParticipant.publishTrack(track);
      console.log(`✅ تم نشر التراك: ${track.kind}`);
    }

    setIsStreaming(true);
  } catch (error) {
    console.error('❌ فشل بدء البث:', error);
    if (error?.message?.includes("permissions denied")) {
      console.warn("⚠️ تحقق من صلاحيات التوكن، خاصة can_publish_sources");
    }
  }
};


  const stopStream = async () => {
    if (room) {
      try {
        room.disconnect();
        console.log("🛑 تم إيقاف الاتصال بالغرفة");
      } catch (e) {
        console.warn("⚠️ خطأ عند قطع الاتصال:", e);
      }
    }
    setIsStreaming(false);
    setRoom(null);
    setToken(null);
    setRoomName(null);
  };

  return (
    <div className={isStreaming ? 'streaming-screen' : 'stream-container'}>
      {!isStreaming ? (
        <button className="stream-button" onClick={startStream}>
          بدء البث المباشر 🎥
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

export default Streming;
