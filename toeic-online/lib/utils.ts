import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// utils.ts or any appropriate utility file
export const getDateFromObjectId = (id: string): Date => {
  if (!id || typeof id !== 'string') return new Date(); // Fallback to current date
  try {
    const timestampHex = id.substring(0, 8); // First 8 characters represent the timestamp
    const timestamp = parseInt(timestampHex, 16) * 1000; // Convert to milliseconds
    return new Date(timestamp);
  } catch (error) {
    console.error('Invalid ObjectID:', id, 'Error:', error);
    return new Date(); // Fallback to current date on error
  }
};
