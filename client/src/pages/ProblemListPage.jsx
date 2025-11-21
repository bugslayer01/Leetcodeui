import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import problemService from '../services/problemService';
import Navbar from '../components/Navbar';

const ProblemListPage = () => {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const data = await problemService.getProblems();
        setProblems(data);
      } catch (error) {
        console.error('Failed to fetch problems', error);
      }
    };
    fetchProblems();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Problems</h1>
        <div className="bg-white shadow-md rounded my-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Difficulty</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {problems.map((problem) => (
                <tr key={problem._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    <span className="font-medium">{problem.title}</span>
                  </td>
                  <td className="py-3 px-6 text-left">
                    <span
                      className={`${
                        problem.difficulty === 'Easy'
                          ? 'text-green-500'
                          : problem.difficulty === 'Medium'
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      } font-bold`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <Link
                      to={`/problems/${problem._id}`}
                      className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                    >
                      Solve
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ProblemListPage;
