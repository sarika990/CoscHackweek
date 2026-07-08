class ASTNode:
    """Base class for all AST nodes."""
    def __init__(self, line: int = None, column: int = None):
        self.line = line
        self.column = column


class Program(ASTNode):
    def __init__(self, statements: list[ASTNode], line: int = None, column: int = None):
        super().__init__(line, column)
        self.statements = statements

    def __repr__(self) -> str:
        return f"Program({self.statements})"


# Expressions

class Expr(ASTNode):
    """Base class for expression AST nodes."""
    pass


class Literal(Expr):
    def __init__(self, value: any, line: int = None, column: int = None):
        super().__init__(line, column)
        self.value = value

    def __repr__(self) -> str:
        return f"Literal({repr(self.value)})"


class Identifier(Expr):
    def __init__(self, name: str, line: int = None, column: int = None):
        super().__init__(line, column)
        self.name = name

    def __repr__(self) -> str:
        return f"Identifier({self.name})"


class BinOp(Expr):
    def __init__(self, left: Expr, op: str, right: Expr, line: int = None, column: int = None):
        super().__init__(line, column)
        self.left = left
        self.op = op
        self.right = right

    def __repr__(self) -> str:
        return f"BinOp({self.left}, {self.op}, {self.right})"


class UnaryOp(Expr):
    def __init__(self, op: str, expr: Expr, line: int = None, column: int = None):
        super().__init__(line, column)
        self.op = op
        self.expr = expr

    def __repr__(self) -> str:
        return f"UnaryOp({self.op}, {self.expr})"


class FnCall(Expr):
    def __init__(self, name: str, args: list[Expr], line: int = None, column: int = None):
        super().__init__(line, column)
        self.name = name
        self.args = args

    def __repr__(self) -> str:
        return f"FnCall({self.name}, {self.args})"


# Statements

class Stmt(ASTNode):
    """Base class for statement AST nodes."""
    pass


class VarDecl(Stmt):
    def __init__(self, name: str, value_expr: Expr, line: int = None, column: int = None):
        super().__init__(line, column)
        self.name = name
        self.value_expr = value_expr

    def __repr__(self) -> str:
        return f"VarDecl({self.name} = {self.value_expr})"


class VarAssign(Stmt):
    def __init__(self, name: str, value_expr: Expr, line: int = None, column: int = None):
        super().__init__(line, column)
        self.name = name
        self.value_expr = value_expr

    def __repr__(self) -> str:
        return f"VarAssign({self.name} = {self.value_expr})"


class PrintStmt(Stmt):
    def __init__(self, expr: Expr, line: int = None, column: int = None):
        super().__init__(line, column)
        self.expr = expr

    def __repr__(self) -> str:
        return f"Print({self.expr})"


class InputStmt(Stmt):
    def __init__(self, name: str, line: int = None, column: int = None):
        super().__init__(line, column)
        self.name = name

    def __repr__(self) -> str:
        return f"Input({self.name})"


class IfStmt(Stmt):
    def __init__(self, condition: Expr, then_branch: list[ASTNode], else_branch: list[ASTNode] = None, line: int = None, column: int = None):
        super().__init__(line, column)
        self.condition = condition
        self.then_branch = then_branch
        self.else_branch = else_branch if else_branch is not None else []

    def __repr__(self) -> str:
        return f"If({self.condition}, then={self.then_branch}, else={self.else_branch})"


class WhileStmt(Stmt):
    def __init__(self, condition: Expr, body: list[ASTNode], line: int = None, column: int = None):
        super().__init__(line, column)
        self.condition = condition
        self.body = body

    def __repr__(self) -> str:
        return f"While({self.condition}, body={self.body})"


class ForStmt(Stmt):
    def __init__(self, var_name: str, start_expr: Expr, end_expr: Expr, step_expr: Expr, body: list[ASTNode], line: int = None, column: int = None):
        super().__init__(line, column)
        self.var_name = var_name
        self.start_expr = start_expr
        self.end_expr = end_expr
        self.step_expr = step_expr
        self.body = body

    def __repr__(self) -> str:
        return f"For({self.var_name} from {self.start_expr} to {self.end_expr} step {self.step_expr}, body={self.body})"


class FnDef(Stmt):
    def __init__(self, name: str, params: list[str], body: list[ASTNode], line: int = None, column: int = None):
        super().__init__(line, column)
        self.name = name
        self.params = params
        self.body = body

    def __repr__(self) -> str:
        return f"FnDef({self.name}({', '.join(self.params)}), body={self.body})"


class ReturnStmt(Stmt):
    def __init__(self, expr: Expr = None, line: int = None, column: int = None):
        super().__init__(line, column)
        self.expr = expr

    def __repr__(self) -> str:
        return f"Return({self.expr})"


class BreakStmt(Stmt):
    def __repr__(self) -> str:
        return "Break"


class ContinueStmt(Stmt):
    def __repr__(self) -> str:
        return "Continue"
