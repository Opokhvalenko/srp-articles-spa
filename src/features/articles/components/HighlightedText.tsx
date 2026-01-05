import type React from "react";
import { useMemo } from "react";

import { buildKeywordsRegex } from "../utils/keywordRegex";

interface HighlightedTextProps {
	text: string;
	keywords: string[];
}

const HighlightedText: React.FC<HighlightedTextProps> = ({
	text,
	keywords,
}) => {
	const memoizedRegex = useMemo(
		() => buildKeywordsRegex(keywords, "gi"),
		[keywords],
	);

	// Clone RegExp to avoid "g" flag state leaking via lastIndex.
	const safeRegex = memoizedRegex
		? new RegExp(memoizedRegex.source, memoizedRegex.flags)
		: null;

	if (!safeRegex || text.length === 0) {
		return <>{text}</>;
	}

	const nodes: React.ReactNode[] = [];

	let lastSliceEndIndex = 0;

	for (const match of text.matchAll(safeRegex)) {
		const matchStartIndex = match.index ?? 0;
		const matchedText = match[0] ?? "";

		if (matchStartIndex > lastSliceEndIndex) {
			nodes.push(text.slice(lastSliceEndIndex, matchStartIndex));
		}

		nodes.push(
			<mark
				key={`${matchStartIndex}-${matchedText}`}
				className="highlighted-text__mark"
			>
				{matchedText}
			</mark>,
		);

		lastSliceEndIndex = matchStartIndex + matchedText.length;
	}

	if (lastSliceEndIndex < text.length) {
		nodes.push(text.slice(lastSliceEndIndex));
	}

	return <>{nodes}</>;
};

export default HighlightedText;
