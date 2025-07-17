import React, { useEffect } from 'react';
import { useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { Room, RoomEvent } from 'livekit-client';

const ViewerRoom = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const room = searchParams.get('room');
  const token = location.state?.token;

  useEffect(() => {
    if (!room || !token) {
      navigate('/');
    } else {
      sessionStorage.setItem("viewer_token", token);

      const startViewer = async () => {
        try {
          const { connect } = await import("https://cdn.skypack.dev/livekit-client");

          const livekitRoom = await connect("wss://digitizer-a4odfmnb.livekit.cloud", token);

          const videoContainer = document.getElementById("video-container");

          livekitRoom.on("trackSubscribed", (track, publication, participant) => {
            if (track.kind === "video") {
              const element = track.attach();
              videoContainer.appendChild(element);
            }
          });
        } catch (error) {
          console.error("فشل الاتصال بـ LiveKit:", error);
        }
      };

      startViewer();
    }
  }, [room, token, navigate]);

  useEffect(() => {
    if (!room || !token) return;

    const livekitRoom = new Room();

    const connectToRoom = async () => {
      try {
        await livekitRoom.connect('wss://digitizer-a4odfmnb.livekit.cloud', token);
        console.log("🎉 تم الاتصال بالغرفة كمشاهد");

        livekitRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          if (track.kind === "video") {
            const videoEl = track.attach();
            videoEl.style.width = "100%";
            videoEl.style.height = "100%";
            document.getElementById("video-container").appendChild(videoEl);
          }
        });
      } catch (err) {
        console.error("❌ فشل الاتصال بالبث:", err);
      }
    };

    connectToRoom();

    return () => {
      livekitRoom.disconnect();
    };
  }, [room, token]);

  return (
    <div>
      <h2>مشاهدة البث المباشر</h2>
      <div id="video-container" style={{ width: '100%', height: '80vh', background: '#000' }}></div>
    </div>
  );
};

export default ViewerRoom;
