import re
from typing import Dict, Pattern

# Compiled regular expressions for various sensitive keys and credentials
SECRET_PATTERNS: Dict[str, Pattern[str]] = {
    "OpenAI API Key": re.compile(r"sk-[a-zA-Z0-9]{48}|sk-proj-[a-zA-Z0-9]{156}"),
    "GitHub Personal Access Token": re.compile(r"ghp_[a-zA-Z0-9]{36}|github_pat_[a-zA-Z0-9]{82}"),
    "AWS Access Key": re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    "AWS Secret Key": re.compile(r"(?<![A-Za-z0-9/+=])[A-Za-z0-9/+=]{40}(?![A-Za-z0-9/+=])"),
    "Google API Key": re.compile(r"\bAIza[0-9A-Za-z-_]{35}\b"),
    "Google OAuth Token": re.compile(r"\bya29\.[a-zA-Z0-9_-]{50,150}\b"),
    "Stripe Secret Key": re.compile(r"\bsk_live_[0-9a-zA-Z]{24}\b|\brk_live_[0-9a-zA-Z]{24}\b"),
    "Slack Token": re.compile(r"\bxox[bapr]-[0-9a-zA-Z]{10,48}\b"),
    "Discord Token": re.compile(r"\b[MN][A-Za-z0-9]{23}\.[A-Za-z0-9-_]{6}\.[A-Za-z0-9-_]{27}\b"),
    "JWT Token": re.compile(r"\beyJ[A-Za-z0-9-_=]+\.eyJ[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*\b"),
    "Bearer Token": re.compile(r"(?i)bearer\s+[a-zA-Z0-9_\-\.=\+\/]{20,}"),
    "Private RSA/SSH Key": re.compile(r"-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----"),
    "PEM Certificate": re.compile(r"-----BEGIN CERTIFICATE-----"),
    "MongoDB Connection String": re.compile(r"mongodb(?:\+srv)?:\/\/[^:\s]+:[^@\s]+@[a-zA-Z0-9.-]+"),
    "PostgreSQL Connection String": re.compile(r"postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@[a-zA-Z0-9.-]+"),
    "MySQL Connection String": re.compile(r"mysql:\/\/[^:\s]+:[^@\s]+@[a-zA-Z0-9.-]+"),
    "Redis Connection String": re.compile(r"redis:\/\/[^:\s]*:[^@\s]+@[a-zA-Z0-9.-]+"),
    "Generic Credentials Assignment": re.compile(
        r"(?i)\b(password|api_key|access_token|client_secret|database_password|"
        r"email_password|auth_token|cookie|session_secret|secret_key|private_key|token)\b"
        r"\s*[:=]\s*['\"]([^'\"]{8,})['\"]"
    )
}
