const isServer = typeof window === "undefined";

export const set = (key, value) => {
  if (isServer) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
};

export const get = (key) => {
  if (isServer) return;
  try {
    const data = window.localStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const del = (key) => {
  if (isServer) return;
  try {
    window.localStorage.removeItem(key);
  } catch (e) {
    console.error(e);
  }
};
