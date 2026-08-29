from fastapi import FastAPI,Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.auth import RegisterData,LoginData
from models.user import User
from database.connection import create_tables, get_db,SessionLocal
from sqlalchemy import select
from fastapi import HTTPException
from fastapi import Response
from auth.jwt import create_access_token
from auth.dependencies import get_current_user

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await create_tables()



@app.post("/register")
async def register(
    data: RegisterData,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(User).where(User.email == data.email)
    )

    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="User with this email already exists"
        )

    user = User(
        email=data.email,
        password_hash=data.password
    )

    db.add(user)

    await db.commit()

    return {
        "message": "User registered successfully",
        "email": user.email
    }


@app.post("/login")
async def login(
        data:LoginData,
        response:Response,
        db:AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(User).where(User.email == data.email)
    )

    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    if user.password_hash != data.password:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )
    
    token = create_access_token(user.id)
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax"
    )

    return {
        "message":"Login successful"

    }
  

@app.get("/dashboard")
async def dashboard(
    user: User = Depends(get_current_user)
):
    return {
        "message": "Welcome to your dashboard",
        "email": user.email
    }