from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Use docker-compose service name "db" as host
DATABASE_URL = "mysql+pymysql://user:password@db:3306/backend"

# Create SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# SessionLocal class for DB sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()
