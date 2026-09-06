from datetime import datetime

from pydantic import BaseModel, Field

class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    status: str = "todo"
    priority: str = "medium"
    due_date: datetime | None = None


class TaskResponse(BaseModel):
    id: int
    title: str
    description: str | None
    status: str
    priority: str
    due_date: datetime | None
    project_id: int

