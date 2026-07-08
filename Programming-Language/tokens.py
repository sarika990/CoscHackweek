# Token type definitions

# Literals
T_INT = "INT"
T_STRING = "STRING"
T_IDENTIFIER = "IDENTIFIER"

# Operators
T_PLUS = "PLUS"
T_MINUS = "MINUS"
T_MUL = "MUL"
T_DIV = "DIV"
T_MOD = "MOD"

# Comparison Operators
T_EQ = "EQ"
T_NE = "NE"
T_LT = "LT"
T_GT = "GT"
T_LTE = "LTE"
T_GTE = "GTE"

# Assignment
T_ASSIGN = "ASSIGN"

# Logical Operators
T_AND = "AND"
T_OR = "OR"
T_NOT = "NOT"

# Boolean Constants
T_TRUE = "TRUE"
T_FALSE = "FALSE"

# Delimiters and Syntax
T_LPAREN = "LPAREN"
T_RPAREN = "RPAREN"
T_COMMA = "COMMA"
T_NEWLINE = "NEWLINE"
T_EOF = "EOF"

# Keywords
T_LET = "LET"
T_PRINT = "PRINT"
T_INPUT = "INPUT"
T_IF = "IF"
T_ELSE = "ELSE"
T_END = "END"
T_WHILE = "WHILE"
T_FOR = "FOR"
T_TO = "TO"
T_STEP = "STEP"
T_FN = "FN"
T_RETURN = "RETURN"
T_BREAK = "BREAK"
T_CONTINUE = "CONTINUE"

KEYWORDS = {
    "let": T_LET,
    "print": T_PRINT,
    "input": T_INPUT,
    "if": T_IF,
    "else": T_ELSE,
    "end": T_END,
    "while": T_WHILE,
    "for": T_FOR,
    "to": T_TO,
    "step": T_STEP,
    "fn": T_FN,
    "return": T_RETURN,
    "break": T_BREAK,
    "continue": T_CONTINUE,
    "and": T_AND,
    "or": T_OR,
    "not": T_NOT,
    "true": T_TRUE,
    "false": T_FALSE,
}
