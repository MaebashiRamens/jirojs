import { createEvaluator, evaluate } from "./evaluator";
import { parse } from "./parser";
import { tokenize } from "./tokenizer";
import type { CallResult, Shop } from "./types";

export function parseCall(input: string): CallResult {
	return evaluate(parse(tokenize(input)));
}

export function createParseCall(shop: Shop): (input: string) => CallResult {
	const evaluateWithShop = createEvaluator(shop);
	return (input: string) => evaluateWithShop(parse(tokenize(input)));
}
