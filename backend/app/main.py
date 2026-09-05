from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.services.inference import predict_emotion
from app.services.music_service import get_music

app = FastAPI(title="EmoTune API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/emotion")
async def emotion_endpoint(image: UploadFile = File(...)):
    try:
        emotion, confidence = await predict_emotion(image)
        songs = get_music(emotion)
        return {
            "emotion": emotion,
            "confidence": confidence,
            "songs": songs,
        }
    except Exception as exc:
        print("Emotion endpoint error:", exc)
        raise HTTPException(
            status_code=422,
            detail=str(exc),
        )
