import React, { useState } from 'react';
import { UserRole } from '../types';
import { GraduationCap, BookOpen, Key, User, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginPageProps {
  onLogin: (role: UserRole, username: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [activeTab, setActiveTab] = useState<UserRole>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (activeTab === 'student') {
      // Validate student roll number
      if (username.toUpperCase() === 'CS2026042') {
        onLogin('student', 'Kavya Sarawagi');
      } else {
        // Allow any roll number, but default to a name
        onLogin('student', username);
      }
    } else {
      // Validate teacher employee id
      if (username.toUpperCase() === 'T-CSE-108') {
        onLogin('teacher', 'Dr. Ramesh Kumar');
      } else {
        onLogin('teacher', username);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="login-page">
      {/* Top Banner / Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 text-white rounded-lg">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Excel University</h1>
            </div>
          </div>
          <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-full border border-emerald-100 uppercase tracking-wider">
            Status: Online & Secure
          </span>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
          >
            {/* Tab Selection */}
            <div className="flex border-b border-slate-100">
              <button
                onClick={() => {
                  setActiveTab('student');
                  setUsername('');
                  setPassword('');
                  setError('');
                }}
                className={`flex-1 py-4 text-center font-semibold text-sm transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  activeTab === 'student'
                    ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50/20'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
                }`}
                id="tab-student"
              >
                <BookOpen className="h-4 w-4" />
                <span>Student Portal</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('teacher');
                  setUsername('');
                  setPassword('');
                  setError('');
                }}
                className={`flex-1 py-4 text-center font-semibold text-sm transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  activeTab === 'teacher'
                    ? 'text-rose-600 border-b-2 border-rose-600 bg-rose-50/20'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50'
                }`}
                id="tab-teacher"
              >
                <Key className="h-4 w-4" />
                <span>Faculty Portal</span>
              </button>
            </div>

            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  {activeTab === 'student' ? 'Student Sign In' : 'Faculty Access'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {activeTab === 'student'
                    ? 'Access your grades, attendance & start online MCQs'
                    : 'Manage examinations, edit announcements & view progress'}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    {activeTab === 'student' ? 'Roll Number' : 'Employee ID'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={activeTab === 'student' ? 'e.g. CS2026042' : 'e.g. T-CSE-108'}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs text-slate-400">
                  <span>Authorized Access Only</span>
                  <span>SSL Encrypted</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-y-0.5 active:translate-y-0 text-sm flex items-center justify-center space-x-2 mt-2 cursor-pointer"
                >
                  <span>Authenticate Portal</span>
                </button>
              </form>

              {/* Quick Fill Demo Credentials */}
              <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">Quick Demo Credentials</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('student');
                      setUsername('CS2026042');
                      setPassword('password123');
                      setError('');
                    }}
                    className="flex-1 py-2 px-3 border border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/10 hover:bg-rose-50/40 text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                  >
                    Student Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('teacher');
                      setUsername('T-CSE-108');
                      setPassword('password123');
                      setError('');
                    }}
                    className="flex-1 py-2 px-3 border border-dashed border-slate-200 hover:border-slate-350 bg-slate-50/20 hover:bg-slate-50/60 text-slate-600 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
                  >
                    Faculty Demo
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-400 font-medium">
        <p>© {new Date().getFullYear()} Excel University. All Rights Reserved.</p>
        <p className="mt-1">Portal Maintained by IT Services & Academic Division</p>
      </footer>
    </div>
  );
}
