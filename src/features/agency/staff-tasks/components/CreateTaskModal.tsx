'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, AlertCircle } from 'lucide-react';
import type { Task, TaskType, TaskPriority, TaskStatus, TaskFrequency } from '../types';
import { TYPE_CONFIG, PRIORITY_CONFIG } from '../types';
import { STAFF_ROSTER, AVATAR_COLORS } from '../constants';

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  defaultStatus?: TaskStatus;
}

const DEPARTMENTS = ['Social Media', 'Chatters', 'Editing', 'Management'];

export function CreateTaskModal({ open, onClose, onSave, defaultStatus = 'todo' }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [employeeId, setEmployeeId] = useState<string>(STAFF_ROSTER[0]?.id ?? '');
  const [type, setType] = useState<TaskType>('custom');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [frequency, setFrequency] = useState<TaskFrequency>('once');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [error, setError] = useState('');
  const [filterDept, setFilterDept] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setEmployeeId(STAFF_ROSTER[0]?.id ?? '');
      setType('custom');
      setPriority('medium');
      setFrequency('once');
      setDueDate('');
      setDueTime('');
      setError('');
    }
  }, [open]);

  const handleSave = () => {
    if (!title.trim()) { setError('Task title is required'); return; }
    if (!employeeId) { setError('Please select an assignee'); return; }
    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      employeeId,
      assignedById: 'alex',
      status: defaultStatus,
      type,
      priority,
      frequency,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
    });
    onClose();
  };

  const filteredEmployees = filterDept
    ? STAFF_ROSTER.filter(e => e.dept === filterDept)
    : STAFF_ROSTER;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
              className="w-[560px] max-h-[90vh] rounded-2xl overflow-hidden flex flex-col bg-white"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 flex-shrink-0">
                <div>
                  <h2 className="text-sm font-bold text-neutral-900">Create Task</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">Assign a new task to a staff member</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-700"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs bg-red-50 border border-red-100 text-red-600">
                    <AlertCircle size={12} />
                    {error}
                  </div>
                )}

                {/* Section 1: Core Details */}
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Details</p>

                  {/* Title */}
                  <div className="space-y-1.5 mb-3">
                    <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest">Task Title *</label>
                    <input
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. Post approved reel to IG"
                      className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-colors"
                      autoFocus
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest">Description</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Optional details or instructions..."
                      rows={2}
                      className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-colors resize-none"
                    />
                  </div>
                </div>

                <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.07)' }} />

                {/* Section 2: Assignment */}
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Assignment</p>

                  {/* Dept filter */}
                  <div className="space-y-1.5 mb-3">
                    <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest">Assign To *</label>
                    <div className="flex gap-1 flex-wrap mb-2">
                      <button
                        onClick={() => setFilterDept('')}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold transition-all"
                        style={{
                          backgroundColor: !filterDept ? '#1f2937' : '#f3f4f6',
                          color: !filterDept ? '#ffffff' : '#6b7280',
                        }}
                      >
                        All
                      </button>
                      {DEPARTMENTS.map(d => (
                        <button
                          key={d}
                          onClick={() => setFilterDept(filterDept === d ? '' : d)}
                          className="px-2 py-0.5 rounded text-[10px] font-semibold transition-all"
                          style={{
                            backgroundColor: filterDept === d ? '#1f2937' : '#f3f4f6',
                            color: filterDept === d ? '#ffffff' : '#6b7280',
                          }}
                        >
                          {d}
                        </button>
                      ))}
                    </div>

                    {/* Employee pills */}
                    <div className="flex flex-wrap gap-2">
                      {filteredEmployees.map(emp => (
                        <button
                          key={emp.id}
                          onClick={() => setEmployeeId(emp.id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                          style={{
                            backgroundColor: employeeId === emp.id ? `${AVATAR_COLORS[emp.id] ?? '#6b7280'}18` : '#f9fafb',
                            border: `1px solid ${employeeId === emp.id ? (AVATAR_COLORS[emp.id] ?? '#6b7280') + '55' : '#e5e7eb'}`,
                            color: employeeId === emp.id ? (AVATAR_COLORS[emp.id] ?? '#6b7280') : '#6b7280',
                          }}
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                            style={{ backgroundColor: AVATAR_COLORS[emp.id] ?? '#6b7280' }}
                          >
                            {emp.name[0]}
                          </div>
                          {emp.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority + Type row */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest">Type</label>
                      <div className="flex gap-1.5">
                        {(Object.keys(TYPE_CONFIG) as TaskType[]).map(t => (
                          <button
                            key={t}
                            onClick={() => setType(t)}
                            className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold transition-all border"
                            style={{
                              backgroundColor: type === t ? TYPE_CONFIG[t].bg : '#f9fafb',
                              borderColor: type === t ? TYPE_CONFIG[t].color + '44' : '#e5e7eb',
                              color: type === t ? TYPE_CONFIG[t].color : '#6b7280',
                            }}
                          >
                            {TYPE_CONFIG[t].label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest">Priority</label>
                      <div className="flex gap-1.5">
                        {(['low', 'medium', 'high'] as TaskPriority[]).map(p => (
                          <button
                            key={p}
                            onClick={() => setPriority(p)}
                            className="flex-1 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all border"
                            style={{
                              backgroundColor: priority === p ? `${PRIORITY_CONFIG[p].color}18` : '#f9fafb',
                              borderColor: priority === p ? PRIORITY_CONFIG[p].color + '44' : '#e5e7eb',
                              color: priority === p ? PRIORITY_CONFIG[p].color : '#6b7280',
                            }}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Frequency */}
                  <div className="space-y-1.5 mb-3">
                    <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest">Frequency</label>
                    <div className="flex gap-2">
                      {(['once', 'daily', 'weekly'] as TaskFrequency[]).map(f => (
                        <button
                          key={f}
                          onClick={() => setFrequency(f)}
                          className="flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all border"
                          style={{
                            backgroundColor: frequency === f ? '#1f2937' : '#f9fafb',
                            borderColor: frequency === f ? '#374151' : '#e5e7eb',
                            color: frequency === f ? '#ffffff' : '#6b7280',
                          }}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Due date + time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest">Due Date</label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-widest">Due Time</label>
                      <input
                        type="time"
                        value={dueTime}
                        onChange={e => setDueTime(e.target.value)}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-neutral-200 flex-shrink-0 bg-neutral-50">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all hover:brightness-110 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #ff0069, #833ab4)' }}
                >
                  <Plus size={13} />
                  Create Task
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
