'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { organs } from '@/lib/data/organs';
import { Plus, Pencil, Trash2, StickyNote } from 'lucide-react';

interface Note {
  id: string;
  organSlug: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedOrgan, setSelectedOrgan] = useState<string>('heart');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filteredNotes = notes.filter((n) => n.organSlug === selectedOrgan);
  const organ = organs.find((o) => o.slug === selectedOrgan);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingId ? { ...n, title, content } : n
        )
      );
      setEditingId(null);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        organSlug: selectedOrgan,
        title,
        content,
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };
      setNotes((prev) => [newNote, ...prev]);
    }

    setTitle('');
    setContent('');
    setShowForm(false);
  };

  const handleEdit = (note: Note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-cream-white font-display">
            Study Notes
          </h1>
          <p className="text-soft-pistachio/50 text-sm mt-1">Organize your anatomy notes by organ</p>
        </div>
        <motion.button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setTitle(''); setContent(''); }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-button-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'New Note'}
        </motion.button>
      </div>

      {/* Organ Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {organs.map((org) => {
          const count = notes.filter((n) => n.organSlug === org.slug).length;
          const isActive = selectedOrgan === org.slug;
          return (
            <button
              key={org.slug}
              onClick={() => setSelectedOrgan(org.slug)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-mint-bloom/15 border border-mint-bloom/30 text-mint-bloom'
                  : 'bg-white/[0.03] border border-white/[0.06] text-soft-pistachio/40 hover:text-cream-white hover:border-white/[0.12]'
              }`}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: org.color }} />
              {org.name}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-mint-bloom/20' : 'bg-white/[0.06]'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* New/Edit Note Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <div className="glass-panel p-6 space-y-4">
              <div>
                <label className="text-xs font-mono text-soft-pistachio/40 uppercase tracking-wider mb-2 block">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`e.g. "${organ?.name} key anatomy points"`}
                  className="glass-input"
                />
              </div>
              <div>
                <label className="text-xs font-mono text-soft-pistachio/40 uppercase tracking-wider mb-2 block">Content</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your study notes..."
                  rows={5}
                  className="glass-input resize-none"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowForm(false)} className="glass-button">Cancel</button>
                <motion.button
                  onClick={handleSave}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button-primary"
                >
                  {editingId ? 'Update Note' : 'Save Note'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-forest-jade/10 border border-forest-jade/15">
            <StickyNote className="w-8 h-8 text-mint-bloom/50" />
          </div>
          <h3 className="text-cream-white font-semibold mb-2 font-display">No notes yet</h3>
          <p className="text-soft-pistachio/40 text-sm mb-4">
            Start adding notes for {organ?.name} to organize your study material
          </p>
          <motion.button
            onClick={() => setShowForm(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button"
          >
            Create First Note
          </motion.button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filteredNotes.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-panel-hover p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-cream-white font-medium font-display">{note.title}</h3>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleEdit(note)}
                    className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-3 h-3 text-soft-pistachio/40" />
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    className="w-7 h-7 rounded-lg bg-white/[0.05] hover:bg-red-500/20 flex items-center justify-center transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3 text-soft-pistachio/40" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-soft-pistachio/50 leading-relaxed whitespace-pre-wrap">{note.content}</p>
              <p className="text-[10px] font-mono text-soft-pistachio/25 mt-3">{note.createdAt}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
