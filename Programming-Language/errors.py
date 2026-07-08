class LanguageError(Exception):
    """Base class for all interpreter errors."""
    def __init__(self, message: str, line: int = None, column: int = None):
        super().__init__(message)
        self.message = message
        self.line = line
        self.column = column

    def __str__(self) -> str:
        pos = ""
        if self.line is not None:
            pos += f"Line {self.line}"
            if self.column is not None:
                pos += f", Column {self.column}"
            pos += ": "
        return f"{pos}{self.message}"


class LexerError(LanguageError):
    """Error encountered during lexing phase."""
    pass


class ParserError(LanguageError):
    """Error encountered during parsing phase."""
    pass


class RunTimeError(LanguageError):
    """Error encountered during execution phase."""
    pass
