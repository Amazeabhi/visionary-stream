import { useRef, useEffect, useState } from 'react';
import { useWebcam } from '@/hooks/useWebcam';
import { useObjectDetection } from '@/hooks/useObjectDetection';
import { DetectionCanvas } from './DetectionCanvas';
import { Video, VideoOff, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoStreamProps {
  confidenceThreshold: number;
  detectionInterval: number;
  onDetectionsUpdate: ReturnType<typeof useObjectDetection>;
}

export function VideoStream({ confidenceThreshold, detectionInterval, onDetectionsUpdate }: VideoStreamProps) {
  const { videoRef, isStreaming, error, devices, currentDeviceId, startStream, stopStream, switchCamera } = useWebcam({
    width: 640,
    height: 480,
  });
  
  const { isLoading, isDetecting, currentDetections, detect, startDetection, stopDetection } = onDetectionsUpdate;
  const [videoSize, setVideoSize] = useState({ width: 640, height: 480 });
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Update video size on load
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleLoadedMetadata = () => {
        setVideoSize({ width: video.videoWidth, height: video.videoHeight });
      };
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    }
  }, [videoRef]);

  // Run detection loop
  useEffect(() => {
    if (isDetecting && isStreaming && videoRef.current) {
      intervalRef.current = setInterval(() => {
        detect(videoRef.current!);
      }, detectionInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isDetecting, isStreaming, detect, detectionInterval]);

  const handleToggleStream = async () => {
    if (isStreaming) {
      stopStream();
      stopDetection();
    } else {
      await startStream();
    }
  };

  return (
    <div className="glass rounded-xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className={`relative ${isStreaming ? 'animate-pulse-glow' : ''}`}>
            <div className={`w-3 h-3 rounded-full ${isStreaming ? 'bg-primary' : 'bg-muted-foreground'}`} />
            {isStreaming && (
              <div className="absolute inset-0 w-3 h-3 rounded-full bg-primary animate-pulse-ring" />
            )}
          </div>
          <h2 className="font-display font-semibold">
            {isStreaming ? 'Live Stream' : 'Camera Offline'}
          </h2>
          {isLoading && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" />
              Loading AI Model...
            </span>
          )}
        </div>
        <Button
          variant={isStreaming ? 'destructive' : 'default'}
          size="sm"
          onClick={handleToggleStream}
          disabled={isLoading}
          className="font-medium"
        >
          {isStreaming ? (
            <>
              <VideoOff className="w-4 h-4 mr-2" />
              Stop
            </>
          ) : (
            <>
              <Video className="w-4 h-4 mr-2" />
              Start Camera
            </>
          )}
        </Button>
      </div>

      {/* Video Container */}
      <div 
        ref={containerRef}
        className="relative aspect-video bg-secondary/20"
      >
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-destructive font-medium mb-2">Camera Access Error</p>
            <p className="text-sm text-muted-foreground max-w-sm">{error}</p>
          </div>
        ) : !isStreaming ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center">
                <Video className="w-12 h-12 text-primary/40" />
              </div>
              <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-primary/20 border-dashed animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <p className="text-muted-foreground mb-1">Camera is offline</p>
            <p className="text-sm text-muted-foreground/70">Click "Start Camera" to begin detection</p>
          </div>
        ) : null}

        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${!isStreaming ? 'hidden' : ''}`}
          playsInline
          muted
        />
        
        {isStreaming && (
          <>
            <DetectionCanvas 
              detections={currentDetections} 
              videoWidth={videoSize.width}
              videoHeight={videoSize.height}
            />
            
            {/* Scanning overlay effect */}
            {isDetecting && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
              </div>
            )}

            {/* Detection count badge */}
            {currentDetections.length > 0 && (
              <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full glass border border-primary/30 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">
                  {currentDetections.length} detected
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
