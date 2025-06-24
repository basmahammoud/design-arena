// src/hooks/useEditProfile.js
import { useState } from 'react';
import { Edite_profile } from '../services/profileserv'; 

const useEditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const editProfile = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await Edite_profile(formData); 
      setResponse(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { editProfile, loading, error, response };
};

export default useEditProfile;
