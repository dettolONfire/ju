import { StudentProfile, TeacherProfile, UserRole } from '../types';
import { User, Mail, Phone, BookOpen, GraduationCap, Award, Shield, FileSpreadsheet } from 'lucide-react';
import { StudentProgressRow } from '../mockData';

interface ProfileModuleProps {
  role: UserRole;
  studentProfile: StudentProfile | undefined;
  teacherProfile: TeacherProfile | undefined;
  studentCumulativeProgress: StudentProgressRow | undefined;
  attendanceRate: number;
}

export default function ProfileModule({
  role,
  studentProfile,
  teacherProfile,
  studentCumulativeProgress,
  attendanceRate
}: ProfileModuleProps) {
  
  return (
    <div className="max-w-3xl mx-auto" id="profile-module-container">
      
      {/* 1. STUDENT PROFILE CARD */}
      {role === 'student' && studentProfile && (
        <div className="space-y-6" id="student-profile-view">
          
          {/* Avatar Hero section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-3xl border-4 border-indigo-50 shadow-inner">
              {studentProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            <div className="text-center sm:text-left space-y-1">
              <span className="bg-indigo-50 text-indigo-700 text-[9px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-widest border border-indigo-100">
                Official Student Record
              </span>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{studentProfile.name}</h2>
              <p className="text-xs text-slate-400 font-mono font-bold">University Roll Num: {studentProfile.rollNumber}</p>
              <p className="text-xs text-slate-500 font-semibold">{studentProfile.course} • {studentProfile.semester}</p>
            </div>
          </div>

          {/* Details Block Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Contact Details */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5">Contact Registration</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-xs text-slate-600 font-semibold">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Primary Email</span>
                    <span>{studentProfile.email}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 text-xs text-slate-600 font-semibold">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Registered Mobile</span>
                    <span>{studentProfile.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Performance Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5">ERP Performance Summary</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-xs text-slate-600 font-semibold">
                  <Award className="h-4 w-4 text-slate-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Current Syllabus Grades</span>
                    <span className="font-bold">
                      {studentCumulativeProgress
                        ? `${studentCumulativeProgress.percentage}% Average (${studentCumulativeProgress.marksObtained}/${studentCumulativeProgress.totalMarksPossible} Marks)`
                        : 'No Marks Logged'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-600 font-semibold">
                  <GraduationCap className="h-4 w-4 text-slate-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Cumulative Attendance Rate</span>
                    <span className={`font-extrabold ${attendanceRate >= 75 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {attendanceRate}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-xs text-slate-600 font-semibold">
                  <Shield className="h-4 w-4 text-slate-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">General Clearance Standing</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-sm font-bold uppercase ${
                      attendanceRate >= 75 && (studentCumulativeProgress?.passed ?? true)
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}>
                      {attendanceRate >= 75 && (studentCumulativeProgress?.passed ?? true) ? 'ELIGIBLE' : 'FLAGGED / ACTION REQ'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. TEACHER PROFILE CARD */}
      {role === 'teacher' && teacherProfile && (
        <div className="space-y-6" id="teacher-profile-view">
          
          {/* Avatar Hero section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-8 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-extrabold text-3xl border-4 border-teal-50 shadow-inner">
              {teacherProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            
            <div className="text-center sm:text-left space-y-1">
              <span className="bg-teal-50 text-teal-700 text-[9px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-widest border border-teal-100">
                Authorized Faculty Profile
              </span>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{teacherProfile.name}</h2>
              <p className="text-xs text-slate-400 font-mono font-bold">Faculty Employee ID: {teacherProfile.employeeId}</p>
              <p className="text-xs text-slate-500 font-semibold">{teacherProfile.department}</p>
            </div>
          </div>

          {/* Details block Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Contact Details */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5">Contact Registration</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-xs text-slate-600 font-semibold">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Academic Email</span>
                    <span>{teacherProfile.email}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Allocated Subjects */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2.5">Allocated Lab Subjects</h3>
              
              <div className="flex flex-wrap gap-2">
                {teacherProfile.subjects.map((sub, idx) => (
                  <span
                    key={idx}
                    className="bg-teal-50 text-teal-700 border border-teal-100 text-[10px] px-3 py-1 rounded-lg font-bold uppercase tracking-wider"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
