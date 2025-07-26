import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get database connection parameters from DATABASE_URL
import urllib.parse
from urllib.parse import urlparse

db_url = os.getenv("DATABASE_URL")
if not db_url:
    raise ValueError("DATABASE_URL not found in .env file")

# Parse the database URL
parsed = urlparse(db_url)
db_params = {
    'user': parsed.username,
    'password': urllib.parse.unquote(parsed.password) if parsed.password else None,
    'host': parsed.hostname,
    'port': parsed.port or 5432,
    'dbname': 'postgres'  # Connect to default 'postgres' database to create our database
}

# Get the database name from the URL
db_name = parsed.path.lstrip('/')

try:
    # Connect to PostgreSQL server
    conn = psycopg2.connect(**db_params)
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    # Check if database exists
    cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (db_name,))
    exists = cursor.fetchone()
    
    if not exists:
        # Create database
        print(f"Creating database: {db_name}")
        cursor.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(db_name)))
        print("Database created successfully!")
    else:
        print(f"Database '{db_name}' already exists.")
    
    # Close communication with the database
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"Error: {e}")
    if 'conn' in locals():
        conn.close()
