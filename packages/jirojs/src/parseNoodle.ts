import { tokenizeNoodle } from "./tokenizer";
import type { NoodleResult } from "./types";

export function parseNoodle(input: string): NoodleResult | null {
	const token = tokenizeNoodle(input);
	if (!token) return null;
	return { option: token.value };
}
