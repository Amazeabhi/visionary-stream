import { useState, useCallback } from 'react';
import { VideoStream } from '@/components/VideoStream';
import { StatsGrid } from '@/components/StatsGrid';
import { DetectionHistory } from '@/components/DetectionHistory';
import { ControlPanel } from '@/components/ControlPanel';
import { useObjectDetection } from '@/hooks/useObjectDetection';
import { useWebcam } from '@/hooks/useWebcam';
import { Scan, Github, Shield, Zap } from 'lucide-react';

const Index = () => {
  // Higher default threshold (0.6) for better accuracy, reducing false positives
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.6);
  const [detectionInterval, setDetectionInterval] = useState(150);

  const objectDetection = useObjectDetection({
    confidenceThreshold,
    detectionInterval,
  });

  const { devices, currentDeviceId, switchCamera } = useWebcam();

  const handleDetectionToggle = useCallback((enabled: boolean) => {
    if (enabled) {
      objectDetection.startDetection();
    } else {
      objectDetection.stopDetection();
    }
  }, [objectDetection]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 glass-strong sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Scan className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-primary border-2 border-background" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl tracking-wider">VISIONAI</h1>
                <p className="text-xs text-muted-foreground">Real-time Object Detection</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Browser-based ML</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-4 h-4 text-primary" />
                <span>COCO-SSD Model</span>
              </div>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Video and Stats */}
          <div className="lg:col-span-2 space-y-6">
            <VideoStream
              confidenceThreshold={confidenceThreshold}
              detectionInterval={detectionInterval}
              onDetectionsUpdate={objectDetection}
            />
            
            <StatsGrid stats={objectDetection.stats} />
          </div>

          {/* Right Column - Controls and History */}
          <div className="space-y-6">
            <ControlPanel
              confidenceThreshold={confidenceThreshold}
              detectionInterval={detectionInterval}
              isDetecting={objectDetection.isDetecting}
              devices={devices}
              currentDeviceId={currentDeviceId}
              onThresholdChange={setConfidenceThreshold}
              onIntervalChange={setDetectionInterval}
              onDetectionToggle={handleDetectionToggle}
              onDeviceChange={switchCamera}
            />

            <div className="h-[400px]">
              <DetectionHistory
                logs={objectDetection.detectionLogs}
                onExport={objectDetection.exportLogs}
                onClear={objectDetection.clearLogs}
              />
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: '🎯',
              title: '80+ Object Classes',
              description: 'Detect persons, vehicles, animals, and common objects',
            },
            {
              icon: '⚡',
              title: 'Real-time Processing',
              description: 'Browser-based ML with TensorFlow.js',
            },
            {
              icon: '📊',
              title: 'Detection Logs',
              description: 'Export detection history as JSON',
            },
            {
              icon: '🔒',
              title: 'Privacy First',
              description: 'All processing happens locally in your browser',
            },
          ].map((feature, index) => (
            <div
              key={feature.title}
              className="glass rounded-xl p-5 border border-border/30 hover:border-primary/30 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-2xl mb-3">{feature.icon}</div>
              <h3 className="font-display font-semibold text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built with TensorFlow.js & COCO-SSD • React + TypeScript
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
