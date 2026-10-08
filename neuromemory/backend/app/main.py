from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import projects, search, graph

app = FastAPI(title="Neuromemory API")

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(projects.router, prefix="/projects", tags=["Projects"])
app.include_router(search.router, prefix="/search", tags=["Search"])
app.include_router(graph.router, prefix="/graph", tags=["Graph"])

@app.get("/")
def read_root():
    return {"message": "Neuromemory API is running"}
