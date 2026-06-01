import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { loadData, saveData, DEFAULT_CATEGORIES } from '../utils/storage';

const GIG_COLORS = DEFAULT_CATEGORIES.gig.colors;

export function useEvents() {
  const [store, setStore] = useState(() => loadData());

  const events = store.events ?? [];
  const nextColorIndex = store.nextColorIndex ?? 0;

  const persist = useCallback((newStore) => {
    setStore(newStore);
    saveData(newStore);
  }, []);

  const addEvent = useCallback((eventData) => {
    let color = eventData.color;
    let newNextColorIndex = nextColorIndex;

    if (eventData.type === 'gig' && !color) {
      color = GIG_COLORS[nextColorIndex % GIG_COLORS.length];
      newNextColorIndex = nextColorIndex + 1;
    } else if (eventData.type === 'vacation') {
      color = DEFAULT_CATEGORIES.vacation.color;
    } else if (eventData.type === 'audition') {
      color = DEFAULT_CATEGORIES.audition.color;
    }

    const newEvent = {
      id: uuidv4(),
      type: eventData.type ?? 'gig',
      groupName: eventData.groupName ?? '',
      startDate: eventData.startDate ?? '',
      endDate: eventData.endDate ?? eventData.startDate ?? '',
      payment: eventData.payment ?? '',
      repertoire: eventData.repertoire ?? '',
      finalsDate: eventData.finalsDate ?? '',
      notes: eventData.notes ?? '',
      color,
    };

    persist({ events: [...events, newEvent], nextColorIndex: newNextColorIndex });
    return newEvent;
  }, [events, nextColorIndex, persist]);

  const updateEvent = useCallback((id, updates) => {
    const updated = events.map((e) => (e.id === id ? { ...e, ...updates } : e));
    persist({ ...store, events: updated });
  }, [events, store, persist]);

  const deleteEvent = useCallback((id) => {
    const filtered = events.filter((e) => e.id !== id);
    persist({ ...store, events: filtered });
  }, [events, store, persist]);

  return { events, addEvent, updateEvent, deleteEvent };
}
