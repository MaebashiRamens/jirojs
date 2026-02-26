import { decode, parseCall, tokenize } from "jirojs";
import type { OutputMode } from "./args";

const LEVEL_BAR = ["_", "▁", "▃", "▅", "▇", "█"];

function levelBar(level: number): string {
	const index = Math.min(Math.round(level), LEVEL_BAR.length - 1);
	return LEVEL_BAR[index];
}

function pretty(input: string): string {
	const result = parseCall(input);
	if (result.toppings.length === 0) {
		return "(トッピングなし)";
	}
	return result.toppings
		.map((t) => {
			if (t.modifier === "ナシ") return `  ${t.topping} ナシ`;
			const bar = levelBar(t.level);
			const mod = t.modifier === "普通" ? "" : ` ${t.modifier}`;
			return `  ${bar} ${t.topping}${mod} (${t.level})`;
		})
		.join("\n");
}

function json(input: string): string {
	return JSON.stringify(parseCall(input));
}

function normalize(input: string): string {
	return decode(parseCall(input));
}

function tokens(input: string): string {
	return tokenize(input)
		.map((t) => {
			if ("value" in t) return `${t.type}:${t.value}`;
			return `${t.type}:${t.raw}`;
		})
		.join(" ");
}

const FORMATTERS: Record<OutputMode, (input: string) => string> = {
	pretty,
	json,
	normalize,
	tokens,
};

export function format(input: string, mode: OutputMode): string {
	return FORMATTERS[mode](input);
}
