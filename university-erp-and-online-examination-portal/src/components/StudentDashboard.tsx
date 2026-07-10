import { Exam, Announcement, StudentAttendance, ExamResult } from '../types';
import { BookOpen, CheckCircle, Clock, Percent, BellRing, ArrowRight, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface StudentDashboardProps {
  exams: Exam[];
  results: ExamResult[];
  announcements: Announcement[];
  attendance: StudentAttendance | undefined;
  onNavigate: (view: string) => void;
  onStartExam: (examId: string) => void;
}

export default function StudentDashboard({
  exams,
  results,
  announcements,
  attendance,
  onNavigate,
  onStartExam
}: StudentDashboardProps) {
  
  // 1. Calculate statistics
  const completedTestIds = results.map(r => r.examId);
  const pendingExams = exams.filter(e => !completedTestIds.includes(e.id));
  const completedCount = results.length;
  
  // Attendance metrics
  let totalClasses = 0;
  let presentClasses = 0;
  let attendancePct = 0;
  if (attendance && attendance.history) {
    totalClasses = attendance.history.length;
    presentClasses = attendance.history.filter(h => h.status === 'Present').length;
    attendancePct = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
  }

  // Latest test result
  const latestResult = results.length > 0 ? results[results.length - 1] : null;

  // Recent announcements (top 3)
  const recentAnnouncements = announcements.slice(0, 3);

  return (
    <div className="space-y-6" id="student-dashboard">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <span className="bg-indigo-500/30 text-indigo-100 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
            Academic Year 2026-27
          </span>
          <h2 className="text-2xl font-extrabold mt-2 tracking-tight">Welcome back!</h2>
          <p className="text-indigo-100 text-sm mt-1 max-w-xl">
            You are currently logged into the Excel University ERP. Below is a real-time summary of your classes, upcoming examinations, and active campus notifications.
          </p>
        </div>
        {/* Abstract background vector circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-xl" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-lg" />
      </div>

      {/* Grid of 4 Dashboard Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Stats Card: Available/Pending Tests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pending Tests</p>
            <h3 className="text-2xl font-bold text-slate-800">{pendingExams.length} Exams</h3>
            <p className="text-xs text-indigo-600 font-semibold flex items-center cursor-pointer hover:underline" onClick={() => onNavigate('tests')}>
              View test paper list &rarr;
            </p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>

        {/* Stats Card: Completed Tests */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completed Tests</p>
            <h3 className="text-2xl font-bold text-slate-800">{completedCount} Papers</h3>
            <p className="text-xs text-emerald-600 font-semibold flex items-center cursor-pointer hover:underline" onClick={() => onNavigate('results')}>
              Review past grades &rarr;
            </p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Stats Card: Attendance Percentage */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Attendance Rate</p>
            <h3 className="text-2xl font-bold text-slate-800">{attendancePct}%</h3>
            <div className="flex items-center space-x-1.5 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${attendancePct >= 75 ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`} />
              <p className={`text-[11px] font-bold ${attendancePct >= 75 ? 'text-emerald-600' : 'text-rose-600 font-bold'}`}>
                {attendancePct >= 75 ? 'Clearance Secured' : 'Attendance Shortage!'}
              </p>
            </div>
          </div>
          <div className={`p-3 rounded-xl ${attendancePct >= 75 ? 'bg-teal-50 text-teal-600' : 'bg-rose-50 text-rose-600'}`}>
            <UserCheck className="h-6 w-6" />
          </div>
        </div>

        {/* Stats Card: Latest Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Latest Result</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {latestResult ? `${latestResult.percentage}%` : 'N/A'}
            </h3>
            <p className="text-[11px] text-slate-500 line-clamp-1 font-semibold">
              {latestResult ? latestResult.examTitle : 'No exams submitted'}
            </p>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Percent className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* Main Grid: Left Column (Exams & Attendance), Right Column (Bulletins) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column Section: 2/3 Width */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Available Tests List Card */}
          <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Exams Ready to Start</h3>
                <p className="text-xs text-slate-400 font-medium">Click a paper card below to view syllabus and launch the timed quiz</p>
              </div>
              <button
                onClick={() => onNavigate('tests')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center space-x-1 cursor-pointer"
              >
                <span>All Tests</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {pendingExams.length === 0 ? (
              <div className="p-8 border border-dashed border-slate-200 rounded-xl text-center">
                <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-slate-700">All Available Quizzes Submitted</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">Excellent! You are all caught up on examinations for the current semester cycle.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingExams.slice(0, 3).map((exam) => (
                  <div key={exam.id} className="p-4 border border-slate-100 hover:border-indigo-100 rounded-xl hover:bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between transition-all gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-slate-800">{exam.title}</h4>
                      <div className="flex items-center space-x-3 text-xs text-slate-400 font-semibold">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          <span>{exam.durationMinutes} Minutes</span>
                        </span>
                        <span>•</span>
                        <span>{exam.questions.length} MCQ Questions</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onStartExam(exam.id)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-colors cursor-pointer self-start sm:self-center"
                    >
                      Start Exam
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Attendance Progress Card */}
          <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-1">Term Attendance Status</h3>
            <p className="text-xs text-slate-400 font-medium mb-4">Minimum 75% attendance is required to qualify for final university examinations.</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                <span>Classes Attended: {presentClasses} / {totalClasses} Sessions</span>
                <span className={attendancePct >= 75 ? 'text-emerald-600' : 'text-rose-600'}>{attendancePct}% Attendance</span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    attendancePct >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${attendancePct}%` }}
                />
              </div>

              {attendancePct < 75 ? (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium leading-relaxed">
                  ⚠️ <strong>Attendance Warning:</strong> Your attendance is below the 75% required threshold. Please attend upcoming lectures and consult with Dr. Ramesh Kumar immediately to avoid academic debarment.
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-700 text-xs rounded-xl font-medium leading-relaxed">
                  ✅ Your attendance looks great! You are officially cleared for final-year submissions.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column Section: 1/3 Width Bulletins */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-150 shadow-sm p-6 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-indigo-600 mb-3">
                <BellRing className="h-5 w-5" />
                <h3 className="text-lg font-bold text-slate-800">Campus Bulletins</h3>
              </div>
              <p className="text-xs text-slate-400 font-medium mb-4">Key dates, midterms, and exam schedules published directly by administrators.</p>

              <div className="space-y-4">
                {recentAnnouncements.map((ann) => (
                  <div key={ann.id} className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1.5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        ann.category === 'Project' || ann.category === 'Exam'
                          ? 'bg-rose-100 text-rose-700'
                          : ann.category === 'Assignment'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-indigo-100 text-indigo-700'
                      }`}>
                        {ann.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{ann.date}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">{ann.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {ann.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onNavigate('announcements')}
              className="mt-6 w-full py-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-slate-700 hover:text-indigo-700 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <span>View All Campus Bulletins</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
