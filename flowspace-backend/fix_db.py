import asyncio
from database.connection import engine
from sqlalchemy import text

async def main():
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE projects ADD COLUMN user_id INTEGER;"))
            await conn.execute(text("ALTER TABLE projects ADD CONSTRAINT fk_projects_users FOREIGN KEY (user_id) REFERENCES users (id);"))
            print("Successfully added user_id column to projects table.")
        except Exception as e:
            print("Error:", e)

if __name__ == "__main__":
    asyncio.run(main())
