import React from 'react';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  BookOpenCheck,
  Award,
  CalendarDays,
  Megaphone,
  UserCircle,
  Settings2,
  LineChart,
  LogOut,
  GraduationCap,
  X
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  userName: string;
  userSubText: string; // e.g., CS2026042 or T-CSE-108
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({
  role,
  userName,
  userSubText,
  activeView,
  onViewChange,
  onLogout,
  isOpen = false,
  onClose
}: SidebarProps) {
  // Navigation item helper function
  const renderNavItem = (viewId: string, label: string, icon: React.ReactNode) => {
    const isActive = activeView === viewId;
    return (
      <button
        key={viewId}
        onClick={() => onViewChange(viewId)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
          isActive
            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
        id={`nav-${viewId}`}
      >
        <span className={isActive ? 'text-white' : 'text-slate-400'}>{icon}</span>
        <span>{label}</span>
      </button>
    );
  };

  const renderSidebarContent = (showCloseButton = false) => {
    return (
      <div className="flex flex-col h-full bg-white relative">
        {showCloseButton && onClose && (
          <div className="absolute top-4 right-4 z-50">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 cursor-pointer focus:outline-hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 pr-12">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-600 text-white rounded-lg shrink-0">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-lg leading-tight">Excel University</h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {role === 'teacher' ? 'Faculty Portal' : 'Student Portal'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile summary inside sidebar */}
        <div className="p-4 mx-4 my-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 font-bold text-lg border-2 border-white shadow-sm uppercase">
              {userName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${role === 'teacher' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </div>
          <h3 className="mt-2 text-sm font-bold text-slate-800 line-clamp-1">{userName}</h3>
          <p className="text-[11px] font-mono text-slate-500 mt-0.5">{userSubText}</p>
          <span className={`mt-2 text-[10px] px-2 py-0.5 font-extrabold rounded-full border uppercase tracking-wider ${
            role === 'teacher'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-rose-50 text-rose-700 border-rose-100'
          }`}>
            {role === 'teacher' ? 'faculty' : 'student'} portal
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex-grow px-4 space-y-1 overflow-y-auto">
          {role === 'student' ? (
            <>
              {renderNavItem('dashboard', 'Dashboard', <LayoutDashboard className="h-5 w-5" />)}
              {renderNavItem('tests', 'Online Tests', <BookOpenCheck className="h-5 w-5" />)}
              {renderNavItem('results', 'Exam Results', <Award className="h-5 w-5" />)}
              {renderNavItem('attendance', 'My Attendance', <CalendarDays className="h-5 w-5" />)}
              {renderNavItem('announcements', 'Announcements', <Megaphone className="h-5 w-5" />)}
              {renderNavItem('profile', 'My Profile', <UserCircle className="h-5 w-5" />)}
            </>
          ) : (
            <>
              {renderNavItem('dashboard', 'Dashboard', <LayoutDashboard className="h-5 w-5" />)}
              {renderNavItem('manage_tests', 'Manage Tests', <Settings2 className="h-5 w-5" />)}
              {renderNavItem('student_progress', 'Student Progress', <LineChart className="h-5 w-5" />)}
              {renderNavItem('attendance', 'Mark Attendance', <CalendarDays className="h-5 w-5" />)}
              {renderNavItem('announcements', 'Post Bulletins', <Megaphone className="h-5 w-5" />)}
              {renderNavItem('profile', 'My Profile', <UserCircle className="h-5 w-5" />)}
            </>
          )}
        </div>

        {/* Logout Footer */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors duration-200 cursor-pointer"
            id="logout-button"
          >
            <LogOut className="h-5 w-5" />
            <span>Exit ERP Portal</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* 1. DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col h-screen shrink-0 sticky top-0" id="portal-sidebar">
        {renderSidebarContent(false)}
      </aside>

      {/* 2. MOBILE SIDEBAR DRAWER OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex" id="portal-sidebar-mobile">
          {/* Backdrop Blur overlay */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
            onClick={onClose}
          />
          
          {/* Sliding drawer block */}
          <div className="relative w-64 max-w-xs h-full flex flex-col shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {renderSidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
}
