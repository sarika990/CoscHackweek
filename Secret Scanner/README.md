# Security Secret Detection Tool

🛡️ A production-quality, high-performance Security Secret Detection Tool written in Python. This utility scans local files and GitHub repositories recursively to detect accidentally exposed sensitive credentials (such as API keys, passwords, private keys, database connection strings) before they are committed.

## Features

- **Recursive Local Directory Scan**: Scans directories while respecting project-level rules and exclusions.
- **GitHub Repository Scan**: Temporarily clones public/private repositories, scans them, and cleans up.
- **High-Fidelity Regex Engine**: Detects specific API keys and credentials (AWS, Stripe, OpenAI, Google, etc.).
- **Shannon Entropy Analysis**: Analyzes generic variable assignments to detect random high-entropy strings, reducing false positives.
- **Git Pre-Commit Hook**: Integrates seamlessly with Git to block commits containing secrets.
- **Multi-Format Report Generation**: Creates detailed reports in HTML Dashboard, JSON, and Text formats under the `reports/` folder.
- **Flexible Exclusions & Configuration**: Supports custom ignore folders, extensions, and confidence levels in `config/scanner_config.yaml`.
- **Beautiful Rich CLI**: Colored terminal outputs, scan progress indicators, and statistics summary.

## Folder Structure

```
secret-scanner/
├── config/
│   └── scanner_config.yaml    # Scanner configuration file
├── sample_files/              # Sample files containing dummy secrets for testing
│   ├── .env
│   ├── config.json
│   ├── sample.py
│   └── secrets.txt
├── tests/                     # Unit test suite
│   ├── test_detector.py
│   ├── test_patterns.py
│   └── test_scanner.py
├── cli.py                     # CLI entrypoint
├── config.py                  # Configuration loader
├── detector.py                # Secret detection engine
├── git_hook.py                # Pre-commit hook logic
├── github_scanner.py          # GitHub cloning and scanning
├── install_hook.py            # Git Hook installer script
├── local_scanner.py           # Recursive file scanner
├── logger.py                  # Rotating file and console logger
├── patterns.py                # Predefined regex patterns
├── report_generator.py        # JSON, TXT, and HTML report generator
├── requirements.txt           # Python project dependencies
├── LICENSE                    # MIT License
└── README.md                  # Project documentation
```

## Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd secret-scanner
   ```

2. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## CLI Usage

### 1. Scan Local Directory
```bash
python cli.py scan .
python cli.py scan sample_files/
```

### 2. Scan GitHub Repository
```bash
python cli.py github https://github.com/user/repository
```

### 3. Check Reports
```bash
python cli.py report
```

### 4. Install Git Pre-Commit Hook
```bash
python cli.py install-hook
```
Or directly:
```bash
python install_hook.py
```

### 5. Version Information
```bash
python cli.py version
```

### 6. Command Help
```bash
python cli.py help
```

## Git Pre-Commit Hook Integration

When the Git hook is installed, the scanner runs automatically on `git commit`. If secrets are detected, the commit is blocked, a console summary is printed, and a full report is written to `reports/`.

To test the hook:
1. Initialize git (if not already done): `git init`
2. Install the hook: `python install_hook.py`
3. Stage a sample file: `git add sample_files/sample.py`
4. Try to commit: `git commit -m "Test commit"` (This will be successfully blocked).

## Testing

Run the automated test suite using `pytest`:
```bash
pytest
```

## Configuration

Modify `config/scanner_config.yaml` to customize:
- Excluded folders (e.g. `node_modules`, `venv`, `__pycache__`)
- Excluded extensions or files
- Allowed extensions to scan (e.g. `.py`, `.js`, `.env`, `.json`)
- Confidence threshold level (`low`, `medium`, `high`)
- Entropy check parameters
