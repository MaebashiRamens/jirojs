import type {
	CallNode,
	CallResult,
	CoreTopping,
	Modifier,
	Shop,
	Topping,
	ToppingResult,
} from "./types";

const CORE_TOPPINGS: CoreTopping[] = ["ニンニク", "ヤサイ", "アブラ", "カラメ"];

export const DEFAULT_LEVELS: Record<Modifier, number> = {
	ナシ: 0,
	少なめ: 0.5,
	普通: 1,
	ちょいマシ: 1.5,
	マシ: 2,
	マシマシ: 3,
};

export function createEvaluator(shop: Shop): (ast: CallNode) => CallResult {
	const defaults = shop.defaults ?? {};
	const levels: Record<Modifier, number> = { ...DEFAULT_LEVELS, ...shop.levels };
	const bareModifier = shop.bareCallModifier ?? "マシ";

	function toToppingResult(topping: string, modifier: Modifier): ToppingResult {
		const defaultLevel = defaults[topping as Topping];
		if (defaultLevel === null) {
			throw new Error(`${topping} はこの店舗ではコールできません`);
		}
		const effective =
			modifier === "普通" && (defaultLevel ?? 0) > 0
				? bareModifier
				: modifier;
		return {
			topping: topping as ToppingResult["topping"],
			modifier: effective,
			level: levels[effective],
		};
	}

	return function evaluateWithShop(ast: CallNode): CallResult {
		switch (ast.type) {
			case "sonomama":
				return { toppings: [] };

			case "aggregate": {
				const toppings = CORE_TOPPINGS.filter(
					(t) => defaults[t] !== null,
				).map((t) => toToppingResult(t, ast.modifier));
				return { toppings };
			}

			case "topping_list": {
				const toppings = ast.items.map((item) =>
					toToppingResult(item.topping, item.modifier),
				);
				return { toppings };
			}
		}
	};
}

import { JIRO_DIRECT } from "./shops";

const defaultEvaluate = createEvaluator(JIRO_DIRECT);

/** 直系二郎のデフォルト設定で評価 */
export function evaluate(ast: CallNode): CallResult {
	return defaultEvaluate(ast);
}
