import sys
import os
from lexer import Lexer
from parser import Parser
from interpreter import Interpreter
from errors import LanguageError
from utils import format_error


def run_file(filepath: str) -> int:
    if not os.path.exists(filepath):
        print(f"Error: File '{filepath}' not found.", file=sys.stderr)
        return 1

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            source_code = f.read()
    except Exception as e:
        print(f"Error: Could not read file: {e}", file=sys.stderr)
        return 1

    # Lexical Analysis
    lexer = Lexer(source_code)
    try:
        tokens = lexer.tokenize()
    except LanguageError as e:
        print(format_error(e, source_code), file=sys.stderr)
        return 1

    # Parsing Analysis
    parser = Parser(tokens)
    try:
        ast = parser.parse()
    except LanguageError as e:
        print(format_error(e, source_code), file=sys.stderr)
        return 1

    # Interpretation
    interpreter = Interpreter()
    try:
        interpreter.interpret(ast)
    except LanguageError as e:
        print(format_error(e, source_code), file=sys.stderr)
        return 1

    return 0


def main():
    if len(sys.argv) < 2 or sys.argv[1] in ("-h", "--help"):
        print("MiniLanguage Interpreter")
        print("Usage: python main.py <filename.lang>")
        sys.exit(1)

    filepath = sys.argv[1]
    status = run_file(filepath)
    sys.exit(status)


if __name__ == "__main__":
    main()
