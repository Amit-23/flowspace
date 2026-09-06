import asyncio
from main import dashboard, get_db
from models.user import User

async def main():
    user = User(id=1, email="test@test.com")
    # Need to get a database session
    db_gen = get_db()
    db = await anext(db_gen)
    try:
        res = await dashboard(user=user, db=db)
        print("RESULT:", res)
    except Exception as e:
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
