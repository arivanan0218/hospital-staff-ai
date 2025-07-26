import psycopg2
from sqlalchemy import create_engine, inspect
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create SQLAlchemy engine
db_url = os.getenv("DATABASE_URL")
engine = create_engine(db_url)

# Create an inspector to get table information
inspector = inspect(engine)

# Get list of all tables
tables = inspector.get_table_names()
print("\nTables in the database:")
print("-" * 30)
for table in tables:
    print(f"- {table}")

# For each table, show columns
print("\nTable Details:")
print("-" * 30)
for table in tables:
    print(f"\nTable: {table}")
    print("Columns:")
    for column in inspector.get_columns(table):
        print(f"  - {column['name']} ({column['type']})")
