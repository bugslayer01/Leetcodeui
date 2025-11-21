const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const { createSubmission, getSubmissionResult } = require('../services/judge0Service');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pollSubmission = async (token) => {
  let result = await getSubmissionResult(token);
  while (result.status.id <= 2) { // 1: In Queue, 2: Processing
    await sleep(1000);
    result = await getSubmissionResult(token);
  }
  return result;
};

exports.runCode = async (req, res) => {
  const { code, languageId, problemId } = req.body;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // Run against sample test cases (first one for now, or all samples)
    // For simplicity, let's run against the first sample test case
    const sampleTestCase = problem.testCases.find(tc => !tc.hidden);
    if (!sampleTestCase) return res.status(400).json({ message: 'No sample test cases found' });

    const token = await createSubmission(code, languageId, sampleTestCase.input);
    const result = await pollSubmission(token);

    res.json({
      input: sampleTestCase.input,
      expectedOutput: sampleTestCase.output,
      actualOutput: result.stdout,
      status: result.status,
      compile_output: result.compile_output,
      stderr: result.stderr,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitCode = async (req, res) => {
  const { code, languageId, problemId } = req.body;
  const userId = req.user._id;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // Prepare batch submissions
    const submissions = problem.testCases.map(tc => ({
      source_code: code,
      language_id: languageId,
      stdin: tc.input,
    }));

    const { createBatchSubmission, getBatchSubmissionResult } = require('../services/judge0Service');
    
    const tokens = await createBatchSubmission(submissions);
    
    // Poll for batch results
    let results = [];
    let allDone = false;
    while (!allDone) {
      await sleep(2000); // Wait a bit longer for batch
      results = await getBatchSubmissionResult(tokens);
      allDone = results.every(r => r.status.id > 2); // 1: In Queue, 2: Processing
    }

    let allPassed = true;
    let firstFailedResult = null;

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      const tc = problem.testCases[i];

      if (result.status.id !== 3) { // 3 is Accepted
        allPassed = false;
        firstFailedResult = result;
        break;
      } else {
        // Check output strictly (trim whitespace)
        if (result.stdout?.trim() !== tc.output.trim()) {
          allPassed = false;
          firstFailedResult = { ...result, status: { description: 'Wrong Answer' } };
          break;
        }
      }
    }

    const status = allPassed ? 'Accepted' : (firstFailedResult?.status?.description || 'Error');

    const submission = await Submission.create({
      user: userId,
      problem: problemId,
      code,
      languageId,
      status,
      result: firstFailedResult || { status: { description: 'Accepted' } },
    });

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
