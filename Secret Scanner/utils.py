import math
from typing import Dict

def calculate_entropy(data: str) -> float:
    """Calculates the Shannon entropy of a string."""
    if not data:
        return 0.0
    entropy = 0.0
    length = len(data)
    frequencies: Dict[str, int] = {}
    for char in data:
        frequencies[char] = frequencies.get(char, 0) + 1
    for count in frequencies.values():
        p = count / length
        entropy -= p * math.log2(p)
    return entropy

def mask_secret(secret: str, secret_type: str) -> str:
    """Masks a secret to hide sensitive parts while retaining prefixes/suffixes if appropriate."""
    if not secret:
        return ""
        
    length = len(secret)
    
    if secret_type == "OpenAI API Key":
        if secret.startswith("sk-proj-"):
            return f"sk-proj-{secret[8:12]}..." + "*" * (length - 16) + secret[-4:]
        return f"sk-{secret[3:7]}..." + "*" * (length - 11) + secret[-4:]
        
    if secret_type == "GitHub Personal Access Token":
        if secret.startswith("ghp_"):
            return f"ghp_{'*' * (length - 8)}{secret[-4:]}"
        elif secret.startswith("github_pat_"):
            return f"github_pat_{'*' * (length - 15)}{secret[-4:]}"
            
    if secret_type == "Google API Key" and secret.startswith("AIza"):
        return f"AIza{'*' * (length - 8)}{secret[-4:]}"
        
    if secret_type == "Generic Credentials Assignment":
        # Usually contains key = "secret", we want to mask the actual value
        return "*" * 10
        
    if length <= 8:
        return "*" * length
        
    # Default masking strategy: keep first 4 and last 4 characters, mask the middle
    return f"{secret[:4]}{'*' * (length - 8)}{secret[-4:]}"
