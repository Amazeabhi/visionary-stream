import { DetectionLog } from '@/types/detection';
import { getCategoryTailwind } from '@/types/detection';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, FileJson } from 'lucide-react';

interface DetectionHistoryProps {
  logs: DetectionLog[];
  onExport: () => void;
  onClear: () => void;
}

export function DetectionHistory({ logs, onExport, onClear }: DetectionHistoryProps) {
  return (
    <div className="glass rounded-xl border border-border/50 h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold text-sm">Detection History</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onExport}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
          >
            <FileJson className="w-3 h-3" />
            Export
          </button>
          <button
            onClick={onClear}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
              <Clock className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No detections yet</p>
            <p className="text-xs text-muted-foreground/70">Start streaming to see detections</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-secondary/30 border border-border/30 animate-slide-in-right"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">
                    Frame #{log.frameNumber}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {log.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {log.detections.map((detection) => (
                    <span
                      key={detection.id}
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getCategoryTailwind(detection.category)}`}
                    >
                      {detection.class} {Math.round(detection.score * 100)}%
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
