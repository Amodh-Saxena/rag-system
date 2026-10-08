from fastapi import APIRouter, HTTPException
from memory.graph_store import store

router = APIRouter()

@router.get("/node/{node_id}")
def get_node(node_id: str):
    node = store.get_node(node_id)
    if not node:
        raise HTTPException(status_code=404, detail=f"Node {node_id} not found")
    return node
