# ML Integration Plan

## Overview
Connect the newly created `ml/js` stack to the existing Backend and Frontend.

## Backend Integration
1.  **Dependencies**: Install `openai`, `@google/generative-ai`, `@google-cloud/speech`, `@google-cloud/text-to-speech`.
2.  **Controller**: Create `Backend/controllers/ml.controller.js` to wrap the ML classes.
3.  **Routes**: Create `Backend/routes/ml.route.js` to expose endpoints:
    *   `POST /api/ml/analyze-face`
    *   `POST /api/ml/analyze-eyes`
    *   `POST /api/ml/chat`
    *   `POST /api/ml/stt`
    *   `POST /api/ml/tts`
4.  **Entry Point**: Register routes in `Backend/index.js`.

## Frontend Integration
1.  **Scanner.jsx**: Update to call `/api/ml/analyze-*` endpoints.
2.  **Chat.jsx**: Update to call `/api/ml/chat`.

## API Keys
> [!IMPORTANT]
> You must add the following keys to your `Backend/.env` file:
> - `OPENAI_API_KEY`
> - `GEMINI_API_KEY`
> - `GOOGLE_APPLICATION_CREDENTIALS` (path to JSON file)

---

## Step 1: Backend Dependencies
Run: `npm install openai @google/generative-ai @google-cloud/speech @google-cloud/text-to-speech` in `Backend/`.

## Step 2: ML Controller
Create `Backend/controllers/ml.controller.js`.

## Step 3: ML Routes
Create `Backend/routes/ml.route.js`.

## Step 4: Register Routes
Update `Backend/index.js`.
