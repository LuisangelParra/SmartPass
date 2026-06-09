from sqlalchemy import create_engine
from sqlalchemy.orm import Session

SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://postgres:password@localhost:5432/example_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)

LocalSession = Session(bind=engine)