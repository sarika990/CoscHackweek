from ast_nodes import *
from environment import Environment
from errors import RunTimeError
from runtime import Function, ReturnValue, BreakSignal, ContinueSignal


class Interpreter:
    def __init__(self):
        self.global_env = Environment()

    def interpret(self, program: Program) -> None:
        """Interpret a parsed program AST."""
        try:
            for stmt in program.statements:
                self.execute(stmt, self.global_env)
        except RunTimeError as e:
            # Re-raise runtime errors to be caught in main.py
            raise e
        except Exception as e:
            raise RunTimeError(f"Internal error during execution: {str(e)}")

    def execute(self, node: ASTNode, env: Environment) -> None:
        """Execute a statement node in the given environment."""
        if isinstance(node, VarDecl):
            val = self.evaluate(node.value_expr, env)
            env.define(node.name, val)

        elif isinstance(node, VarAssign):
            val = self.evaluate(node.value_expr, env)
            env.assign(node.name, val, node.line, node.column)

        elif isinstance(node, PrintStmt):
            val = self.evaluate(node.expr, env)
            # Custom printing: print booleans as lowercase true/false
            if isinstance(val, bool):
                print("true" if val else "false")
            elif val is None:
                print("nil")
            else:
                print(val)

        elif isinstance(node, InputStmt):
            try:
                user_val = input()
            except (KeyboardInterrupt, EOFError):
                user_val = ""
            
            # Coerce input value to int if it looks like an integer
            try:
                if user_val.strip().isdigit() or (user_val.strip().startswith("-") and user_val.strip()[1:].isdigit()):
                    val = int(user_val)
                else:
                    val = user_val
            except Exception:
                val = user_val
            env.assign(node.name, val, node.line, node.column)

        elif isinstance(node, IfStmt):
            cond_val = self.evaluate(node.condition, env)
            if self.is_truthy(cond_val):
                self.execute_block(node.then_branch, env)
            else:
                self.execute_block(node.else_branch, env)

        elif isinstance(node, WhileStmt):
            while self.is_truthy(self.evaluate(node.condition, env)):
                try:
                    self.execute_block(node.body, env)
                except BreakSignal:
                    break
                except ContinueSignal:
                    continue

        elif isinstance(node, ForStmt):
            # Evaluate start and end expressions
            start_val = self.evaluate(node.start_expr, env)
            end_val = self.evaluate(node.end_expr, env)
            step_val = self.evaluate(node.step_expr, env)

            if not isinstance(start_val, int) or not isinstance(end_val, int) or not isinstance(step_val, int):
                raise RunTimeError("For loop bounds and step must be integers", node.line, node.column)

            # Create a loop environment scope
            loop_env = Environment(env)
            loop_env.define(node.var_name, start_val)

            # Execution loop
            # If step is positive, loop as long as var <= end
            # If step is negative, loop as long as var >= end
            while True:
                current_val = loop_env.lookup(node.var_name, node.line, node.column)
                if step_val >= 0 and current_val > end_val:
                    break
                elif step_val < 0 and current_val < end_val:
                    break

                try:
                    self.execute_block(node.body, loop_env)
                except BreakSignal:
                    break
                except ContinueSignal:
                    # Proceed to increment phase
                    pass

                # Increment phase
                current_val = loop_env.lookup(node.var_name, node.line, node.column)
                loop_env.assign(node.var_name, current_val + step_val, node.line, node.column)

        elif isinstance(node, FnDef):
            fn_obj = Function(node.name, node.params, node.body, env)
            env.define(node.name, fn_obj)

        elif isinstance(node, ReturnStmt):
            val = self.evaluate(node.expr, env) if node.expr else None
            raise ReturnValue(val)

        elif isinstance(node, BreakStmt):
            raise BreakSignal()

        elif isinstance(node, ContinueStmt):
            raise ContinueSignal()

        else:
            # It might be an expression statement, evaluate it
            self.evaluate(node, env)

    def execute_block(self, statements: list[ASTNode], env: Environment) -> None:
        """Execute a list of statements in a local block environment."""
        # Create a new local scope environment if desired or reuse current
        # In our case, blocks within loops/ifs run in the passed environment,
        # but function bodies and for loops handle their own environment creation.
        # This keeps scoping consistent with most simple scripting languages.
        for stmt in statements:
            self.execute(stmt, env)

    def evaluate(self, node: ASTNode, env: Environment) -> any:
        """Evaluate an expression node and return the result."""
        if isinstance(node, Literal):
            return node.value

        elif isinstance(node, Identifier):
            return env.lookup(node.name, node.line, node.column)

        elif isinstance(node, UnaryOp):
            val = self.evaluate(node.expr, env)
            if node.op == "-":
                if not isinstance(val, (int, float)):
                    raise RunTimeError("Unary '-' can only be applied to numbers", node.line, node.column)
                return -val
            elif node.op == "+":
                if not isinstance(val, (int, float)):
                    raise RunTimeError("Unary '+' can only be applied to numbers", node.line, node.column)
                return +val
            elif node.op == "not":
                return not self.is_truthy(val)
            else:
                raise RunTimeError(f"Unknown unary operator: {node.op}", node.line, node.column)

        elif isinstance(node, BinOp):
            # Short-circuit logical operators
            if node.op == "and":
                left_val = self.evaluate(node.left, env)
                if not self.is_truthy(left_val):
                    return left_val
                return self.evaluate(node.right, env)

            elif node.op == "or":
                left_val = self.evaluate(node.left, env)
                if self.is_truthy(left_val):
                    return left_val
                return self.evaluate(node.right, env)

            # Evaluate left and right for other operators
            left_val = self.evaluate(node.left, env)
            right_val = self.evaluate(node.right, env)

            # Arithmetic Operators
            if node.op == "+":
                if isinstance(left_val, int) and isinstance(right_val, int):
                    return left_val + right_val
                if isinstance(left_val, str) or isinstance(right_val, str):
                    return str(left_val) + str(right_val)
                raise RunTimeError("Operator '+' expects numbers or strings", node.line, node.column)

            elif node.op == "-":
                self.check_number_operands(node.op, left_val, right_val, node.line, node.column)
                return left_val - right_val

            elif node.op == "*":
                # Support string multiplication (e.g. "a" * 3)
                if isinstance(left_val, str) and isinstance(right_val, int):
                    return left_val * right_val
                if isinstance(left_val, int) and isinstance(right_val, str):
                    return left_val * right_val
                self.check_number_operands(node.op, left_val, right_val, node.line, node.column)
                return left_val * right_val

            elif node.op == "/":
                self.check_number_operands(node.op, left_val, right_val, node.line, node.column)
                if right_val == 0:
                    raise RunTimeError("Division by zero", node.line, node.column)
                return left_val // right_val  # Keep it integer division

            elif node.op == "%":
                self.check_number_operands(node.op, left_val, right_val, node.line, node.column)
                if right_val == 0:
                    raise RunTimeError("Division by zero", node.line, node.column)
                return left_val % right_val

            # Comparison Operators
            elif node.op == "==":
                return left_val == right_val
            elif node.op == "!=":
                return left_val != right_val
            elif node.op == "<":
                self.check_comparable_operands(node.op, left_val, right_val, node.line, node.column)
                return left_val < right_val
            elif node.op == "<=":
                self.check_comparable_operands(node.op, left_val, right_val, node.line, node.column)
                return left_val <= right_val
            elif node.op == ">":
                self.check_comparable_operands(node.op, left_val, right_val, node.line, node.column)
                return left_val > right_val
            elif node.op == ">=":
                self.check_comparable_operands(node.op, left_val, right_val, node.line, node.column)
                return left_val >= right_val
            else:
                raise RunTimeError(f"Unknown binary operator: {node.op}", node.line, node.column)

        elif isinstance(node, FnCall):
            fn = env.lookup(node.name, node.line, node.column)
            if not isinstance(fn, Function):
                raise RunTimeError(f"'{node.name}' is not a function", node.line, node.column)
            args = [self.evaluate(arg, env) for arg in node.args]
            return fn(self, args, node.line, node.column)

        else:
            raise RunTimeError(f"Unknown expression node type: {type(node).__name__}", node.line, node.column)

    def is_truthy(self, val: any) -> bool:
        if val is None:
            return False
        if isinstance(val, bool):
            return val
        if isinstance(val, int):
            return val != 0
        if isinstance(val, str):
            return val != ""
        return True

    def check_number_operands(self, op: str, left: any, right: any, line: int, col: int) -> None:
        if not isinstance(left, int) or not isinstance(right, int):
            raise RunTimeError(f"Operator '{op}' expects numeric operands", line, col)

    def check_comparable_operands(self, op: str, left: any, right: any, line: int, col: int) -> None:
        if type(left) is not type(right):
            raise RunTimeError(f"Operator '{op}' expects operands of the same type", line, col)
