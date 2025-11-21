import React, { useState } from 'react';
import problemService from '../services/problemService';
import Navbar from '../components/Navbar';

const AdminPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [starterCode, setStarterCode] = useState('');
  const [testCases, setTestCases] = useState([{ input: '', output: '', hidden: false }]);

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', output: '', hidden: false }]);
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...testCases];
    newTestCases[index][field] = value;
    setTestCases(newTestCases);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await problemService.createProblem({
        title,
        description,
        difficulty,
        starterCode,
        testCases,
      });
      alert('Problem created successfully!');
    } catch (error) {
      alert('Failed to create problem');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Add New Problem</h1>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea
              className="w-full p-2 border rounded"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Difficulty</label>
            <select
              className="w-full p-2 border rounded"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Starter Code</label>
            <textarea
              className="w-full p-2 border rounded font-mono"
              rows="6"
              value={starterCode}
              onChange={(e) => setStarterCode(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Test Cases</label>
            {testCases.map((tc, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Input"
                  className="w-1/3 p-2 border rounded"
                  value={tc.input}
                  onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Output"
                  className="w-1/3 p-2 border rounded"
                  value={tc.output}
                  onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                  required
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={tc.hidden}
                    onChange={(e) => handleTestCaseChange(index, 'hidden', e.target.checked)}
                  />
                  Hidden
                </label>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddTestCase}
              className="text-blue-500 hover:text-blue-700"
            >
              + Add Test Case
            </button>
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Create Problem
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminPage;
