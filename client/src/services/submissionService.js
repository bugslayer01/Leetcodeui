import api from './api';

const runCode = async (data) => {
  const response = await api.post('/submit/run', data);
  return response.data;
};

const submitCode = async (data) => {
  const response = await api.post('/submit', data);
  return response.data;
};

export default {
  runCode,
  submitCode,
};
