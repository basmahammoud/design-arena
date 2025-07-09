// src/hooks/useStreaming.js
import { useState, useEffect } from 'react';
import { Room, createLocalScreenTracks } from 'livekit-client';
import { getStreamToken } from '../services/streaming';

const useStreaming = () => {
  const [token, setToken] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  const startStream = async () => {
    try {
      const data = await getStreamToken();
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
        console.log("🔍 Trying to publish track:", track.kind, track.name || "");

        // تحقق من نوع track
        if (track.kind === "video" && (track.name === "screen" || track.source === "screen_share")) {
          await newRoom.localParticipant.publishTrack(track);
          console.log("✅ تم نشر شاشة الفيديو بنجاح");
        } else if (track.kind === "audio") {
          await newRoom.localParticipant.publishTrack(track);
          console.log("✅ تم نشر صوت الشاشة بنجاح");
        } else {
          console.warn("❌ نوع التراك غير مدعوم للنشر:", track.kind);
        }
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

  return { token, roomName, isStreaming, startStream, stopStream };
};

export default useStreaming;
