import { useState, useEffect } from 'react';
import { Exam, Question, ExamResult } from '../types';
import { Clock, ShieldAlert, CheckCircle2, XCircle, AlertCircle, Award, ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { motion } from 'motion/react';

interface ExamModuleProps {
  exams: Exam[];
  completedResults: ExamResult[];
  onAddResult: (result: ExamResult) => void;
  viewMode?: 'tests' | 'results';
}

type ExamState = 'list' | 'instructions' | 'active' | 'feedback';

export default function ExamModule({
  exams,
  completedResults,
  onAddResult,
  viewMode = 'tests'
}: ExamModuleProps) {
  
  // State management
  const [currentView, setCurrentView] = useState<ExamState>('list');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  
  // Active test states
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({}); // maps questionId -> selectedOptionIndex
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [wasAutoSubmitted, setWasAutoSubmitted] = useState(false);
  
  // Post-submission result temporary state (to show immediately on feedback)
  const [liveResult, setLiveResult] = useState<ExamResult | null>(null);

  // Countdown timer effect
  useEffect(() => {
    if (currentView !== 'active' || timeLeft <= 0) {
      if (currentView === 'active' && timeLeft === 0) {
        // Auto submit when timer reaches 0
        handleExamSubmit(true);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentView, timeLeft]);

  // Launch instruction phase
  const handleSelectExam = (exam: Exam) => {
    setSelectedExam(exam);
    setCurrentView('instructions');
  };

  // Start the actual test
  const handleStartExam = () => {
    if (!selectedExam) return;
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTimeLeft(selectedExam.durationMinutes * 60);
    setWasAutoSubmitted(false);
    setShowSubmitConfirm(false);
    setCurrentView('active');
  };

  // Handle radio option click
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // Grade the quiz & push to database/state
  const handleExamSubmit = (isAutoSubmit = false) => {
    if (!selectedExam) return;

    let score = 0;
    selectedExam.questions.forEach((q) => {
      const studentAns = selectedAnswers[q.id];
      if (studentAns !== undefined && studentAns === q.correctOptionIndex) {
        score++;
      }
    });

    const totalQuestions = selectedExam.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 50; // Pass criteria: 50%

    // Create result record
    const resultRecord: ExamResult = {
      examId: selectedExam.id,
      examTitle: selectedExam.title,
      score,
      totalQuestions,
      percentage,
      passed,
      submittedAt: new Date().toLocaleString()
    };

    onAddResult(resultRecord);
    setLiveResult(resultRecord);
    setWasAutoSubmitted(isAutoSubmit);
    setCurrentView('feedback');
  };

  // Helper: check if student already took the exam
  const isExamCompleted = (examId: string) => {
    return completedResults.some((r) => r.examId === examId);
  };

  // Helper: get the result of an already completed exam
  const getExamResultObj = (examId: string) => {
    return completedResults.find((r) => r.examId === examId);
  };

  // Convert seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="exam-module-container" className="space-y-6">
      
      {/* 1. EXAM LIST VIEW (Online Tests Page) */}
      {currentView === 'list' && viewMode === 'tests' && (
        <div className="space-y-6" id="exam-list">
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs">
            <h3 className="text-lg font-bold text-slate-800">Available Examination Papers</h3>
            <p className="text-xs text-slate-400 font-semibold">Select an examination paper below to start your online assessment. Complete it before the timer expires.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exams.map((exam) => {
              const completed = isExamCompleted(exam.id);
              const pastResult = getExamResultObj(exam.id);

              return (
                <div
                  key={exam.id}
                  className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all hover:shadow-md ${
                    completed
                      ? 'border-emerald-100 bg-emerald-50/10'
                      : 'border-slate-200 hover:border-rose-200'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] px-2.5 py-0.5 font-bold rounded-full uppercase tracking-wider ${
                        completed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                          : 'bg-rose-50 text-rose-700 border border-rose-100 animate-pulse'
                      }`}>
                        {completed ? 'COMPLETED' : 'READY TO ATTEMPT'}
                      </span>
                      <span className="text-xs font-mono text-slate-400 flex items-center space-x-1 font-bold">
                        <Clock className="h-3 w-3" />
                        <span>{exam.durationMinutes} mins</span>
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-800 leading-snug">{exam.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {exam.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center space-x-4 text-xs text-slate-400 font-semibold">
                      <span>• {exam.questions.length} Questions</span>
                      <span>• MCQ Format</span>
                      <span>• 50% Passing Criteria</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    {completed && pastResult ? (
                      <div className="text-left">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Graded Score</span>
                        <span className={`text-sm font-bold font-mono ${pastResult.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {pastResult.score}/{pastResult.totalQuestions} ({pastResult.percentage}%)
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-400">Time Limit: {exam.durationMinutes}m</span>
                    )}

                    {completed ? (
                      <button
                        onClick={() => {
                          setSelectedExam(exam);
                          setLiveResult(pastResult || null);
                          setCurrentView('feedback');
                        }}
                        className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer"
                      >
                        Review Answers
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSelectExam(exam)}
                        className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                      >
                        Launch Exam &rarr;
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 1b. EXAM RESULTS VIEW (Exam Results Page) */}
      {currentView === 'list' && viewMode === 'results' && (
        <div className="space-y-6" id="results-dashboard">
          {/* Header Block */}
          <div className="bg-gradient-to-r from-rose-600 to-pink-600 text-white p-6 rounded-2xl shadow-md">
            <h3 className="text-xl font-bold">Academic Performance Ledger</h3>
            <p className="text-xs text-rose-100 mt-1 font-medium font-sans">Review your official examination outcomes, grade averages, and detailed performance insights.</p>
          </div>

          {/* Stats Summary Cards */}
          {completedResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Completed Exams</span>
                <span className="text-2xl font-mono font-extrabold text-slate-800">{completedResults.length} <span className="text-xs text-slate-400 font-sans">of {exams.length}</span></span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Average Percentage</span>
                <span className="text-2xl font-mono font-extrabold text-slate-800">
                  {Math.round(completedResults.reduce((acc, r) => acc + r.percentage, 0) / completedResults.length)}%
                </span>
                <div className="w-full bg-slate-105 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div
                    className="h-full bg-rose-600 rounded-full transition-all"
                    style={{ width: `${Math.round(completedResults.reduce((acc, r) => acc + r.percentage, 0) / completedResults.length)}%` }}
                  />
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Score Marks</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-600">
                  {completedResults.reduce((acc, r) => acc + r.score, 0)} <span className="text-xs text-slate-400 font-sans">/ {completedResults.reduce((acc, r) => acc + r.totalQuestions, 0)}</span>
                </span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-150 shadow-xs">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Passing Rate</span>
                <span className="text-2xl font-mono font-extrabold text-slate-800">
                  {Math.round((completedResults.filter(r => r.passed).length / completedResults.length) * 100)}%
                </span>
              </div>
            </div>
          ) : null}

          {/* List of completed exam cards */}
          {completedResults.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4">
              <div className="p-4 bg-slate-50 text-slate-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto border border-slate-150">
                <Award className="h-8 w-8 text-rose-500" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-base">No Exam Results Published</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  You haven't completed any examinations in this semester cycle yet. Take your first test on the Online Tests page to see your grading report here.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedResults.map((result) => {
                const examObj = exams.find((e) => e.id === result.examId);
                return (
                  <div key={result.examId} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-all">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] px-2.5 py-0.5 font-bold rounded-full uppercase tracking-wider ${
                          result.passed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-100'
                        }`}>
                          {result.passed ? 'PASSED' : 'REMEDIAL / FAIL'}
                        </span>
                        <span className="text-[11px] text-slate-400 font-bold font-mono">
                          {result.submittedAt}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-bold text-slate-800 leading-snug">{result.examTitle}</h4>
                        {examObj && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                            {examObj.description}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-3 px-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Percentage Score</span>
                          <span className={`text-base font-extrabold font-mono ${result.passed ? 'text-emerald-600' : 'text-rose-600'}`}>{result.percentage}%</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Correct Answers</span>
                          <span className="text-base font-extrabold font-mono text-slate-700">{result.score} / {result.totalQuestions}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-bold font-mono">CSE-{result.examId.split('-')[1]?.toUpperCase() || 'GEN'}</span>
                      <button
                        onClick={() => {
                          const associatedExam = examObj || {
                            id: result.examId,
                            title: result.examTitle,
                            description: '',
                            durationMinutes: 0,
                            questions: []
                          };
                          setSelectedExam(associatedExam);
                          setLiveResult(result);
                          setCurrentView('feedback');
                        }}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-colors cursor-pointer flex items-center space-x-1"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Review Answer Sheet</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. EXAM INSTRUCTIONS PHASE */}
      {currentView === 'instructions' && selectedExam && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden" id="exam-instructions">
          <div className="p-6 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-lg">Exam Hall Rules & Instructions</h3>
            <button
              onClick={() => setCurrentView('list')}
              className="text-xs text-slate-500 hover:text-slate-700 font-semibold flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back to list</span>
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="text-center">
              <span className="text-[10px] bg-rose-50 text-rose-700 px-3 py-1 rounded-full font-extrabold uppercase tracking-widest border border-rose-100">
                Online Proctoring Active
              </span>
              <h2 className="text-2xl font-bold text-slate-800 mt-3">{selectedExam.title}</h2>
              <p className="text-xs text-slate-400 font-medium mt-1">Course Code: CSE-{selectedExam.id.split('-')[1].toUpperCase()}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 px-6 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Duration</span>
                <span className="text-sm font-extrabold text-slate-700 font-mono">{selectedExam.durationMinutes} Minutes</span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Questions</span>
                <span className="text-sm font-extrabold text-slate-700 font-mono">{selectedExam.questions.length} MCQs</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Passing Limit</span>
                <span className="text-sm font-extrabold text-slate-700 font-mono">50% Score</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed bg-amber-50/50 border border-amber-200/50 p-4 rounded-xl">
              <div className="flex items-start space-x-2">
                <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="font-bold text-amber-800">Mandatory Student Guidelines:</p>
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                <li>Once you start the examination, the **countdown timer will begin running** and cannot be paused or stopped under any circumstances.</li>
                <li>Closing the tab, logging out, or refreshing the page will result in automatic submission of whatever answers are currently marked.</li>
                <li>If the timer reaches **00:00**, the exam will **auto-submit** immediately to ensure fairness.</li>
                <li>Each correct answer awards <strong>1 Mark</strong>. There is <strong>no negative marking</strong> in this portal.</li>
              </ul>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-400 font-semibold">Prepared by Department of CSE</span>
              <button
                onClick={handleStartExam}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Acknowledge & Start Exam</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ACTIVE TEST LAYOUT */}
      {currentView === 'active' && selectedExam && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="exam-arena">
          
          {/* Left Column: Current Question & Options (3/4 width) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-md flex flex-col justify-between overflow-hidden">
            
            {/* Header: Title, Live Timer, and Top Right Submit Button */}
            <div className="p-5 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">LIVE EXAMINATION SCREEN</span>
                <h3 className="font-bold text-slate-800 text-base">{selectedExam.title}</h3>
              </div>

              <div className="flex items-center space-x-3">
                {/* Submit Assessment Button placed prominently on the top right */}
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-colors cursor-pointer flex items-center space-x-1"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>Submit Assessment</span>
                </button>

                {/* Timer Pill */}
                <div className={`flex items-center space-x-2 px-4 py-1.5 rounded-xl border font-mono font-bold text-sm ${
                  timeLeft < 60
                    ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <Clock className="h-4 w-4 text-rose-500" />
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>

            {/* Active MCQ Question Box */}
            <div className="p-8 space-y-6 flex-grow">
              
              {/* Question Label */}
              <div className="space-y-2">
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {selectedExam.questions.length}
                </span>
                <h4 className="text-lg font-bold text-slate-800 leading-snug">
                  {selectedExam.questions[currentQuestionIndex].text}
                </h4>
              </div>

              {/* Radio Options Grid */}
              <div className="grid grid-cols-1 gap-3">
                {selectedExam.questions[currentQuestionIndex].options.map((option, idx) => {
                  const isSelected = selectedAnswers[selectedExam.questions[currentQuestionIndex].id] === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(selectedExam.questions[currentQuestionIndex].id, idx)}
                      className={`w-full p-4 rounded-xl text-left font-medium text-sm border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-rose-50/50 border-rose-600 text-rose-900 font-bold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span>{option}</span>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-rose-600 bg-rose-600' : 'border-slate-300'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Nav Footer controls */}
            <div className="p-5 bg-slate-50 border-t border-slate-150 flex items-center justify-between">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:text-slate-800 bg-white rounded-xl text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-1"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Prev</span>
              </button>

              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-colors cursor-pointer flex items-center space-x-1"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Submit Assessment</span>
              </button>

              <button
                disabled={currentQuestionIndex === selectedExam.questions.length - 1}
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:text-slate-800 bg-white rounded-xl text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center space-x-1"
              >
                <span>Next</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>

          </div>

          {/* Right Column: Question Navigator Matrix (1/4 width) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Question Navigator</h4>
              
              {/* Grid 1-10 */}
              <div className="grid grid-cols-4 gap-2.5">
                {selectedExam.questions.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCurrent = currentQuestionIndex === idx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`h-10 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${
                        isCurrent
                          ? 'ring-2 ring-rose-500 ring-offset-2 border-rose-600 text-rose-700 bg-rose-50'
                          : isAnswered
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Map Legend */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-[11px] text-slate-500 font-semibold">
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 bg-emerald-500 rounded-sm" />
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 bg-slate-50 border border-slate-200 rounded-sm" />
                <span>Not Visited / Skipped</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3.5 h-3.5 bg-rose-50 border border-rose-400 rounded-sm" />
                <span>Active Question</span>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 4. POST-SUBMISSION DETAILED FEEDBACK & ANSWERS REVIEW */}
      {currentView === 'feedback' && selectedExam && liveResult && (
        <div className="space-y-6 max-w-4xl mx-auto" id="exam-feedback">
          
          {/* Custom Auto-Submit Banner */}
          {wasAutoSubmitted && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 text-amber-800 text-xs animate-fade-in shadow-xs">
              <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5 animate-bounce" />
              <div>
                <p className="font-extrabold text-sm text-amber-950">Examination Time Limit Reached</p>
                <p className="mt-1 leading-relaxed text-amber-900 font-semibold">
                  Your official time limit of {selectedExam.durationMinutes} minutes has elapsed. All of your currently answered questions were automatically saved, compiled, and synchronized to the university registry successfully.
                </p>
              </div>
            </div>
          )}

          {/* Summary Score Header */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center space-y-4">
            <div className="inline-flex p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <Award className="h-10 w-10" />
            </div>

            <div>
              <span className={`text-[10px] px-3 py-1 rounded-full font-extrabold uppercase tracking-widest ${
                liveResult.passed
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-rose-50 text-rose-700 border border-rose-100'
              }`}>
                {liveResult.passed ? 'PASSED EXAMINATION' : 'REMEDIAL REQUIRED / FAILED'}
              </span>
              <h2 className="text-2xl font-bold text-slate-800 mt-2">Performance Summary: {selectedExam.title}</h2>
              <p className="text-xs text-slate-400 font-medium">Submitted on {liveResult.submittedAt}</p>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto py-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Marks Obtained</span>
                <span className="text-lg font-mono font-extrabold text-slate-700">{liveResult.score} / {liveResult.totalQuestions}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Percentage</span>
                <span className="text-lg font-mono font-extrabold text-slate-700">{liveResult.percentage}%</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Correct MCQs</span>
                <span className="text-lg font-mono font-extrabold text-emerald-600">{liveResult.score}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Incorrect / Blank</span>
                <span className="text-lg font-mono font-extrabold text-rose-500">{liveResult.totalQuestions - liveResult.score}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCurrentView('list');
                setSelectedExam(null);
                setLiveResult(null);
              }}
              className="px-5 py-2.5 bg-slate-850 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center space-x-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>{viewMode === 'results' ? 'Back to Results Panel' : 'Back to Examinations Panel'}</span>
            </button>
          </div>

          {/* Question-by-Question Detailed Answer Sheet Review */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">Detailed Graded Answer Sheet</h3>

            <div className="space-y-6 divide-y divide-slate-100">
              {selectedExam.questions.map((q, idx) => {
                const studentAnsIndex = selectedAnswers[q.id];
                const isCorrect = studentAnsIndex === q.correctOptionIndex;

                return (
                  <div key={q.id} className={`pt-6 ${idx === 0 ? 'pt-0' : ''} space-y-3`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-bold font-mono">QUESTION #{idx + 1}</span>
                        <h4 className="font-bold text-sm text-slate-800 leading-relaxed">{q.text}</h4>
                      </div>
                      
                      {studentAnsIndex === undefined ? (
                        <span className="inline-flex items-center space-x-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full shrink-0">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>Not Answered</span>
                        </span>
                      ) : isCorrect ? (
                        <span className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Correct (+1)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full shrink-0">
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Incorrect (0)</span>
                        </span>
                      )}
                    </div>

                    {/* Options status layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {q.options.map((option, opIdx) => {
                        const isCorrectOption = opIdx === q.correctOptionIndex;
                        const isStudentSelected = opIdx === studentAnsIndex;

                        let cardStyle = 'border-slate-150 bg-slate-50/50 text-slate-600';
                        if (isCorrectOption) {
                          cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                        } else if (isStudentSelected && !isCorrect) {
                          cardStyle = 'border-rose-500 bg-rose-50 text-rose-900';
                        }

                        return (
                          <div
                            key={opIdx}
                            className={`p-3 rounded-lg border text-xs font-medium flex items-center justify-between ${cardStyle}`}
                          >
                            <span className="line-clamp-1">{String.fromCharCode(65 + opIdx)}. {option}</span>
                            {isCorrectOption ? (
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm shrink-0">CORRECT ANSWER</span>
                            ) : isStudentSelected ? (
                              <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-sm shrink-0">YOUR SELECTION</span>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* RENDER BEAUTIFUL CUSTOM CONFIRMATION MODAL (No window.confirm!) */}
      {showSubmitConfirm && selectedExam && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="confirm-submit-modal">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0">
                <ShieldAlert className="h-6 w-6 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-800 text-base">Finish & Submit Exam?</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  You have answered <span className="font-extrabold text-rose-600">{Object.keys(selectedAnswers).length} of {selectedExam.questions.length}</span> questions.
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Are you absolutely sure you want to finalize your exam answers and publish them to the university grading registry? This action is irreversible.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-150">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:text-slate-800 bg-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Continue Answering
              </button>
              <button
                onClick={() => {
                  setShowSubmitConfirm(false);
                  handleExamSubmit();
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-colors cursor-pointer"
              >
                Yes, Submit Assessment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
