type CryptoHashInput = string | ArrayBuffer | Uint8Array;
type FingerprintInput =
	| string
	| ArrayBuffer
	| SharedArrayBuffer
	| Uint8Array
	| DataView;
type PasswordHashOptions = NonNullable<Parameters<typeof Bun.password.hash>[1]>;

const DEFAULT_PASSWORD_HASH_OPTIONS = {
	algorithm: "bcrypt",
	cost: 4,
} satisfies PasswordHashOptions;

/**
 * Session cookie options exposed by the secure cookie helper.
 */
export interface SessionCookieOptions {
	maxAge?: number;
	name?: string;
	path?: string;
	sameSite?: "strict" | "lax" | "none";
	secure?: boolean;
}

/**
 * Hashes a password with Bun.password.
 *
 * Interview angle:
 * Password hashing must be slow, salted, and verifiable. Do not use SHA-256 for
 * passwords. Bun.password stores the selected algorithm metadata in the hash.
 *
 * Time: intentionally expensive; depends on algorithm cost.
 * Space: depends on algorithm memory settings.
 */
export async function hashPassword(
	password: string,
	options: PasswordHashOptions = DEFAULT_PASSWORD_HASH_OPTIONS,
): Promise<string> {
	if (password.length < 8) {
		throw new Error("Password must be at least 8 characters long");
	}

	return Bun.password.hash(password, options);
}

/**
 * Verifies a password against a Bun.password hash.
 *
 * Time: intentionally expensive; matches the stored hash parameters.
 * Space: depends on the stored algorithm.
 */
export async function verifyPassword(
	password: string,
	hash: string,
): Promise<boolean> {
	return Bun.password.verify(password, hash);
}

/**
 * Computes a cryptographic SHA-256 digest for content integrity checks.
 *
 * Interview angle:
 * Cryptographic hashes are for integrity and signatures, not password storage.
 *
 * Time: O(n), where n is total input size.
 * Space: O(1), because chunks are streamed into the hasher.
 */
export function sha256Hex(...chunks: CryptoHashInput[]): string {
	const hasher = new Bun.CryptoHasher("sha256");

	for (const chunk of chunks) {
		hasher.update(chunk);
	}

	return hasher.digest("hex");
}

/**
 * Computes a fast non-cryptographic fingerprint.
 *
 * Interview angle:
 * Non-cryptographic hashes are useful for hash tables, sharding, caches, and
 * dedupe hints. They are not safe for security decisions.
 *
 * Time: O(n), where n is input size.
 * Space: O(1).
 */
export function contentFingerprint(input: FingerprintInput, seed = 0): string {
	return Bun.hash(input, seed).toString(36);
}

/**
 * Builds a secure session Set-Cookie header with Bun.Cookie.
 *
 * Time: O(1).
 * Space: O(1).
 */
export function createSessionCookie(
	sessionId: string,
	options: SessionCookieOptions = {},
): string {
	const cookie = new Bun.Cookie(options.name ?? "session_id", sessionId, {
		httpOnly: true,
		maxAge: options.maxAge ?? 60 * 60,
		path: options.path ?? "/",
		sameSite: options.sameSite ?? "lax",
		secure: options.secure ?? true,
	});

	return cookie.serialize();
}

/**
 * Parses a Cookie header with Bun.CookieMap.
 *
 * Time: O(n), where n is header length.
 * Space: O(k), where k is the number of cookies.
 */
export function parseCookies(header: string): Record<string, string> {
	return new Bun.CookieMap(header).toJSON();
}
