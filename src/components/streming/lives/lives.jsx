import { useNavigate } from "react-router-dom";
import useLives from "../../../hooks/usewatchlives";
import useViewerToken from "../../../hooks/useViewerToken";
import './lives.css';

const Lives = () => {
  const { lives, loading, error } = useLives();
  const { fetchToken } = useViewerToken();
  const navigate = useNavigate();

  if (loading) return <p>جاري التحميل...</p>;
  if (error) return <p>حدث خطأ: {error}</p>;

  const handleWatch = async (streamKey, userId) => {
    const room = `room_${userId}`;
    const data = await fetchToken(room);
    if (data) {
        
        navigate(`/viewer-token?room=${room}`, { state: { token: data.token } });    
       }
    };

  return (
    <div className="lives-container">
      {lives.map((live) => (
        <div key={live.id} className="live-card">
          <img
            src={`http://localhost:8000/${live.user.profile_picture}`}
            alt={live.user.name}
            className="live-image"
          />
          <h3 className="live-name">{live.user.name}</h3>
          <button
            className="watch-button"
            onClick={() => handleWatch(live.stream_key, live.user_id)}
          >
            مشاهدة البث
          </button>
        </div>
      ))}
    </div>
  );
};

export default Lives;
