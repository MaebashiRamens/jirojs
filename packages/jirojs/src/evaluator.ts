import type {
	CallNode,
	CallResult,
	CoreTopping,
	Modifier,
	ToppingResult,
} from "./types";

const CORE_TOPPINGS: CoreTopping[] = ["ニンニク", "ヤサイ", "アブラ", "カラメ"];

const LEVEL_MAP: Record<Modifier, number> = {
	ナシ: 0,
	少なめ: 0.5,
	普通: 1,
	ちょいマシ: 1.5,
	マシ: 2,
	マシマシ: 3,
};

function toToppingResult(topping: string, modifier: Modifier): ToppingResult {
	return {
		topping: topping as ToppingResult["topping"],
		modifier,
		level: LEVEL_MAP[modifier],
	};
}

export function evaluate(ast: CallNode): CallResult {
	switch (ast.type) {
		case "sonomama":
			return { toppings: [] };

		case "aggregate": {
			const toppings = CORE_TOPPINGS.map((t) => toToppingResult(t, ast.modifier));
			return { toppings };
		}

		case "topping_list": {
			const toppings = ast.items.map((item) =>
				toToppingResult(item.topping, item.modifier),
			);
			return { toppings };
		}
	}
}
