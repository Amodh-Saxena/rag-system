import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.health import router as health_router
from routes.query import router as query_router
from routes.graph import router as graph_router
from routes.timeline import router as timeline_router
from routes.node import router as node_router
from routes.auth import router as auth_router
from database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NeuroMemory Backend Core",
    description="FastAPI memory exploration backend serving episodic, semantic, and temporal graph data.",
    version="1.0.0",
)

# Enable CORS for frontend client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(health_router)
app.include_router(query_router)
app.include_router(graph_router)
app.include_router(timeline_router)
app.include_router(node_router)
app.include_router(auth_router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
