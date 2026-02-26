import type { CallResult, ToppingResult } from "jirojs";

const LEVEL_BAR = ["_", "▁", "▃", "▅", "▇", "█"];

function levelBar(level: number): string {
	const index = Math.min(Math.round(level), LEVEL_BAR.length - 1);
	return LEVEL_BAR[index];
}

function formatTopping(t: ToppingResult): string {
	if (t.modifier === "ナシ") {
		return `  ${t.topping} ${t.modifier}`;
	}
	const bar = levelBar(t.level);
	const mod = t.modifier === "普通" ? "" : ` ${t.modifier}`;
	return `  ${bar} ${t.topping}${mod} (${t.level})`;
}

export function formatResult(result: CallResult): string {
	if (result.toppings.length === 0) {
		return "  (トッピングなし)";
	}
	return result.toppings.map(formatTopping).join("\n");
}
