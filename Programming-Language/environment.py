from errors import RunTimeError


class Environment:
    def __init__(self, parent=None):
        self.variables = {}
        self.parent = parent

    def define(self, name: str, value: any) -> None:
        """Define a new variable in the current local scope."""
        self.variables[name] = value

    def lookup(self, name: str, line: int = None, col: int = None) -> any:
        """Look up a variable value recursively in the scope tree."""
        if name in self.variables:
            return self.variables[name]
        if self.parent:
            return self.parent.lookup(name, line, col)
        raise RunTimeError(f"Undefined variable '{name}'", line, col)

    def assign(self, name: str, value: any, line: int = None, col: int = None) -> None:
        """Assign a new value to an existing variable in the scope tree."""
        if name in self.variables:
            self.variables[name] = value
            return
        if self.parent:
            self.parent.assign(name, value, line, col)
            return
        raise RunTimeError(f"Undefined variable '{name}'", line, col)
