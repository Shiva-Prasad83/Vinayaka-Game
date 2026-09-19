const PREFIX = 'gf_';

export const saveToLocalStorage = (key, value) => {
  try {
    if (value === null) {
      localStorage.removeItem(PREFIX + key);
    } else {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    }
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
};

export const loadFromLocalStorage = (key) => {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('localStorage load failed:', e);
    return null;
  }
};

// Generate or retrieve anonymous player ID
export const getOrCreatePlayerId = () => {
  const key = PREFIX + 'player_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = 'guest_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now();
    localStorage.setItem(key, id);
  }
  return id;
};
