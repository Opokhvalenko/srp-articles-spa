import { escapeRegExp } from "./escapeRegExp";

export type KeywordRegexMode = "wordStart";

export type KeywordRegexFlags =
	| "g"
	| "i"
	| "gi"
	| "ig"
	| "gu"
	| "iu"
	| "giu"
	| "igi";

const ensureUnicodeFlag = (flags: KeywordRegexFlags): string =>
	flags.includes("u") ? flags : `${flags}u`;

export const buildKeywordsRegex = (
	keywords: string[],
	flags: KeywordRegexFlags = "gi",
	mode: KeywordRegexMode = "wordStart",
): RegExp | null => {
	const normalizedKeywords = keywords
		.map((rawKeyword) => rawKeyword.trim())
		.filter((trimmedKeyword) => trimmedKeyword.length > 0);

	if (normalizedKeywords.length === 0) {
		return null;
	}

	const escapedKeywords = normalizedKeywords
		.sort((a, b) => b.length - a.length)
		.map(escapeRegExp);

	const flagsWithUnicode = ensureUnicodeFlag(flags);

	if (mode === "wordStart") {
		// "word start" boundary for unicode letters/digits:
		// not preceded by a letter/digit/underscore
		const pattern = `(?<![\\p{L}\\p{N}_])(?:${escapedKeywords.join("|")})`;
		return new RegExp(pattern, flagsWithUnicode);
	}

	return null;
};
