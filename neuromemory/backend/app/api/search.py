from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def search_memory(q: str):
    return {"message": "Search placeholder", "query": q}
