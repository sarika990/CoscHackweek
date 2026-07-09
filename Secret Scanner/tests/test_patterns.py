import re
from patterns import SECRET_PATTERNS

def test_openai_pattern():
    pattern = SECRET_PATTERNS["OpenAI API Key"]
    match = pattern.search("sk-Ua1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x")
    assert match is not None
    assert match.group(0) == "sk-Ua1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x"

def test_github_pattern():
    pattern = SECRET_PATTERNS["GitHub Personal Access Token"]
    match = pattern.search("ghp_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r")
    assert match is not None

def test_aws_patterns():
    access_pattern = SECRET_PATTERNS["AWS Access Key"]
    secret_pattern = SECRET_PATTERNS["AWS Secret Key"]
    
    assert access_pattern.search("AKIA1234567890ABCDEF") is not None
    assert secret_pattern.search("aBcDeFgHiJkLmNoPqRsTuVwXyZ0123456789aBcD") is not None

def test_google_pattern():
    pattern = SECRET_PATTERNS["Google API Key"]
    assert pattern.search("AIzaSyD-a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p") is not None

def test_jwt_pattern():
    pattern = SECRET_PATTERNS["JWT Token"]
    jwt_str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSm9obiJEb2UifQ.abc123xyz"
    assert pattern.search(jwt_str) is not None
