const Problem = require('../models/Problem');

exports.getProblems = async (req, res) => {
  try {
    const problems = await Problem.find({}, 'title difficulty');
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (problem) {
      // Hide hidden test cases from the client
      const publicProblem = problem.toObject();
      publicProblem.testCases = publicProblem.testCases.filter(tc => !tc.hidden);
      res.json(publicProblem);
    } else {
      res.status(404).json({ message: 'Problem not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createProblem = async (req, res) => {
  const { title, description, difficulty, starterCode, testCases } = req.body;

  try {
    const problem = new Problem({
      title,
      description,
      difficulty,
      starterCode,
      testCases,
    });

    const createdProblem = await problem.save();
    res.status(201).json(createdProblem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
