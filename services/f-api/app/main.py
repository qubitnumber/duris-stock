import os

from fastapi import Depends, FastAPI, HTTPException, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://s-service:8001", "http://localhost:8001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

token_auth_scheme = HTTPBearer(auto_error=False)
api_key = os.getenv('F_X_API_KEY')

@app.get("/")
def private(request: Request, bearer_token: str = Depends(token_auth_scheme)):
    if not bearer_token or bearer_token.credentials != api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="broken token",
        )
    return {"scheme": bearer_token.credentials, "api-key": api_key}
