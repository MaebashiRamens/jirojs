import { describe, expect, it } from "vitest";
import {
	createEvaluator,
	createParseCall,
	DEFAULT_LEVELS,
	HIGHMOUNT_M,
	JIRO_DIRECT,
} from "../index";
import type { CallNode, Shop } from "../types";

describe("createEvaluator", () => {
	describe("直系二郎（デフォルト）", () => {
		const evaluate = createEvaluator(JIRO_DIRECT);

		it("ヤサイ bare → マシ（デフォルト入りなので増量）", () => {
			const ast: CallNode = {
				type: "topping_list",
				items: [{ type: "topping_spec", topping: "ヤサイ", modifier: "普通" }],
			};
			expect(evaluate(ast)).toEqual({
				toppings: [{ topping: "ヤサイ", modifier: "マシ", level: 2 }],
			});
		});

		it("アブラ bare → マシ（デフォルト入り）", () => {
			const ast: CallNode = {
				type: "topping_list",
				items: [{ type: "topping_spec", topping: "アブラ", modifier: "普通" }],
			};
			expect(evaluate(ast)).toEqual({
				toppings: [{ topping: "アブラ", modifier: "マシ", level: 2 }],
			});
		});

		it("ニンニク bare → 普通（デフォルト未入り）", () => {
			const ast: CallNode = {
				type: "topping_list",
				items: [
					{ type: "topping_spec", topping: "ニンニク", modifier: "普通" },
				],
			};
			expect(evaluate(ast)).toEqual({
				toppings: [{ topping: "ニンニク", modifier: "普通", level: 1 }],
			});
		});
	});

	describe("ハイマウントM", () => {
		const evaluate = createEvaluator(HIGHMOUNT_M);

		it("ヤサイ bare → マシ（デフォルト入り）", () => {
			const ast: CallNode = {
				type: "topping_list",
				items: [{ type: "topping_spec", topping: "ヤサイ", modifier: "普通" }],
			};
			expect(evaluate(ast)).toEqual({
				toppings: [{ topping: "ヤサイ", modifier: "マシ", level: 2 }],
			});
		});

		it("アブラ bare → 普通（ハイマウントMではデフォルト未入り）", () => {
			const ast: CallNode = {
				type: "topping_list",
				items: [{ type: "topping_spec", topping: "アブラ", modifier: "普通" }],
			};
			expect(evaluate(ast)).toEqual({
				toppings: [{ topping: "アブラ", modifier: "普通", level: 1 }],
			});
		});

		it("カラメをコールするとエラー（コール不可）", () => {
			const ast: CallNode = {
				type: "topping_list",
				items: [{ type: "topping_spec", topping: "カラメ", modifier: "マシ" }],
			};
			expect(() => evaluate(ast)).toThrow(
				"カラメ はこの店舗ではコールできません",
			);
		});

		it("全マシでカラメがスキップされる", () => {
			const ast: CallNode = {
				type: "aggregate",
				modifier: "マシ",
			};
			const result = evaluate(ast);
			expect(result.toppings.map((t) => t.topping)).not.toContain("カラメ");
			expect(result.toppings).toHaveLength(3);
		});
	});

	describe("カスタムレベル", () => {
		const shop: Shop = {
			name: "カスタム店",
			defaults: { ヤサイ: 1 },
			levels: { 少なめ: 1.5 },
		};
		const evaluate = createEvaluator(shop);

		it("少なめが普通とマシの間（1.5）に設定される", () => {
			const ast: CallNode = {
				type: "topping_list",
				items: [
					{ type: "topping_spec", topping: "ヤサイ", modifier: "少なめ" },
				],
			};
			expect(evaluate(ast)).toEqual({
				toppings: [{ topping: "ヤサイ", modifier: "少なめ", level: 1.5 }],
			});
		});

		it("未設定のモディファイアはデフォルトレベルを使用", () => {
			const ast: CallNode = {
				type: "topping_list",
				items: [
					{ type: "topping_spec", topping: "ニンニク", modifier: "マシマシ" },
				],
			};
			expect(evaluate(ast)).toEqual({
				toppings: [
					{
						topping: "ニンニク",
						modifier: "マシマシ",
						level: DEFAULT_LEVELS["マシマシ"],
					},
				],
			});
		});
	});

	describe("bareCallModifier カスタマイズ", () => {
		const shop: Shop = {
			name: "控えめ店",
			defaults: { ヤサイ: 1, アブラ: 1 },
			bareCallModifier: "ちょいマシ",
		};
		const evaluate = createEvaluator(shop);

		it("デフォルト入りの bare コールが ちょいマシ に正規化", () => {
			const ast: CallNode = {
				type: "topping_list",
				items: [{ type: "topping_spec", topping: "ヤサイ", modifier: "普通" }],
			};
			expect(evaluate(ast)).toEqual({
				toppings: [{ topping: "ヤサイ", modifier: "ちょいマシ", level: 1.5 }],
			});
		});
	});

	describe("全トッピング未入り（全て追加制）", () => {
		const shop: Shop = {
			name: "追加制の店",
			defaults: {},
		};
		const evaluate = createEvaluator(shop);

		it("全ての bare コールが普通のまま", () => {
			const ast: CallNode = {
				type: "topping_list",
				items: [
					{ type: "topping_spec", topping: "ヤサイ", modifier: "普通" },
					{ type: "topping_spec", topping: "アブラ", modifier: "普通" },
					{ type: "topping_spec", topping: "ニンニク", modifier: "普通" },
				],
			};
			const result = evaluate(ast);
			for (const t of result.toppings) {
				expect(t.modifier).toBe("普通");
				expect(t.level).toBe(1);
			}
		});
	});
});

describe("createParseCall", () => {
	it("直系二郎: ヤサイ = ヤサイマシ", () => {
		const parse = createParseCall(JIRO_DIRECT);
		expect(parse("ヤサイ")).toEqual(parse("ヤサイマシ"));
	});

	it("ハイマウントM: アブラ ≠ アブラマシ（デフォルト未入り）", () => {
		const parse = createParseCall(HIGHMOUNT_M);
		expect(parse("アブラ")).not.toEqual(parse("アブラマシ"));
	});

	it("ハイマウントM: アブラ bare → 普通/1", () => {
		const parse = createParseCall(HIGHMOUNT_M);
		expect(parse("アブラ")).toEqual({
			toppings: [{ topping: "アブラ", modifier: "普通", level: 1 }],
		});
	});

	it("ハイマウントM: カラメをコールするとエラー", () => {
		const parse = createParseCall(HIGHMOUNT_M);
		expect(() => parse("カラメ")).toThrow(
			"カラメ はこの店舗ではコールできません",
		);
	});

	it("カスタムレベル: 少なめ = 1.5 の店", () => {
		const shop: Shop = {
			name: "テスト店",
			levels: { 少なめ: 1.5 },
		};
		const parse = createParseCall(shop);
		expect(parse("ヤサイ少なめ")).toEqual({
			toppings: [{ topping: "ヤサイ", modifier: "少なめ", level: 1.5 }],
		});
	});
});
