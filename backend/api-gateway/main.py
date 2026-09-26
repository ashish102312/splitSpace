# pyrefly: ignore [missing-import]
from fastapi import FastAPI, Request, Response, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
import httpx
import os
# pyrefly: ignore [missing-import]
import uvicorn
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="SplitSpace API Gateway")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service URLs
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL", "http://localhost:8001")

# Global HTTP client
client = httpx.AsyncClient()

@app.on_event("shutdown")
async def shutdown_event():
    await client.aclose()

async def forward_request(request: Request, service_url: str, path: str):
    url = f"{service_url}/{path}"
    
    # Forward headers, but exclude 'host' to avoid issues with target service
    headers = dict(request.headers)
    headers.pop("host", None)
    headers.pop("content-length", None)
    
    body = await request.body()

    try:
        response = await client.request(
            method=request.method,
            url=url,
            headers=headers,
            content=body,
            params=request.query_params,
        )
        
        # Forward response headers, excluding some hop-by-hop headers
        response_headers = dict(response.headers)
        for key in ["content-length", "content-encoding", "transfer-encoding", "connection"]:
            response_headers.pop(key, None)
            
        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=response_headers,
        )
    except httpx.RequestError as exc:
        print(f"An error occurred while requesting {exc.request.url!r}.")
        raise HTTPException(status_code=503, detail="Service unavailable")

@app.api_route("/api/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"])
async def auth_proxy(request: Request, path: str):
    """Forward auth requests to the Auth Service"""
    return await forward_request(request, AUTH_SERVICE_URL, f"api/auth/{path}")

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "api-gateway"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
