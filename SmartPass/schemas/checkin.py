from pydantic import BaseModel

class CheckInRequest(BaseModel):
    image_base64: str