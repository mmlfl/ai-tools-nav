import json
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from recommend_engine import recommend_stream

app = FastAPI(title="AI Tools Recommendation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://lflaitool.top"],
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["*"],
)


@app.post("/api/recommend")
async def recommend(request: Request):
    body = await request.json()
    query = body.get("query", "")
    if not query:
        return StreamingResponse(
            iter(["data: " + json.dumps({"error": "query is required"}, ensure_ascii=False) + "\n\n"]),
            media_type="text/event-stream",
        )

    async def event_stream():
        async for token in recommend_stream(query):
            yield f"data: {json.dumps({'token': token}, ensure_ascii=False)}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
