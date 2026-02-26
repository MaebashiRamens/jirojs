import type {
	AggregateNode,
	CallNode,
	SonomamaNode,
	Token,
	ToppingListNode,
	ToppingSpecNode,
} from "./types";

export function parse(tokens: Token[]): CallNode {
	if (tokens.length === 0) {
		return { type: "topping_list", items: [] };
	}

	// Check for sonomama
	if (tokens[0].type === "sonomama") {
		return { type: "sonomama" } satisfies SonomamaNode;
	}

	// Check for aggregate
	if (tokens[0].type === "aggregate") {
		const modifier = tokens[0].value === "全マシマシ" ? "マシマシ" : "マシ";
		return { type: "aggregate", modifier } satisfies AggregateNode;
	}

	// Build topping list
	const items: ToppingSpecNode[] = [];
	let i = 0;

	while (i < tokens.length) {
		const token = tokens[i];

		if (token.type === "delimiter") {
			i++;
			continue;
		}

		if (token.type === "topping") {
			const next = tokens[i + 1];
			if (next && next.type === "modifier") {
				items.push({
					type: "topping_spec",
					topping: token.value,
					modifier: next.value,
				});
				i += 2;
			} else {
				items.push({
					type: "topping_spec",
					topping: token.value,
					modifier: "普通",
				});
				i++;
			}
			continue;
		}

		// Skip unexpected tokens (standalone modifiers, etc.)
		i++;
	}

	return { type: "topping_list", items } satisfies ToppingListNode;
}
