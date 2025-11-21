import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import problemService from '../services/problemService';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowRight, Code2 } from 'lucide-react';

const ProblemListPage = () => {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await problemService.getProblems();
        setProblems(data);
        setFilteredProblems(data);
      } catch (error) {
        console.error('Failed to fetch problems', error);
      }
    };
    fetchProblems();
  }, []);

  useEffect(() => {
    let result = problems;
    if (searchTerm) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (difficultyFilter !== 'All') {
      result = result.filter((p) => p.difficulty === difficultyFilter);
    }
    setFilteredProblems(result);
  }, [searchTerm, difficultyFilter, problems]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
            Problems
          </h1>
          <p className="text-slate-400 text-lg">
            Sharpen your skills with our collection of algorithm challenges.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center bg-slate-800/50 p-4 rounded-xl border border-slate-700 backdrop-blur-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search problems..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white placeholder-slate-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="text-slate-400" size={20} />
            <select
              className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none text-white cursor-pointer transition-all"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProblems.map((problem) => (
            <motion.div
              key={problem._id}
              variants={item}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${problem.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                      'bg-red-500/10 text-red-400'
                  }`}>
                  <Code2 size={24} />
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                  }`}>
                  {problem.difficulty}
                </span>
              </div>

              <h3 className="text-xl font-bold mb-2 text-white group-hover:text-indigo-400 transition-colors">
                {problem.title}
              </h3>

              <Link
                to={`/problems/${problem._id}`}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 group-hover:text-white transition-colors mt-4"
              >
                Solve Challenge <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No problems found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemListPage;
