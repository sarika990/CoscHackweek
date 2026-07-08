# MiniLanguage Grammar Specification

This document defines the formal syntax of MiniLanguage using Extended Backus-Naur Form (EBNF).

## EBNF Grammar

```ebnf
Program         = { Statement } EOF ;

Statement       = VarDecl
                | VarAssign
                | PrintStmt
                | InputStmt
                | IfStmt
                | WhileStmt
                | ForStmt
                | FnDef
                | ReturnStmt
                | BreakStmt
                | ContinueStmt
                | ExpressionStmt ;

VarDecl         = "let" Identifier "=" Expression StatementEnd ;
VarAssign       = Identifier "=" Expression StatementEnd ;
PrintStmt       = "print" Expression StatementEnd ;
InputStmt       = "input" Identifier StatementEnd ;

IfStmt          = "if" Expression StatementEnd
                  { Statement }
                  [ "else" StatementEnd { Statement } ]
                  "end" StatementEnd ;

WhileStmt       = "while" Expression StatementEnd
                  { Statement }
                  "end" StatementEnd ;

ForStmt         = "for" Identifier "=" Expression "to" Expression [ "step" Expression ] StatementEnd
                  { Statement }
                  "end" StatementEnd ;

FnDef           = "fn" Identifier "(" [ ParameterList ] ")" StatementEnd
                  { Statement }
                  "end" StatementEnd ;

ParameterList   = Identifier { "," Identifier } ;
ReturnStmt      = "return" [ Expression ] StatementEnd ;
BreakStmt       = "break" StatementEnd ;
ContinueStmt    = "continue" StatementEnd ;

ExpressionStmt  = Expression StatementEnd ;
StatementEnd    = NEWLINE | EOF ;

(* Expressions & Operator Precedence *)
Expression      = LogicalOr ;
LogicalOr       = LogicalAnd { "or" LogicalAnd } ;
LogicalAnd      = Equality { "and" Equality } ;
Equality        = Comparison { ( "==" | "!=" ) Comparison } ;
Comparison      = Term { ( "<" | "<=" | ">" | ">=" ) Term } ;
Term            = Factor { ( "+" | "-" ) Factor } ;
Factor          = Unary { ( "*" | "/" | "%" ) Unary } ;
Unary           = [ "not" | "-" | "+" ] Unary
                | Primary ;

Primary         = Integer
                | String
                | Boolean
                | "(" Expression ")"
                | FnCall
                | Identifier ;

FnCall          = Identifier "(" [ ArgumentList ] ")" ;
ArgumentList    = Expression { "," Expression } ;

(* Lexical Tokens *)
Identifier      = Letter { Letter | Digit | "_" } ;
Letter          = "a" | ... | "z" | "A" | ... | "Z" | "_" ;
Integer         = Digit { Digit } ;
Digit           = "0" | ... | "9" ;
String          = '"' { Character } '"' ;
Boolean         = "true" | "false" ;
```
