import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import problemService from '../services/problemService';
import submissionService from '../services/submissionService';
import Navbar from '../components/Navbar';
import CodeEditor from '../components/CodeEditor';

const ProblemPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await problemService.getProblemById(id);
        setProblem(data);
        setCode(data.starterCode);
      } catch (error) {
        console.error('Failed to fetch problem', error);
      }
    };
    fetchProblem();
  }, [id]);

  const handleRun = async () => {
    setLoading(true);
    setOutput(null);
    try {
      const result = await submissionService.runCode({
        code,
        languageId: 63, // JavaScript
        problemId: id,
      });
      setOutput(result);
      setActiveTab('output');
    } catch (error) {
      setOutput({ error: 'Execution failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setOutput(null);
    try {
      const result = await submissionService.submitCode({
        code,
        languageId: 63, // JavaScript
        problemId: id,
      });
      setOutput(result);
      setActiveTab('output');
    } catch (error) {
      setOutput({ error: 'Submission failed' });
    } finally {
      setLoading(false);
    }
  };

  if (!problem) return <div>Loading...</div>;

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Description */}
        <div className="w-1/2 p-6 overflow-y-auto border-r bg-white">
          <h1 className="text-2xl font-bold mb-4">{problem.title}</h1>
          <div className={`inline-block px-2 py-1 rounded text-sm font-bold mb-4 ${
            problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
            problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {problem.difficulty}
          </div>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{problem.description}</p>
          </div>
          
          <div className="mt-8">
            <h3 className="font-bold mb-2">Example Test Cases:</h3>
            {problem.testCases.map((tc, idx) => (
              <div key={idx} className="bg-gray-100 p-4 rounded mb-2">
                <p><strong>Input:</strong> {tc.input}</p>
                <p><strong>Output:</strong> {tc.output}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel: Editor & Output */}
        <div className="w-1/2 flex flex-col bg-gray-50">
          <div className="flex-1 p-4">
            <CodeEditor code={code} onChange={setCode} language="javascript" />
          </div>
          
          {/* Action Bar */}
          <div className="p-4 bg-white border-t flex justify-between items-center">
             <div className="flex space-x-2">
                <button 
                  className={`px-4 py-2 rounded ${activeTab === 'output' ? 'bg-gray-200' : ''}`}
                  onClick={() => setActiveTab('output')}
                >
                  Output
                </button>
             </div>
             <div className="flex space-x-2">
                <button
                  onClick={handleRun}
                  disabled={loading}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                  Run
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
                >
                  Submit
                </button>
             </div>
          </div>

          {/* Output Panel */}
          {activeTab === 'output' && (
            <div className="h-1/3 bg-gray-900 text-white p-4 overflow-y-auto font-mono text-sm">
              {loading ? (
                <p>Running...</p>
              ) : output ? (
                <div>
                  {output.status && (
                    <div className={`mb-2 font-bold ${
                      output.status.description === 'Accepted' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      Status: {output.status.description || output.status}
                    </div>
                  )}
                  {output.actualOutput && (
                    <div className="mb-2">
                      <span className="text-gray-400">Output:</span>
                      <pre>{output.actualOutput}</pre>
                    </div>
                  )}
                  {output.expectedOutput && (
                    <div className="mb-2">
                      <span className="text-gray-400">Expected:</span>
                      <pre>{output.expectedOutput}</pre>
                    </div>
                  )}
                  {output.compile_output && (
                    <div className="mb-2 text-yellow-400">
                      <span className="text-gray-400">Compilation:</span>
                      <pre>{output.compile_output}</pre>
                    </div>
                  )}
                  {output.stderr && (
                    <div className="mb-2 text-red-400">
                      <span className="text-gray-400">Error:</span>
                      <pre>{output.stderr}</pre>
                    </div>
                  )}
                  {output.error && <div className="text-red-500">{output.error}</div>}
                </div>
              ) : (
                <p className="text-gray-500">Run code to see output</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
