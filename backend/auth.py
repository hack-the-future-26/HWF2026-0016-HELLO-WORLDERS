import os
from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
import bcrypt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from dotenv import load_dotenv

load_dotenv()

ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)


def get_jwt_secret_key() -> str:
    """
    Retrieve JWT_SECRET_KEY strictly from the environment.
    Fails fast with a clear error if missing — no fallback or hardcoded secret.
    """
    key = os.getenv("JWT_SECRET_KEY")
    if not key or not key.strip():
        raise RuntimeError(
            "CRITICAL: JWT_SECRET_KEY environment variable is not set. "
            "Please set JWT_SECRET_KEY in your .env or environment variables."
        )
    return key.strip()


def get_token_expire_minutes() -> int:
    """Retrieve token expiration in minutes (defaults to 1440 mins = 24 hours)."""
    val = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
    if val and val.strip().isdigit():
        return int(val.strip())
    return 1440


# ---------------------------------------------------------------------------
# Password Hashing (bcrypt only)
# ---------------------------------------------------------------------------

def hash_password(password: str) -> str:
    """Securely hash a plain text password using bcrypt with a salt."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: Optional[str]) -> bool:
    """Verify a plain text password against its bcrypt hash."""
    if not hashed_password:
        return False
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


# ---------------------------------------------------------------------------
# JWT Generation & Verification
# ---------------------------------------------------------------------------

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Generate a signed JWT token containing user claims and an expiration time.
    Never includes user passwords.
    """
    secret_key = get_jwt_secret_key()
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=get_token_expire_minutes())

    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, secret_key, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    """
    Decode and validate a JWT token.
    Raises HTTPException(401) on expiration or signature errors.
    """
    secret_key = get_jwt_secret_key()
    try:
        payload = jwt.decode(token, secret_key, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ---------------------------------------------------------------------------
# FastAPI Dependency for Protected Endpoints
# ---------------------------------------------------------------------------

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
) -> dict:
    """
    FastAPI dependency to extract and validate the JWT token.
    Returns token payload containing user claims (e.g. sub=user_id).
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload: missing user identifier.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload
