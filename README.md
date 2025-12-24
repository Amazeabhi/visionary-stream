# VisionAI - Real-time Object Detection

A browser-based real-time object detection application powered by TensorFlow.js and the COCO-SSD model. All processing happens locally in your browser – no data is sent to any server.

![VisionAI](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Features

- **🎯 80+ Object Classes** - Detect persons, vehicles, animals, and common everyday objects
- **⚡ Real-time Processing** - Smooth detection powered by TensorFlow.js running entirely in your browser
- **📊 Detection Logs** - View detection history and export as JSON for analysis
- **🔒 Privacy First** - All processing happens locally; no images or data leave your device
- **🎛️ Adjustable Settings** - Fine-tune confidence threshold and detection interval
- **📱 Multi-camera Support** - Switch between available cameras on your device

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or bun

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Navigate to the project directory
cd <project-name>

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [React](https://react.dev/) | UI Framework |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety |
| [Vite](https://vitejs.dev/) | Build Tool |
| [TensorFlow.js](https://www.tensorflow.org/js) | Machine Learning |
| [COCO-SSD](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) | Object Detection Model |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [shadcn/ui](https://ui.shadcn.com/) | UI Components |

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── ControlPanel.tsx    # Detection settings controls
│   ├── DetectionCanvas.tsx # Bounding box overlay
│   ├── DetectionHistory.tsx# Detection log viewer
│   ├── StatsGrid.tsx       # Real-time statistics
│   └── VideoStream.tsx     # Camera stream handler
├── hooks/
│   ├── useObjectDetection.ts # TensorFlow.js detection logic
│   └── useWebcam.ts        # Webcam access management
├── pages/
│   └── Index.tsx           # Main application page
├── types/
│   └── detection.ts        # TypeScript interfaces
└── index.css               # Global styles & design tokens
```

## 🎮 Usage

1. **Start the camera** - Click the "Start Camera" button to enable your webcam
2. **Enable detection** - Toggle detection on using the control panel
3. **Adjust settings** - Fine-tune the confidence threshold (0.1–1.0) and detection interval
4. **View results** - See real-time bounding boxes, statistics, and detection history
5. **Export logs** - Download your detection history as a JSON file

## 🔧 Configuration

### Confidence Threshold
- **Range**: 0.1 to 1.0
- **Default**: 0.6
- Higher values reduce false positives but may miss some detections

### Detection Interval
- **Range**: 50ms to 1000ms
- **Default**: 150ms
- Lower values increase responsiveness but use more CPU

## 📦 Detected Object Categories

| Category | Examples |
|----------|----------|
| **Person** | person |
| **Vehicles** | car, truck, bus, motorcycle, bicycle, airplane, boat, train |
| **Animals** | bird, cat, dog, horse, sheep, cow, elephant, bear, zebra, giraffe |
| **Objects** | All other COCO-SSD classes (80+ total) |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using TensorFlow.js & React
