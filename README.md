# ⚡️ Hand-Controlled Interactive 3D Party

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![MediaPipe](https://img.shields.io/badge/MediaPipe-0075FF?style=for-the-badge&logo=google-lens&logoColor=white)

A creative "Weekend Project" exploring the intersection of computer vision and 3D web graphics. This application uses your webcam to track your hands in real-time, allowing you to interact with 3D objects, draw in mid-air, and trigger particle effects using natural gestures.

> **Inspiration:** Highly inspired by the generative audio-visual work of [CollidingScopes](https://github.com/collidingScopes).

## ✨ Features

### 🖐 AI Hand Tracking
Powered by **Google MediaPipe Hands**, the app tracks your finger coordinates directly in the browser with low latency. No extra hardware required—just a webcam.
- **Privacy First**: All video processing happens locally on your device. No video is ever sent to a server.

### 🪩 Party Mode
The default immersive experience.
- **Interactive Geometries**: Grab and resize 3D shapes (Spheres, Cubes, Toruts) by pinching.
- **Gesture Fireworks**: Pinch and release to launch vibrant firework explosions.
- **Dynamic Lighting**: The scene reacts to the mood, with pulsing lights and "Dance Mode" effects.
- **Music**: Integrated audio player for ambient party vibes.

### ✍️ Air Drawing Mode
Unleash your creativity in 3D space.
- **Pinch to Draw**: Pinch your thumb and index finger to create glowing trails of light.
- **Smoothing Algorithms**: Custom LERP (Linear Interpolation) logic ensures your strokes look silky smooth, removing webcam jitter.

### 🧠 Neural Portfolio (Experimental)
A conceptual 3D visualization of skills and projects.
- *Note: This feature is currently disabled (dormant) in the main branch but showcases dynamic node expansion logic.*

## 🛠️ Tech Stack

*   **Core**: React, Vite
*   **3D Engine**: Three.js, @react-three/fiber, @react-three/drei
*   **Computer Vision**: Google MediaPipe Hands
*   **Styling**: CSS Modules, Custom Animations

## 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yashbh/hand-tracking.git
    cd hand-tracking
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  **Allow Camera Access**: When prompted, allow the browser to access your webcam to enable hand tracking.

## 🎮 How to Interact

| Action | Gesture |
| :--- | :--- |
| **Move Cursor** | Move your index finger. |
| **Interact / Grab** | Pinch your **Thumb** and **Index Finger** together. |
| **Draw (in Drawing Mode)** | Pinch and move your hand to paint trails. |
| **Launch Firework** | Pinch and quickly release ("throw") the gesture. |

---

*Built with ❤️ by Yash Bhati*
