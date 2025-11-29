# ML/AI Integration Plan

## Overview
Implementation of pre-trained models for Health Navigator Pro, covering Computer Vision (Face/Eye/Teeth), Multilingual Chat, and Speech services.

## User Review Required
> [!IMPORTANT]
> **Technology Choice**: You requested structures for both JS and Python.
> - **JavaScript (Node.js)**: Best for keeping a single language stack (MERN). Good for IO-heavy tasks (Chat/Speech APIs). *Note: MediaPipe is optimized for Browser (Frontend) or Python (Backend). Node.js support for MediaPipe is experimental/limited compared to Python.*
> - **Python**: The industry standard for ML/Computer Vision. Best library support for MediaPipe, TensorFlow, and OpenCV. Recommended if doing heavy image processing on the backend.
>
> **Recommendation**: 
> 1. **Vision (Face/Eye/Teeth)**: Run in **Frontend (React/JS)** using MediaPipe JS for real-time feedback, OR use **Python Backend** for high-accuracy analysis of uploaded photos.
> 2. **Chat/Speech**: Run in **Node.js Backend** (easy API integration).

Below are the structures for both approaches as requested.

---

## Option A: JavaScript Structure (Node.js Backend)

This structure integrates directly into your existing `Backend` folder.

```text
Backend/
├── ml/
│   ├── face/
│   │   ├── FaceLandmarks.js       # Class for MediaPipe FaceMesh
│   │   └── FacePreprocess.js      # Image resizing/normalization
│   ├── eyes/
│   │   ├── EyeCrop.js             # Extract eye region
│   │   ├── RednessDetector.js     # TF.js model / HSV logic
│   │   ├── FatigueDetector.js     # EAR (Eye Aspect Ratio) logic
│   │   └── CataractModel.js       # TF Hub model wrapper
│   ├── teeth/
│   │   ├── TeethCrop.js           # Extract mouth region
│   │   └── TeethHygiene.js        # Brightness/Edge detection
│   ├── speech/
│   │   ├── SttWhisper.js          # OpenAI Whisper wrapper
│   │   └── SttGoogle.js           # Google Cloud Speech wrapper
│   ├── tts/
│   │   ├── TtsOpenAI.js           # OpenAI TTS wrapper
│   │   └── TtsGoogle.js           # Google Cloud TTS wrapper
│   └── chat/
│       └── GeminiChat.js          # Gemini 2.0 Flash wrapper
├── api/
│   ├── scan.controller.js         # Handles image upload & analysis
│   ├── chat.controller.js         # Handles text/voice chat
│   └── speech.controller.js       # Handles STT/TTS requests
├── services/
│   ├── fileUpload.js              # Multer config
│   └── preprocess.js              # Shared image utils
├── routes/
│   └── ml.route.js                # API endpoints
└── index.js                       # Main entry (existing)
```

### Key Dependencies (JS)
- `@google/generative-ai` (Gemini)
- `openai` (Whisper/TTS)
- `@google-cloud/speech` & `@google-cloud/text-to-speech`
- `@tensorflow/tfjs-node` (TensorFlow for Node)
- `canvas` (Image manipulation for Node)
- *Note: MediaPipe for Node.js is not officially supported. We might need to use a Python script called from Node or use TF.js models.*

---

## Option B: Python Structure (Microservice)

A separate Flask/FastAPI service dedicated to ML tasks. Best for MediaPipe/OpenCV.

```text
ml_service/
├── ml/
│   ├── __init__.py
│   ├── face/
│   │   ├── face_landmarks.py      # Class FaceLandmarks
│   │   └── face_preprocess.py     # Class FacePreprocess
│   ├── eyes/
│   │   ├── eye_crop.py
│   │   ├── redness_detector.py
│   │   ├── fatigue_detector.py
│   │   └── cataract_model.py
│   ├── teeth/
│   │   ├── teeth_crop.py
│   │   └── teeth_hygiene.py
│   ├── speech/
│   │   ├── stt_whisper.py
│   │   └── stt_google.py
│   ├── tts/
│   │   ├── tts_openai.py
│   │   └── tts_google.py
│   └── chat/
│       └── gemini_chat.py
├── api/
│   ├── scan_controller.py
│   ├── chat_controller.py
│   └── speech_controller.py
├── services/
│   ├── file_upload.py
│   └── preprocess.py
├── app.py                         # Main Flask/FastAPI app
├── routes.py
└── requirements.txt
```

### Key Dependencies (Python)
- `mediapipe` (Excellent support)
- `tensorflow`
- `opencv-python`
- `google-generativeai`
- `openai`
- `google-cloud-speech`

---

## Proposed Class Architecture (Example: JS)

We will use a **Class-Based Approach** as requested.

### 1. Base Model Class
```javascript
class BaseModel {
    constructor(config) {
        this.config = config;
        this.model = null;
    }
    async load() { throw new Error("Method not implemented"); }
    async predict(input) { throw new Error("Method not implemented"); }
}
```

### 2. Face Landmarks (Vision)
```javascript
class FaceLandmarks extends BaseModel {
    async load() {
        // Load MediaPipe FaceMesh
    }
    async getLandmarks(imageBuffer) {
        // Return 468 landmarks
    }
}
```

### 3. Redness Detector (Logic)
```javascript
class RednessDetector {
    analyze(eyeImage) {
        // HSV Color analysis
        // Return redness score (0-100)
    }
}
```

### 4. Gemini Chat (LLM)
```javascript
class GeminiChat {
    constructor(apiKey) { ... }
    async sendMessage(history, message, language) {
        // Handle multilingual context
        // Return response
    }
}
```

---

## Next Steps
1. **Select Architecture**: 
   - **Option A (JS)**: Easier integration, but Vision might be tricky on Backend (better on Frontend).
   - **Option B (Python)**: Robust Vision support, requires running a second server.
   
   *My suggestion: Use **Option A** but move the "Vision" folders (`face`, `eyes`, `teeth`) to the **Frontend (`src/ml`)** to use MediaPipe JS directly in the browser. Keep `chat` and `speech` in the **Backend (`Backend/ml`)**.*

2. **Install Dependencies**: Based on selection.
3. **Implement Classes**: Create the folder structure and files.
