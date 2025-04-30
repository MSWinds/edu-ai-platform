// SSR-safe localStorage utilities to prevent errors during server rendering

export const getLocalStorage = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('读取localStorage时出错:', error);
      return null;
    }
  }
  return null;
};

export const setLocalStorage = (key: string, value: string): boolean => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('写入localStorage时出错:', error);
      return false;
    }
  }
  return false;
};

export const removeLocalStorage = (key: string): boolean => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('删除localStorage时出错:', error);
      return false;
    }
  }
  return false;
}; 