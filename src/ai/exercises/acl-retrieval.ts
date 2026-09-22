export interface RetrievalPrincipal {
	id: string;
	tenantId: string;
}

export interface RetrievalDocument {
	allowedPrincipalIds: readonly string[];
	body: string;
	id: string;
	tenantId: string;
	title: string;
}

export interface UntrustedRetrievedText {
	kind: "untrusted-retrieved-text";
	text: string;
	treatAsInstructions: false;
}

export interface AuthorizedRetrievalResult {
	content: UntrustedRetrievedText;
	documentId: string;
	score: number;
	title: string;
}

export interface AclRetrievalOptions {
	limit?: number | undefined;
	scoreDocument?:
		| ((query: string, document: RetrievalDocument) => number)
		| undefined;
}

function tokens(value: string): Set<string> {
	return new Set(
		value
			.toLocaleLowerCase()
			.match(/[\p{L}\p{N}]+/gu)
			?.filter((token) => token.length > 1) ?? [],
	);
}

function defaultScore(query: string, document: RetrievalDocument): number {
	const queryTokens = tokens(query);
	if (queryTokens.size === 0) return 0;
	const titleTokens = tokens(document.title);
	const bodyTokens = tokens(document.body);
	let score = 0;
	for (const token of queryTokens) {
		if (titleTokens.has(token)) score += 3;
		if (bodyTokens.has(token)) score += 1;
	}
	return score / queryTokens.size;
}

function isAuthorized(
	principal: RetrievalPrincipal,
	document: RetrievalDocument,
): boolean {
	return (
		document.tenantId === principal.tenantId &&
		document.allowedPrincipalIds.includes(principal.id)
	);
}

/**
 * Filters authorization before invoking the ranker, preventing both result and
 * scoring side-channel leakage across principals or tenants.
 *
 * Time: O(d * a + v log v), where d is document count, a is ACL length, and v
 * is the number of visible documents. Auxiliary space: O(v).
 */
export function retrieveAuthorizedDocuments(
	query: string,
	principal: RetrievalPrincipal,
	documents: readonly RetrievalDocument[],
	options: AclRetrievalOptions = {},
): AuthorizedRetrievalResult[] {
	if (query.trim().length === 0) throw new Error("query must not be empty");
	const limit = options.limit ?? 5;
	if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
		throw new Error("limit must be an integer between 1 and 100");
	}
	const scoreDocument = options.scoreDocument ?? defaultScore;

	return documents
		.filter((document) => isAuthorized(principal, document))
		.map((document) => ({ document, score: scoreDocument(query, document) }))
		.filter(({ score }) => Number.isFinite(score) && score > 0)
		.sort(
			(left, right) =>
				right.score - left.score ||
				left.document.id.localeCompare(right.document.id),
		)
		.slice(0, limit)
		.map(({ document, score }) => ({
			content: {
				kind: "untrusted-retrieved-text",
				text: document.body,
				treatAsInstructions: false,
			},
			documentId: document.id,
			score,
			title: document.title,
		}));
}
