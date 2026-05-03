# Backtracking Guide

Backtracking means trying a choice, exploring it, and then undoing the choice before trying the next option.

## Mental Model

Use this template:

```ts
function backtrack(state) {
  if (state is complete) {
    save answer;
    return;
  }

  for (const choice of choices) {
    make choice;
    backtrack(next state);
    undo choice;
  }
}
```

## Letter Combinations

Function: `letterCombinations`

Problem:

Given phone keypad digits, return every possible letter string.

Step-by-step:

1. Map each digit to possible letters.
2. Pick one letter for the current digit.
3. Recurse to the next digit.
4. When the string length equals digits length, save it.
5. Undo the last letter and try another.

Complexity:

- Time: `O(4^n)`
- Space: `O(n)` excluding output

## Generate Parentheses

Function: `generateParentheses`

Problem:

Generate all valid strings with `n` pairs of parentheses.

Rules:

- You can add `(` while `open < n`.
- You can add `)` while `close < open`.

Why the second rule matters:

You cannot close more parentheses than you opened.

Complexity:

- Time: Catalan number scale
- Space: `O(n)` excluding output

## Word Search

Function: `wordSearch`

Problem:

Find whether a word exists in a grid by moving up, down, left, or right.

Step-by-step:

1. Try every cell as a starting point.
2. If the cell matches the current word character, mark it visited.
3. Search four neighbors for the next character.
4. Restore the cell before returning.

Why restore?

The same board cell may be needed for a different path later.

Complexity:

- Time: `O(rows * cols * 4^wordLength)`
- Space: `O(wordLength)`

