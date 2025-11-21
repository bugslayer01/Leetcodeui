import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import problemService from '../services/problemService';
import submissionService from '../services/submissionService';
import Editor from '@monaco-editor/react';
import { Play, Send, CheckCircle, XCircle, Loader2, ChevronRight } from 'lucide-react';

const ProblemPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [verdict, setVerdict] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const data = await problemService.getProblemById(id);
        setProblem(data);
        setCode(data.starterCode);
      } catch (error) {
        console.error('Failed to fetch problem', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setVerdict(null);
    setOutput('Running tests...');

    try {
      const result = await submissionService.submitCode({
        problemId: id,
        code,
        language: 'javascript', // Hardcoded for now
      });

      setVerdict(result.status);
      if (result.status === 'Accepted') {
        setOutput('All test cases passed! 🎉');
      } else {
        setOutput(`Error: ${result.message || 'Test cases failed.'}\n\nOutput:\n${result.output || ''}`);
      }
    } catch (error) {
      setVerdict('Error');
      setOutput('An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
      </div>
    );
  }

  if (!problem) {
    return <div className="min-h-screen bg-slate-900 text-white p-8">Problem not found</div>;
  }

  return (
    <div className="h-[calc(100vh-64px)] bg-slate-900 text-slate-50 flex flex-col lg:flex-row overflow-hidden">
      {/* Left Panel: Description */}
      <div className="w-full lg:w-1/2 h-full flex flex-col border-r border-slate-800">
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2 text-white">{problem.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                  problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                }`}>
                {problem.difficulty}
              </span>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-slate-300 leading-relaxed">{problem.description}</p>
            </div>
          </div>

          {/* Examples Section (Mocked for now if not in data) */}
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4 text-white">Examples</h3>
            <div className="space-y-4">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <p className="text-sm font-mono text-slate-400 mb-2">Input: <span className="text-white">nums = [2,7,11,15], target = 9</span></p>
                <p className="text-sm font-mono text-slate-400">Output: <span className="text-white">[0,1]</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Editor & Output */}
      <div className="w-full lg:w-1/2 h-full flex flex-col bg-[#1e1e1e]">
        {/* Editor Header */}
        <div className="h-10 bg-[#1e1e1e] border-b border-[#2d2d2d] flex items-center px-4 justify-between">
          <span className="text-xs text-slate-400 font-mono">JavaScript</span>
          <div className="flex items-center gap-2">
            <button className="text-xs text-slate-400 hover:text-white transition-colors">Reset</button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 relative">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>

        {/* Action Bar & Output */}
        <div className="h-1/3 bg-slate-900 border-t border-slate-800 flex flex-col">
          <div className="h-12 border-b border-slate-800 flex items-center justify-between px-4 bg-slate-800/50">
            <span className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <ChevronRight size={16} /> Console
            </span>
            <div className="flex items-center gap-2">
              <button
                className="px-4 py-1.5 rounded bg-slate-700 text-white text-sm font-medium hover:bg-slate-600 transition-colors flex items-center gap-2"
                onClick={() => { }} // Run Code Logic
              >
                <Play size={14} /> Run
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`px-4 py-1.5 rounded text-white text-sm font-medium flex items-center gap-2 transition-all ${submitting ? 'bg-indigo-600/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
                  }`}
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                Submit
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto font-mono text-sm custom-scrollbar">
            {output ? (
              <div className={verdict === 'Accepted' ? 'text-green-400' : verdict === 'Error' ? 'text-red-400' : 'text-slate-300'}>
                {verdict === 'Accepted' && <CheckCircle className="inline-block mr-2 mb-1" size={16} />}
                {verdict === 'Error' && <XCircle className="inline-block mr-2 mb-1" size={16} />}
                <pre className="whitespace-pre-wrap font-sans">{output}</pre>
              </div>
            ) : (
              <div className="text-slate-500 italic">Run your code to see output...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
