/**
 * @file types.ts
 * @description Type definitions for the University ERP & Online Examination Portal.
 * These types outline the structures for Students, Teachers, Exams, Questions,
 * Results, Attendance, and Announcements.
 */

// User roles in the ERP Portal
export type UserRole = 'student' | 'teacher';

// Schema for an MCQ Question
export interface Question {
  id: string;
  text: string;
  options: string[]; // Exactly 4 options
  correctOptionIndex: number; // 0, 1, 2, or 3 representing the correct option
}

// Schema for an Exam / Test
export interface Exam {
  id: string;
  title: string;
  description: string;
  durationMinutes: number; // Duration of exam in minutes
  questions: Question[];
}

// Result of a completed exam
export interface ExamResult {
  examId: string;
  examTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  submittedAt: string;
}

// Daily attendance record for history
export interface AttendanceHistory {
  date: string;
  status: 'Present' | 'Absent';
}

// Attendance record for a specific student (used in teacher management and student view)
export interface StudentAttendance {
  studentRoll: string;
  studentName: string;
  course: string;
  history: AttendanceHistory[];
}

// Announcement / Reminder
export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Exam' | 'Assignment' | 'Holiday' | 'Project' | 'Workshop' | 'General';
}

// Student User Profile information
export interface StudentProfile {
  name: string;
  rollNumber: string;
  course: string;
  semester: string;
  email: string;
  phone: string;
}

// Teacher User Profile information
export interface TeacherProfile {
  name: string;
  department: string;
  employeeId: string;
  subjects: string[];
  email: string;
}
