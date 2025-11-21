import api from './api';

const getProblems = async () => {
  const response = await api.get('/problems');
  return response.data;
};

const getProblemById = async (id) => {
  const response = await api.get(`/problems/${id}`);
  return response.data;
};

const createProblem = async (problemData) => {
  const response = await api.post('/problems', problemData);
  return response.data;
};

export default {
  getProblems,
  getProblemById,
  createProblem,
};
