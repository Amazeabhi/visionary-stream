import { DetectionStats } from '@/types/detection';
import { Users, Car, PawPrint, Box, Activity, Target } from 'lucide-react';

interface StatsGridProps {
  stats: DetectionStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statItems = [
    {
      label: 'Total Detections',
      value: stats.totalDetections,
      icon: Target,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
    },
    {
      label: 'Persons',
      value: stats.personCount,
      icon: Users,
      color: 'text-detection-person',
      bgColor: 'bg-detection-person/10',
      borderColor: 'border-detection-person/30',
    },
    {
      label: 'Vehicles',
      value: stats.vehicleCount,
      icon: Car,
      color: 'text-detection-vehicle',
      bgColor: 'bg-detection-vehicle/10',
      borderColor: 'border-detection-vehicle/30',
    },
    {
      label: 'Animals',
      value: stats.animalCount,
      icon: PawPrint,
      color: 'text-detection-animal',
      bgColor: 'bg-detection-animal/10',
      borderColor: 'border-detection-animal/30',
    },
    {
      label: 'Objects',
      value: stats.objectCount,
      icon: Box,
      color: 'text-detection-object',
      bgColor: 'bg-detection-object/10',
      borderColor: 'border-detection-object/30',
    },
    {
      label: 'FPS',
      value: stats.fps,
      icon: Activity,
      color: 'text-foreground',
      bgColor: 'bg-muted/50',
      borderColor: 'border-muted',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {statItems.map((item) => (
        <div
          key={item.label}
          className={`glass rounded-lg p-4 border ${item.borderColor} animate-fade-in`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${item.bgColor}`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-2xl font-display font-bold tabular-nums">{item.value.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
