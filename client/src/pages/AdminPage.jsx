import React, { useState, useEffect } from 'react';
import problemService from '../services/problemService';
import { Plus, List, Trash2, Edit, Save, X, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    starterCode: '',
    testCases: [{ input: '', output: '', hidden: false }],
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (activeTab === 'manage') {
      fetchProblems();
    }
  }, [activeTab]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const data = await problemService.getProblems();
      setProblems(data);
    } catch (error) {
      console.error('Failed to fetch problems', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTestCaseChange = (index, field, value) => {
    const newTestCases = [...formData.testCases];
    newTestCases[index][field] = value;
    setFormData({ ...formData, testCases: newTestCases });
  };

  const addTestCase = () => {
    setFormData({
      ...formData,
      testCases: [...formData.testCases, { input: '', output: '', hidden: false }],
    });
  };

  const removeTestCase = (index) => {
    const newTestCases = formData.testCases.filter((_, i) => i !== index);
    setFormData({ ...formData, testCases: newTestCases });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Basic Validation
    if (!formData.title || !formData.description || !formData.starterCode) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    try {
      await problemService.createProblem(formData);
      setMessage({ type: 'success', text: 'Problem created successfully!' });
      setFormData({
        title: '',
        description: '',
        difficulty: 'Easy',
        starterCode: '',
        testCases: [{ input: '', output: '', hidden: false }],
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create problem. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <div className="flex space-x-4 bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${activeTab === 'create' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
            >
              <Plus size={18} /> Create Problem
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${activeTab === 'manage' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
                }`}
            >
              <List size={18} /> Manage Problems
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'create' ? (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700"
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Plus className="text-indigo-400" /> Add New Problem
              </h2>

              {message.text && (
                <div className={`p-4 rounded-lg mb-6 flex items-center gap-2 ${message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Problem Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g. Two Sum"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Difficulty</label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Description (Markdown supported)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                    placeholder="Describe the problem..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Starter Code</label>
                  <textarea
                    name="starterCode"
                    value={formData.starterCode}
                    onChange={handleInputChange}
                    rows="6"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-mono text-sm"
                    placeholder="function solution(args) { ... }"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Test Cases</label>
                  <div className="space-y-4">
                    {formData.testCases.map((tc, index) => (
                      <div key={index} className="flex flex-col md:flex-row gap-4 items-start bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Input (e.g. [2, 7, 11, 15], 9)"
                            value={tc.input}
                            onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white focus:border-indigo-500 outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="text"
                            placeholder="Output (e.g. [0, 1])"
                            value={tc.output}
                            onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-white focus:border-indigo-500 outline-none"
                          />
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={tc.hidden}
                              onChange={(e) => handleTestCaseChange(index, 'hidden', e.target.checked)}
                              className="form-checkbox h-4 w-4 text-indigo-600 rounded bg-slate-800 border-slate-600"
                            />
                            <span className="ml-2 text-sm text-slate-400">Hidden</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => removeTestCase(index)}
                            className="text-red-400 hover:text-red-300 p-1"
                            title="Remove Test Case"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addTestCase}
                    className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Test Case
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-700 flex justify-end">
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 flex items-center gap-2"
                  >
                    <Save size={20} /> Create Problem
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="manage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-slate-800 rounded-xl p-8 shadow-xl border border-slate-700"
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <List className="text-indigo-400" /> Manage Problems
              </h2>

              {loading ? (
                <div className="text-center py-10 text-slate-400">Loading problems...</div>
              ) : problems.length === 0 ? (
                <div className="text-center py-10 text-slate-400 bg-slate-900/50 rounded-lg border border-dashed border-slate-700">
                  No problems found. Create one to get started!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 text-slate-400 text-sm uppercase tracking-wider">
                        <th className="p-4">Title</th>
                        <th className="p-4">Difficulty</th>
                        <th className="p-4">Test Cases</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {problems.map((problem) => (
                        <tr key={problem._id} className="hover:bg-slate-700/50 transition-colors">
                          <td className="p-4 font-medium text-white">{problem.title}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                                problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                              }`}>
                              {problem.difficulty}
                            </span>
                          </td>
                          <td className="p-4 text-slate-400">{problem.testCases?.length || 0}</td>
                          <td className="p-4 text-right space-x-2">
                            <button className="text-indigo-400 hover:text-indigo-300 p-1" title="Edit">
                              <Edit size={18} />
                            </button>
                            <button className="text-red-400 hover:text-red-300 p-1" title="Delete">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminPage;
