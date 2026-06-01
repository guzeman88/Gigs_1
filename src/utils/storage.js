const STORAGE_KEY = 'gigs_app_data';

export const DEFAULT_CATEGORIES = {
  gig: { label: 'Gig', colors: ['#d9ead3', '#b6d7a8', '#93c47d', '#d9d2e9', '#b4a7d6', '#8e7cc3', '#fce5cd', '#f9cb9c', '#f6b26b'] },
  vacation: { label: 'Vacation', color: '#c9daf8' },
  audition: { label: 'Audition', color: '#fff2cc' },
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { events: [], nextColorIndex: 0 };
    return JSON.parse(raw);
  } catch {
    return { events: [], nextColorIndex: 0 };
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save data:', e);
  }
}
