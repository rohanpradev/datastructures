import { describe, expect, test } from "bun:test";
import {
  generateDocument,
  firstNonRepeatingCharacter,
  semordNilap,
} from "@/algorithms/strings/string-exercises";

describe("generateDocument", () => {
  test("should return true when document can be generated", () => {
    const characters = "aabbcc";
    const document = "abc";

    const result = generateDocument(characters, document);

    expect(result).toBe(true);
  });

  test("should return false when characters are insufficient", () => {
    const characters = "abc";
    const document = "aabb";

    const result = generateDocument(characters, document);

    expect(result).toBe(false);
  });

  test("should handle exact character match", () => {
    const characters = "hello";
    const document = "hello";

    const result = generateDocument(characters, document);

    expect(result).toBe(true);
  });

  test("should return false when document is longer than characters", () => {
    const characters = "abc";
    const document = "abcd";

    const result = generateDocument(characters, document);

    expect(result).toBe(false);
  });

  test("should handle empty document", () => {
    const characters = "abc";
    const document = "";

    const result = generateDocument(characters, document);

    expect(result).toBe(true);
  });

  test("should handle empty characters string", () => {
    const characters = "";
    const document = "a";

    const result = generateDocument(characters, document);

    expect(result).toBe(false);
  });

  test("should handle both strings empty", () => {
    const characters = "";
    const document = "";

    const result = generateDocument(characters, document);

    expect(result).toBe(true);
  });

  test("should handle repeated characters correctly", () => {
    const characters = "aaabbb";
    const document = "aab";

    const result = generateDocument(characters, document);

    expect(result).toBe(true);
  });

  test("should return false when a required character is missing", () => {
    const characters = "abc";
    const document = "abd";

    const result = generateDocument(characters, document);

    expect(result).toBe(false);
  });

  test("should be case-sensitive", () => {
    const characters = "aA";
    const document = "aa";

    const result = generateDocument(characters, document);

    expect(result).toBe(false);
  });
});

describe("firstNonRepeatingCharacter", () => {
  test("should return first non-repeating character", () => {
    expect(firstNonRepeatingCharacter("aabcc")).toBe("b");
    expect(firstNonRepeatingCharacter("abcd")).toBe("a");
    expect(firstNonRepeatingCharacter("aaabcccdeff")).toBe("b");
  });

  test("should return null when all characters repeat", () => {
    expect(firstNonRepeatingCharacter("aabbcc")).toBeNull();
    expect(firstNonRepeatingCharacter("zzzz")).toBeNull();
  });

  test("should handle empty string", () => {
    expect(firstNonRepeatingCharacter("")).toBeNull();
  });

  test("should handle single character strings", () => {
    expect(firstNonRepeatingCharacter("x")).toBe("x");
  });

  test("should handle repeated characters with single unique at end", () => {
    expect(firstNonRepeatingCharacter("aabbccd")).toBe("d");
  });

  test("should be case-sensitive", () => {
    expect(firstNonRepeatingCharacter("aA")).toBe("a");
    expect(firstNonRepeatingCharacter("Aa")).toBe("A");
  });

  test("should handle long strings", () => {
    const str = "a".repeat(1000) + "b" + "c".repeat(500);
    expect(firstNonRepeatingCharacter(str)).toBe("b");
  });

  test("should handle numbers and symbols in string", () => {
    expect(firstNonRepeatingCharacter("112233!@#!!")).toBe("@");
  });
});

describe("semordNilap", () => {
  test("should find semordnilap pairs", () => {
    const words = ["diaper", "repaid", "test", "tset", "loop"];
    const result = semordNilap(words);
    expect(result).toEqual([
      ["diaper", "repaid"],
      ["test", "tset"],
    ]);
  });

  test("should handle multiple pairs", () => {
    const words = ["loop", "pool", "god", "dog", "cat"];
    const result = semordNilap(words);
    expect(result).toEqual([
      ["loop", "pool"],
      ["god", "dog"],
    ]);
  });

  test("should handle duplicates properly", () => {
    const words = ["loop", "pool", "loop", "pool"];
    const result = semordNilap(words);
    expect(result).toEqual([
      ["loop", "pool"],
      ["loop", "pool"],
    ]);
  });

  test("should handle empty array", () => {
    const result = semordNilap([]);
    expect(result).toEqual([]);
  });

  test("should handle array with no pairs", () => {
    const words = ["abc", "def", "ghi"];
    const result = semordNilap(words);
    expect(result).toEqual([]);
  });

  test("should handle single word", () => {
    const result = semordNilap(["abc"]);
    expect(result).toEqual([]);
  });

  test("should handle words that are their own reverse", () => {
    const words = ["level", "deified", "rotor"];
    const result = semordNilap(words);
    expect(result).toEqual([]); // palindromes alone are not semordnilap pairs
  });

  test("should handle mixed normal and palindrome words", () => {
    const words = ["loop", "pool", "level"];
    const result = semordNilap(words);
    expect(result).toEqual([["loop", "pool"]]);
  });
});
