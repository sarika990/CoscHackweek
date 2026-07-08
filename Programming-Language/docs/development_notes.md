# Development and Extension Notes

This document provides developer guidelines on implementation decisions, and instructions on how to extend the language with new keywords or operators.

---

## Key Design Decisions

### 1. Statement Boundaries (Newlines vs. Semicolons)
We chose newlines as statement separators. This creates a clean, Python-like aesthetic. To do this, the Lexer returns a `T_NEWLINE` token, and the Parser skips multiple newlines where appropriate but ensures statements are separated.

### 2. Typographical Angle Quotes
To accommodate potential copy-paste encoding artifacts like `«»` and `«=»` for greater-than operators, the Lexer specifically maps these character sequences to standard tokens `T_GT` (`>`) and `T_GTE` (`>=`).

### 3. Dynamic Type Checking
MiniLanguage is dynamically typed. Operands are verified at runtime inside `interpreter.py`. Division by zero is explicitly checked and raises an execution error containing correct position coordinates.

### 4. Control Signals as Exceptions
Using standard Python exceptions (`ReturnValue`, `BreakSignal`, `ContinueSignal`) allows clean flow-control propagation across the recursive tree-walk interpreter without passing state flags down the call stack.

---

## How to Extend the Language

### 1. Adding a New Keyword (e.g., `repeat`)

1. **Register the Token Constant**:
   In `tokens.py`, define the token name:
   ```python
   T_REPEAT = "REPEAT"
   ```
2. **Register the Keyword**:
   Add it to the `KEYWORDS` dictionary in `tokens.py`:
   ```python
   KEYWORDS["repeat"] = T_REPEAT
   ```
3. **Parse the Syntax**:
   In `parser.py`, add a check inside `parse_statement()`:
   ```python
   elif tok.type == T_REPEAT:
       return self.parse_repeat()
   ```
   Then implement `parse_repeat(self)` to construct the corresponding AST node.
4. **Define the AST Node**:
   In `ast_nodes.py`, add the node class:
   ```python
   class RepeatStmt(Stmt):
       ...
   ```
5. **Evaluate the AST Node**:
   In `interpreter.py`, add an execution branch in `execute()`:
   ```python
   elif isinstance(node, RepeatStmt):
       ...
   ```

### 2. Adding a New Operator (e.g., `^` Power)

1. **Register the Operator Token**:
   In `tokens.py`:
   ```python
   T_POW = "POW"
   ```
2. **Update the Lexer**:
   In `lexer.py`, map the character `^` to the token:
   ```python
   elif char == "^":
       tokens.append(Token(T_POW, "^", self.line, self.column))
       self.advance()
   ```
3. **Configure Operator Precedence**:
   In `parser.py`, insert power operator precedence. Since power is higher precedence than multiplication, insert a level between `parse_unary()` and `parse_factor()`:
   ```python
   def parse_factor(self) -> Expr:
       expr = self.parse_power()
       ...
   ```
4. **Implement Execution**:
   In `interpreter.py`, under the `BinOp` evaluation branch, add support for the `^` operation:
   ```python
   elif node.op == "^":
       self.check_number_operands(node.op, left_val, right_val, node.line, node.column)
       return left_val ** right_val
   ```
