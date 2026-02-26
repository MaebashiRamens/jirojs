import { describe, expect, it } from "vitest";
import { decode, parseCall } from "../index";
import type { CallResult } from "../types";

describe("decode", () => {
	describe("各モディファイアの出力テキスト", () => {
		it("普通 → トッピング名のみ", () => {
			const result: CallResult = {
				toppings: [{ topping: "ニンニク", modifier: "普通", level: 1 }],
			};
			expect(decode(result)).toBe("ニンニク");
		});

		it("マシ", () => {
			const result: CallResult = {
				toppings: [{ topping: "ヤサイ", modifier: "マシ", level: 2 }],
			};
			expect(decode(result)).toBe("ヤサイマシ");
		});

		it("マシマシ", () => {
			const result: CallResult = {
				toppings: [{ topping: "ヤサイ", modifier: "マシマシ", level: 3 }],
			};
			expect(decode(result)).toBe("ヤサイマシマシ");
		});

		it("ナシ", () => {
			const result: CallResult = {
				toppings: [{ topping: "ニンニク", modifier: "ナシ", level: 0 }],
			};
			expect(decode(result)).toBe("ニンニクナシ");
		});

		it("少なめ", () => {
			const result: CallResult = {
				toppings: [{ topping: "アブラ", modifier: "少なめ", level: 0.5 }],
			};
			expect(decode(result)).toBe("アブラ少なめ");
		});

		it("ちょいマシ", () => {
			const result: CallResult = {
				toppings: [{ topping: "ヤサイ", modifier: "ちょいマシ", level: 1.5 }],
			};
			expect(decode(result)).toBe("ヤサイちょいマシ");
		});
	});

	describe("複数トッピングの連結", () => {
		it("デリミタなしで連結", () => {
			const result: CallResult = {
				toppings: [
					{ topping: "ヤサイ", modifier: "マシマシ", level: 3 },
					{ topping: "ニンニク", modifier: "普通", level: 1 },
					{ topping: "アブラ", modifier: "普通", level: 1 },
					{ topping: "カラメ", modifier: "普通", level: 1 },
				],
			};
			expect(decode(result)).toBe("ヤサイマシマシニンニクアブラカラメ");
		});
	});

	describe("空入力", () => {
		it("toppings が空 → 空文字列", () => {
			const result: CallResult = { toppings: [] };
			expect(decode(result)).toBe("");
		});
	});

	describe("ラウンドトリップ", () => {
		it("正規形の入力はラウンドトリップ一致", () => {
			const input = "ヤサイマシマシニンニク";
			expect(decode(parseCall(input))).toBe(input);
		});

		it("エイリアスは正規形に正規化", () => {
			expect(decode(parseCall("野菜増し増し"))).toBe("ヤサイマシマシ");
		});

		it("複合コールのラウンドトリップ", () => {
			const input = "ヤサイマシニンニクアブラマシマシカラメ";
			expect(decode(parseCall(input))).toBe(input);
		});
	});
});
