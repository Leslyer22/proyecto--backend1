import { v4 as uuidv4 } from 'uuid';

// Genera un código único más corto
export const generateUniqueCode = () => {
  return uuidv4().split("-")[0].toUpperCase(); // ej: '4F9F8B90'
};
