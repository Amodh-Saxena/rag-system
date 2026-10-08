from fastapi import APIRouter
from memory.graph_store import store

router = APIRouter()

@router.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "NeuroMemory Core Engine",
        "repository": store.repository.get("id", "nexus-research"),
        "nodes": len(store.nodes),
        "edges": len(store.edges),
    }
