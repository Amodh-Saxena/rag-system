from fastapi import APIRouter
from memory.graph_store import store

router = APIRouter()

@router.get("/timeline/{repository_id}")
def get_timeline(repository_id: str):
    return store.get_timeline()
