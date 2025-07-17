// src/pages/PublisherPageWrapper.jsx
import React from 'react';
import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import PublisherRoom from './PublisherRoom';

const PublisherPageWrapper = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const room = searchParams.get('room');
  const token = location.state?.token;

  if (!room || !token) {
    navigate('/');
    return null;
  }

  return <PublisherRoom room={room} token={token} />;
};

export default PublisherPageWrapper;
