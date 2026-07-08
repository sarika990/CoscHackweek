import os
from errors import LanguageError


def format_error(error: LanguageError, source_code: str = None) -> str:
    """Format a language error with source context showing where the error occurred."""
    output = f"Error: {str(error)}\n"
    if source_code and error.line is not None:
        lines = source_code.splitlines()
        if 0 < error.line <= len(lines):
            line_content = lines[error.line - 1]
            output += f"  | {line_content}\n"
            if error.column is not None:
                pointer = " " * (error.column - 1) + "^"
                output += f"  | {pointer}\n"
    return output


def print_ast(node, indent: int = 0) -> None:
    """Recursively prints the AST in a structured human-readable tree format."""
    spacing = "  " * indent
    node_type = type(node).__name__
    
    if hasattr(node, "name") and hasattr(node, "value_expr"):
        print(f"{spacing}{node_type}: {node.name}")
        print_ast(node.value_expr, indent + 1)
    elif hasattr(node, "statements"):
        print(f"{spacing}{node_type}:")
        for stmt in node.statements:
            print_ast(stmt, indent + 1)
    elif hasattr(node, "body"):
        print(f"{spacing}{node_type}:")
        for stmt in node.body:
            print_ast(stmt, indent + 1)
    elif hasattr(node, "left") and hasattr(node, "right"):
        print(f"{spacing}{node_type} ({node.op}):")
        print_ast(node.left, indent + 1)
        print_ast(node.right, indent + 1)
    elif hasattr(node, "expr") and node.expr is not None:
        print(f"{spacing}{node_type}:")
        print_ast(node.expr, indent + 1)
    elif hasattr(node, "value"):
        print(f"{spacing}{node_type}: {repr(node.value)}")
    else:
        print(f"{spacing}{node_type}")
