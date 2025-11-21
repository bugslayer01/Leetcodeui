const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  hidden: { type: Boolean, default: false },
});

const ProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  starterCode: {
    type: String,
    required: true,
  },
  testCases: [TestCaseSchema],
}, { timestamps: true });

module.exports = mongoose.model('Problem', ProblemSchema);
