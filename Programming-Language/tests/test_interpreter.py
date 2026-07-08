import unittest
from lexer import Lexer
from parser import Parser
from interpreter import Interpreter
from errors import RunTimeError


class TestInterpreter(unittest.TestCase):
    def run_source(self, source: str) -> Interpreter:
        lexer = Lexer(source)
        tokens = lexer.tokenize()
        parser = Parser(tokens)
        ast = parser.parse()
        interpreter = Interpreter()
        interpreter.interpret(ast)
        return interpreter

    def test_variable_assignment(self) -> None:
        source = "let a = 10\nlet b = 20\na = a + b"
        interpreter = self.run_source(source)
        self.assertEqual(interpreter.global_env.lookup("a"), 30)

    def test_conditionals(self) -> None:
        source = "let x = 5\nlet result = 0\nif x < 10\nresult = 1\nelse\nresult = 2\nend"
        interpreter = self.run_source(source)
        self.assertEqual(interpreter.global_env.lookup("result"), 1)

    def test_functions(self) -> None:
        source = "fn add(x, y)\nreturn x + y\nend\nlet sum = add(15, 35)"
        interpreter = self.run_source(source)
        self.assertEqual(interpreter.global_env.lookup("sum"), 50)

    def test_division_by_zero(self) -> None:
        source = "let x = 10 / 0"
        with self.assertRaises(RunTimeError) as context:
            self.run_source(source)
        self.assertIn("Division by zero", str(context.exception))

    def test_string_operations(self) -> None:
        source = 'let hello = "Hello "\nlet world = "World"\nlet greet = hello + world'
        interpreter = self.run_source(source)
        self.assertEqual(interpreter.global_env.lookup("greet"), "Hello World")


if __name__ == "__main__":
    unittest.main()
