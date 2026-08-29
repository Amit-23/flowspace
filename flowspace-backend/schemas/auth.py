from pydantic import BaseModel, EmailStr


class LoginData(BaseModel):
    email: EmailStr
    password: str
class RegisterData(BaseModel):
    email:EmailStr
    password:str