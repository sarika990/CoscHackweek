from pathlib import Path
from local_scanner import LocalScanner
from detector import SecretDetector
from config import ScannerConfig

def test_scanner_should_ignore():
    config = ScannerConfig()
    detector = SecretDetector(config)
    scanner = LocalScanner(config, detector)
    
    # Check that paths inside standard ignored folder are ignored
    assert scanner.should_ignore(Path(".git/config"), Path(".")) is True
    assert scanner.should_ignore(Path("node_modules/package/index.js"), Path(".")) is True
    
    # Check that standard config allowed extensions are scanned
    assert scanner.should_ignore(Path("src/main.py"), Path(".")) is False
    
    # Check that forbidden extension is ignored
    assert scanner.should_ignore(Path("src/image.png"), Path(".")) is True
