import { useState, useRef, useCallback, useEffect } from 'react';

interface UseWebcamOptions {
  width?: number;
  height?: number;
}

export function useWebcam(options: UseWebcamOptions = {}) {
  const { width = 640, height = 480 } = options;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Get available video devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
      } catch (err) {
        console.error('Failed to enumerate devices:', err);
      }
    };
    getDevices();
  }, []);

  const startStream = useCallback(async (deviceId?: string) => {
    try {
      setError(null);
      
      // Stop existing stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode: 'environment',
          ...(deviceId && { deviceId: { exact: deviceId } }),
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsStreaming(true);
        setCurrentDeviceId(deviceId || stream.getVideoTracks()[0]?.getSettings().deviceId || null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access camera';
      setError(errorMessage);
      setIsStreaming(false);
    }
  }, [width, height]);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  const switchCamera = useCallback(async (deviceId: string) => {
    await startStream(deviceId);
  }, [startStream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    videoRef,
    isStreaming,
    error,
    devices,
    currentDeviceId,
    startStream,
    stopStream,
    switchCamera,
  };
}
