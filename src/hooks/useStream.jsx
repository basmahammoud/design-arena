// useStreaming.js
import { useState, useEffect } from 'react';
import { Room, createLocalScreenTracks } from 'livekit-client';
import { getStreamToken } from '../services/streaming';

const useStreaming = () => {
  const [token, setToken] = useState(null);
  const [roomName, setRoomName] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [room, setRoom] = useState(null);
  const [stream, setStream] = useState(null); //  للاحتفاظ بالبث

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

      // ✅ الاتصال بالغرفة
      const newRoom = new Room();
      await newRoom.connect('wss://digitizer-6wnqoum4.livekit.cloud', data.access_token);
      console.log("✅ تم الاتصال بالغرفة LiveKit بنجاح!");

      setRoom(newRoom);

      // ✅ إنشاء تراك للشاشة + الصوت
      const tracks = await createLocalScreenTracks({
        audio: true,
        video: true,
      });

      // ✅ حفظ MediaStream
      const mediaStream = new MediaStream();
      tracks.forEach(track => mediaStream.addTrack(track.mediaStreamTrack));
      setStream(mediaStream);

      // ✅ نشر جميع التراكات بدون شروط
      for (const track of tracks) {
        await newRoom.localParticipant.publishTrack(track);
        console.log(`✅ Published ${track.kind} track`, track);
      }

      setIsStreaming(true);
    } catch (error) {
      console.error('❌ فشل بدء البث:', error);
      if (error?.message?.includes("permissions denied")) {
        console.warn("⚠️ تحقق من صلاحيات التوكن، خاصة canPublishSources");
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

    // ✅ تنظيف البث المحلي
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    setIsStreaming(false);
    setRoom(null);
    setToken(null);
    setRoomName(null);
    setStream(null);
  };

  return {
    token,
    roomName,
    isStreaming,
    startStream,
    stopStream,
    stream,
  };
};

export default useStreaming;
