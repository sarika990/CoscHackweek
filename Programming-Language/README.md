# MiniLanguage Custom Programming Language & Interpreter

MiniLanguage is a complete, custom, modular, and beginner-friendly programming language written from scratch in Python 3. It features an independent Lexer, recursive descent Parser, Abstract Syntax Tree (AST) visualizer, lexically scoped Environment, and Tree-Walking Interpreter.

---

## Folder Structure

```
MiniLanguage/
├── README.md                 # Complete documentation and overview
├── requirements.txt          # Python dependencies (mostly optional)
├── main.py                   # CLI entrypoint to run programs
├── lexer.py                  # Lexical analyzer / scanner
├── token.py                  # Token class representing parsed units
├── tokens.py                 # Constants defining token types
├── parser.py                 # Syntactic parser mapping tokens to AST
├── ast_nodes.py              # Structural classes representing the AST
├── interpreter.py            # Evaluator for executing statements and expressions
├── environment.py            # Scoping table mapping variables to values
├── runtime.py                # Callables (functions) and flow-control signals
├── errors.py                 # Custom exception definitions
├── utils.py                  # Formatting and visual layout utilities
├── grammar.md                # Grammar specifications in EBNF
├── docs/                     # Additional architectural & syntax documentations
│   ├── architecture.md
│   ├── language_syntax.md
│   └── development_notes.md
├── examples/                 # Executable source code samples
│   ├── hello.lang
│   ├── variables.lang
│   ├── calculator.lang
│   ├── conditions.lang
│   ├── loops.lang
│   ├── factorial.lang
│   ├── fibonacci.lang
│   ├── prime.lang
│   └── fizzbuzz.lang
├── screenshots/              # Execution terminal captures
│   ├── hello_output.png
│   ├── calculator_output.png
│   ├── factorial_output.png
│   └── fizzbuzz_output.png
└── tests/                    # Pipeline unit tests
    ├── test_lexer.py
    ├── test_parser.py
    └── test_interpreter.py
```

---

## Installation & Setup

Ensure you have **Python 3.10+** installed.

1. Clone or download this repository.
2. Navigate to the project root:
   ```bash
   cd Programming-Language
   ```
3. Install dependencies (optional, primarily for unit tests):
   ```bash
   pip install -r requirements.txt
   ```

---

## Running Example Programs

To run a MiniLanguage script, pass the path of the `.lang` file to `main.py`:

```bash
# Run Hello World
python main.py examples/hello.lang

# Run Calculator
python main.py examples/calculator.lang

# Run Factorial
python main.py examples/factorial.lang

# Run FizzBuzz
python main.py examples/fizzbuzz.lang
```

---

## Running Tests

We implement unit tests using Python's standard `unittest` library. Run all tests with:

```bash
python -m unittest discover -s tests
```

---

## Architectural & Execution Flow

### 1. Lexical Analysis (`lexer.py`)
Reads the raw source code text character by character. It ignores whitespace and comments (`#`) and groups characters into logical units called `Token` objects (e.g., numbers, string literals, operators, keywords). It detects unknown characters and raises a `LexerError` with line and column numbers.

### 2. Syntactic Parsing (`parser.py`)
Consumes the token stream from the Lexer and matches them against the EBNF grammar using a **Recursive Descent** parser. It ensures statements are separated by newlines, resolves operator precedence, and builds the Abstract Syntax Tree (AST). It raises `ParserError` on invalid syntax.

### 3. Abstract Syntax Tree (`ast_nodes.py`)
A tree structure representing the hierarchical syntax of the code. **Expressions** (such as binary operations, literals, variable lookups, and function calls) evaluate to values. **Statements** (such as variable declarations, print statements, if-else, while/for loops, and function definitions) perform actions.

### 4. Scoping Environment (`environment.py`)
A lookup table holding variable names mapped to their values. MiniLanguage uses lexical block scoping. Child environments (such as within loop bodies or function scopes) hold a reference to their parent environment. Looking up or reassigning a variable traverses this scope tree upwards.

### 5. Execution Interpreter (`interpreter.py` & `runtime.py`)
Evaluates the AST starting from the root node. To manage complex control flow like `break`, `continue`, and `return`, the interpreter raises specific Python exceptions (`BreakSignal`, `ContinueSignal`, `ReturnValue`) which are caught by the corresponding loop and function execution frames.

---

## Extending the Language

### How to add a new keyword
1. Define a token constant in `tokens.py` (e.g., `T_REPEAT = "REPEAT"`).
2. Register the keyword spelling in the `KEYWORDS` dictionary in `tokens.py` (e.g., `"repeat": T_REPEAT`).
3. Add a parse branch in `parser.py` inside `parse_statement()` and implement its matching logic.
4. Add a corresponding AST class in `ast_nodes.py`.
5. Add an execution branch inside the `Interpreter.execute()` method in `interpreter.py`.

### How to add a new operator
1. Define the operator token in `tokens.py`.
2. Update `lexer.py` to match the operator's character sequence.
3. Update `parser.py` within the correct precedence method (e.g., `parse_term` or `parse_factor`) to parse the expression.
4. Add execution behavior under the `BinOp` (or `UnaryOp`) block inside the `Interpreter.evaluate()` method in `interpreter.py`.
