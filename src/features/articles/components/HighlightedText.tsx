import type React from "react";

interface HighlightedTextProps {
	text: string;
	keywords: string[];
}

const escapeRegExp = (value: string): string => {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const HighlightedText: React.FC<HighlightedTextProps> = ({
	text,
	keywords,
}) => {
	if (keywords.length === 0) {
		return <>{text}</>;
	}
	const escaped = keywords.map(escapeRegExp).join("|");

	if (!escaped) {
		return <>{text}</>;
	}

	const regex = new RegExp(`(${escaped})`, "gi");
	const parts: React.ReactNode[] = [];

	let lastIndex = 0;
	let match: RegExpExecArray | null = regex.exec(text);

	while (match !== null) {
		const matchIndex = match.index;

		if (matchIndex > lastIndex) {
			parts.push(text.slice(lastIndex, matchIndex));
		}

		const matchedText = text.slice(matchIndex, matchIndex + match[0].length);

		parts.push(
			<mark
				key={`${matchIndex} - ${matchedText}`}
				style={{ backgroundColor: "yellow", padding: 0 }}
			>
				{matchedText}
			</mark>,
		);

		lastIndex = matchIndex + match[0].length;
		match = regex.exec(text);
	}

	if (lastIndex < text.length) {
		parts.push(text.slice(lastIndex));
	}

	return <>{parts}</>;
};

export default HighlightedText;
