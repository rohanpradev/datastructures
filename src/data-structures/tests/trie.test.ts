import { describe, expect, test } from "bun:test";
import { Trie } from "@/data-structures/trie/trie";

describe("Trie", () => {
  describe("constructor", () => {
    test("should create an empty Trie", () => {
      const trie = new Trie();

      expect(trie.search("anything")).toBe(false);
      expect(trie.startsWith("any")).toBe(false);
      expect(trie.getAllWords()).toEqual([]);
    });
  });

  describe("insert()", () => {
    test("should insert a single word", () => {
      const trie = new Trie();
      trie.insert("hello");

      expect(trie.search("hello")).toBe(true);
      expect(trie.search("hell")).toBe(false);
      expect(trie.startsWith("hell")).toBe(true);
    });

    test("should insert multiple words and maintain prefix relationships", () => {
      const trie = new Trie();
      trie.insert("car");
      trie.insert("card");
      trie.insert("care");
      trie.insert("cat");

      expect(trie.search("car")).toBe(true);
      expect(trie.search("card")).toBe(true);
      expect(trie.search("care")).toBe(true);
      expect(trie.search("cat")).toBe(true);
      expect(trie.search("ca")).toBe(false);

      expect(trie.startsWith("ca")).toBe(true);
      expect(trie.startsWith("car")).toBe(true);
      expect(trie.startsWith("cap")).toBe(false);
    });

    test("should handle duplicate insertions gracefully", () => {
      const trie = new Trie();
      trie.insert("hello");
      trie.insert("hello");

      expect(trie.search("hello")).toBe(true);
      expect(trie.getAllWords()).toEqual(["hello"]);
    });

    test("should handle empty string insertion", () => {
      const trie = new Trie();
      trie.insert("");

      expect(trie.search("")).toBe(false);
      expect(trie.getAllWords()).toEqual([]);
    });
  });

  describe("search()", () => {
    test("should return true for inserted words", () => {
      const trie = new Trie();
      trie.insert("apple");
      trie.insert("app");

      expect(trie.search("apple")).toBe(true);
      expect(trie.search("app")).toBe(true);
    });

    test("should return false for non-existent words", () => {
      const trie = new Trie();
      trie.insert("apple");

      expect(trie.search("apples")).toBe(false);
      expect(trie.search("ap")).toBe(false);
    });
  });

  describe("startsWith()", () => {
    test("should return true for existing prefixes", () => {
      const trie = new Trie();
      trie.insert("banana");
      trie.insert("band");

      expect(trie.startsWith("ban")).toBe(true);
      expect(trie.startsWith("band")).toBe(true);
    });

    test("should return false for non-existent prefixes", () => {
      const trie = new Trie();
      trie.insert("banana");

      expect(trie.startsWith("baaa")).toBe(false);
      expect(trie.startsWith("bananas")).toBe(false);
    });
  });

  describe("delete()", () => {
    test("should delete a word and keep other words intact", () => {
      const trie = new Trie();
      trie.insert("car");
      trie.insert("card");
      trie.insert("care");

      expect(trie.delete("card")).toBe(true);
      expect(trie.search("card")).toBe(false);
      expect(trie.search("car")).toBe(true);
      expect(trie.search("care")).toBe(true);
    });

    test("should return false when deleting non-existent word", () => {
      const trie = new Trie();
      trie.insert("apple");

      expect(trie.delete("banana")).toBe(false);
      expect(trie.search("apple")).toBe(true);
    });

    test("should delete entire word chain when possible", () => {
      const trie = new Trie();
      trie.insert("a");
      trie.insert("ab");
      trie.insert("abc");

      expect(trie.delete("abc")).toBe(true);
      expect(trie.search("abc")).toBe(false);
      expect(trie.search("ab")).toBe(true);
      expect(trie.search("a")).toBe(true);

      expect(trie.delete("ab")).toBe(true);
      expect(trie.search("ab")).toBe(false);
      expect(trie.search("a")).toBe(true);

      expect(trie.delete("a")).toBe(true);
      expect(trie.search("a")).toBe(false);
    });

    test("should handle deletion of empty string safely", () => {
      const trie = new Trie();
      expect(trie.delete("")).toBe(false);
    });
  });

  describe("getAllWords()", () => {
    test("should return all words in Trie", () => {
      const trie = new Trie();
      trie.insert("dog");
      trie.insert("deer");
      trie.insert("deal");

      const words = trie.getAllWords().sort();
      expect(words).toEqual(["deal", "deer", "dog"]);
    });

    test("should return empty array for empty Trie", () => {
      const trie = new Trie();
      expect(trie.getAllWords()).toEqual([]);
    });
  });

  describe("integration scenarios", () => {
    test("should work for autocomplete simulation", () => {
      const trie = new Trie();
      trie.insert("apple");
      trie.insert("app");
      trie.insert("application");

      const prefix = "app";
      const words = trie
        .getAllWords()
        .filter((word) => word.startsWith(prefix))
        .sort();

      expect(words).toEqual(["app", "apple", "application"]);
    });

    test("should support incremental word building", () => {
      const trie = new Trie();
      const input = "hello";

      let current = "";
      for (const char of input) {
        current += char;
        trie.insert(current);
      }

      expect(trie.search("h")).toBe(true);
      expect(trie.search("he")).toBe(true);
      expect(trie.search("hel")).toBe(true);
      expect(trie.search("hell")).toBe(true);
      expect(trie.search("hello")).toBe(true);
    });
  });

  describe("edge cases", () => {
    test("should handle long words", () => {
      const trie = new Trie();
      const longWord = "a".repeat(1000);
      trie.insert(longWord);

      expect(trie.search(longWord)).toBe(true);
      expect(trie.startsWith("a".repeat(500))).toBe(true);
      expect(trie.delete(longWord)).toBe(true);
      expect(trie.search(longWord)).toBe(false);
    });

    test("should handle overlapping prefixes", () => {
      const trie = new Trie();
      trie.insert("at");
      trie.insert("ate");
      trie.insert("atom");

      expect(trie.search("at")).toBe(true);
      expect(trie.search("ate")).toBe(true);
      expect(trie.search("atom")).toBe(true);

      trie.delete("ate");
      expect(trie.search("ate")).toBe(false);
      expect(trie.search("at")).toBe(true);
      expect(trie.search("atom")).toBe(true);
    });
  });

  describe("different data types", () => {
    test("should work with numeric strings", () => {
      const trie = new Trie();
      trie.insert("123");
      trie.insert("1234");

      expect(trie.search("123")).toBe(true);
      expect(trie.search("1234")).toBe(true);
      expect(trie.startsWith("12")).toBe(true);
    });

    test("should handle single-character words", () => {
      const trie = new Trie();
      trie.insert("x");
      trie.insert("y");

      expect(trie.search("x")).toBe(true);
      expect(trie.search("y")).toBe(true);
      expect(trie.search("z")).toBe(false);
    });
  });
});
