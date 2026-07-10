import React, { useState } from 'react';
import { Announcement, UserRole } from '../types';
import { Plus, Megaphone, Trash2, Edit3, Calendar, AlertCircle, Info, Tag, Check, Filter } from 'lucide-react';
import { motion } from 'motion/react';

interface AnnouncementsModuleProps {
  role: UserRole;
  announcements: Announcement[];
  onAddAnnouncement: (ann: Announcement) => void;
  onUpdateAnnouncement: (ann: Announcement) => void;
  onDeleteAnnouncement: (annId: string) => void;
}

type Mode = 'list' | 'form';

export default function AnnouncementsModule({
  role,
  announcements,
  onAddAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement
}: AnnouncementsModuleProps) {
  
  // Local states
  const [currentMode, setCurrentMode] = useState<Mode>('list');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Exam' | 'Assignment' | 'Holiday' | 'Project' | 'Workshop' | 'General'>('General');
  const [formError, setFormError] = useState('');

  // Categories list for filter
  const categories = ['All', 'Exam', 'Assignment', 'Holiday', 'Project', 'Workshop', 'General'];

  // Initiate Create Notice
  const handleInitiateCreate = () => {
    setTitle('');
    setContent('');
    setCategory('General');
    setEditingId(null);
    setFormError('');
    setCurrentMode('form');
  };

  // Initiate Edit Notice
  const handleInitiateEdit = (ann: Announcement) => {
    setTitle(ann.title);
    setContent(ann.content);
    setCategory(ann.category);
    setEditingId(ann.id);
    setFormError('');
    setCurrentMode('form');
  };

  // Submit Notice Form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !content.trim()) {
      setFormError('Please fill in both the bulletin title and content description.');
      return;
    }

    if (editingId) {
      // Edit
      const updatedAnn: Announcement = {
        id: editingId,
        title,
        content,
        category,
        date: new Date().toISOString().split('T')[0]
      };
      onUpdateAnnouncement(updatedAnn);
    } else {
      // Add
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        title,
        content,
        category,
        date: new Date().toISOString().split('T')[0]
      };
      onAddAnnouncement(newAnn);
    }

    setCurrentMode('list');
  };

  // Delete Notice
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this bulletin permanently from the student ERP boards?')) {
      onDeleteAnnouncement(id);
    }
  };

  // Apply filters
  const filteredAnnouncements = announcements.filter((ann) => {
    if (activeCategoryFilter === 'All') return true;
    return ann.category === activeCategoryFilter;
  });

  return (
    <div id="announcements-module" className="space-y-6">
      
      {/* Dynamic Title Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-150 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">
            {role === 'student' ? 'University Bulletin Board' : 'Post & Broadcast Notices'}
          </h3>
          <p className="text-xs text-slate-400 font-semibold">
            {role === 'student'
              ? 'Stay updated on essential final-year examination rosters, extended submissions, and campus announcements.'
              : 'Write advisories, assign categories, and post bulletins directly to student dashboard dashboards.'}
          </p>
        </div>

        {role === 'teacher' && currentMode === 'list' && (
          <button
            onClick={handleInitiateCreate}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center space-x-1.5 self-start sm:self-center"
          >
            <Plus className="h-4 w-4" />
            <span>Post New Bulletin</span>
          </button>
        )}
      </div>

      {/* Categories Filter pills */}
      {currentMode === 'list' && (
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0 flex items-center space-x-1">
            <Filter className="h-3.5 w-3.5" />
            <span>Category:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border transition-all cursor-pointer shrink-0 ${
                activeCategoryFilter === cat
                  ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ========================================== */}
      {/* BULLETIN LIST VIEW */}
      {/* ========================================== */}
      {currentMode === 'list' && (
        <div className="space-y-4" id="bulletin-list-container">
          {filteredAnnouncements.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
              <Megaphone className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">No Bulletins Found</h4>
              <p className="text-xs text-slate-400">There are no active notices matching the selected filter criteria.</p>
            </div>
          ) : (
            filteredAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="bg-white rounded-2xl border border-slate-150 p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all hover:border-slate-300 hover:shadow-xs"
              >
                {/* Left Section: Notice details */}
                <div className="space-y-3 flex-grow">
                  <div className="flex items-center space-x-3">
                    <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-extrabold uppercase tracking-widest ${
                      ann.category === 'Project' || ann.category === 'Exam'
                        ? 'bg-rose-100 text-rose-700 border border-rose-100'
                        : ann.category === 'Assignment'
                        ? 'bg-amber-100 text-amber-700 border border-amber-100'
                        : 'bg-indigo-100 text-indigo-700 border border-indigo-100'
                    }`}>
                      {ann.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-bold flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{ann.date}</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-slate-800 leading-snug">{ann.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl whitespace-pre-line font-medium">
                      {ann.content}
                    </p>
                  </div>
                </div>

                {/* Right Section: Actions for Teachers */}
                {role === 'teacher' && (
                  <div className="flex items-center space-x-1.5 shrink-0 self-start md:self-center">
                    <button
                      onClick={() => handleFormSubmit} // wait, handleInitiateEdit is what we want!
                      onClickCapture={() => handleInitiateEdit(ann)}
                      className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors cursor-pointer"
                      title="Edit Bulletin"
                    >
                      <Edit3 className="h-4.5 w-4.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(ann.id)}
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Delete Bulletin"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                )}

              </div>
            ))
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* CREATE / EDIT FORM VIEW */}
      {/* ========================================== */}
      {currentMode === 'form' && (
        <div className="bg-white rounded-2xl border border-slate-250 shadow-md max-w-2xl mx-auto overflow-hidden" id="bulletin-form-container">
          <div className="p-5 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-sm">
              {editingId ? 'Modify Campus Bulletin' : 'Create New Broadcast Notice'}
            </h4>
            <button
              onClick={() => setCurrentMode('list')}
              className="text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Title field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Bulletin Title</label>
              <input
                type="text"
                placeholder="e.g. Capstone Project Presentation Schedule"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-teal-500/15 focus:border-teal-500 transition-all font-semibold"
              />
            </div>

            {/* Category selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Notice Category Tag</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {['General', 'Exam', 'Assignment', 'Holiday', 'Project', 'Workshop'].map((cat) => {
                  const isSel = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat as any)}
                      className={`py-2 rounded-lg text-[10px] font-extrabold uppercase tracking-wide border transition-all cursor-pointer ${
                        isSel
                          ? 'bg-teal-600 border-teal-600 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content text description */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Detailed Description Summary</label>
              <textarea
                rows={5}
                placeholder="Write notices guidelines, dates, times, and syllabus rules..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-xs focus:outline-hidden focus:ring-2 focus:ring-teal-500/15 focus:border-teal-500 transition-all font-semibold resize-none"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentMode('list')}
                className="px-4 py-2.5 border border-slate-200 text-slate-600 bg-white rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Discard
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg cursor-pointer flex items-center space-x-1"
              >
                <Check className="h-3.5 w-3.5" />
                <span>{editingId ? 'Save Bulletin' : 'Broadcast Notice'}</span>
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
