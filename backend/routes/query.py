from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from memory.retrieval import retriever

router = APIRouter()

class QueryRequest(BaseModel):
    query: str
    repository_id: Optional[str] = "nexus-research"

@router.post("/query")
def query_memory(req: QueryRequest):
    if not req.query or not req.query.strip():
        raise HTTPException(status_code=400, detail="Query string cannot be empty")
    
    return retriever.retrieve(req.query)
