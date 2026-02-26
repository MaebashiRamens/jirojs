import { evaluate } from "./evaluator";
import { parse } from "./parser";
import { tokenize } from "./tokenizer";
import type { CallResult } from "./types";

export function parseCall(input: string): CallResult {
	return evaluate(parse(tokenize(input)));
}
