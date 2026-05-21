from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from deep_translator import GoogleTranslator

app = FastAPI(title="Language Translation API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranslationRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str

class TranslationResponse(BaseModel):
    translated_text: str
    source_lang_detected: str

@app.post("/api/translate", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    try:
        # If source_lang is 'auto', let deep_translator handle it
        src = request.source_lang if request.source_lang != 'auto' else 'auto'
        tgt = request.target_lang
        
        # Perform translation using deep_translator
        translator = GoogleTranslator(source=src, target=tgt)
        translated_text = translator.translate(request.text)
        
        return TranslationResponse(
            translated_text=translated_text,
            source_lang_detected=src
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
