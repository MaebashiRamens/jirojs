import { describe, expect, it } from "vitest";
import { evaluate } from "../evaluator";
import type { CallNode } from "../types";

describe("evaluate", () => {
	describe("SonomamaNode", () => {
		it("空のトッピング", () => {
			const ast: CallNode = { type: "sonomama" };
			expect(evaluate(ast)).toEqual({ toppings: [] });
		});
	});

	describe("AggregateNode", () => {
		it("全マシ → 4コアトッピング level 2", () => {
			const ast: CallNode = { type: "aggregate", modifier: "マシ" };
			expect(evaluate(ast)).toEqual({
				toppings: [
					{ topping: "ニンニク", modifier: "マシ", level: 2 },
					{ topping: "ヤサイ", modifier: "マシ", level: 2 },
					{ topping: "アブラ", modifier: "マシ", level: 2 },
					{ topping: "カラメ", modifier: "マシ", level: 2 },
				],
			});
		});

		it("全マシマシ → 4コアトッピング level 3", () => {
			const ast: CallNode = { type: "aggregate", modifier: "マシマシ" };
			expect(evaluate(ast)).toEqual({
				toppings: [
					{ topping: "ニンニク", modifier: "マシマシ", level: 3 },
					{ topping: "ヤサイ", modifier: "マシマシ", level: 3 },
					{ topping: "アブラ", modifier: "マシマシ", level: 3 },
					{ topping: "カラメ", modifier: "マシマシ", level: 3 },
				],
			});
		});
	});

	describe("ToppingListNode", () => {
		it("各モディファイアの level 値", () => {
			const ast: CallNode = {
				type: "topping_list",
				items: [
					{ type: "topping_spec", topping: "ニンニク", modifier: "ナシ" },
					{ type: "topping_spec", topping: "カラメ", modifier: "少なめ" },
					{ type: "topping_spec", topping: "ニンニク", modifier: "普通" },
					{ type: "topping_spec", topping: "ショウガ", modifier: "ちょいマシ" },
					{ type: "topping_spec", topping: "ヤサイ", modifier: "マシ" },
					{ type: "topping_spec", topping: "ガリマヨ", modifier: "マシマシ" },
				],
			};
			expect(evaluate(ast)).toEqual({
				toppings: [
					{ topping: "ニンニク", modifier: "ナシ", level: 0 },
					{ topping: "カラメ", modifier: "少なめ", level: 0.5 },
					{ topping: "ニンニク", modifier: "普通", level: 1 },
					{ topping: "ショウガ", modifier: "ちょいマシ", level: 1.5 },
					{ topping: "ヤサイ", modifier: "マシ", level: 2 },
					{ topping: "ガリマヨ", modifier: "マシマシ", level: 3 },
				],
			});
		});

		it("デフォルト入りトッピングは名前だけのコールでマシに正規化", () => {
			const ast: CallNode = {
				type: "topping_list",
				items: [
					{ type: "topping_spec", topping: "ヤサイ", modifier: "普通" },
					{ type: "topping_spec", topping: "アブラ", modifier: "普通" },
				],
			};
			expect(evaluate(ast)).toEqual({
				toppings: [
					{ topping: "ヤサイ", modifier: "マシ", level: 2 },
					{ topping: "アブラ", modifier: "マシ", level: 2 },
				],
			});
		});

		it("空の topping_list", () => {
			const ast: CallNode = { type: "topping_list", items: [] };
			expect(evaluate(ast)).toEqual({ toppings: [] });
		});
	});
});
