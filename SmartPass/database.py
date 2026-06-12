import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:password@localhost:5432/example_db"
)

# Railway/Heroku/etc. inject a bare "postgresql://" URL; SQLAlchemy needs the driver suffix.
if SQLALCHEMY_DATABASE_URL.startswith("postgresql://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace(
        "postgresql://", "postgresql+psycopg2://", 1
    )

engine = create_engine(SQLALCHEMY_DATABASE_URL)

LocalSession = sessionmaker(bind=engine)

def get_db():
    db = LocalSession()
    try:
        yield db
    finally:
        db.close()