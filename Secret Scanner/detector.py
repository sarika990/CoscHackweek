import re
from typing import Dict, List, Any, Optional
from patterns import SECRET_PATTERNS
from utils import calculate_entropy, mask_secret
from config import ScannerConfig

class SecretDetector:
    """Detects secrets in content lines using predefined regular expressions and entropy analysis."""

    def __init__(self, config: Optional[ScannerConfig] = None):
        self.config = config or ScannerConfig()
        self.patterns = SECRET_PATTERNS

    def scan_line(self, line: str, line_number: int) -> List[Dict[str, Any]]:
        """Scans a single line for secrets and returns any findings."""
        findings: List[Dict[str, Any]] = []

        # 1. Regex Pattern Matching
        for name, pattern in self.patterns.items():
            # Special handling for generic credentials assignment
            if name == "Generic Credentials Assignment":
                matches = pattern.finditer(line)
                for match in matches:
                    full_match = match.group(0)
                    key = match.group(1)
                    val = match.group(2)
                    
                    # Compute entropy of the potential secret value
                    entropy = calculate_entropy(val)
                    
                    # Ignore short or low-entropy default values (like 'password', 'null')
                    if len(val) < 8 or (self.config.enable_entropy and entropy < self.config.entropy_threshold):
                        continue
                        
                    # Calculate confidence and severity
                    confidence = "medium"
                    severity = "medium"
                    if entropy > 5.5:
                        confidence = "high"
                        severity = "high"
                    elif entropy < 3.5:
                        confidence = "low"
                        severity = "low"

                    findings.append({
                        "line_number": line_number,
                        "matched_secret": val,
                        "secret_type": f"Generic Credential ({key})",
                        "masked_value": mask_secret(val, "Generic Credentials Assignment"),
                        "confidence_score": confidence,
                        "severity_level": severity,
                        "entropy": round(entropy, 2)
                    })
            else:
                matches = pattern.finditer(line)
                for match in matches:
                    val = match.group(0)
                    entropy = calculate_entropy(val)
                    
                    # Apply regex-specific rules
                    confidence = "high"
                    severity = "high"
                    
                    # Some patterns like AWS Secret Key can be noisy without entropy checks
                    if name == "AWS Secret Key":
                        # Raw AWS Secret keys should be 40 chars and high entropy
                        if len(val) != 40 or entropy < 3.8:
                            continue
                        # AWS keys can be high confidence if entropy matches
                        confidence = "medium"
                        severity = "high"
                    elif name == "JWT Token":
                        # JWTs are high-entropy base64 structures
                        if entropy < 4.0:
                            continue
                        confidence = "medium"
                        severity = "high"
                    elif name == "Bearer Token":
                        # Bearer tokens might just be bearer headers in requests, verify entropy
                        token_part = val.split()[-1]
                        if calculate_entropy(token_part) < 3.5:
                            continue
                        confidence = "medium"
                        severity = "medium"

                    findings.append({
                        "line_number": line_number,
                        "matched_secret": val,
                        "secret_type": name,
                        "masked_value": mask_secret(val, name),
                        "confidence_score": confidence,
                        "severity_level": severity,
                        "entropy": round(entropy, 2)
                    })

        # Apply configuration confidence filter
        thresholds = {"low": 1, "medium": 2, "high": 3}
        target_val = thresholds.get(self.config.confidence_threshold, 2)
        
        filtered_findings = [
            f for f in findings 
            if thresholds.get(f["confidence_score"], 2) >= target_val
        ]

        return filtered_findings
