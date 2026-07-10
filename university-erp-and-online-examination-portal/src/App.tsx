import { useState } from 'react';
import { UserRole, Exam, Announcement, StudentAttendance, ExamResult } from './types';
import {
  initialExams,
  initialAnnouncements,
  defaultStudentProfile,
  defaultTeacherProfile,
  initialAttendance,
  initialExamResults,
  initialStudentProgress,
  StudentProgressRow
} from './mockData';

// Component imports
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import ExamModule from './components/ExamModule';
import ManageTests from './components/ManageTests';
import StudentProgress from './components/StudentProgress';
import AttendanceModule from './components/AttendanceModule';
import AnnouncementsModule from './components/AnnouncementsModule';
import ProfileModule from './components/ProfileModule';

export default function App() {
  
  // ==========================================
  // SYSTEM / DATABASE STATE
  // ==========================================
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState('');
  const [activeView, setActiveView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Core records (Mock Database)
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [attendanceData, setAttendanceData] = useState<StudentAttendance[]>(initialAttendance);
  const [examResults, setExamResults] = useState<ExamResult[]>(initialExamResults);
  const [studentProgress, setStudentProgress] = useState<StudentProgressRow[]>(initialStudentProgress);

  // ==========================================
  // CALLBACK HANDLERS
  // ==========================================

  // Authentication Flow
  const handleLogin = (role: UserRole, authenticatedName: string) => {
    setUserRole(role);
    setUserName(authenticatedName);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserName('');
    setActiveView('dashboard');
  };

  // Student Completes an Exam
  const handleAddResult = (newResult: ExamResult) => {
    // 1. Save student result record
    setExamResults((prev) => [...prev, newResult]);

    // 2. Synchronize "Dr. Ramesh's Student Progress Ledger" so it updates dynamically!
    setStudentProgress((prevRows) => {
      return prevRows.map((row) => {
        // Find Kavya Sarawagi (CS2026042) row and update her score metrics
        if (row.roll === 'CS2026042') {
          // Gather all results including the new one
          const updatedResults = [...examResults, newResult];
          const totalMarksPossible = updatedResults.length * 10;
          const totalMarksObtained = updatedResults.reduce((sum, r) => sum + r.score, 0);
          const avgPct = Math.round((totalMarksObtained / totalMarksPossible) * 100);
          
          return {
            ...row,
            completedTests: updatedResults.length,
            marksObtained: totalMarksObtained,
            totalMarksPossible: totalMarksPossible,
            percentage: avgPct,
            passed: avgPct >= 50
          };
        }
        return row;
      });
    });
  };

  // Teacher Modifies Exams Syllabus (CRUD)
  const handleAddExam = (newExam: Exam) => {
    setExams((prev) => [...prev, newExam]);
  };

  const handleUpdateExam = (updatedExam: Exam) => {
    setExams((prev) => prev.map((e) => (e.id === updatedExam.id ? updatedExam : e)));
  };

  const handleDeleteExam = (examId: string) => {
    setExams((prev) => prev.filter((e) => e.id !== examId));
  };

  // Teacher Modifies Attendance history
  const handleMarkAttendance = (studentRoll: string, date: string, status: 'Present' | 'Absent') => {
    setAttendanceData((prevData) => {
      return prevData.map((student) => {
        if (student.studentRoll === studentRoll) {
          // Check if date already has a marked record, if so overwrite, else push
          const historyIndex = student.history.findIndex((h) => h.date === date);
          const updatedHistory = [...student.history];

          if (historyIndex !== -1) {
            updatedHistory[historyIndex] = { date, status };
          } else {
            updatedHistory.unshift({ date, status }); // Add to beginning
          }

          return {
            ...student,
            history: updatedHistory
          };
        }
        return student;
      });
    });
  };

  // Teacher Modifies Announcements bulletins (CRUD)
  const handleAddAnnouncement = (newAnn: Announcement) => {
    setAnnouncements((prev) => [newAnn, ...prev]); // Add new to top
  };

  const handleUpdateAnnouncement = (updatedAnn: Announcement) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === updatedAnn.id ? updatedAnn : a)));
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Helper dashboard action: allows teacher to post instantly from the Quick Notice widget
  const handleQuickAnnouncement = (title: string, content: string, category: any) => {
    const newNotice: Announcement = {
      id: `ann-quick-${Date.now()}`,
      title,
      content,
      category,
      date: new Date().toISOString().split('T')[0]
    };
    handleAddAnnouncement(newNotice);
  };

  // ==========================================
  // RENDER DECISION ENGINE
  // ==========================================

  // If user is not authenticated, show elegant split LoginPage
  if (userRole === null) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Attendance metrics for student profile view
  const activeStudentAttendance = attendanceData.find((a) => a.studentRoll === 'CS2026042');
  const studentTotalDays = activeStudentAttendance?.history.length || 0;
  const studentPresentDays = activeStudentAttendance?.history.filter((h) => h.status === 'Present').length || 0;
  const studentAttendanceRate = studentTotalDays > 0 ? Math.round((studentPresentDays / studentTotalDays) * 100) : 0;

  // Custom metadata to display inside sidebar
  const userSubText = userRole === 'student' ? defaultStudentProfile.rollNumber : defaultTeacherProfile.employeeId;

  // Render content module depending on activeView and userRole
  const renderViewContent = () => {
    switch (activeView) {
      case 'dashboard':
        return userRole === 'student' ? (
          <StudentDashboard
            exams={exams}
            results={examResults}
            announcements={announcements}
            attendance={activeStudentAttendance}
            onNavigate={(view) => setActiveView(view)}
            onStartExam={(examId) => {
              setActiveView('tests');
              // Auto launch specific test trigger can be handled if needed, or simply switch tabs.
            }}
          />
        ) : (
          <TeacherDashboard
            exams={exams}
            progress={studentProgress}
            announcements={announcements}
            attendance={attendanceData}
            onNavigate={(view) => setActiveView(view)}
            onQuickAnnouncement={handleQuickAnnouncement}
          />
        );

      case 'tests':
        return (
          <ExamModule
            exams={exams}
            completedResults={examResults}
            onAddResult={handleAddResult}
            viewMode="tests"
          />
        );

      case 'manage_tests':
        return (
          <ManageTests
            exams={exams}
            onAddExam={handleAddExam}
            onUpdateExam={handleUpdateExam}
            onDeleteExam={handleDeleteExam}
          />
        );

      case 'student_progress':
        return <StudentProgress progressRows={studentProgress} />;

      case 'results':
        return (
          <ExamModule
            exams={exams}
            completedResults={examResults}
            onAddResult={handleAddResult}
            viewMode="results"
          />
        );

      case 'attendance':
        return (
          <AttendanceModule
            role={userRole}
            currentStudentRoll="CS2026042"
            attendanceData={attendanceData}
            onMarkAttendance={handleMarkAttendance}
          />
        );

      case 'announcements':
        return (
          <AnnouncementsModule
            role={userRole}
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            onUpdateAnnouncement={handleUpdateAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
          />
        );

      case 'profile':
        return (
          <ProfileModule
            role={userRole}
            studentProfile={defaultStudentProfile}
            teacherProfile={defaultTeacherProfile}
            studentCumulativeProgress={studentProgress.find((p) => p.roll === 'CS2026042')}
            attendanceRate={studentAttendanceRate}
          />
        );

      default:
        return <div className="text-slate-500 font-bold p-8">Module construction in progress...</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden text-slate-700 font-sans" id="erp-app-shell">
      
      {/* Responsive Left Sidebar */}
      <Sidebar
        role={userRole}
        userName={userName}
        userSubText={userSubText}
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          setIsSidebarOpen(false);
        }}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex flex-col flex-grow overflow-hidden">
        
        {/* Unified Top Navigation */}
        <Navbar
          role={userRole}
          userName={userName}
          activeView={activeView}
          announcements={announcements}
          onNavigate={(view) => {
            setActiveView(view);
            setIsSidebarOpen(false);
          }}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Dynamic Inner Panel Body */}
        <main className="flex-grow overflow-y-auto p-4 sm:p-8" id="erp-main-content">
          <div className="max-w-7xl mx-auto">
            {renderViewContent()}
          </div>
        </main>

      </div>

    </div>
  );
}
