# Language Syntax Guide

This guide describes the syntax, operators, comments, statements, and constructs supported by MiniLanguage.

---

## 1. Comments
Comments start with `#` and run until the end of the line.
```
# This is a comment
let x = 5  # Inline comment
```

## 2. Variables
Variables are declared using the `let` keyword and reassigned without it. They can store integers, strings, or booleans.
```
let score = 95
let message = "Passed!"
let active = true

score = score + 5
```

## 3. Arithmetic Operators
- Addition: `+` (also performs string concatenation or string repetition/multiplication)
- Subtraction: `-`
- Multiplication: `*`
- Division: `/` (performed as integer/floor division)
- Modulo: `%`

```
let total = (10 + 5) * 2 / 3
let name = "Hello " + "World"
```

## 4. Comparison and Logical Operators
Comparison operators: `==`, `!=`, `<`, `<=`, `>`, `>=` (we also accept typographical `«»` for `>` and `«=»` for `>=`).
Logical operators: `and`, `or`, `not`

```
if x < 10 and not y == 5
    print "Condition met"
end
```

## 5. Control Flow

### If / Else
```
if x < y
    print "x is smaller"
else
    print "x is larger or equal"
end
```

### While Loop
```
let i = 0
while i < 5
    print i
    i = i + 1
end
```

### For Loop
Includes optional step keyword (defaults to 1 if omitted).
```
for i = 1 to 10 step 2
    print i
end
```

### Break and Continue
```
while true
    let x = 5
    if x == 5
        break
    end
end
```

## 6. Input / Output
- `print <expr>`: Prints the value to stdout.
- `input <var>`: Reads a line from stdin and assigns it to `<var>` (automatically converting to an integer if the input is purely numeric).

```
print "Enter your name:"
let name = ""
input name
print "Hello, " + name
```

## 7. Functions
Functions are defined using `fn` and return values using `return`.
```
fn add(a, b)
    return a + b
end

let result = add(10, 20)
print result
```
