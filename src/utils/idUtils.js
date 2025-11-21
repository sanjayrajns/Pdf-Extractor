import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'user_silent_id';

export const getSilentId = () => {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = uuidv4();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
};
