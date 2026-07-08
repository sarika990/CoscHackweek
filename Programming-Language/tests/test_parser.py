import unittest
from lexer import Lexer
from parser import Parser
from ast_nodes import *
from errors import ParserError


class TestParser(unittest.TestCase):
    def test_variable_declaration(self) -> None:
        lexer = Lexer("let val = 42")
        tokens = lexer.tokenize()
        parser = Parser(tokens)
        ast = parser.parse()

        self.assertIsInstance(ast, Program)
        self.assertEqual(len(ast.statements), 1)
        self.assertIsInstance(ast.statements[0], VarDecl)
        self.assertEqual(ast.statements[0].name, "val")
        self.assertIsInstance(ast.statements[0].value_expr, Literal)
        self.assertEqual(ast.statements[0].value_expr.value, 42)

    def test_precedence(self) -> None:
        # 1 + 2 * 3 should parse as 1 + (2 * 3)
        lexer = Lexer("1 + 2 * 3")
        tokens = lexer.tokenize()
        parser = Parser(tokens)
        ast = parser.parse()

        self.assertEqual(len(ast.statements), 1)
        expr = ast.statements[0]
        self.assertIsInstance(expr, BinOp)
        self.assertEqual(expr.op, "+")
        self.assertIsInstance(expr.left, Literal)
        self.assertEqual(expr.left.value, 1)
        self.assertIsInstance(expr.right, BinOp)
        self.assertEqual(expr.right.op, "*")

    def test_while_loop(self) -> None:
        lexer = Lexer("while true\nprint 1\nend")
        tokens = lexer.tokenize()
        parser = Parser(tokens)
        ast = parser.parse()

        self.assertEqual(len(ast.statements), 1)
        self.assertIsInstance(ast.statements[0], WhileStmt)
        self.assertIsInstance(ast.statements[0].condition, Literal)
        self.assertTrue(ast.statements[0].condition.value)
        self.assertEqual(len(ast.statements[0].body), 1)

    def test_fn_def(self) -> None:
        lexer = Lexer("fn double(x)\nreturn x * 2\nend")
        tokens = lexer.tokenize()
        parser = Parser(tokens)
        ast = parser.parse()

        self.assertEqual(len(ast.statements), 1)
        self.assertIsInstance(ast.statements[0], FnDef)
        self.assertEqual(ast.statements[0].name, "double")
        self.assertEqual(ast.statements[0].params, ["x"])

    def test_syntax_error(self) -> None:
        lexer = Lexer("let x =")
        tokens = lexer.tokenize()
        parser = Parser(tokens)
        with self.assertRaises(ParserError):
            parser.parse()


if __name__ == "__main__":
    unittest.main()
