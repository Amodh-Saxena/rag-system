from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_graph():
    return {"message": "Graph placeholder"}
