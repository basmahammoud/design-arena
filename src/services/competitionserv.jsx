import axios from 'axios';

axios.defaults.withCredentials = true;

export const fetchCompetitions = async () => {
  const response = await axios.get('http://localhost:8000/competitions');
  console.log("er",response);
  return response.data;

};

//عرض معلمومات المسابقة اذا كانت منتهية يعرض التصاميم ايضا
export const show = async (id) => {
  const response = await axios.get(`http://localhost:8000/competitions/${id}`);
  return response.data;

};

// انضمام مصمم الى مسابقة

export const storeForCompetition = async (competitionId, formData) => {
  const response = await axios.post(
    `http://localhost:8000/competitions/${competitionId}/designs`,
    formData, 
    {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true, 
    }
  );
  return response.data;
};
