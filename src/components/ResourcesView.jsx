import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  Sparkles,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  Globe,
  Video,
  FileText,
  FileCode,
  Link as LinkIcon,
  Filter,
  Layers,
  Copy,
  Check,
  X,
  Bookmark,
  BookOpen
} from 'lucide-react';
import { studentProfile } from '../data/studentData';
import { useToast } from '../context/ToastContext';

export const LOCAL_STORAGE_RESOURCES_KEY = 'study_assistant_resources';

const RESOURCE_TYPES = [
  { id: 'Website', label: 'Website', icon: Globe, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200' },
  { id: 'YouTube', label: 'YouTube', icon: Video, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200' },
  { id: 'PDF', label: 'PDF', icon: FileText, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200' },
  { id: 'Document', label: 'Document', icon: FileCode, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200' },
  { id: 'Other', label: 'Other', icon: LinkIcon, color: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 border-slate-200' },
];

const SUBJECT_CHOICES = [
  'All Subjects',
  'Data Structures & Algorithms',
  'Operating Systems',
  'Database Management Systems',
  'Computer Networks',
  'Artificial Intelligence & ML',
  'General Engineering',
];

const INITIAL_RESOURCES = [
  {
    id: 'res-1',
    title: 'MIT 6.006: Introduction to Algorithms Lecture Series',
    url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-fall-2011/',
    subject: 'Data Structures & Algorithms',
    type: 'Website',
    description: 'Full course curriculum with lecture videos, recitation notes, and problem sets on dynamic programming, graph algorithms, and shortest paths.',
    addedAt: 'Aug 24, 2026',
  },
  {
    id: 'res-2',
    title: 'Operating Systems: Three Easy Pieces (OSTEP Book)',
    url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
    subject: 'Operating Systems',
    type: 'PDF',
    description: 'Free university textbook covering virtualization, concurrency (locks, semaphores, condition variables), and persistence (file systems).',
    addedAt: 'Aug 26, 2026',
  },
  {
    id: 'res-3',
    title: 'CMU 15-445/645 Database Systems Lecture Playlist (Andy Pavlo)',
    url: 'https://www.youtube.com/playlist?list=PLSE8ODhjZXjbohkNBWQs_otTrBTrJYohi',
    subject: 'Database Management Systems',
    type: 'YouTube',
    description: 'In-depth university lectures on database internals, B+ Trees, buffer pool managers, concurrency control, and query execution.',
    addedAt: 'Aug 28, 2026',
  },
  {
    id: 'res-4',
    title: 'Stanford CS231n: Deep Learning for Computer Vision Notes',
    url: 'https://cs231n.github.io/',
    subject: 'Artificial Intelligence & ML',
    type: 'Website',
    description: 'Comprehensive tutorials on neural networks, backpropagation calculus, optimization techniques, and convolutional architectures.',
    addedAt: 'Aug 29, 2026',
  },
  {
    id: 'res-5',
    title: 'Computer Networking: A Top-Down Approach (Slides & Summaries)',
    url: 'http://gaia.cs.umass.edu/kurose_ross/online_lectures.htm',
    subject: 'Computer Networks',
    type: 'Document',
    description: 'Official slide decks and protocol diagrams for Kurose & Ross covering TCP flow control, congestion control, and routing protocols.',
    addedAt: 'Aug 30, 2026',
  },
  {
    id: 'res-6',
    title: 'NeetCode 150: Core Coding Interview Patterns & Proofs',
    url: 'https://neetcode.io/practice',
    subject: 'Data Structures & Algorithms',
    type: 'Website',
    description: 'Curated list of 150 essential algorithm problems covering arrays, two-pointers, trees, backtracking, and dynamic programming.',
    addedAt: 'Sep 01, 2026',
  },
];

export const ResourcesView = ({ setActiveTab }) => {
  const toast = useToast();
  // Resources list stored in localStorage
  const [resources, setResources] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_RESOURCES_KEY);
      return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All Subjects');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    url: '',
    subject: 'Data Structures & Algorithms',
    type: 'Website',
    description: '',
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_RESOURCES_KEY, JSON.stringify(resources));
    } catch (e) {
      console.error('Failed to sync resources to localStorage', e);
    }
  }, [resources]);

  // Open Modal for Add
  const handleOpenAddModal = () => {
    setEditingResource(null);
    setFormData({
      title: '',
      url: '',
      subject: 'Data Structures & Algorithms',
      type: 'Website',
      description: '',
    });
    setShowModal(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (res) => {
    setEditingResource(res);
    setFormData({
      title: res.title,
      url: res.url,
      subject: res.subject,
      type: res.type,
      description: res.description || '',
    });
    setShowModal(true);
  };

  // Save Modal (Add or Update)
  const handleSaveResource = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) return;

    let normalizedUrl = formData.url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    if (editingResource) {
      setResources((prev) =>
        prev.map((r) =>
          r.id === editingResource.id
            ? { ...r, ...formData, url: normalizedUrl }
            : r
        )
      );
      toast.success('Resource updated.');
    } else {
      const newResource = {
        id: `res-${Date.now()}`,
        ...formData,
        url: normalizedUrl,
        addedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      setResources((prev) => [newResource, ...prev]);
      toast.success(`Resource "${newResource.title}" added to library.`);
    }
    setShowModal(false);
  };

  // Delete Resource
  const handleDeleteResource = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      setResources((prev) => prev.filter((r) => r.id !== id));
      toast.info('Resource deleted.');
    }
  };

  // Copy URL to Clipboard
  const handleCopyUrl = (e, id, url) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.info('Resource URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Link
  const handleOpenLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Filter and Search
  const filteredResources = resources.filter((res) => {
    const matchSearch =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.url.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    if (selectedSubjectFilter !== 'All Subjects' && res.subject !== selectedSubjectFilter) {
      return false;
    }

    if (selectedTypeFilter !== 'All' && res.type !== selectedTypeFilter) {
      return false;
    }

    return true;
  });

  const getTypeConfig = (type) => {
    return (
      RESOURCE_TYPES.find((t) => t.id === type) || {
        label: type,
        icon: Globe,
        color: 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 border-slate-200',
      }
    );
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-cyan-700 via-teal-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl shadow-cyan-700/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md border border-white/10">
              <Bookmark className="h-3.5 w-3.5 text-cyan-300" />
              <span>Curated Study Material Library</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Study Resources & Reference Hub 🔗
            </h1>
            <p className="text-sm text-cyan-100/90 leading-relaxed">
              Save, organize, and quickly access high-yield lecture notes, YouTube courses, research papers, and textbooks for <span className="font-bold text-white">{studentProfile.fullName}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-teal-950 shadow-md hover:bg-cyan-50 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Add New Resource
            </button>
          </div>
        </div>

        {/* Decorative Blurred Glows */}
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* 2. Search & Filters Strip */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search resources by title, description, or URL..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2 text-xs text-slate-900 font-medium placeholder-slate-400 focus:border-cyan-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 transition-all"
            />
          </div>

          {/* Subject Filter Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-400 uppercase">Subject:</span>
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 focus:border-cyan-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
            >
              {SUBJECT_CHOICES.map((subj, idx) => (
                <option key={idx} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Type:</span>
          <button
            onClick={() => setSelectedTypeFilter('All')}
            className={`rounded-xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
              selectedTypeFilter === 'All'
                ? 'bg-cyan-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            All Types ({resources.length})
          </button>

          {RESOURCE_TYPES.map((type) => {
            const Icon = type.icon;
            const count = resources.filter((r) => r.type === type.id).length;

            return (
              <button
                key={type.id}
                onClick={() => setSelectedTypeFilter(type.id)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  selectedTypeFilter === type.id
                    ? 'bg-cyan-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{type.label}</span>
                <span className="opacity-60 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Resources Grid View */}
      {filteredResources.length === 0 ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs dark:border-slate-800/80 dark:bg-slate-900 space-y-3">
          <FolderOpen className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            No Study Resources Found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms or click "Add New Resource" to save a helpful article or video.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => {
            const typeConfig = getTypeConfig(res.type);
            const Icon = typeConfig.icon;

            return (
              <div
                key={res.id}
                className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-cyan-400 hover:shadow-xl dark:border-slate-800/80 dark:bg-slate-900 dark:hover:border-cyan-600"
              >
                <div className="space-y-3.5">
                  {/* Top Badges & Actions */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 rounded-lg border px-2 py-0.5 text-[11px] font-bold ${typeConfig.color}`}>
                        <Icon className="h-3 w-3" />
                        {typeConfig.label}
                      </span>
                      <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {res.subject}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleCopyUrl(e, res.id, res.url)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        title="Copy Link"
                      >
                        {copiedId === res.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(res)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        title="Edit Resource"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteResource(res.id, res.title)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete Resource"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => handleOpenLink(res.url)}
                    className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-2 cursor-pointer"
                  >
                    {res.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {res.description || 'No description provided.'}
                  </p>
                </div>

                {/* Card Bottom CTA */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Added {res.addedAt}
                  </span>

                  <button
                    onClick={() => handleOpenLink(res.url)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-800 hover:bg-cyan-100 dark:bg-cyan-950/60 dark:text-cyan-300 dark:hover:bg-cyan-900/80 transition-all cursor-pointer"
                  >
                    <span>Open Resource</span>
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Add / Edit Resource Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl dark:bg-slate-900 space-y-6 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingResource ? 'Edit Study Resource' : 'Add New Study Resource'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Resource Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. MIT 6.006 Algorithms Lectures"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-cyan-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Resource URL
                </label>
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium focus:border-cyan-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 cursor-pointer"
                  >
                    {SUBJECT_CHOICES.filter((s) => s !== 'All Subjects').map((subj, idx) => (
                      <option key={idx} value={subj}>
                        {subj}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                    Resource Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 font-medium dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 cursor-pointer"
                  >
                    {RESOURCE_TYPES.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  Description / Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Key topics covered, book chapters, or why this is useful..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs text-slate-900 font-medium focus:border-cyan-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-cyan-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-cyan-800 shadow-md shadow-cyan-700/20 cursor-pointer"
                >
                  {editingResource ? 'Save Changes' : 'Save Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
