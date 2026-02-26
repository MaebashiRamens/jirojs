import { describe, expect, it } from "vitest";
import { tokenize, tokenizeNoodle } from "../tokenizer";

describe("tokenize", () => {
	describe("トッピング", () => {
		it("コアトッピングをトークン化", () => {
			expect(tokenize("ニンニク")).toEqual([
				{ type: "topping", value: "ニンニク", raw: "ニンニク" },
			]);
		});

		it("エイリアスを正規化", () => {
			expect(tokenize("野菜")).toEqual([
				{ type: "topping", value: "ヤサイ", raw: "野菜" },
			]);
			expect(tokenize("脂")).toEqual([
				{ type: "topping", value: "アブラ", raw: "脂" },
			]);
			expect(tokenize("生姜")).toEqual([
				{ type: "topping", value: "ショウガ", raw: "生姜" },
			]);
		});

		it("拡張トッピング", () => {
			expect(tokenize("ガリマヨ")).toEqual([
				{ type: "topping", value: "ガリマヨ", raw: "ガリマヨ" },
			]);
			expect(tokenize("辛揚げ")).toEqual([
				{ type: "topping", value: "辛揚げ", raw: "辛揚げ" },
			]);
		});
	});

	describe("モディファイア", () => {
		it("マシマシが貪欲マッチでマシより先にトークン化", () => {
			const tokens = tokenize("マシマシ");
			expect(tokens).toEqual([
				{ type: "modifier", value: "マシマシ", raw: "マシマシ" },
			]);
		});

		it("マシ単体", () => {
			expect(tokenize("マシ")).toEqual([
				{ type: "modifier", value: "マシ", raw: "マシ" },
			]);
		});

		it("モディファイアエイリアス", () => {
			expect(tokenize("ナシ")).toEqual([
				{ type: "modifier", value: "ナシ", raw: "ナシ" },
			]);
			expect(tokenize("抜き")).toEqual([
				{ type: "modifier", value: "ナシ", raw: "抜き" },
			]);
			expect(tokenize("なし")).toEqual([
				{ type: "modifier", value: "ナシ", raw: "なし" },
			]);
			expect(tokenize("ダブル")).toEqual([
				{ type: "modifier", value: "マシマシ", raw: "ダブル" },
			]);
			expect(tokenize("増し増し")).toEqual([
				{ type: "modifier", value: "マシマシ", raw: "増し増し" },
			]);
			expect(tokenize("増し")).toEqual([
				{ type: "modifier", value: "マシ", raw: "増し" },
			]);
			expect(tokenize("スクナメ")).toEqual([
				{ type: "modifier", value: "少なめ", raw: "スクナメ" },
			]);
			expect(tokenize("少し")).toEqual([
				{ type: "modifier", value: "少なめ", raw: "少し" },
			]);
			expect(tokenize("ちょっと")).toEqual([
				{ type: "modifier", value: "少なめ", raw: "ちょっと" },
			]);
			expect(tokenize("多め")).toEqual([
				{ type: "modifier", value: "マシ", raw: "多め" },
			]);
		});

		it("ちょいマシ", () => {
			expect(tokenize("ちょいマシ")).toEqual([
				{ type: "modifier", value: "ちょいマシ", raw: "ちょいマシ" },
			]);
		});
	});

	describe("そのままで", () => {
		it("そのままでトークン", () => {
			expect(tokenize("そのままで")).toEqual([
				{ type: "sonomama", raw: "そのままで" },
			]);
		});
	});

	describe("全マシ系", () => {
		it("全マシ", () => {
			expect(tokenize("全マシ")).toEqual([
				{ type: "aggregate", value: "全マシ", raw: "全マシ" },
			]);
		});

		it("全マシマシ", () => {
			expect(tokenize("全マシマシ")).toEqual([
				{ type: "aggregate", value: "全マシマシ", raw: "全マシマシ" },
			]);
		});

		it("全部マシ", () => {
			expect(tokenize("全部マシ")).toEqual([
				{ type: "aggregate", value: "全マシ", raw: "全部マシ" },
			]);
		});

		it("全部マシマシ", () => {
			expect(tokenize("全部マシマシ")).toEqual([
				{ type: "aggregate", value: "全マシマシ", raw: "全部マシマシ" },
			]);
		});
	});

	describe("tokenizeNoodle", () => {
		it("麺少なめ", () => {
			expect(tokenizeNoodle("麺少なめ")).toEqual({
				type: "noodle",
				value: "少なめ",
				raw: "麺少なめ",
			});
		});

		it("麺半分", () => {
			expect(tokenizeNoodle("麺半分")).toEqual({
				type: "noodle",
				value: "半分",
				raw: "麺半分",
			});
		});

		it("麺硬め", () => {
			expect(tokenizeNoodle("麺硬め")).toEqual({
				type: "noodle",
				value: "硬め",
				raw: "麺硬め",
			});
		});

		it("不一致で null", () => {
			expect(tokenizeNoodle("ヤサイマシ")).toBeNull();
		});

		it("部分一致しない", () => {
			expect(tokenizeNoodle("麺少なめニンニク")).toBeNull();
		});
	});

	describe("デリミタ", () => {
		it("読点", () => {
			const tokens = tokenize("ヤサイ、ニンニク");
			expect(tokens).toEqual([
				{ type: "topping", value: "ヤサイ", raw: "ヤサイ" },
				{ type: "delimiter", raw: "、" },
				{ type: "topping", value: "ニンニク", raw: "ニンニク" },
			]);
		});

		it("半角スペース", () => {
			const tokens = tokenize("ヤサイ ニンニク");
			expect(tokens).toEqual([
				{ type: "topping", value: "ヤサイ", raw: "ヤサイ" },
				{ type: "delimiter", raw: " " },
				{ type: "topping", value: "ニンニク", raw: "ニンニク" },
			]);
		});
	});

	describe("複合入力", () => {
		it("ヤサイマシマシニンニクアブラカラメ", () => {
			expect(tokenize("ヤサイマシマシニンニクアブラカラメ")).toEqual([
				{ type: "topping", value: "ヤサイ", raw: "ヤサイ" },
				{ type: "modifier", value: "マシマシ", raw: "マシマシ" },
				{ type: "topping", value: "ニンニク", raw: "ニンニク" },
				{ type: "topping", value: "アブラ", raw: "アブラ" },
				{ type: "topping", value: "カラメ", raw: "カラメ" },
			]);
		});

		it("rawフィールドが元テキストを保持", () => {
			const tokens = tokenize("野菜増し増し");
			expect(tokens).toEqual([
				{ type: "topping", value: "ヤサイ", raw: "野菜" },
				{ type: "modifier", value: "マシマシ", raw: "増し増し" },
			]);
		});
	});

	describe("空入力", () => {
		it("空文字列", () => {
			expect(tokenize("")).toEqual([]);
		});

		it("空白のみ", () => {
			expect(tokenize("   ")).toEqual([]);
		});
	});
});
