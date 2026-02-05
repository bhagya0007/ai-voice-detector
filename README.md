# AI Voice Detector System

A secure REST API and React frontend to detect whether an audio sample is AI-generated or Human.

## Project Structure

- `frontend/`: React + Tailwind web interface (Root directory files).
- `backend/`: Python FastAPI application with Librosa audio processing.

## 🚀 Getting Started

### 1. Backend Setup (Python)

Navigate to the backend directory and install dependencies:

```bash
cd backend
pip install -r requirements.txt
```

Run the API server:

```bash
python main.py
```

The server will start at `http://0.0.0.0:8000`.

### 2. Frontend Setup (React)

Install dependencies and run the development server:

```bash
npm install
npm start
```

### 3. Usage

1. Open the web interface.
2. In "Connection Settings", switch to **Live API** mode.
3. Ensure the API URL is `http://localhost:8000/api/voice-detection`.
4. Enter the API Key: `my-secret-key`.
5. Upload an MP3 file (Tamil, English, Hindi, Malayalam, or Telugu).
6. Click "Detect Voice".

## 📡 API Reference

**Endpoint:** `POST /api/voice-detection`

**Headers:**
- `x-api-key`: `my-secret-key`
- `Content-Type`: `application/json`

**Body:**
```json
{
  "language": "English",
  "audioFormat": "mp3",
  "audioBase64": "..."
}
```

## 🧠 AI Logic

The system uses `librosa` to extract:
- **Pitch Standard Deviation**: To detect unnatural monotonicity.
- **MFCC Variance**: To analyze spectral texture.

Low pitch variance (< 40Hz) triggers an "AI_GENERATED" classification.
