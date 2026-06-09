import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from SmartPass.api.router import router
from SmartPass.database import engine
from SmartPass.database_models.base import Base
import SmartPass.database_models


@asynccontextmanager
async def lifespan(app: FastAPI):
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector;"))
        conn.commit()
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="SmartPass API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        os.getenv("FRONTEND_URL", "*"),
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)