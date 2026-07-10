import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Bell, User, BookOpen, AlertCircle, Menu } from 'lucide-react';
import { UserRole, Announcement } from '../types';

interface NavbarProps {
  role: UserRole;
  userName: string;
  activeView: string;
  announcements: Announcement[];
  onNavigate: (view: string) => void;
  onToggleSidebar?: () => void;
}

export default function Navbar({ role, userName, activeView, announcements, onNavigate, onToggleSidebar }: NavbarProps) {
  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Keep the clock updated
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Map the active view id to a human-friendly page heading
  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'ERP Control Center';
      case 'tests':
        return 'Online Computer Examinations';
      case 'results':
        return 'Official Marks & Performance';
      case 'attendance':
        return role === 'student' ? 'My Term Attendance' : 'Class Attendance Registrar';
      case 'announcements':
        return role === 'student' ? 'Latest University Bulletins' : 'Manage Campus Notifications';
      case 'profile':
        return 'Academic Registry Profile';
      case 'manage_tests':
        return 'Standard Test Publisher';
      case 'student_progress':
        return 'Comprehensive Marks ledger';
      default:
        return 'University ERP';
    }
  };

  // Human friendly date string
  const formatDateString = () => {
    return time.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Clock string
  const formatTimeString = () => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const recentAnnouncements = announcements.slice(0, 4);

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-40" id="portal-navbar">
      {/* Page Title & Breadcrumbs */}
      <div className="flex items-center space-x-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-50 border border-slate-150 cursor-pointer focus:outline-hidden shrink-0"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <div>
          <div className="flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span className="hidden xs:inline">Excel University</span>
            <span className="hidden xs:inline">/</span>
            <span className="text-slate-500 capitalize">{role === 'teacher' ? 'faculty' : role}</span>
            <span>/</span>
            <span className="text-rose-600 capitalize">{activeView.replace('_', ' ')}</span>
          </div>
          <h1 className="text-sm sm:text-xl font-extrabold text-slate-800 tracking-tight leading-none mt-0.5 sm:mt-1 truncate max-w-[160px] xs:max-w-xs sm:max-w-none">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Right Side Widgets (Simulated clock, User indicator) */}
      <div className="flex items-center space-x-6">
        {/* Live Clock Widget */}
        <div className="hidden md:flex items-center space-x-4 bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-100 text-xs font-semibold text-slate-600">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3.5 w-3.5 text-rose-500" />
            <span>{formatDateString()}</span>
          </div>
          <div className="w-px h-3.5 bg-slate-200" />
          <div className="flex items-center space-x-1 font-mono">
            <Clock className="h-3.5 w-3.5 text-rose-500" />
            <span>{formatTimeString()}</span>
          </div>
        </div>

        {/* Demo Notification Bell Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-colors focus:outline-hidden"
            aria-label="Campus Bulletins"
          >
            <Bell className="h-5 w-5 text-slate-500" />
            {announcements.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Campus Alerts ({announcements.length})</span>
                <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-sm font-semibold uppercase">Latest</span>
              </div>
              <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                {recentAnnouncements.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-slate-400 font-medium">
                    No active campus bulletins.
                  </div>
                ) : (
                  recentAnnouncements.map((ann) => (
                    <div 
                      key={ann.id} 
                      onClick={() => {
                        setShowNotifications(false);
                        onNavigate('announcements');
                      }}
                      className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer text-left space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${
                          ann.category === 'Exam' || ann.category === 'Project'
                            ? 'bg-rose-50 text-rose-700 border border-rose-100'
                            : ann.category === 'Assignment'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {ann.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{ann.date}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 line-clamp-1">{ann.title}</p>
                      <p className="text-[11px] text-slate-400 line-clamp-1 font-medium">{ann.content}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('announcements');
                  }}
                  className="w-full py-1.5 text-center text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline transition-all cursor-pointer"
                >
                  View All Campus Bulletins
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Info Badge */}
        <button
          onClick={() => onNavigate('profile')}
          className="flex items-center space-x-3 bg-slate-50/50 hover:bg-rose-50/20 active:scale-98 pl-3 pr-4 py-1.5 rounded-xl border border-slate-150 transition-all cursor-pointer text-left focus:outline-hidden"
          title="Access Profile"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 font-bold text-sm border border-rose-100">
            {role === 'teacher' ? 'F' : 'S'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-700 leading-tight">{userName}</p>
            <p className="text-[10px] font-semibold text-slate-400 capitalize">{role === 'teacher' ? 'Faculty' : 'Student'} Account</p>
          </div>
        </button>
      </div>
    </header>
  );
}

