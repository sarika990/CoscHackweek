from token import Token
from tokens import (
    T_INT, T_STRING, T_IDENTIFIER, T_PLUS, T_MINUS, T_MUL, T_DIV, T_MOD,
    T_EQ, T_NE, T_LT, T_GT, T_LTE, T_GTE, T_ASSIGN, T_LPAREN, T_RPAREN,
    T_COMMA, T_NEWLINE, T_EOF, KEYWORDS
)
from errors import LexerError


class Lexer:
    def __init__(self, source_code: str):
        self.source_code = source_code
        self.position = 0
        self.line = 1
        self.column = 1
        self.length = len(source_code)

    def error(self, message: str) -> None:
        raise LexerError(message, self.line, self.column)

    def peek(self, offset: int = 0) -> str:
        """Look at the character at the current position + offset without advancing."""
        pos = self.position + offset
        if pos >= self.length:
            return ""
        return self.source_code[pos]

    def advance(self) -> str:
        """Advance the position and update line/column counters."""
        if self.position >= self.length:
            return ""
        char = self.source_code[self.position]
        self.position += 1
        if char == "\n":
            self.line += 1
            self.column = 1
        else:
            self.column += 1
        return char

    def skip_whitespace(self) -> None:
        """Skip horizontal whitespaces (spaces, tabs, carriage returns). Newlines are kept."""
        while self.position < self.length and self.peek() in " \t\r":
            self.advance()

    def skip_comment(self) -> None:
        """Skip comments starting with '#' until the end of the line."""
        if self.peek() == "#":
            while self.position < self.length and self.peek() != "\n":
                self.advance()

    def read_number(self) -> Token:
        """Read an integer literal."""
        start_line = self.line
        start_col = self.column
        num_str = ""
        while self.position < self.length and self.peek().isdigit():
            num_str += self.advance()
        return Token(T_INT, int(num_str), start_line, start_col)

    def read_string(self) -> Token:
        """Read a string literal enclosed in double quotes."""
        start_line = self.line
        start_col = self.column
        self.advance()  # Consume opening quote
        str_val = ""
        while self.position < self.length and self.peek() != '"':
            if self.peek() == "\n":
                self.error("Unterminated string literal")
            if self.peek() == "\\" and self.peek(1) == '"':
                self.advance()  # skip backslash
                str_val += self.advance()  # read escaped quote
            else:
                str_val += self.advance()

        if self.position >= self.length:
            self.error("Unterminated string literal")
        self.advance()  # Consume closing quote
        return Token(T_STRING, str_val, start_line, start_col)

    def read_identifier_or_keyword(self) -> Token:
        """Read an identifier or keyword."""
        start_line = self.line
        start_col = self.column
        ident = ""
        # Identifiers can start with letter/underscore, followed by letters/digits/underscores
        while self.position < self.length and (self.peek().isalnum() or self.peek() == "_"):
            ident += self.advance()

        token_type = KEYWORDS.get(ident, T_IDENTIFIER)
        return Token(token_type, ident, start_line, start_col)

    def tokenize(self) -> list[Token]:
        """Generate a list of tokens from the source code."""
        tokens = []

        while self.position < self.length:
            self.skip_whitespace()
            if self.position >= self.length:
                break

            char = self.peek()

            # Handle comment
            if char == "#":
                self.skip_comment()
                continue

            # Handle newline
            if char == "\n":
                tokens.append(Token(T_NEWLINE, "\n", self.line, self.column))
                self.advance()
                continue

            # Handle operators and delimiters
            if char == "+":
                tokens.append(Token(T_PLUS, "+", self.line, self.column))
                self.advance()
            elif char == "-":
                tokens.append(Token(T_MINUS, "-", self.line, self.column))
                self.advance()
            elif char == "*":
                tokens.append(Token(T_MUL, "*", self.line, self.column))
                self.advance()
            elif char == "/":
                tokens.append(Token(T_DIV, "/", self.line, self.column))
                self.advance()
            elif char == "%":
                tokens.append(Token(T_MOD, "%", self.line, self.column))
                self.advance()
            elif char == "(":
                tokens.append(Token(T_LPAREN, "(", self.line, self.column))
                self.advance()
            elif char == ")":
                tokens.append(Token(T_RPAREN, ")", self.line, self.column))
                self.advance()
            elif char == ",":
                tokens.append(Token(T_COMMA, ",", self.line, self.column))
                self.advance()
            elif char == "=":
                # Could be = or ==
                start_line, start_col = self.line, self.column
                self.advance()
                if self.peek() == "=":
                    self.advance()
                    tokens.append(Token(T_EQ, "==", start_line, start_col))
                else:
                    tokens.append(Token(T_ASSIGN, "=", start_line, start_col))
            elif char == "!":
                # Must be !=
                start_line, start_col = self.line, self.column
                self.advance()
                if self.peek() == "=":
                    self.advance()
                    tokens.append(Token(T_NE, "!=", start_line, start_col))
                else:
                    self.error(f"Unexpected character: '!' without '='")
            elif char == "<":
                # Could be < or <=
                start_line, start_col = self.line, self.column
                self.advance()
                if self.peek() == "=":
                    self.advance()
                    tokens.append(Token(T_LTE, "<=", start_line, start_col))
                else:
                    tokens.append(Token(T_LT, "<", start_line, start_col))
            elif char == ">":
                # Could be > or >=
                start_line, start_col = self.line, self.column
                self.advance()
                if self.peek() == "=":
                    self.advance()
                    tokens.append(Token(T_GTE, ">=", start_line, start_col))
                else:
                    tokens.append(Token(T_GT, ">", start_line, start_col))
            elif char == "«":
                # Handle typographical quotes for greater-than/greater-than-or-equal: «» or «=»
                start_line, start_col = self.line, self.column
                self.advance()  # consume «
                if self.peek() == "=" and self.peek(1) == "»":
                    self.advance()  # consume =
                    self.advance()  # consume »
                    tokens.append(Token(T_GTE, ">=", start_line, start_col))
                elif self.peek() == "»":
                    self.advance()  # consume »
                    tokens.append(Token(T_GT, ">", start_line, start_col))
                else:
                    self.error(f"Unexpected character sequence starting with '«'")
            elif char == '"':
                tokens.append(self.read_string())
            elif char.isdigit():
                tokens.append(self.read_number())
            elif char.isalpha() or char == "_":
                tokens.append(self.read_identifier_or_keyword())
            else:
                self.error(f"Unknown or unexpected character: {repr(char)}")

        # Add EOF token at the end
        tokens.append(Token(T_EOF, None, self.line, self.column))
        return tokens
