# Tree 🌲 language

This was inspired\* by the [Tree esoteric language](https://esolangs.org/wiki/Tree) designed by Tslil Clingman. The author's intentions when designing this language were twofold: Create an esoteric language that looks like a tree and Design a language specifically not Turing Complete.

`Tree` 🌲 is a stack based (IFOL) and non-recursive language. The Tree in this language is significant of both the aesthetics and the program's flow control.

\* There are some syntax and behavior that are different from author's original design, check end of this document for more details

# Syntax

In Tree, there are three types of constructions: Branches, Leaves and Insects.

Branches are the building blocks of the program, they direct the flow of the program as well as cause the program to execute instructions (Leaves).

Leaves are the stack manipulators and the I/O of the language.

Insects are the flow control manipulators of the language.

## Branches

The Branches are: `|`, `\` and `/` and they all function as a navigation path to the next construction.

Direction precedence:

- `\`: navigate directly up and then up left
- `/`: navigate directly up and then up righ
- `|`: navigate directly up left, then up right, then up

## Leaves

- `+`, `-`, `*`, `%`: Pops top two stack elements, applies operator, pushes result (sum, difference, product, quotient).
- `@`: Pops the top stack element, records its value. Moves the stack element in the position of that value to the top of the stack.
- `#`: Pops the top stack element and disregards it.
- `~`: Pushes a duplicate of the top stack element.
- `^`: Pops top stack element to output.
- `:`: Pushes input to the stack.

## Insects

`<`, `>`, `=`, `!=`: Pops top two stack elements, compares then according to the operator (greater than, equal to, not equal to) and branches if true.

Insects can only be used next to a `|` branch.

## Other

Anything that is not a Branch, Leaf, or Insect merely pushes its own value to the stack.

## Numbers

Numbers are treated specially when being pushed. Whenever a number is reached, all the numbers of that branch are read off, from bottom to top, left to right, to form a single decimal number.

For example:

```
1
 32
/
```

Would push 321 to the stack, check the parser tests for more examples.

# Syntax Usage

Each valid tree program must stem from a single, main, vertical branch ( `|` ) on the last line. From then on, it is up to the programmer to place further branches stemming from the main branch or from other branches. The order that branches are traced is as follows:

The program starts at the main branch and moves upwards. It then follows the lowest branch it finds off of the main branch. It then follows that branch, choosing always the left-most possible branch first. Finally, when the lowest possible branches have been explored, it returns the the branch from which the current branch stems, and explores the next right-most branches that have not been followed yet.

Leaves may be placed only at the end of branches.

Insects may only be placed next to `|` branches.


# Example

Hello world:

```
      ^^^
     ^^|^^
    ^^\|/^^
    ^^\|/^^
      \|/^
     H^|/
      \| e
       |/
     o |l~
      \|/
   32 ,|
    \/ |
     \ |  W
 !    \| /
 \  d  |/   o
  \/ l | r /
   \/  | \/
    \  | /
     \ |/
      \|
       |
```

Receives two characters as input and outputs the greater of the two inputs:

```
      ^
   #  |
    \<|
      | @
    0 |/
     \|
      |  ~
    : | /
     \|/  ~
   :  |  /
    \ | /
     \|/
      |
```

# Differences from original design

- `:` used instead of `v` for input
- Direction precedence of branches
- Direction on how nodes are read, this implementation reads left to right instead of lowest to highest (TODO)