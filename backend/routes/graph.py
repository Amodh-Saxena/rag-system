from fastapi import APIRouter
from memory.graph_store import store

router = APIRouter()

@router.get("/graph/{repository_id}")
def get_graph(repository_id: str):
    data = store.get_graph()
    return {
        "repository_id": repository_id,
        "nodes": data["nodes"],
        "edges": data["edges"],
        "metadata": data["repository"]
    }
