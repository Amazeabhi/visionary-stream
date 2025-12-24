import { useState, useRef, useCallback, useEffect } from 'react';
import type { Detection, DetectionLog, DetectionStats } from '@/types/detection';
import { getDetectionCategory } from '@/types/detection';

// Dynamic import types
type CocoSsdModel = {
  detect: (video: HTMLVideoElement) => Promise<Array<{
    class: string;
    score: number;
    bbox: [number, number, number, number];
  }>>;
};

interface UseObjectDetectionOptions {
  confidenceThreshold: number;
  detectionInterval: number;
}

export function useObjectDetection(options: UseObjectDetectionOptions) {
  const [model, setModel] = useState<CocoSsdModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentDetections, setCurrentDetections] = useState<Detection[]>([]);
  const [detectionLogs, setDetectionLogs] = useState<DetectionLog[]>([]);
  const [stats, setStats] = useState<DetectionStats>({
    totalDetections: 0,
    personCount: 0,
    vehicleCount: 0,
    animalCount: 0,
    objectCount: 0,
    fps: 0,
    avgConfidence: 0,
  });
  
  const frameCountRef = useRef(0);
  const lastFpsUpdateRef = useRef(Date.now());
  const fpsCountRef = useRef(0);
  const isDetectingRef = useRef(false);
  
  // Keep ref in sync with state
  useEffect(() => {
    isDetectingRef.current = isDetecting;
  }, [isDetecting]);

  // Load COCO-SSD model dynamically to avoid build issues
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        // Dynamic imports to avoid build issues with TensorFlow
        await import('@tensorflow/tfjs');
        const cocoSsd = await import('@tensorflow-models/coco-ssd');
        const loadedModel = await cocoSsd.load({
          base: 'mobilenet_v2',
        });
        setModel(loadedModel as CocoSsdModel);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load model:', error);
        setIsLoading(false);
      }
    };
    loadModel();
  }, []);

  const detect = useCallback(async (video: HTMLVideoElement): Promise<Detection[]> => {
    // Guard against stale closures - check ref, not state
    if (!isDetectingRef.current || !model || !video || video.readyState !== 4) return [];

    try {
      const predictions = await model.detect(video);
      
      const detections: Detection[] = predictions
        .filter(pred => pred.score >= options.confidenceThreshold)
        .map(pred => ({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          class: pred.class,
          score: pred.score,
          bbox: pred.bbox as [number, number, number, number],
          timestamp: new Date(),
          category: getDetectionCategory(pred.class),
        }));

      // Update FPS
      fpsCountRef.current++;
      const now = Date.now();
      if (now - lastFpsUpdateRef.current >= 1000) {
        setStats(prev => ({ ...prev, fps: fpsCountRef.current }));
        fpsCountRef.current = 0;
        lastFpsUpdateRef.current = now;
      }

      // Update current detections
      setCurrentDetections(detections);

      // Log detections if any found
      if (detections.length > 0) {
        frameCountRef.current++;
        const log: DetectionLog = {
          id: `log-${Date.now()}`,
          detections,
          timestamp: new Date(),
          frameNumber: frameCountRef.current,
        };
        
        setDetectionLogs(prev => [log, ...prev].slice(0, 100));

        // Update stats
        setStats(prev => {
          const personCount = detections.filter(d => d.category === 'person').length;
          const vehicleCount = detections.filter(d => d.category === 'vehicle').length;
          const animalCount = detections.filter(d => d.category === 'animal').length;
          const objectCount = detections.filter(d => d.category === 'object').length;
          const avgConfidence = detections.reduce((sum, d) => sum + d.score, 0) / detections.length;

          return {
            ...prev,
            totalDetections: prev.totalDetections + detections.length,
            personCount: prev.personCount + personCount,
            vehicleCount: prev.vehicleCount + vehicleCount,
            animalCount: prev.animalCount + animalCount,
            objectCount: prev.objectCount + objectCount,
            avgConfidence: avgConfidence * 100,
          };
        });
      }

      return detections;
    } catch (error) {
      console.error('Detection error:', error);
      return [];
    }
  }, [model, options.confidenceThreshold]);

  const startDetection = useCallback(() => {
    setIsDetecting(true);
  }, []);

  const stopDetection = useCallback(() => {
    setIsDetecting(false);
    setCurrentDetections([]);
  }, []);

  const clearLogs = useCallback(() => {
    setDetectionLogs([]);
    setStats({
      totalDetections: 0,
      personCount: 0,
      vehicleCount: 0,
      animalCount: 0,
      objectCount: 0,
      fps: 0,
      avgConfidence: 0,
    });
    frameCountRef.current = 0;
  }, []);

  const exportLogs = useCallback(() => {
    const exportData = {
      exportDate: new Date().toISOString(),
      totalLogs: detectionLogs.length,
      stats,
      logs: detectionLogs.map(log => ({
        timestamp: log.timestamp.toISOString(),
        frameNumber: log.frameNumber,
        detections: log.detections.map(d => ({
          class: d.class,
          category: d.category,
          confidence: Math.round(d.score * 100),
          bbox: d.bbox,
        })),
      })),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `detection-log-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [detectionLogs, stats]);

  return {
    model,
    isLoading,
    isDetecting,
    currentDetections,
    detectionLogs,
    stats,
    detect,
    startDetection,
    stopDetection,
    clearLogs,
    exportLogs,
  };
}
