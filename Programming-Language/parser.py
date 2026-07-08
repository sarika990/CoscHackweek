from token import Token
from tokens import *
from ast_nodes import *
from errors import ParserError


class Parser:
    def __init__(self, tokens: list[Token]):
        self.tokens = tokens
        self.position = 0

    def current_token(self) -> Token:
        return self.tokens[self.position]

    def peek(self, offset: int = 1) -> Token:
        pos = self.position + offset
        if pos >= len(self.tokens):
            return self.tokens[-1]
        return self.tokens[pos]

    def advance(self) -> Token:
        tok = self.current_token()
        if tok.type != T_EOF:
            self.position += 1
        return tok

    def error(self, message: str, token: Token = None) -> None:
        if token is None:
            token = self.current_token()
        raise ParserError(message, token.line, token.column)

    def consume(self, expected_type: str, err_msg: str) -> Token:
        if self.current_token().type == expected_type:
            return self.advance()
        self.error(err_msg)

    def match(self, *types: str) -> bool:
        if self.current_token().type in types:
            self.advance()
            return True
        return False

    def skip_newlines(self) -> None:
        while self.current_token().type == T_NEWLINE:
            self.advance()

    def parse(self) -> Program:
        statements = []
        self.skip_newlines()
        while self.current_token().type != T_EOF:
            stmt = self.parse_statement()
            if stmt:
                statements.append(stmt)
            self.skip_newlines()
        return Program(statements, 1, 1)

    def parse_statement(self) -> Stmt:
        self.skip_newlines()
        tok = self.current_token()

        if tok.type == T_LET:
            return self.parse_var_decl()
        elif tok.type == T_PRINT:
            return self.parse_print()
        elif tok.type == T_INPUT:
            return self.parse_input()
        elif tok.type == T_IF:
            return self.parse_if()
        elif tok.type == T_WHILE:
            return self.parse_while()
        elif tok.type == T_FOR:
            return self.parse_for()
        elif tok.type == T_FN:
            return self.parse_fn_def()
        elif tok.type == T_RETURN:
            return self.parse_return()
        elif tok.type == T_BREAK:
            self.advance()
            self.expect_statement_end()
            return BreakStmt(tok.line, tok.column)
        elif tok.type == T_CONTINUE:
            self.advance()
            self.expect_statement_end()
            return ContinueStmt(tok.line, tok.column)
        elif tok.type == T_IDENTIFIER:
            # Check if assignment (e.g. x = 10)
            if self.peek().type == T_ASSIGN:
                return self.parse_assignment()
            else:
                # Expression statement (e.g., function call)
                expr = self.parse_expression()
                self.expect_statement_end()
                return expr
        else:
            # Try to parse an expression statement (e.g., call)
            expr = self.parse_expression()
            self.expect_statement_end()
            return expr

    def expect_statement_end(self) -> None:
        tok = self.current_token()
        if tok.type in (T_NEWLINE, T_EOF):
            self.advance()
        else:
            # Allow statement end right before keyword "end" or "else" without explicit newline
            if tok.type not in (T_END, T_ELSE):
                self.error(f"Expected newline or end of statement, got {tok.type}")

    def parse_var_decl(self) -> VarDecl:
        start_tok = self.advance()  # Consume let
        name_tok = self.consume(T_IDENTIFIER, "Expected identifier after 'let'")
        self.consume(T_ASSIGN, "Expected '=' after identifier in variable declaration")
        expr = self.parse_expression()
        self.expect_statement_end()
        return VarDecl(name_tok.value, expr, start_tok.line, start_tok.column)

    def parse_assignment(self) -> VarAssign:
        name_tok = self.advance()  # Consume identifier
        self.advance()  # Consume =
        expr = self.parse_expression()
        self.expect_statement_end()
        return VarAssign(name_tok.value, expr, name_tok.line, name_tok.column)

    def parse_print(self) -> PrintStmt:
        start_tok = self.advance()  # Consume print
        expr = self.parse_expression()
        self.expect_statement_end()
        return PrintStmt(expr, start_tok.line, start_tok.column)

    def parse_input(self) -> InputStmt:
        start_tok = self.advance()  # Consume input
        name_tok = self.consume(T_IDENTIFIER, "Expected identifier after 'input'")
        self.expect_statement_end()
        return InputStmt(name_tok.value, start_tok.line, start_tok.column)

    def parse_if(self) -> IfStmt:
        start_tok = self.advance()  # Consume if
        condition = self.parse_expression()
        self.expect_statement_end()

        then_branch = []
        else_branch = []

        self.skip_newlines()
        while self.current_token().type not in (T_EOF, T_ELSE, T_END):
            stmt = self.parse_statement()
            if stmt:
                then_branch.append(stmt)
            self.skip_newlines()

        if self.current_token().type == T_ELSE:
            self.advance()  # Consume else
            self.expect_statement_end()
            self.skip_newlines()
            while self.current_token().type not in (T_EOF, T_END):
                stmt = self.parse_statement()
                if stmt:
                    else_branch.append(stmt)
                self.skip_newlines()

        self.consume(T_END, "Expected 'end' at the end of 'if' block")
        return IfStmt(condition, then_branch, else_branch, start_tok.line, start_tok.column)

    def parse_while(self) -> WhileStmt:
        start_tok = self.advance()  # Consume while
        condition = self.parse_expression()
        self.expect_statement_end()

        body = []
        self.skip_newlines()
        while self.current_token().type not in (T_EOF, T_END):
            stmt = self.parse_statement()
            if stmt:
                body.append(stmt)
            self.skip_newlines()

        self.consume(T_END, "Expected 'end' at the end of 'while' block")
        return WhileStmt(condition, body, start_tok.line, start_tok.column)

    def parse_for(self) -> ForStmt:
        start_tok = self.advance()  # Consume for
        var_tok = self.consume(T_IDENTIFIER, "Expected variable name after 'for'")
        self.consume(T_ASSIGN, "Expected '=' after variable name in for loop")
        start_expr = self.parse_expression()
        self.consume(T_TO, "Expected 'to' in for loop")
        end_expr = self.parse_expression()

        # Step is optional
        step_expr = None
        if self.current_token().type == T_STEP:
            self.advance()  # Consume step
            step_expr = self.parse_expression()
        else:
            step_expr = Literal(1, start_tok.line, start_tok.column)

        self.expect_statement_end()

        body = []
        self.skip_newlines()
        while self.current_token().type not in (T_EOF, T_END):
            stmt = self.parse_statement()
            if stmt:
                body.append(stmt)
            self.skip_newlines()

        self.consume(T_END, "Expected 'end' at the end of 'for' block")
        return ForStmt(var_tok.value, start_expr, end_expr, step_expr, body, start_tok.line, start_tok.column)

    def parse_fn_def(self) -> FnDef:
        start_tok = self.advance()  # Consume fn
        name_tok = self.consume(T_IDENTIFIER, "Expected function name after 'fn'")
        self.consume(T_LPAREN, "Expected '(' after function name")

        params = []
        if self.current_token().type != T_RPAREN:
            param_tok = self.consume(T_IDENTIFIER, "Expected parameter name")
            params.append(param_tok.value)
            while self.current_token().type == T_COMMA:
                self.advance()  # Consume comma
                param_tok = self.consume(T_IDENTIFIER, "Expected parameter name")
                params.append(param_tok.value)

        self.consume(T_RPAREN, "Expected ')' after parameters")
        self.expect_statement_end()

        body = []
        self.skip_newlines()
        while self.current_token().type not in (T_EOF, T_END):
            stmt = self.parse_statement()
            if stmt:
                body.append(stmt)
            self.skip_newlines()

        self.consume(T_END, "Expected 'end' at the end of 'fn' block")
        return FnDef(name_tok.value, params, body, start_tok.line, start_tok.column)

    def parse_return(self) -> ReturnStmt:
        start_tok = self.advance()  # Consume return
        expr = None
        if self.current_token().type not in (T_NEWLINE, T_EOF, T_END, T_ELSE):
            expr = self.parse_expression()
        self.expect_statement_end()
        return ReturnStmt(expr, start_tok.line, start_tok.column)

    # Expressions Parsing

    def parse_expression(self) -> Expr:
        return self.parse_logical_or()

    def parse_logical_or(self) -> Expr:
        expr = self.parse_logical_and()
        while self.current_token().type == T_OR:
            op_tok = self.advance()
            right = self.parse_logical_and()
            expr = BinOp(expr, op_tok.value, right, op_tok.line, op_tok.column)
        return expr

    def parse_logical_and(self) -> Expr:
        expr = self.parse_equality()
        while self.current_token().type == T_AND:
            op_tok = self.advance()
            right = self.parse_equality()
            expr = BinOp(expr, op_tok.value, right, op_tok.line, op_tok.column)
        return expr

    def parse_equality(self) -> Expr:
        expr = self.parse_comparison()
        while self.current_token().type in (T_EQ, T_NE):
            op_tok = self.advance()
            right = self.parse_comparison()
            expr = BinOp(expr, op_tok.value, right, op_tok.line, op_tok.column)
        return expr

    def parse_comparison(self) -> Expr:
        expr = self.parse_term()
        while self.current_token().type in (T_LT, T_GT, T_LTE, T_GTE):
            op_tok = self.advance()
            right = self.parse_term()
            expr = BinOp(expr, op_tok.value, right, op_tok.line, op_tok.column)
        return expr

    def parse_term(self) -> Expr:
        expr = self.parse_factor()
        while self.current_token().type in (T_PLUS, T_MINUS):
            op_tok = self.advance()
            right = self.parse_factor()
            expr = BinOp(expr, op_tok.value, right, op_tok.line, op_tok.column)
        return expr

    def parse_factor(self) -> Expr:
        expr = self.parse_unary()
        while self.current_token().type in (T_MUL, T_DIV, T_MOD):
            op_tok = self.advance()
            right = self.parse_unary()
            expr = BinOp(expr, op_tok.value, right, op_tok.line, op_tok.column)
        return expr

    def parse_unary(self) -> Expr:
        tok = self.current_token()
        if tok.type in (T_NOT, T_MINUS, T_PLUS):
            self.advance()
            expr = self.parse_unary()
            return UnaryOp(tok.value, expr, tok.line, tok.column)
        return self.parse_primary()

    def parse_primary(self) -> Expr:
        tok = self.current_token()

        if tok.type == T_INT:
            self.advance()
            return Literal(tok.value, tok.line, tok.column)
        elif tok.type == T_STRING:
            self.advance()
            return Literal(tok.value, tok.line, tok.column)
        elif tok.type == T_TRUE:
            self.advance()
            return Literal(True, tok.line, tok.column)
        elif tok.type == T_FALSE:
            self.advance()
            return Literal(False, tok.line, tok.column)
        elif tok.type == T_LPAREN:
            self.advance()
            expr = self.parse_expression()
            self.consume(T_RPAREN, "Expected ')' after expression")
            return expr
        elif tok.type == T_IDENTIFIER:
            self.advance()
            # Check if function call
            if self.current_token().type == T_LPAREN:
                self.advance()  # Consume (
                args = []
                if self.current_token().type != T_RPAREN:
                    args.append(self.parse_expression())
                    while self.current_token().type == T_COMMA:
                        self.advance()  # Consume comma
                        args.append(self.parse_expression())
                self.consume(T_RPAREN, "Expected ')' after arguments in function call")
                return FnCall(tok.value, args, tok.line, tok.column)
            return Identifier(tok.value, tok.line, tok.column)

        self.error(f"Unexpected token in expression: {tok.type}")
