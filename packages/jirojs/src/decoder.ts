import type { CallResult, Modifier } from "./types";

const MODIFIER_TEXT: Record<Modifier, string> = {
	ナシ: "ナシ",
	少なめ: "少なめ",
	ちょいマシ: "ちょいマシ",
	普通: "",
	マシ: "マシ",
	マシマシ: "マシマシ",
};

export function decode(result: CallResult): string {
	return result.toppings
		.map((t) => t.topping + MODIFIER_TEXT[t.modifier])
		.join("");
}
