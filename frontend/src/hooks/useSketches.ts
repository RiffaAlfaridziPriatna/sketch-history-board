import { useState, useEffect, useCallback } from 'react';
import { SketchVersion } from '@/types';
import { serviceContainer } from '@/services/ServiceContainer';

export const useSketches = () => {
  const [sketches, setSketches] = useState<SketchVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sketchService = serviceContainer.getSketchService();

  const loadSketches = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await sketchService.getAllSketchVersions();
      setSketches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sketches');
    } finally {
      setLoading(false);
    }
  }, [sketchService]);

  const saveSketch = useCallback(async (sketch: Omit<SketchVersion, 'id' | 'createdAt' | 'updatedAt'> | (Partial<SketchVersion> & { id: string })) => {
    setLoading(true);
    setError(null);
    
    try {
      if ('id' in sketch) {
        const updatedSketch = await sketchService.updateSketchVersion(sketch.id, sketch);
        setSketches(prev => prev.map(s => s.id === sketch.id ? updatedSketch : s));
        return updatedSketch;
      } else {
        const newSketch = await sketchService.createSketchVersion(sketch);
        setSketches(prev => [newSketch, ...prev]);
        return newSketch;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save sketch');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [sketchService]);

  const loadSketch = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const sketch = await sketchService.getSketchVersion(id);
      return sketch;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sketch');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [sketchService]);

  const deleteSketch = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await sketchService.deleteSketchVersion(id);
      setSketches(prev => prev.filter(sketch => sketch.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete sketch');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [sketchService]);

  useEffect(() => {
    loadSketches();
  }, [loadSketches]);

  return {
    sketches,
    loading,
    error,
    loadSketches,
    saveSketch,
    loadSketch,
    deleteSketch,
  };
};
