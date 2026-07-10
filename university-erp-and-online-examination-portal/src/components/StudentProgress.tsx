import { useState } from 'react';
import { StudentProgressRow } from '../mockData';
import { Search, Sparkles, Filter, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { motion } from 'motion/react';

interface StudentProgressProps {
  progressRows: StudentProgressRow[];
}

export default function StudentProgress({ progressRows }: StudentProgressProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pass' | 'fail'>('all');

  // Filter students based on search term and pass/fail filters
  const filteredProgress = progressRows.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.roll.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'pass') return matchesSearch && student.passed;
    if (statusFilter === 'fail') return matchesSearch && !student.passed;
    return matchesSearch;
  });

  return (
    <div id="student-progress-container" className="space-y-6">
      
      {/* Title block */}
      <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Comprehensive Student Progress Ledger</h3>
          <p className="text-xs text-slate-400 font-semibold">Track cumulative MCQ assessments, scores, averages, and clearance status for all enrolled candidates.</p>
        </div>
      </div>

      {/* Controls Grid (Search, Filter, Stats Pill) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search student name or roll..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-450 focus:outline-hidden focus:ring-2 focus:ring-teal-500/10 focus:border-teal-500"
          />
        </div>

        {/* Filter Selection */}
        <div className="flex items-center space-x-2 bg-white px-4 border border-slate-200 rounded-xl">
          <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full bg-transparent border-0 text-xs font-bold text-slate-600 focus:outline-hidden py-2"
          >
            <option value="all">Display All Students</option>
            <option value="pass">Only Passed Candidates</option>
            <option value="fail">Remedial/Flagged (Fail)</option>
          </select>
        </div>

        {/* Aggregate mini statistics */}
        <div className="bg-teal-50/50 border border-teal-100 rounded-xl px-4 py-2 flex items-center justify-between text-xs text-teal-800 font-semibold">
          <span>Passing Ratio:</span>
          <span className="font-mono text-sm font-extrabold bg-teal-600 text-white px-2.5 py-0.5 rounded-full">
            {progressRows.length > 0
              ? `${Math.round((progressRows.filter(p => p.passed).length / progressRows.length) * 100)}%`
              : 'N/A'}
          </span>
        </div>

      </div>

      {/* Main Ledger Table */}
      <div className="bg-white rounded-2xl border border-slate-250 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th className="py-4 px-6">Candidate Credentials</th>
                <th className="py-4 px-4">Degree Course</th>
                <th className="py-4 px-4 text-center">Completed Quizzes</th>
                <th className="py-4 px-4 text-center">Aggregate Marks</th>
                <th className="py-4 px-4 text-center">Avg Percentage</th>
                <th className="py-4 px-6 text-right">Academic Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProgress.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                    <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-700">No Student Records Found</p>
                    <p className="text-xs text-slate-400">Try modifying your search or filters to locate student logs.</p>
                  </td>
                </tr>
              ) : (
                filteredProgress.map((student) => (
                  <tr key={student.roll} className="hover:bg-slate-50/50 transition-all">
                    
                    {/* Name & Roll */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800 text-sm">{student.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{student.roll}</div>
                    </td>

                    {/* Course */}
                    <td className="py-4 px-4 text-xs font-bold text-slate-500">
                      {student.course}
                    </td>

                    {/* Completed */}
                    <td className="py-4 px-4 text-center font-bold text-xs text-slate-600 font-mono">
                      {student.completedTests} Exams
                    </td>

                    {/* Marks obtained vs possible */}
                    <td className="py-4 px-4 text-center font-bold text-xs text-slate-600 font-mono">
                      {student.marksObtained} / {student.totalMarksPossible}
                    </td>

                    {/* Percentage progress */}
                    <td className="py-4 px-4">
                      <div className="flex flex-col items-center justify-center space-y-1 max-w-[120px] mx-auto">
                        <div className="flex items-center justify-between w-full text-[10px] font-mono font-bold">
                          <span className={student.percentage >= 50 ? 'text-emerald-600' : 'text-rose-600'}>
                            {student.percentage}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              student.percentage >= 50 ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${student.percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 text-right">
                      <span className={`text-[9px] px-3 py-1 rounded-full font-extrabold uppercase tracking-widest ${
                        student.passed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100 animate-pulse'
                      }`}>
                        {student.passed ? 'PASS CLEARANCE' : 'FAIL / WARNING'}
                      </span>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
