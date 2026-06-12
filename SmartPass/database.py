import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:password@localhost:5432/example_db"
)

# Railway/Heroku/etc. inject bare "postgres://" or "postgresql://"; SQLAlchemy needs the driver suffix.
for _prefix in ("postgres://", "postgresql://"):
    if SQLALCHEMY_DATABASE_URL.startswith(_prefix):
        SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://" + SQLALCHEMY_DATABASE_URL[len(_prefix):]
        break

engine = create_engine(SQLALCHEMY_DATABASE_URL)

LocalSession = sessionmaker(bind=engine)

def get_db():
    db = LocalSession()
    try:
        yield db
    finally:
        db.close()