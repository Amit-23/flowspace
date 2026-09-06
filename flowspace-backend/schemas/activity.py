from datetime import datetime

from pydantic import BaseModel

class ActivityResponse(BaseModel):
    id: int
    action: str
    description: str | None
    user_id: int
    project_id: int | None
    task_id: int | None
    created_at: datetime

