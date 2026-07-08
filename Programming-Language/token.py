import os
import sys
import importlib.util

# Directly locate and load Python's standard library 'token' module to prevent shadowing conflicts
try:
    stdlib_dir = os.path.dirname(os.__file__)
    std_token_path = os.path.join(stdlib_dir, "token.py")
    if os.path.exists(std_token_path):
        spec = importlib.util.spec_from_file_location("_std_token", std_token_path)
        _std_token = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(_std_token)
        
        # Inject standard token module properties
        for k, v in _std_token.__dict__.items():
            if k in ("__all__", "__file__", "__doc__") or not k.startswith("__"):
                globals()[k] = v
except Exception:
    pass

class Token:
    def __init__(self, type_: str, value: any = None, line: int = 1, column: int = 1):
        self.type = type_
        self.value = value
        self.line = line
        self.column = column

    def __repr__(self) -> str:
        if self.value is not None:
            return f"Token({self.type}, {repr(self.value)}, line={self.line}, col={self.column})"
        return f"Token({self.type}, line={self.line}, col={self.column})"
