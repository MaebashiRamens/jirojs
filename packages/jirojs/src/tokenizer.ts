import type {
	AggregateModifier,
	Modifier,
	NoodleOption,
	NoodleToken,
	Token,
	Topping,
} from "./types";

// Sorted by pattern length descending for greedy matching
const TOPPING_PATTERNS: [string, Topping][] = [
	["ガリマヨ", "ガリマヨ"],
	["ニンニク", "ニンニク"],
	["ショウガ", "ショウガ"],
	["ヤサイ", "ヤサイ"],
	["アブラ", "アブラ"],
	["カラメ", "カラメ"],
	["辛揚げ", "辛揚げ"],
	["削り節", "削り節"],
	["ラー油", "ラー油"],
	["辛玉", "辛玉"],
	["一味", "一味"],
	["野菜", "ヤサイ"],
	["生姜", "ショウガ"],
	["脂", "アブラ"],
];

// CRITICAL: マシマシ and its aliases MUST come before マシ
const MODIFIER_PATTERNS: [string, Modifier][] = [
	["ちょいマシ", "ちょいマシ"],
	["マシマシ", "マシマシ"],
	["増し増し", "マシマシ"],
	["スクナメ", "少なめ"],
	["ダブル", "マシマシ"],
	["少なめ", "少なめ"],
	["ちょっと", "少なめ"],
	["少し", "少なめ"],
	["多め", "マシ"],
	["マシ", "マシ"],
	["増し", "マシ"],
	["ナシ", "ナシ"],
	["なし", "ナシ"],
	["抜き", "ナシ"],
	["普通", "普通"],
];

const NOODLE_PATTERNS: [string, NoodleOption][] = [
	["麺少なめ", "少なめ"],
	["麺半分", "半分"],
	["麺硬め", "硬め"],
];

const AGGREGATE_PATTERNS: [string, AggregateModifier][] = [
	["全部マシマシ", "全マシマシ"],
	["全マシマシ", "全マシマシ"],
	["全部マシ", "全マシ"],
	["全マシ", "全マシ"],
];

const DELIMITERS = new Set(["、", " ", "\u3000", ","]);

function matchLongest<T>(
	input: string,
	pos: number,
	patterns: [string, T][],
): { value: T; raw: string } | null {
	for (const [pattern, value] of patterns) {
		if (input.startsWith(pattern, pos)) {
			return { value, raw: pattern };
		}
	}
	return null;
}

export function tokenize(input: string): Token[] {
	const trimmed = input.trim();
	const tokens: Token[] = [];
	let pos = 0;

	while (pos < trimmed.length) {
		// Sonomama
		if (trimmed.startsWith("そのままで", pos)) {
			const raw = "そのままで";
			tokens.push({ type: "sonomama", raw });
			pos += raw.length;
			continue;
		}

		// Aggregate
		const aggMatch = matchLongest(trimmed, pos, AGGREGATE_PATTERNS);
		if (aggMatch) {
			tokens.push({
				type: "aggregate",
				value: aggMatch.value,
				raw: aggMatch.raw,
			});
			pos += aggMatch.raw.length;
			continue;
		}

		// Topping
		const toppingMatch = matchLongest(trimmed, pos, TOPPING_PATTERNS);
		if (toppingMatch) {
			tokens.push({
				type: "topping",
				value: toppingMatch.value,
				raw: toppingMatch.raw,
			});
			pos += toppingMatch.raw.length;
			continue;
		}

		// Modifier
		const modifierMatch = matchLongest(trimmed, pos, MODIFIER_PATTERNS);
		if (modifierMatch) {
			tokens.push({
				type: "modifier",
				value: modifierMatch.value,
				raw: modifierMatch.raw,
			});
			pos += modifierMatch.raw.length;
			continue;
		}

		// Delimiter
		if (DELIMITERS.has(trimmed[pos])) {
			tokens.push({ type: "delimiter", raw: trimmed[pos] });
			pos++;
			continue;
		}

		// Unrecognized — skip
		pos++;
	}

	return tokens;
}

export function tokenizeNoodle(input: string): NoodleToken | null {
	const trimmed = input.trim();
	const match = matchLongest(trimmed, 0, NOODLE_PATTERNS);
	if (match && match.raw.length === trimmed.length) {
		return { type: "noodle", value: match.value, raw: match.raw };
	}
	return null;
}
