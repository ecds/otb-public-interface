export const loadPreferences = (storageKey: string) => {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) return JSON.parse(raw);
  } catch {
    return null;
  }
};
