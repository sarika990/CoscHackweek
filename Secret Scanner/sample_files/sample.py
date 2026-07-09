# Sample python file with simulated credentials for secret scanning verification
import os

# Simulated API Keys
OPENAI_KEY = "sk-Ua1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x"
GITHUB_TOKEN = "ghp_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r"
GOOGLE_MAPS_KEY = "AIzaSyD-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p"

def connect_database():
    # PostgreSQL connection string with password
    db_uri = "postgresql://db_user:my-super-secret-password-123@localhost:5432/production"
    print(f"Connecting to database: {db_uri}")

if __name__ == "__main__":
    connect_database()
