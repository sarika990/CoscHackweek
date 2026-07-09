from detector import SecretDetector
from config import ScannerConfig

def test_detector_finds_secrets():
    config = ScannerConfig()
    detector = SecretDetector(config)
    
    line = "my_openai_key = 'sk-Ua1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x'"
    findings = detector.scan_line(line, 1)
    
    assert len(findings) > 0
    assert findings[0]["secret_type"] == "OpenAI API Key"
    assert "sk-" in findings[0]["masked_value"]

def test_detector_generic_credential_entropy():
    config = ScannerConfig()
    detector = SecretDetector(config)
    
    # High entropy password assignment should be flagged
    line = 'database_password = "g9X7w!2mKz#qP5vRt[yB1a_L3kJfHdQwP"'
    findings = detector.scan_line(line, 1)
    assert len(findings) > 0
    
    # Low entropy password assignment should be ignored by default configuration thresholds
    low_entropy_line = 'database_password = "password"'
    findings_low = detector.scan_line(low_entropy_line, 1)
    assert len(findings_low) == 0
