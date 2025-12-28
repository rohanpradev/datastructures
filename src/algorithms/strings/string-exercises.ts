/**
 * Checks if a given document can be generated using the available characters.
 *
 * This function verifies if the characters in the `characters` string can be rearranged
 * and used to form the `document` string, considering the frequency of each character.
 * If there are enough occurrences of each character in `characters` to form `document`,
 * the function returns `true`. Otherwise, it returns `false`.
 *
 * @param {string} characters - A string containing the available characters.
 * @param {string} document - A string representing the document to be generated.
 * @returns {boolean} - Returns `true` if the document can be generated, otherwise `false`.
 */
export function generateDocument(
	characters: string,
	document: string,
): boolean {
	// If the number of characters is less than the length of the document, it's impossible to generate it.
	if (characters.length < document.length) return false;

	// Create a map to store the frequency of each character in the 'characters' string.
	const charMap: Record<string, number> = {};

	// Populate the charMap with frequencies of each character in 'characters'.
	for (const char of characters) {
		charMap[char] = (charMap[char] ?? 0) + 1;
	}

	// Iterate over each character in the 'document' to check if it can be formed.
	for (const char of document) {
		// If the character isn't available in 'charMap' or its count is 0, return false.
		if (!charMap[char]) return false;
		// Decrement the count of the character in 'charMap'.
		else {
			charMap[char] = charMap[char] - 1;
		}
	}

	// If all characters in the document have been accounted for, return true.
	return true;
}

/**
 * Returns the first non-repeating character in a string.
 *
 * A non-repeating character is one that appears exactly once in the string.
 * If no such character exists, the function returns `null`.
 *
 * This optimized solution works in two passes:
 * 1. Count how many times each character appears.
 * 2. Find the first character with a count of 1.
 *
 * @param {string} str - The input string to analyze.
 * @returns {string | null} - The first non-repeating character, or null if none exists.
 */
export function firstNonRepeatingCharacter(str: string): string | null {
	// Edge case: empty or falsy string
	if (!str) return null;

	// Map to store the frequency of each character
	const charCount: Record<string, number> = {};

	// First pass: count occurrences of each character
	for (const char of str) {
		charCount[char] = (charCount[char] ?? 0) + 1;
	}

	// Second pass: find the first character that appears exactly once
	for (const char of str) {
		if (charCount[char] === 1) {
			return char;
		}
	}

	// No non-repeating character found
	return null;
}

/**
 * Finds all semordnilap pairs in an array of words.
 *
 * A semordnilap pair is a pair of words where one word is the reverse of the other.
 * Each word can only be used in one pair.
 *
 * Example:
 *   Input: ["diaper", "repaid", "test", "tset", "loop"]
 *   Output: [["diaper", "repaid"], ["test", "tset"]]
 *
 * @param {string[]} words - An array of words to search for semordnilap pairs
 * @returns {[string, string][]} An array of semordnilap pairs
 */
export function semordNilap(words: string[]): [string, string][] {
	const wordMap = new Map<string, boolean>(); // track which words are used
	const pairs: [string, string][] = [];

	const reverseString = (word: string) => word.split("").reverse().join("");

	for (const word of words) {
		const reversed = reverseString(word);

		// If the reversed word exists and hasn't been used yet
		if (wordMap.has(reversed)) {
			pairs.push([reversed, word]);
			wordMap.delete(reversed); // remove it to avoid duplicates
		} else {
			wordMap.set(word, true);
		}
	}

	return pairs;
}
