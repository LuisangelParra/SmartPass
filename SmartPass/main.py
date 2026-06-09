from fastapi import FastAPI
from api.router import router

app = FastAPI(title="SmartPass API")

app.include_router(router)