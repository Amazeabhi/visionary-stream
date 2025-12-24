# Object Detection Web App

<p align="center">
  <a href="https://object-detection.lovable.app" target="_blank">
    <img src="https://img.shields.io/badge/🚀 Launch%20App-blue?style=for-the-badge" />
  </a>
</p>

## 📌 Project Info
A web-based object detection application built using modern web technologies.

## 🛠️ Tech Stack
- Vite  
- TypeScript  
- React  
- Tailwind CSS  
- shadcn-ui  

## 🚀 Run Locally

Make sure you have Node.js and npm installed.

```sh
# Clone the repository
git clone <YOUR_REPO_URL>

# Go to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev


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
