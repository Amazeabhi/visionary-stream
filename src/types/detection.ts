export interface Detection {
  id: string;
  class: string;
  score: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
  timestamp: Date;
  category: 'person' | 'vehicle' | 'animal' | 'object';
}

export interface DetectionLog {
  id: string;
  detections: Detection[];
  timestamp: Date;
  frameNumber: number;
}

export interface DetectionStats {
  totalDetections: number;
  personCount: number;
  vehicleCount: number;
  animalCount: number;
  objectCount: number;
  fps: number;
  avgConfidence: number;
}

export const PERSON_CLASSES = ['person'];
export const VEHICLE_CLASSES = ['car', 'truck', 'bus', 'motorcycle', 'bicycle', 'airplane', 'boat', 'train'];
export const ANIMAL_CLASSES = ['bird', 'cat', 'dog', 'horse', 'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe'];

export function getDetectionCategory(className: string): Detection['category'] {
  if (PERSON_CLASSES.includes(className)) return 'person';
  if (VEHICLE_CLASSES.includes(className)) return 'vehicle';
  if (ANIMAL_CLASSES.includes(className)) return 'animal';
  return 'object';
}

export function getCategoryColor(category: Detection['category']): string {
  switch (category) {
    case 'person': return 'hsl(174, 72%, 56%)';
    case 'vehicle': return 'hsl(38, 92%, 50%)';
    case 'animal': return 'hsl(142, 70%, 50%)';
    case 'object': return 'hsl(280, 70%, 60%)';
  }
}

export function getCategoryTailwind(category: Detection['category']): string {
  switch (category) {
    case 'person': return 'border-detection-person bg-detection-person/20 text-detection-person';
    case 'vehicle': return 'border-detection-vehicle bg-detection-vehicle/20 text-detection-vehicle';
    case 'animal': return 'border-detection-animal bg-detection-animal/20 text-detection-animal';
    case 'object': return 'border-detection-object bg-detection-object/20 text-detection-object';
  }
}
