const axios = require('axios');

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
// Parse API keys from comma-separated string
const API_KEYS = (process.env.JUDGE0_API_KEY || '').split(',').map(k => k.trim()).filter(k => k);

let currentKeyIndex = 0;

const getNextKey = () => {
  if (API_KEYS.length === 0) {
    throw new Error('No Judge0 API keys provided');
  }
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
};

const getClient = () => {
  const apiKey = getNextKey();
  console.log(`Using API Key index: ${(currentKeyIndex - 1 + API_KEYS.length) % API_KEYS.length}`); // Debug log
  return axios.create({
    baseURL: JUDGE0_API_URL,
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    },
  });
};

exports.createSubmission = async (code, languageId, input) => {
  try {
    const client = getClient();
    const response = await client.post('/submissions', {
      source_code: code,
      language_id: languageId,
      stdin: input,
    });
    return response.data.token;
  } catch (error) {
    console.error('Judge0 Submission Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to create submission');
  }
};

exports.getSubmissionResult = async (token) => {
  try {
    const client = getClient();
    const response = await client.get(`/submissions/${token}`);
    return response.data;
  } catch (error) {
    console.error('Judge0 Result Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to get submission result');
  }
};

exports.createBatchSubmission = async (submissions) => {
  try {
    const client = getClient();
    const response = await client.post('/submissions/batch', {
      submissions: submissions
    });
    // Response is an array of objects, each containing a 'token'
    return response.data.map(s => s.token);
  } catch (error) {
    console.error('Judge0 Batch Submission Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to create batch submission');
  }
};

exports.getBatchSubmissionResult = async (tokens) => {
  try {
    const client = getClient();
    const tokensString = tokens.join(',');
    const response = await client.get(`/submissions/batch?tokens=${tokensString}`);
    // Response is an object with 'submissions' array
    return response.data.submissions;
  } catch (error) {
    console.error('Judge0 Batch Result Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to get batch submission result');
  }
};
