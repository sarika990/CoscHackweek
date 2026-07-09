import sys
import argparse
import time
from pathlib import Path
from typing import List, Dict, Any

from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn, TaskProgressColumn
from rich import box

from config import ScannerConfig
from detector import SecretDetector
from local_scanner import LocalScanner
from github_scanner import GitHubScanner
from report_generator import ReportGenerator
from install_hook import install_hook

VERSION = "1.0.0"
console = Console()
error_console = Console(stderr=True)

def print_banner() -> None:
    """Prints a beautiful title banner."""
    console.print(
        Panel(
            "[bold red]*** SECURITY SECRET DETECTOR & SCANNER ***[/bold red]\n"
            "[dim]A production-grade credentials and token protection utility[/dim]",
            expand=False,
            border_style="red",
            box=box.DOUBLE
        )
    )

def handle_scan(path_str: str) -> None:
    """Handles the scanning of a local directory."""
    path = Path(path_str)
    if not path.exists():
        error_console.print(f"[bold red]Error:[/bold red] Path '{path_str}' does not exist.")
        sys.exit(1)

    config = ScannerConfig()
    detector = SecretDetector(config)
    scanner = LocalScanner(config, detector)

    print_banner()
    
    with Progress(
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TaskProgressColumn(),
        console=console
    ) as progress:
        task = progress.add_task("[cyan]Scanning directory...", total=None)
        start_time = time.time()
        findings = scanner.scan_directory(path)
        duration = time.time() - start_time
        progress.update(task, completed=100, description="[green]Scan complete!")

    # Display Results
    console.print(f"\n[bold]Files scanned :[/bold] {scanner.total_files_scanned}")
    console.print(f"[bold]Secrets found :[/bold] [bold red]{len(findings)}[/bold red]")
    console.print("=" * 40)

    for idx, f in enumerate(findings, 1):
        console.print(f"\n[bold yellow]Secret Type:[/bold yellow] {f['secret_type']}")
        console.print(f"[bold]File:[/bold]        {f['relative_path']}")
        console.print(f"[bold]Line:[/bold]        {f['line_number']}")
        console.print(f"[bold]Confidence:[/bold]  [bold cyan]{f['confidence_score'].upper()}[/bold cyan]")
        console.print(f"[bold]Severity:[/bold]    [bold red]{f['severity_level'].upper()}[/bold red]")
        console.print(f"[bold]Masked:[/bold]      [bold green]{f['masked_value']}[/bold green]")
        console.print("=" * 40)

    # Generate Reports
    if findings:
        report_gen = ReportGenerator(findings, scanner.total_files_scanned, duration)
        report_paths = report_gen.generate_all()
        console.print("\n[bold green]Report generation completed:[/bold green]")
        for fmt, rpath in report_paths.items():
            console.print(f"  - [bold]{fmt.upper()}:[/bold] {rpath.resolve()}")
    
    # Print statistics summary
    table = Table(title="Scan Summary", box=box.SIMPLE)
    table.add_column("Metric", style="cyan")
    table.add_column("Value", style="magenta")
    table.add_row("Total Files", str(scanner.total_files_scanned))
    table.add_row("Total Secrets", str(len(findings)))
    table.add_row("Scan Duration", f"{duration:.3f} seconds")
    console.print(table)

    if findings:
        sys.exit(1)
    else:
        sys.exit(0)

def handle_github(url: str) -> None:
    """Handles github repository scanning."""
    config = ScannerConfig()
    detector = SecretDetector(config)
    github_scanner = GitHubScanner(config, detector)

    print_banner()
    console.print(f"[cyan]Scanning GitHub Repository:[/cyan] {url}")
    
    start_time = time.time()
    try:
        findings = github_scanner.scan_repository(url)
    except Exception as e:
        error_console.print("\n[bold red]Repository could not be cloned.[/bold red]")
        error_console.print("[bold]Reason:[/bold]")
        error_console.print("Repository not found or inaccessible.\n")
        error_console.print("[bold]Please verify:[/bold]")
        error_console.print("  - Repository URL")
        error_console.print("  - Repository visibility (public vs. private)")
        error_console.print("  - Internet connection\n")
        sys.exit(1)
    duration = time.time() - start_time

    console.print(f"\n[bold]Secrets found :[/bold] [bold red]{len(findings)}[/bold red]")
    console.print("=" * 40)

    for idx, f in enumerate(findings, 1):
        console.print(f"\n[bold yellow]Secret Type:[/bold yellow] {f['secret_type']}")
        console.print(f"[bold]GitHub link:[/bold]  {f['github_url']}")
        console.print(f"[bold]Confidence:[/bold]   [bold cyan]{f['confidence_score'].upper()}[/bold cyan]")
        console.print(f"[bold]Severity:[/bold]     [bold red]{f['severity_level'].upper()}[/bold red]")
        console.print(f"[bold]Masked:[/bold]       [bold green]{f['masked_value']}[/bold green]")
        console.print("=" * 40)

    if findings:
        report_gen = ReportGenerator(findings, github_scanner.local_scanner.total_files_scanned, duration)
        report_paths = report_gen.generate_all()
        console.print("\n[bold green]Report generation completed:[/bold green]")
        for fmt, rpath in report_paths.items():
            console.print(f"  - [bold]{fmt.upper()}:[/bold] {rpath.resolve()}")
        sys.exit(1)
    else:
        console.print("[green]No secrets detected in repository.[/green]")
        sys.exit(0)

def handle_report() -> None:
    """Print paths to currently generated reports if they exist."""
    json_path = Path("reports/report.json")
    txt_path = Path("reports/report.txt")
    html_path = Path("reports/report.html")
    
    console.print("[bold cyan]Report Status Summary:[/bold cyan]")
    for path, fmt in [(json_path, "JSON"), (txt_path, "TXT"), (html_path, "HTML")]:
        if path.exists():
            console.print(f"  - {fmt}: [green]{path.resolve()}[/green]")
        else:
            console.print(f"  - {fmt}: [yellow]Not generated yet[/yellow]")

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Security Secret Detection Tool - Scan local directories and Git repositories for exposed credentials.",
        add_help=False
    )
    
    subparsers = parser.add_subparsers(dest="command", help="Command to run")
    
    # scan
    scan_parser = subparsers.add_parser("scan", help="Scan local files and directories")
    scan_parser.add_argument("path", nargs="?", default=".", help="Directory or file path to scan")
    
    # github
    github_parser = subparsers.add_parser("github", help="Scan public/private GitHub repository")
    github_parser.add_argument("url", help="GitHub Repository URL")
    
    # report
    subparsers.add_parser("report", help="Check location of scan reports")
    
    # install-hook
    subparsers.add_parser("install-hook", help="Install pre-commit Git hook")
    
    # version
    subparsers.add_parser("version", help="Print tool version")
    
    # help
    subparsers.add_parser("help", help="Show this help message")

    args, unknown = parser.parse_known_args()

    if len(sys.argv) == 1 or args.command == "help" or (args.command is None and not unknown):
        parser.print_help()
        sys.exit(0)

    if args.command == "version":
        console.print(f"Security Secret Scanner v{VERSION}")
        sys.exit(0)
    elif args.command == "scan":
        handle_scan(args.path)
    elif args.command == "github":
        handle_github(args.url)
    elif args.command == "report":
        handle_report()
    elif args.command == "install-hook":
        success = install_hook()
        sys.exit(0 if success else 1)
    else:
        # Fallback if unknown arg
        parser.print_help()
        sys.exit(0)

if __name__ == "__main__":
    main()
