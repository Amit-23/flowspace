import os
from datetime import datetime,timedelta,timezone

from jose import jwt

from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"


def create_access_token(user_id:int):
    expire = datetime.now(timezone.utc) + timedelta(minutes=30)
    payload = {
        "sub":str(user_id),
        "exp":expire
    }

    token = jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token