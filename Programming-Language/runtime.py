from environment import Environment


class ReturnValue(Exception):
    """Exception used to bubble up a return value from a function call."""
    def __init__(self, value: any):
        self.value = value


class BreakSignal(Exception):
    """Exception used to break out of a loop."""
    pass


class ContinueSignal(Exception):
    """Exception used to jump to the next iteration of a loop."""
    pass


class Function:
    """Representation of a user-defined function in the language runtime."""
    def __init__(self, name: str, params: list[str], body: list, closure: Environment):
        self.name = name
        self.params = params
        self.body = body
        self.closure = closure

    def __call__(self, interpreter, args: list[any], line: int = None, col: int = None) -> any:
        # Create a new local environment using closure
        env = Environment(self.closure)

        if len(args) != len(self.params):
            from errors import RunTimeError
            raise RunTimeError(
                f"Function '{self.name}' expects {len(self.params)} arguments, but got {len(args)}",
                line, col
            )

        # Bind parameters to arguments
        for param, arg in zip(self.params, args):
            env.define(param, arg)

        # Execute body within the new environment
        try:
            interpreter.execute_block(self.body, env)
        except ReturnValue as r:
            return r.value

        return None

    def __repr__(self) -> str:
        return f"<function {self.name}>"
