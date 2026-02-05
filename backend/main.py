from fastapi import FastAPI, HTTPException, Header, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import base64
import os
import uuid
from audio_utils import analyze_audio_features
from classifier import classify_voice

app = FastAPI(title="AI Voice Detection API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants
VALID_API_KEY = "my-secret-key"  # In production, use env vars
TEMP_DIR = "temp_audio"

if not os.path.exists(TEMP_DIR):
    os.makedirs(TEMP_DIR)

class VoiceRequest(BaseModel):
    language: str
    audioFormat: str
    audioBase64: str

@app.post("/api/voice-detection")
async def detect_voice(
    request: VoiceRequest = Body(...),
    x_api_key: str = Header(None)
):
    # 1. API Key Validation
    if x_api_key != VALID_API_KEY:
        raise HTTPException(status_code=401, detail={"status": "error", "message": "Invalid API key"})

    # 2. Request Validation
    if request.audioFormat != "mp3":
        raise HTTPException(status_code=400, detail={"status": "error", "message": "Only mp3 format supported"})
    
    if request.language not in ["Tamil", "English", "Hindi", "Malayalam", "Telugu"]:
        raise HTTPException(status_code=400, detail={"status": "error", "message": "Unsupported language"})

    # 3. Save Base64 to Temp File
    file_id = str(uuid.uuid4())
    temp_file_path = os.path.join(TEMP_DIR, f"{file_id}.mp3")
    
    try:
        audio_data = base64.b64decode(request.audioBase64)
        with open(temp_file_path, "wb") as f:
            f.write(audio_data)
    except Exception:
        raise HTTPException(status_code=400, detail={"status": "error", "message": "Invalid Base64 audio"})

    try:
        # 4. Feature Extraction & Classification
        features = analyze_audio_features(temp_file_path)
        result = classify_voice(features)

        # 5. Return Response
        return {
            "status": "success",
            "language": request.language,
            "classification": result["classification"],
            "confidenceScore": result["confidenceScore"],
            "explanation": result["explanation"]
        }

    except Exception as e:
        print(f"Error processing audio: {e}")
        raise HTTPException(status_code=500, detail={"status": "error", "message": "Internal server error during processing"})
    
    finally:
        # 6. Cleanup
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
