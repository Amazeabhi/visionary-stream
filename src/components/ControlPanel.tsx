import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings, Gauge, Timer, Camera } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ControlPanelProps {
  confidenceThreshold: number;
  detectionInterval: number;
  isDetecting: boolean;
  devices: MediaDeviceInfo[];
  currentDeviceId: string | null;
  onThresholdChange: (value: number) => void;
  onIntervalChange: (value: number) => void;
  onDetectionToggle: (enabled: boolean) => void;
  onDeviceChange: (deviceId: string) => void;
}

export function ControlPanel({
  confidenceThreshold,
  detectionInterval,
  isDetecting,
  devices,
  currentDeviceId,
  onThresholdChange,
  onIntervalChange,
  onDetectionToggle,
  onDeviceChange,
}: ControlPanelProps) {
  return (
    <div className="glass rounded-xl border border-border/50 p-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-4 h-4 text-primary" />
        <h3 className="font-display font-semibold text-sm">Detection Settings</h3>
      </div>

      <div className="space-y-5">
        {/* Detection Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isDetecting ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
            <Label htmlFor="detection-toggle" className="text-sm">
              Detection Active
            </Label>
          </div>
          <Switch
            id="detection-toggle"
            checked={isDetecting}
            onCheckedChange={onDetectionToggle}
          />
        </div>

        {/* Camera Selection */}
        {devices.length > 1 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm">Camera</Label>
            </div>
            <Select value={currentDeviceId || ''} onValueChange={onDeviceChange}>
              <SelectTrigger className="w-full bg-secondary/50 border-border/50">
                <SelectValue placeholder="Select camera" />
              </SelectTrigger>
              <SelectContent>
                {devices.map((device, index) => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${index + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Confidence Threshold */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm">Confidence Threshold</Label>
            </div>
            <span className="text-sm font-mono text-primary">
              {Math.round(confidenceThreshold * 100)}%
            </span>
          </div>
          <Slider
            value={[confidenceThreshold]}
            onValueChange={([value]) => onThresholdChange(value)}
            min={0.1}
            max={0.9}
            step={0.05}
            className="w-full"
          />
        </div>

        {/* Detection Interval */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm">Detection Interval</Label>
            </div>
            <span className="text-sm font-mono text-primary">
              {detectionInterval}ms
            </span>
          </div>
          <Slider
            value={[detectionInterval]}
            onValueChange={([value]) => onIntervalChange(value)}
            min={50}
            max={500}
            step={50}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
