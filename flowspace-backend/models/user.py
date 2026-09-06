from sqlalchemy import String, ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

from database.connection import Base


class User(Base):
    __tablename__ = 'users'

    id:Mapped[int]=mapped_column(primary_key=True)
    email:Mapped[str]=mapped_column(
        String(255),
        unique=True,
        nullable=False
    )

    password_hash:Mapped[str]=mapped_column(
        String(256),
        nullable=False
    )


class Project(Base):
    __tablename__="projects"
    id:Mapped[int]=mapped_column(primary_key=True)
    name:Mapped[str]=mapped_column(
        String(255),
        nullable=False
    )
    description:Mapped[str | None]=mapped_column(Text,nullable=True)
    user_id:Mapped[int]=mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(50),
        default="todo",
        nullable=False
    )

    priority: Mapped[str] = mapped_column(
        String(50),
        default="medium",
        nullable=False
    )

    due_date: Mapped[datetime | None] = mapped_column(
        DateTime,
        nullable=True
    )

    project_id: Mapped[int] = mapped_column(
        ForeignKey("projects.id"),
        nullable=False
    )



class Activity(Base):
    __tablename__ = "activities"

    id: Mapped[int] = mapped_column(primary_key=True)

    action: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    project_id: Mapped[int | None] = mapped_column(
        ForeignKey("projects.id"),
        nullable=True
    )

    task_id: Mapped[int | None] = mapped_column(
        ForeignKey("tasks.id"),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )