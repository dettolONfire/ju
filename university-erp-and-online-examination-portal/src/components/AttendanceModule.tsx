import { useState } from 'react';
import { StudentAttendance, UserRole } from '../types';
import { CalendarCheck, User, Check, X, AlertCircle, Info, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface AttendanceModuleProps {
  role: UserRole;
  currentStudentRoll: string;
  attendanceData: StudentAttendance[];
  onMarkAttendance: (roll: string, date: string, status: 'Present' | 'Absent') => void;
}

export default function AttendanceModule({
  role,
  currentStudentRoll,
  attendanceData,
  onMarkAttendance
}: AttendanceModuleProps) {
  
  // Local states
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [successMsg, setSuccessMsg] = useState('');

  // 1. STUDENT VIEW LOGIC
  const studentRecord = attendanceData.find((a) => a.studentRoll === currentStudentRoll);
  const totalClasses = studentRecord?.history.length || 0;
  const presentClasses = studentRecord?.history.filter((h) => h.status === 'Present').length || 0;
  const attendancePercent = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;

  // 2. TEACHER VIEW LOGIC
  // Returns attendance status of a student for the selected date
  const getStudentStatusForDate = (student: StudentAttendance, dateStr: string) => {
    const record = student.history.find((h) => h.date === dateStr);
    return record ? record.status : null;
  };

  const handleMark = (roll: string, status: 'Present' | 'Absent') => {
    onMarkAttendance(roll, selectedDate, status);
    const student = attendanceData.find(a => a.studentRoll === roll);
    setSuccessMsg(`Marked ${student?.studentName} as ${status} for ${selectedDate}`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div id="attendance-module" className="space-y-6">
      
      {/* Dynamic welcome head */}
      <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs">
        <h3 className="text-lg font-bold text-slate-800">
          {role === 'student' ? 'My Official Term Attendance Ledger' : 'Daily Roll Call Registrar'}
        </h3>
        <p className="text-xs text-slate-400 font-semibold">
          {role === 'student'
            ? 'Verify daily class registrations. A minimum cumulative rate of 75% is strictly enforced.'
            : 'Select an academic calendar date and easily mark, review, or modify students Present/Absent status.'}
        </p>
      </div>

      {/* SUCCESS BANNER */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center space-x-2 animate-bounce">
          <Check className="h-4 w-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ========================================== */}
      {/* STUDENT ATTENDANCE PORTAL */}
      {/* ========================================== */}
      {role === 'student' && studentRecord && (
        <div className="space-y-6" id="student-attendance-view">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Lectures</span>
                <span className="text-xl font-extrabold text-slate-800 font-mono">{totalClasses} Sessions</span>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Calendar className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Attended Lectures</span>
                <span className="text-xl font-extrabold text-slate-800 font-mono">{presentClasses} Lectures</span>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <Check className="h-6 w-6" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Registration Percentage</span>
                <span className={`text-xl font-extrabold font-mono ${attendancePercent >= 75 ? 'text-emerald-600' : 'text-rose-600 animate-pulse'}`}>
                  {attendancePercent}%
                </span>
              </div>
              <div className={`p-3 rounded-xl ${attendancePercent >= 75 ? 'bg-teal-50 text-teal-600' : 'bg-rose-50 text-rose-600'}`}>
                <CalendarCheck className="h-6 w-6" />
              </div>
            </div>

          </div>

          {/* Detailed Attendance History Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden max-w-xl mx-auto">
            <div className="p-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 text-sm">Class Attendance Log History</h4>
              <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-sm font-bold">100% Verified</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-100/20">
                  <tr>
                    <th className="py-3.5 px-6">Lecture Date</th>
                    <th className="py-3.5 px-6 text-right">Registrar Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {studentRecord.history.map((h, index) => (
                    <tr key={index} className="hover:bg-slate-50/50">
                      <td className="py-3 px-6 font-semibold text-slate-700 font-mono text-xs">
                        {h.date}
                      </td>
                      <td className="py-3 px-6 text-right">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-widest ${
                          h.status === 'Present'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {h.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* TEACHER ATTENDANCE PORTAL */}
      {/* ========================================== */}
      {role === 'teacher' && (
        <div className="space-y-6" id="teacher-attendance-view">
          
          {/* Controls: Date Picker */}
          <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              <label className="text-sm font-bold text-slate-700">Select Session Date:</label>
            </div>
            
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 font-mono"
            />
          </div>

          {/* Master Roster Sheet Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="py-4 px-6">Student Credentials</th>
                    <th className="py-4 px-4">Standard Course</th>
                    <th className="py-4 px-4 text-center">Cumulative Attendance</th>
                    <th className="py-4 px-4 text-center">Status for {selectedDate}</th>
                    <th className="py-4 px-6 text-right">Roster Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {attendanceData.map((student) => {
                    // Calculate student cumulative average
                    const total = student.history.length;
                    const present = student.history.filter((h) => h.status === 'Present').length;
                    const cumulativePct = total > 0 ? Math.round((present / total) * 100) : 0;
                    
                    const dateStatus = getStudentStatusForDate(student, selectedDate);

                    return (
                      <tr key={student.studentRoll} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* Name and Roll */}
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-800 text-sm">{student.studentName}</div>
                          <div className="text-[10px] text-slate-400 font-mono font-bold mt-0.5">{student.studentRoll}</div>
                        </td>

                        {/* Course */}
                        <td className="py-4 px-4 text-xs font-bold text-slate-500">
                          {student.course}
                        </td>

                        {/* Cumulative average */}
                        <td className="py-4 px-4">
                          <div className="flex flex-col items-center justify-center space-y-1 max-w-[120px] mx-auto">
                            <span className={`text-[10px] font-mono font-bold ${cumulativePct >= 75 ? 'text-emerald-600' : 'text-rose-600 font-extrabold'}`}>
                              {cumulativePct}% ({present}/{total} days)
                            </span>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${cumulativePct >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                style={{ width: `${cumulativePct}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Date Status indicator */}
                        <td className="py-4 px-4 text-center">
                          {dateStatus ? (
                            <span className={`text-[9px] px-2.5 py-1 rounded-full font-extrabold uppercase tracking-widest ${
                              dateStatus === 'Present'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-rose-50 text-rose-700 border border-rose-100'
                            }`}>
                              {dateStatus}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-sm">
                              Not Marked Yet
                            </span>
                          )}
                        </td>

                        {/* Actions to toggle */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleMark(student.studentRoll, 'Present')}
                              className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                                dateStatus === 'Present'
                                  ? 'bg-emerald-600 text-white border-emerald-600'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'
                              }`}
                              title="Mark Present"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleMark(student.studentRoll, 'Absent')}
                              className={`p-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center space-x-1 ${
                                dateStatus === 'Absent'
                                  ? 'bg-rose-600 text-white border-rose-600'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200'
                              }`}
                              title="Mark Absent"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
