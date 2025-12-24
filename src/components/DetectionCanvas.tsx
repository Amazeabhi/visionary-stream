import { useRef, useEffect } from 'react';
import { Detection, getCategoryColor } from '@/types/detection';

interface DetectionCanvasProps {
  detections: Detection[];
  videoWidth: number;
  videoHeight: number;
}

export function DetectionCanvas({ detections, videoWidth, videoHeight }: DetectionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw detections
    detections.forEach(detection => {
      const [x, y, width, height] = detection.bbox;
      const color = getCategoryColor(detection.category);

      // Draw bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Draw corner accents
      const cornerLength = Math.min(15, width / 4, height / 4);
      ctx.lineWidth = 3;

      // Top-left
      ctx.beginPath();
      ctx.moveTo(x, y + cornerLength);
      ctx.lineTo(x, y);
      ctx.lineTo(x + cornerLength, y);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(x + width - cornerLength, y);
      ctx.lineTo(x + width, y);
      ctx.lineTo(x + width, y + cornerLength);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(x, y + height - cornerLength);
      ctx.lineTo(x, y + height);
      ctx.lineTo(x + cornerLength, y + height);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(x + width - cornerLength, y + height);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x + width, y + height - cornerLength);
      ctx.stroke();

      // Draw label background
      const label = `${detection.class} ${Math.round(detection.score * 100)}%`;
      ctx.font = 'bold 12px Inter, sans-serif';
      const textMetrics = ctx.measureText(label);
      const textHeight = 16;
      const padding = 4;

      ctx.fillStyle = color;
      ctx.fillRect(
        x,
        y - textHeight - padding * 2,
        textMetrics.width + padding * 2,
        textHeight + padding * 2
      );

      // Draw label text
      ctx.fillStyle = '#0a0f1a';
      ctx.fillText(label, x + padding, y - padding - 2);

      // Draw glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, width, height);
      ctx.shadowBlur = 0;
    });
  }, [detections]);

  return (
    <canvas
      ref={canvasRef}
      width={videoWidth}
      height={videoHeight}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
