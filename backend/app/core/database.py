"""SQLAlchemy persistence configured for Supabase PostgreSQL or a local database."""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import get_settings


class Base(DeclarativeBase):
    pass


def database_url() -> str:
    url = get_settings().database_url
    if not url:
        return "sqlite:///./leakguard.db"
    return url.replace("postgres://", "postgresql+psycopg://", 1).replace("postgresql://", "postgresql+psycopg://", 1)


engine = create_engine(database_url(), pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_db():
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
