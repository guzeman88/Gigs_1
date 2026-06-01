import React, { useState, useEffect } from 'react';

const TYPE_OPTIONS = [
  { value: 'gig', label: 'Gig', emoji: '🎵' },
  { value: 'vacation', label: 'Vacation', emoji: '🏖️' },
  { value: 'audition', label: 'Audition', emoji: '🎭' },
];

const EMPTY_FORM = {
  type: 'gig',
  groupName: '',
  startDate: '',
  endDate: '',
  payment: '',
  repertoire: '',
  finalsDate: '',
  notes: '',
};

export default function EventModal({ event, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    if (event) {
      setForm({ ...EMPTY_FORM, ...event });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [event]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.groupName.trim()) return;
    if (!form.startDate) return;
    onSave(form);
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90dvh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold text-slate-800">
            {event ? 'Edit Entry' : 'Add Entry'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
            <div className="flex gap-2">
              {TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set('type', opt.value)}
                  className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                    form.type === opt.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {opt.emoji} {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Group / Organization Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {form.type === 'gig' ? 'Group / Ensemble' : form.type === 'vacation' ? 'Destination / Label' : 'Audition For'}
              <span className="text-red-500 ml-0.5">*</span>
            </label>
            <input
              type="text"
              value={form.groupName}
              onChange={(e) => set('groupName', e.target.value)}
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. City Symphony Orchestra"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => {
                  set('startDate', e.target.value);
                  if (!form.endDate || e.target.value > form.endDate) {
                    set('endDate', e.target.value);
                  }
                }}
                required
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input
                type="date"
                value={form.endDate}
                min={form.startDate}
                onChange={(e) => set('endDate', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Payment (Gigs only) */}
          {form.type === 'gig' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payment</label>
              <input
                type="text"
                value={form.payment}
                onChange={(e) => set('payment', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. $500, TBD, Per-service"
              />
            </div>
          )}

          {/* Repertoire (Gigs and Auditions) */}
          {(form.type === 'gig' || form.type === 'audition') && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Repertoire</label>
              <textarea
                value={form.repertoire}
                onChange={(e) => set('repertoire', e.target.value)}
                rows={2}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                placeholder="e.g. Beethoven 9, Brahms Requiem"
              />
            </div>
          )}

          {/* Finals Date (Auditions only) */}
          {form.type === 'audition' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Finals Date (optional)</label>
              <input
                type="date"
                value={form.finalsDate}
                onChange={(e) => set('finalsDate', e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              rows={2}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              placeholder="Any additional notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 pb-safe">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium text-sm hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 active:bg-blue-800"
            >
              {event ? 'Save Changes' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
