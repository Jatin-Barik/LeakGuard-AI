"""LeakGuard AI - FastAPI Backend"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import advisor, analysis, health, upload

app = FastAPI(
    title="LeakGuard AI API",
    description="AI-powered subscription leak detection backend",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(analysis.router, prefix="/api", tags=["analysis"])
app.include_router(advisor.router, prefix="/api", tags=["advisor"])


@app.get("/")
async def root():
    return {"service": "LeakGuard AI API", "status": "running", "version": "1.0.0"}
