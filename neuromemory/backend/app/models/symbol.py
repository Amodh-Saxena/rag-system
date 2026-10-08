from pydantic import BaseModel

class Symbol(BaseModel):
    name: str
    type: str
