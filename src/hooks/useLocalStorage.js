import { useState, useEffect } from "react";
import { updateUserData } from "../utils/supabase/client";

export function useLocalStorage(key, initialValue, userId) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key", key, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));

      // Guardar también en Supabase si tenemos userId
      if (userId) {
        updateUserData(userId, key, value);
      }

    } catch (error) {
      console.error("Error setting localStorage key", key, error);
    }
  }, [key, value, userId]);

  return [value, setValue];
}
