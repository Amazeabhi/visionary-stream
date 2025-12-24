import { useState, useRef, useCallback, useEffect } from 'react';
import type { Detection, DetectionLog, DetectionStats } from '@/types/detection';
import { getDetectionCategory } from '@/types/detection';

interface UseObjectDetectionOptions {
  confidenceThreshold: number;
  detectionInterval: number;
}

// Placeholder type for the model
type DetectionModel = {
  detect: (video: HTMLVideoElement) => Promise<Array<{
    class: string;
    score: number;
    bbox: [number, number, number, number];
  }>>;
} | null;

export function useObjectDetection(options: UseObjectDetectionOptions) {
  const [model, setModel] = useState<DetectionModel>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
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
  
  useEffect(() => {
    isDetectingRef.current = isDetecting;
  }, [isDetecting]);

  // Load model with better error handling
  useEffect(() => {
    let mounted = true;
    
    const loadModel = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        // Dynamically import TensorFlow and COCO-SSD
        const [tf, cocoSsd] = await Promise.all([
          import('@tensorflow/tfjs'),
          import('@tensorflow-models/coco-ssd')
        ]);
        
        await tf.ready();
        
        if (!mounted) return;
        
        const loadedModel = await cocoSsd.load({
          base: 'lite_mobilenet_v2',
        });
        
        if (mounted) {
          setModel(loadedModel);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load model:', error);
        if (mounted) {
          setLoadError(error instanceof Error ? error.message : 'Failed to load AI model');
          setIsLoading(false);
        }
      }
    };
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(loadModel, 100);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  const detect = useCallback(async (video: HTMLVideoElement): Promise<Detection[]> => {
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

      fpsCountRef.current++;
      const now = Date.now();
      if (now - lastFpsUpdateRef.current >= 1000) {
        setStats(prev => ({ ...prev, fps: fpsCountRef.current }));
        fpsCountRef.current = 0;
        lastFpsUpdateRef.current = now;
      }

      setCurrentDetections(detections);

      if (detections.length > 0) {
        frameCountRef.current++;
        const log: DetectionLog = {
          id: `log-${Date.now()}`,
          detections,
          timestamp: new Date(),
          frameNumber: frameCountRef.current,
        };
        
        setDetectionLogs(prev => [log, ...prev].slice(0, 100));

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
    loadError,
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
