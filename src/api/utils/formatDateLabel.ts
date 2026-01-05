export function formatDateLabel(value: string | Date): string {
	const date = value instanceof Date ? value : new Date(value);

	if (Number.isNaN(date.getTime())) {
		return "";
	}

	const dayNumber = date.getDate();

	const suffix = getDaySuffix(dayNumber);

	const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
		date,
	);
	const yearNumber = date.getFullYear();

	return `${monthName} ${dayNumber}${suffix}, ${yearNumber}`;
}
function getDaySuffix(day: number): "st" | "nd" | "rd" | "th" {
	const mod100 = day % 100;

	if (mod100 >= 11 && mod100 <= 13) {
		return "th";
	}

	switch (day % 10) {
		case 1:
			return "st";
		case 2:
			return "nd";
		case 3:
			return "rd";
		default:
			return "th";
	}
}
