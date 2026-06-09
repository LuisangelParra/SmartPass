from fastapi import FastAPI
from contextlib import asynccontextmanager
from SmartPass.api.router import router

from SmartPass.database import engine
from SmartPass.database_models.base import Base
from sqlalchemy import text

import SmartPass.database_models

@asynccontextmanager
async def lifespan(app: FastAPI):
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        conn.commit()
        
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(title="SmartPass API", lifespan=lifespan)

app.include_router(router)