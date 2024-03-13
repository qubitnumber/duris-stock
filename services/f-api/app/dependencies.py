import os

from dotenv import load_dotenv
from typing import Annotated
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

load_dotenv()

async def get_bear_token(bearer_token: Annotated[HTTPAuthorizationCredentials, Depends(HTTPBearer(auto_error=False))]):
    if not bearer_token or bearer_token.credentials != os.getenv('F_X_API_KEY'):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="broken token",
        )

