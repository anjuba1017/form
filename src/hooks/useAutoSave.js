// src/hooks/useAutoSave.js
import { useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { saveFormProgress } from '../utils/session';

export const useAutoSave = (formData, formName) => {
  const saveProgress = useCallback(
    debounce(async (data) => {
      try {
        await saveFormProgress({
          [formName]: data
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    }, 1000),
    [formName]
  );

  useEffect(() => {
    if (formData) {
      saveProgress(formData);
    }
    return () => saveProgress.cancel();
  }, [formData, saveProgress]);

  return null;
};