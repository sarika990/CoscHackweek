import unittest
from lexer import Lexer
from tokens import *
from errors import LexerError


class TestLexer(unittest.TestCase):
    def test_basic_tokens(self) -> None:
        source = 'let x = 123\nprint "hello"'
        lexer = Lexer(source)
        tokens = lexer.tokenize()

        self.assertEqual(len(tokens), 8)  # let, x, =, 123, \n, print, "hello", EOF
        self.assertEqual(tokens[0].type, T_LET)
        self.assertEqual(tokens[1].type, T_IDENTIFIER)
        self.assertEqual(tokens[1].value, "x")
        self.assertEqual(tokens[2].type, T_ASSIGN)
        self.assertEqual(tokens[3].type, T_INT)
        self.assertEqual(tokens[3].value, 123)
        self.assertEqual(tokens[4].type, T_NEWLINE)
        self.assertEqual(tokens[5].type, T_PRINT)
        self.assertEqual(tokens[6].type, T_STRING)
        self.assertEqual(tokens[6].value, "hello")
        self.assertEqual(tokens[7].type, T_EOF)

    def test_operators(self) -> None:
        source = "+ - * / % == != < <= > >= and or not"
        lexer = Lexer(source)
        tokens = [t.type for t in lexer.tokenize()]
        expected = [
            T_PLUS, T_MINUS, T_MUL, T_DIV, T_MOD,
            T_EQ, T_NE, T_LT, T_LTE, T_GT, T_GTE,
            T_AND, T_OR, T_NOT, T_EOF
        ]
        self.assertEqual(tokens, expected)

    def test_typographical_quotes(self) -> None:
        source = "«» «=»"
        lexer = Lexer(source)
        tokens = [t.type for t in lexer.tokenize()]
        expected = [T_GT, T_GTE, T_EOF]
        self.assertEqual(tokens, expected)

    def test_comments(self) -> None:
        source = "# comment line\nlet a = 1 # inline comment"
        lexer = Lexer(source)
        tokens = [t.type for t in lexer.tokenize() if t.type != T_NEWLINE]
        expected = [T_LET, T_IDENTIFIER, T_ASSIGN, T_INT, T_EOF]
        self.assertEqual(tokens, expected)

    def test_lexer_error(self) -> None:
        lexer = Lexer("let @ = 1")
        with self.assertRaises(LexerError):
            lexer.tokenize()


if __name__ == "__main__":
    unittest.main()
