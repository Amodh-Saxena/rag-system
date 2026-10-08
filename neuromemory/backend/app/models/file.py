from pydantic import BaseModel

class FileModel(BaseModel):
    path: str
    content: str
