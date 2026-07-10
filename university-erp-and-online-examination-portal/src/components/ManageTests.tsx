import React, { useState } from 'react';
import { Exam, Question } from '../types';
import { Plus, Trash2, Edit2, Check, ArrowLeft, PlusCircle, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { motion } from 'motion/react';

interface ManageTestsProps {
  exams: Exam[];
  onAddExam: (exam: Exam) => void;
  onUpdateExam: (exam: Exam) => void;
  onDeleteExam: (examId: string) => void;
}

type Mode = 'list' | 'create' | 'edit';

export default function ManageTests({
  exams,
  onAddExam,
  onUpdateExam,
  onDeleteExam
}: ManageTestsProps) {
  
  const [currentMode, setCurrentMode] = useState<Mode>('list');
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [deletingExamId, setDeletingExamId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q-1',
      text: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0
    }
  ]);

  const [formError, setFormError] = useState('');

  // Switch to Create Mode
  const handleInitiateCreate = () => {
    setTitle('');
    setDescription('');
    setDuration(10);
    setQuestions([
      {
        id: 'q-init-1',
        text: 'What is the default value of local variables in Java?',
        options: ['Null', '0', 'Garbage Value', 'Not initialized / Compilation Error'],
        correctOptionIndex: 3
      }
    ]);
    setFormError('');
    setCurrentMode('create');
  };

  // Switch to Edit Mode
  const handleInitiateEdit = (exam: Exam) => {
    setEditingExamId(exam.id);
    setTitle(exam.title);
    setDescription(exam.description);
    setDuration(exam.durationMinutes);
    setQuestions(JSON.parse(JSON.stringify(exam.questions))); // Deep clone questions
    setFormError('');
    setCurrentMode('edit');
  };

  // Add empty question helper
  const handleAddQuestionField = () => {
    const newId = `q-new-${Date.now()}`;
    setQuestions((prev) => [
      ...prev,
      {
        id: newId,
        text: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0
      }
    ]);
  };

  // Delete question field from form
  const handleDeleteQuestionField = (index: number) => {
    if (questions.length <= 1) {
      setFormError('An exam must contain at least one question.');
      return;
    }
    setQuestions((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Handle changes on a specific question
  const handleQuestionTextChange = (index: number, val: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index].text = val;
      return copy;
    });
  };

  // Handle changes on an option string
  const handleOptionChange = (qIndex: number, opIndex: number, val: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex].options[opIndex] = val;
      return copy;
    });
  };

  // Handle correct option index selection
  const handleCorrectOptionChange = (qIndex: number, valIndex: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex].correctOptionIndex = valIndex;
      return copy;
    });
  };

  // Submit test form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!title.trim() || !description.trim()) {
      setFormError('Please provide a title and description for the examination.');
      return;
    }

    if (duration <= 0) {
      setFormError('Exam duration must be greater than 0 minutes.');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        setFormError(`Question #${i + 1} has empty text field.`);
        return;
      }
      for (let o = 0; o < 4; o++) {
        if (!q.options[o].trim()) {
          setFormError(`Question #${i + 1} Option ${String.fromCharCode(65 + o)} is empty.`);
          return;
        }
      }
    }

    // Assemble and trigger callbacks
    if (currentMode === 'create') {
      const newExam: Exam = {
        id: `exam-custom-${Date.now()}`,
        title,
        description,
        durationMinutes: duration,
        questions: questions.map((q, idx) => ({ ...q, id: `q-${idx}-${Date.now()}` }))
      };
      onAddExam(newExam);
    } else if (currentMode === 'edit' && editingExamId) {
      const updatedExam: Exam = {
        id: editingExamId,
        title,
        description,
        durationMinutes: duration,
        questions
      };
      onUpdateExam(updatedExam);
    }

    setCurrentMode('list');
  };

  // Delete an entire exam paper
  const handleDeleteExam = (examId: string) => {
    setDeletingExamId(examId);
  };

  return (
    <div id="manage-tests" className="space-y-6">
      
      {/* 1. EXAMS TABLE / VIEW */}
      {currentMode === 'list' && (
        <div className="space-y-6" id="exams-list-mode">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Examination Syllabus Registry</h3>
              <p className="text-xs text-slate-400 font-semibold">Publish new multiple-choice question sets, or review and modify existing exam models.</p>
            </div>
            
            <button
              onClick={handleInitiateCreate}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center space-x-1.5 self-start sm:self-center"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Exam Paper</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-xs font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/50">
                  <tr>
                    <th className="py-4 px-6">Exam Syllabus Title</th>
                    <th className="py-4 px-4">Duration</th>
                    <th className="py-4 px-4 text-center">Questions</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {exams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50/50 transition-all">
                      <td className="py-4 px-6">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg shrink-0 mt-0.5">
                            <FileSpreadsheet className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm leading-snug">{exam.title}</h4>
                            <p className="text-[11px] text-slate-400 line-clamp-1 max-w-md mt-0.5">{exam.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-xs font-mono text-slate-600">
                        {exam.durationMinutes} Minutes
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                          {exam.questions.length} MCQs
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleInitiateEdit(exam)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Exam"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteExam(exam.id)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Exam"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 2. CREATE OR EDIT EXAMS FORM LAYOUT */}
      {(currentMode === 'create' || currentMode === 'edit') && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg max-w-4xl mx-auto overflow-hidden" id="exam-form-container">
          
          <div className="p-6 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                {currentMode === 'create' ? 'Assemble New Question Set' : 'Edit Exam Syllabus Details'}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">Add questions, set dynamic durations, and select correct MCQ options.</p>
            </div>

            <button
              onClick={() => setCurrentMode('list')}
              className="px-3 py-1.5 border border-slate-200 text-slate-600 bg-white rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer flex items-center space-x-1"
            >
              <ArrowLeft className="h-3 w-3" />
              <span>Back to list</span>
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
            {formError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Title & Duration Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Exam Title</label>
                <input
                  type="text"
                  placeholder="e.g. Advanced Operating Systems Lab"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Duration (Minutes)</label>
                <input
                  type="number"
                  placeholder="e.g. 15"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-mono font-bold"
                  min="1"
                />
              </div>

            </div>

            {/* Description field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Syllabus / Description Summary</label>
              <textarea
                rows={3}
                placeholder="Brief guidelines covering topic weights, proctoring warnings, and expected learnings."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-semibold resize-none"
              />
            </div>

            {/* Questions Form Stack */}
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-700 text-sm uppercase tracking-wider">Construct Exam Questions</h4>
                <button
                  type="button"
                  onClick={handleAddQuestionField}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center space-x-1 cursor-pointer hover:underline"
                >
                  <PlusCircle className="h-4.5 w-4.5" />
                  <span>Add Next Question</span>
                </button>
              </div>

              {/* Loop and render question modules */}
              <div className="space-y-6 divide-y divide-slate-100">
                {questions.map((question, qIdx) => (
                  <div key={question.id} className={`pt-6 ${qIdx === 0 ? 'pt-0' : ''} space-y-4`}>
                    
                    {/* Header: Question Num and Delete */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-rose-700 font-bold font-mono">QUESTION BLOCK #{qIdx + 1}</span>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestionField(qIdx)}
                          className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* Question Statement Input */}
                    <div className="space-y-1.5">
                      <input
                        type="text"
                        placeholder="Write the MCQ question query statement..."
                        value={question.text}
                        onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-semibold"
                      />
                    </div>

                    {/* 4 Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {question.options.map((option, opIdx) => (
                        <div key={opIdx} className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase block pl-1">
                            Option {String.fromCharCode(65 + opIdx)}
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-slate-400">
                              {String.fromCharCode(65 + opIdx)}
                            </span>
                            <input
                              type="text"
                              placeholder="Type option option text..."
                              value={option}
                              onChange={(e) => handleOptionChange(qIdx, opIdx, e.target.value)}
                              className="w-full pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 placeholder-slate-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Select Correct option */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50/50 p-4 border border-slate-100 rounded-xl gap-2">
                      <span className="text-xs text-slate-500 font-bold">Mark which option is mathematically / logically correct:</span>
                      <div className="flex space-x-1.5">
                        {question.options.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleCorrectOptionChange(qIdx, idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                              question.correctOptionIndex === idx
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            Option {String.fromCharCode(65 + idx)}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentMode('list')}
                className="px-4 py-2.5 border border-slate-200 text-slate-600 bg-white rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel Changes
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center space-x-1"
              >
                <Check className="h-4 w-4" />
                <span>
                  {currentMode === 'create' ? 'Publish Exam to ERP' : 'Save Syllabus Modifications'}
                </span>
              </button>
            </div>

          </form>

        </div>
      )}

      {/* RENDER BEAUTIFUL CUSTOM DELETION MODAL (No window.confirm!) */}
      {deletingExamId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="confirm-delete-exam-modal">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-start space-x-3.5">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shrink-0">
                <Trash2 className="h-6 w-6 animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-slate-800 text-base">Delete Examination Paper?</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                  Are you absolutely sure you want to permanently delete this examination syllabus model?
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  All active student results, grading summaries, and analytics records tied to this course code will be permanently archived and unlinked. This is irreversible.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-150">
              <button
                onClick={() => setDeletingExamId(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 hover:text-slate-800 bg-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel Keep Paper
              </button>
              <button
                onClick={() => {
                  if (deletingExamId) {
                    onDeleteExam(deletingExamId);
                  }
                  setDeletingExamId(null);
                }}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-colors cursor-pointer"
              >
                Yes, Delete Syllabus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
