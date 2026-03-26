# Guide: Vision + Text Understanding App

> **Stack:** [Dev — Ollama + Qwen3.5](../stacks/dev-ollama-qwen3.5.md)
> **Framework:** FastAPI + Next.js
> **Time:** 30 minutes

Build an app that understands both images and text using a local vision-language model.

## Prerequisites

- Stack setup complete: [Dev — Ollama + Qwen3.5](../stacks/dev-ollama-qwen3.5.md)
- Python 3.11+
- Node.js 18+

## Steps

### 1. Pull a vision model

For Mac Mini 24 GB, BakLLaVA is recommended (lower VRAM requirement):

```bash
ollama pull bakllava
```

For Mac 64 GB or DGX Spark, LLaVA 13B offers better accuracy:

```bash
ollama pull llava:13b
```

Verify:
```bash
ollama list | grep -E "bakllava|llava"
```

### 2. Create backend (FastAPI)

```bash
mkdir vision-app && cd vision-app
mkdir backend && cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn python-multipart aiofiles
```

Create `backend/main.py`:

```python
import base64
import os
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = os.getenv("OLLAMA_MODEL", "bakllava")

@app.post("/analyze")
async def analyze_image(
    image: UploadFile = File(...),
    question: str = Form("Describe this image in detail.")
):
    image_bytes = await image.read()
    image_base64 = base64.b64encode(image_bytes).decode("utf-8")

    async with httpx.AsyncClient(timeout=120.0) as client:
        response = await client.post(
            "http://localhost:11434/api/generate",
            json={
                "model": MODEL,
                "prompt": question,
                "images": [image_base64],
                "stream": False
            }
        )
        response.raise_for_status()
        result = response.json()

    return JSONResponse({"response": result["response"]})

@app.get("/health")
async def health():
    return {"status": "ok", "model": MODEL}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

Run the backend:

```bash
uvicorn main:app --reload --port 8000
```

The backend runs on `http://localhost:8000`.

### 3. Create frontend (Next.js)

In a new terminal, from the project root:

```bash
npx create-next-app@latest frontend --typescript --tailwind --eslint
cd frontend
npm install axios
```

Replace `frontend/src/app/page.tsx` with:

```typescript
"use client";

import { useState, useRef } from "react";
import axios from "axios";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [question, setQuestion] = useState("Describe this image in detail.");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const analyze = async () => {
    if (!image) return;
    setLoading(true);
    setResponse("");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("question", question);

    try {
      const res = await axios.post("http://localhost:8000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResponse(res.data.response);
    } catch (err) {
      setResponse("Error: Could not analyze image. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Vision + Text Understanding</h1>

      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        onChange={handleImageChange}
        className="mb-4 block"
      />

      {preview && (
        <img src={preview} alt="Preview" className="mb-4 max-h-64 rounded" />
      )}

      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Your question about the image..."
        className="w-full p-2 border rounded mb-4 h-24"
      />

      <button
        onClick={analyze}
        disabled={!image || loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Analyze Image"}
      </button>

      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded whitespace-pre-wrap">
          {response}
        </div>
      )}
    </main>
  );
}
```

Run the frontend:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Verify

| Check | How | Expected |
|-------|-----|----------|
| Ollama model available | `ollama list \| grep -E "bakllava\|llava"` | Model listed |
| Backend healthy | `curl http://localhost:8000/health` | `{"status":"ok","model":"bakllava"}` |
| Vision inference | Upload an image, click Analyze | Text description returned |
| Memory usage | `ollama ps` | Model loaded, ~5 GB |

## Troubleshooting

- **`Connection refused` at localhost:11434** — Ollama not running. Start with `brew services start ollama` (macOS) or `sudo systemctl start ollama` (Linux).
- **Backend 500 error on /analyze** — Model may still be loading. Wait for `ollama ps` to show the model, then retry.
- **Slow image analysis** — Normal on Mac Mini. LLaVA processes images token-by-token; expect 10–30 seconds per image.
- **CORS error in browser** — Backend CORS is set to `localhost:3000`. Ensure frontend runs on port 3000.
- **Out of memory** — Reduce context length or switch to `bakllava` (lower VRAM than `llava:13b`).

## Next Steps

Try different questions:

- `"What text is in this image?"` — OCR-style extraction
- `"List the objects in this image"` — Object detection
- `"Is this image suitable for a professional presentation?"` — Image assessment

For production, consider adding:
- Image preprocessing (resize before base64 encoding)
- Batch processing for multiple images
- Streaming responses for long descriptions
