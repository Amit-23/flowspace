
from sqlalchemy import func
from fastapi import FastAPI,Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.auth import RegisterData,LoginData
from models.user import Project, Task, User
from database.connection import create_tables, get_db,SessionLocal
from sqlalchemy import func, select
from fastapi import HTTPException
from fastapi import Response
from auth.jwt import create_access_token
from auth.dependencies import get_current_user
from schemas.project import ProjectCreate,ProjectResponse

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


@app.get("/projects", response_model=list[ProjectResponse])
async def get_projects(
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Project).where(Project.user_id == user.id)
    )

    projects = result.scalars().all()

    return projects


@app.post("/projects",response_model=ProjectResponse)
async def create_project(data:ProjectCreate,user:User=Depends(get_current_user),
                         db:AsyncSession=Depends(get_db)):
    project = Project(name=data.name,description=data.description,user_id=user.id)
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project


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
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # Total projects belonging to this user
    project_result = await db.execute(
        select(func.count(Project.id))
        .where(Project.user_id == user.id)
    )
    total_projects = project_result.scalar()

    # Total tasks belonging to this user's projects
    task_result = await db.execute(
        select(func.count(Task.id))
        .join(Project, Task.project_id == Project.id)
        .where(Project.user_id == user.id)
    )
    total_tasks = task_result.scalar()

    # Completed tasks
    completed_result = await db.execute(
        select(func.count(Task.id))
        .join(Project, Task.project_id == Project.id)
        .where(
            Project.user_id == user.id,
            Task.status == "completed"
        )
    )
    completed_tasks = completed_result.scalar()

    # Overdue tasks
    overdue_result = await db.execute(
        select(func.count(Task.id))
        .join(Project, Task.project_id == Project.id)
        .where(
            Project.user_id == user.id,
            Task.due_date < func.now(),
            Task.status != "completed"
        )
    )
    overdue_tasks = overdue_result.scalar()

    return {
        "email": user.email,
        "total_projects": total_projects,
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "overdue_tasks": overdue_tasks
    }

    