# Learner Note Standards

Last checked: 2026-06-11.

This repo's notes should teach understanding, not just collect solutions. I
compared the current structure against strong public learning references:

- MIT OCW 6.006 pairs lecture notes with practice problems, assignments,
  quizzes, and solutions.
- OpenDSA combines text, visuals, algorithm walkthroughs, and interactive
  exercises so learners can check whether they actually understood the reading.
- CP-Algorithms is organized by reusable algorithm and data-structure families,
  with compact explanations, implementation details, and complexity.
- The current Bun docs are structured for fast scanning and deeper follow-up:
  overview, examples, reference, and best practices.

Use this standard when reading, writing, or reviewing notes, comments, guides,
and generated practice prompts.

## The Learning Shape

Every useful note should answer these questions in order:

1. What problem is this solving?
2. What data structure or pattern makes it work?
3. What invariant, recurrence, or contract proves it is correct?
4. What happens on a small dry run?
5. Which edge cases break naive code?
6. What is the simplest implementation shape?
7. What are the time and auxiliary space costs?
8. When should you choose this approach over alternatives?
9. What changes in production or system design, if relevant?

If a note cannot answer those questions, it is probably a reminder, not a
teaching note.

## How To Read This Repo

Read in this order for each topic:

1. Guide: build the mental model and vocabulary.
2. Source JSDoc/comments: learn the invariant and implementation contract.
3. Tests: discover edge cases and expected behavior.
4. Generated `practice/` file: rebuild from memory.
5. Reference implementation: compare only after your version passes or gets
   stuck for a concrete reason.
6. Your own note: record the pattern, invariant, bug, and review date.

Do not turn the repo into passive reading. The source only becomes useful when
you trace, implement, test, and explain it.

## Good Comments

Good comments explain why code exists, what must stay true, or what trade-off
was chosen:

```ts
// The window is valid only while every character appears once.
// Move left past the previous duplicate so each index is visited at most twice.
```

Avoid comments that repeat the next line:

```ts
// Increment i.
i++;
```

For learner TODOs, prefer prompts that preserve thinking:

```ts
// TODO: Trace one sample input, then implement the invariant-preserving step.
```

Avoid TODOs that reveal the whole solution without teaching the reason:

```ts
// TODO: Put target - current in a map and return the saved index.
```

## Topic Guide Checklist

A learner-friendly guide should include:

- Beginner explanation.
- Pattern signal: how to recognize the problem.
- Invariant, recurrence, or data-structure contract.
- Small dry run with state changes.
- Implementation outline without hiding the key decision.
- Focused tests and edge cases.
- Time and auxiliary space complexity using the right variables.
- Common bugs.
- Follow-ups or production notes where relevant.
- A suggested review cadence.

## Personal Study Notes

After each practice attempt, write no more than five lines:

```text
Target:
Pattern:
Invariant:
Bug or edge case I missed:
Next review:
```

Short notes are easier to review. If you need a long explanation, write it once
in the topic guide, then keep daily notes compact.

## External References

- MIT OCW 6.006 Introduction to Algorithms: https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/
- OpenDSA: https://opendsa-server.cs.vt.edu/ODSA/Books/Everything/html/
- CP-Algorithms: https://cp-algorithms.com/
- Bun documentation: https://bun.com/docs
