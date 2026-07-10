import React, { useState } from 'react';
import { Exam, Announcement, StudentAttendance } from '../types';
import { Users, FileSpreadsheet, AlertCircle, TrendingUp, Megaphone, Plus, ArrowRight } from 'lucide-react';
import { StudentProgressRow } from '../mockData';

interface TeacherDashboardProps {
  exams: Exam[];
  progress: StudentProgressRow[];
  announcements: Announcement[];
  attendance: StudentAttendance[];
  onNavigate: (view: string) => void;
  onQuickAnnouncement: (title: string, content: string, category: 'Exam' | 'Assignment' | 'Holiday' | 'Project' | 'Workshop' | 'General') => void;
}

export default function TeacherDashboard({
  exams,
  progress,
  announcements,
  attendance,
  onNavigate,
  onQuickAnnouncement
}: TeacherDashboardProps) {
  
  // Quick Post State
  const [quickTitle, setQuickTitle] = useState('');
  const [quickContent, setQuickContent] = useState('');
  const [quickCategory, setQuickCategory] = useState<'Exam' | 'Assignment' | 'Holiday' | 'Project' | 'Workshop' | 'General'>('General');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Calculate Teacher Dashboard Stats
  const totalStudents = progress.length;
  const totalTests = exams.length;
  
  // Calculate Average Attendance across all students
  let totalPctSum = 0;
  attendance.forEach(student => {
    const present = student.history.filter(h => h.status === 'Present').length;
    const total = student.history.length;
    const pct = total > 0 ? (present / total) * 100 : 0;
    totalPctSum += pct;
  });
  const averageAttendance = totalStudents > 0 ? Math.round(totalPctSum / totalStudents) : 0;

  // Let's count students with failing grades (e.g. under 50% average or failed any exams)
  const pendingReviewCount = progress.filter(p => !p.passed).length;

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim() || !quickContent.trim()) return;
    
    onQuickAnnouncement(quickTitle, quickContent, quickCategory);
    setQuickTitle('');
    setQuickContent('');
    setQuickCategory('General');
    setSuccessMsg('Announcement posted successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-6" id="teacher-dashboard">
      
      {/* Welcome & Info */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <span className="bg-teal-500/30 text-teal-100 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            Faculty Control Panel
          </span>
          <h2 className="text-2xl font-extrabold mt-2 tracking-tight">Dr. Ramesh Kumar — Faculty Dashboard</h2>
          <p className="text-teal-100 text-sm mt-1 max-w-xl">
            Welcome to the Faculty Administration Board. You can manage syllabus test papers, grade logs, student attendance, and push real-time university notices.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* Card 1: Total Students */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Students</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalStudents} enrolled</h3>
            <p className="text-xs text-teal-600 font-semibold cursor-pointer hover:underline" onClick={() => onNavigate('student_progress')}>
              View grade-logs &rarr;
            </p>
          </div>
          <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Total Tests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Exams</p>
            <h3 className="text-2xl font-bold text-slate-800">{totalTests} Syllabi</h3>
            <p className="text-xs text-teal-600 font-semibold cursor-pointer hover:underline" onClick={() => onNavigate('manage_tests')}>
              Manage question-banks &rarr;
            </p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: Pending Review / Failures */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Failed / Flagged</p>
            <h3 className="text-2xl font-bold text-slate-800">{pendingReviewCount} Students</h3>
            <p className="text-[11px] text-slate-500 font-medium">Needs remedial counseling</p>
          </div>
          <div className={`p-3 rounded-xl ${pendingReviewCount > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Average Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Avg Attendance</p>
            <h3 className="text-2xl font-bold text-slate-800">{averageAttendance}%</h3>
            <p className="text-xs text-emerald-600 font-semibold cursor-pointer hover:underline" onClick={() => onNavigate('attendance')}>
              Record roll-call &rarr;
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        {/* Card 5: Recent Announcements */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Campus Notices</p>
            <h3 className="text-2xl font-bold text-slate-800">{announcements.length} Posts</h3>
            <p className="text-xs text-slate-400 font-semibold cursor-pointer hover:underline" onClick={() => onNavigate('announcements')}>
              Manage bulletins &rarr;
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Megaphone className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Lower Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Student Progress Overview (2/3 width) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-150 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Class Progress Registry</h3>
              <p className="text-xs text-slate-400 font-medium">Quick snapshot of students scores and grading outcome</p>
            </div>
            <button
              onClick={() => onNavigate('student_progress')}
              className="text-xs text-teal-600 hover:text-teal-800 font-bold flex items-center space-x-1 cursor-pointer"
            >
              <span>View Full Ledger</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Tests</th>
                  <th className="py-3 px-4 text-center">Percentage</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {progress.slice(0, 4).map((student) => (
                  <tr key={student.roll} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">
                      <div>{student.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{student.roll}</div>
                    </td>
                    <td className="py-3 px-4 font-medium text-xs">
                      {student.completedTests} Exams
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              student.percentage >= 50 ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                            style={{ width: `${student.percentage}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold font-mono">{student.percentage}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        student.passed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {student.passed ? 'PASS' : 'FAIL'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Post Announcement Form (1/3 width) */}
        <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-teal-600 mb-3">
              <Plus className="h-5 w-5" />
              <h3 className="text-lg font-bold text-slate-800 font-sans">Quick Bulletin</h3>
            </div>
            <p className="text-xs text-slate-400 font-medium mb-4">
              Push an instant advisory, assignment deadline, or reminder to the students.
            </p>

            {successMsg && (
              <div className="mb-4 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-lg">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleQuickSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Notice Title (e.g. Assignment Extended)"
                  value={quickTitle}
                  onChange={(e) => setQuickTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <select
                  value={quickCategory}
                  onChange={(e) => setQuickCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="General">General Category</option>
                  <option value="Assignment">Assignment Notice</option>
                  <option value="Exam">Exam Notice</option>
                  <option value="Project">Project Schedule</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Holiday">Holiday</option>
                </select>
              </div>

              <div>
                <textarea
                  rows={4}
                  placeholder="Write notice description..."
                  value={quickContent}
                  onChange={(e) => setQuickContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Broadcast Notice</span>
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}
