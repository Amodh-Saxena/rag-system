from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional
import os
import git
import shutil
import zipfile

router = APIRouter()

# Assuming the server runs from backend directory, so repositories is one level up
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPOSITORIES_DIR = os.path.join(os.path.dirname(BASE_DIR), "repositories")

@router.post("/")
async def create_project(
    name: str = Form(...),
    source: str = Form(...),
    url: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    if source not in ["github", "local"]:
        raise HTTPException(status_code=400, detail="Source must be 'github' or 'local'")

    project_dir = os.path.join(REPOSITORIES_DIR, name)
    
    if os.path.exists(project_dir):
        raise HTTPException(status_code=400, detail="Project with this name already exists")
        
    os.makedirs(project_dir, exist_ok=True)

    if source == "github":
        if not url:
            shutil.rmtree(project_dir)
            raise HTTPException(status_code=400, detail="URL is required for GitHub source")
        
        try:
            git.Repo.clone_from(url, project_dir)
        except Exception as e:
            shutil.rmtree(project_dir)
            raise HTTPException(status_code=500, detail=f"Failed to clone repository: {str(e)}")
            
    elif source == "local":
        if not file or not file.filename.endswith('.zip'):
            shutil.rmtree(project_dir)
            raise HTTPException(status_code=400, detail="A .zip file is required for local source")
        
        zip_path = os.path.join(REPOSITORIES_DIR, file.filename)
        with open(zip_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        try:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall(project_dir)
        except Exception as e:
            shutil.rmtree(project_dir)
            if os.path.exists(zip_path):
                os.remove(zip_path)
            raise HTTPException(status_code=500, detail=f"Failed to extract zip file: {str(e)}")
            
        if os.path.exists(zip_path):
            os.remove(zip_path)

    return {"message": "Project ingested successfully", "name": name, "source": source}
