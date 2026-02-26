import { describe, expect, it } from "vitest";
import { parse } from "../parser";
import type { Token } from "../types";

describe("parse", () => {
	describe("空入力", () => {
		it("空トークン列 → 空の topping_list", () => {
			expect(parse([])).toEqual({ type: "topping_list", items: [] });
		});
	});

	describe("そのままで", () => {
		it("sonomama トークン → SonomamaNode", () => {
			const tokens: Token[] = [{ type: "sonomama", raw: "そのままで" }];
			expect(parse(tokens)).toEqual({ type: "sonomama" });
		});
	});

	describe("全マシ系", () => {
		it("全マシ → AggregateNode modifier マシ", () => {
			const tokens: Token[] = [{ type: "aggregate", value: "全マシ", raw: "全マシ" }];
			expect(parse(tokens)).toEqual({ type: "aggregate", modifier: "マシ" });
		});

		it("全マシマシ → AggregateNode modifier マシマシ", () => {
			const tokens: Token[] = [{ type: "aggregate", value: "全マシマシ", raw: "全マシマシ" }];
			expect(parse(tokens)).toEqual({ type: "aggregate", modifier: "マシマシ" });
		});
	});

	describe("トッピング + モディファイア対応付け", () => {
		it("topping + modifier → ToppingSpecNode", () => {
			const tokens: Token[] = [
				{ type: "topping", value: "ヤサイ", raw: "ヤサイ" },
				{ type: "modifier", value: "マシ", raw: "マシ" },
			];
			expect(parse(tokens)).toEqual({
				type: "topping_list",
				items: [{ type: "topping_spec", topping: "ヤサイ", modifier: "マシ" }],
			});
		});

		it("modifier なし → 普通", () => {
			const tokens: Token[] = [
				{ type: "topping", value: "ニンニク", raw: "ニンニク" },
			];
			expect(parse(tokens)).toEqual({
				type: "topping_list",
				items: [{ type: "topping_spec", topping: "ニンニク", modifier: "普通" }],
			});
		});

		it("複数トッピングの対応付け", () => {
			const tokens: Token[] = [
				{ type: "topping", value: "ヤサイ", raw: "ヤサイ" },
				{ type: "modifier", value: "マシマシ", raw: "マシマシ" },
				{ type: "topping", value: "ニンニク", raw: "ニンニク" },
				{ type: "topping", value: "アブラ", raw: "アブラ" },
				{ type: "modifier", value: "マシ", raw: "マシ" },
			];
			expect(parse(tokens)).toEqual({
				type: "topping_list",
				items: [
					{ type: "topping_spec", topping: "ヤサイ", modifier: "マシマシ" },
					{ type: "topping_spec", topping: "ニンニク", modifier: "普通" },
					{ type: "topping_spec", topping: "アブラ", modifier: "マシ" },
				],
			});
		});
	});

	describe("デリミタスキップ", () => {
		it("delimiter トークンを無視", () => {
			const tokens: Token[] = [
				{ type: "topping", value: "ヤサイ", raw: "ヤサイ" },
				{ type: "modifier", value: "マシ", raw: "マシ" },
				{ type: "delimiter", raw: "、" },
				{ type: "topping", value: "ニンニク", raw: "ニンニク" },
			];
			expect(parse(tokens)).toEqual({
				type: "topping_list",
				items: [
					{ type: "topping_spec", topping: "ヤサイ", modifier: "マシ" },
					{ type: "topping_spec", topping: "ニンニク", modifier: "普通" },
				],
			});
		});
	});

});
