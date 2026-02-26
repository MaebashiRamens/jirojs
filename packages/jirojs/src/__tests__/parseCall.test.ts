import { describe, expect, it } from "vitest";
import { parseCall } from "../index";

describe("parseCall（統合テスト）", () => {
	describe("基本パース（トッピング単体）", () => {
		it("ニンニク", () => {
			expect(parseCall("ニンニク")).toEqual({
				toppings: [{ topping: "ニンニク", modifier: "普通", level: 1 }],
			});
		});

		it("ヤサイ（デフォルト入り → マシ相当）", () => {
			expect(parseCall("ヤサイ")).toEqual({
				toppings: [{ topping: "ヤサイ", modifier: "マシ", level: 2 }],
			});
		});

		it("アブラ（デフォルト入り → マシ相当）", () => {
			expect(parseCall("アブラ")).toEqual({
				toppings: [{ topping: "アブラ", modifier: "マシ", level: 2 }],
			});
		});

		it("カラメ", () => {
			expect(parseCall("カラメ")).toEqual({
				toppings: [{ topping: "カラメ", modifier: "普通", level: 1 }],
			});
		});
	});

	describe("デフォルト入りトッピングの等価性", () => {
		it("ヤサイ = ヤサイマシ", () => {
			expect(parseCall("ヤサイ")).toEqual(parseCall("ヤサイマシ"));
		});

		it("アブラ = アブラマシ", () => {
			expect(parseCall("アブラ")).toEqual(parseCall("アブラマシ"));
		});

		it("ニンニクは等価にならない（デフォルト未入り）", () => {
			expect(parseCall("ニンニク")).not.toEqual(parseCall("ニンニクマシ"));
		});
	});

	describe("トッピング + モディファイア", () => {
		it("ヤサイマシ", () => {
			expect(parseCall("ヤサイマシ")).toEqual({
				toppings: [{ topping: "ヤサイ", modifier: "マシ", level: 2 }],
			});
		});

		it("ヤサイマシマシ（貪欲マッチ）", () => {
			expect(parseCall("ヤサイマシマシ")).toEqual({
				toppings: [{ topping: "ヤサイ", modifier: "マシマシ", level: 3 }],
			});
		});

		it("ニンニクナシ", () => {
			expect(parseCall("ニンニクナシ")).toEqual({
				toppings: [{ topping: "ニンニク", modifier: "ナシ", level: 0 }],
			});
		});

		it("アブラ少なめ", () => {
			expect(parseCall("アブラ少なめ")).toEqual({
				toppings: [{ topping: "アブラ", modifier: "少なめ", level: 0.5 }],
			});
		});

		it("ヤサイちょいマシ", () => {
			expect(parseCall("ヤサイちょいマシ")).toEqual({
				toppings: [{ topping: "ヤサイ", modifier: "ちょいマシ", level: 1.5 }],
			});
		});
	});

	describe("連結パース（デリミタなし）", () => {
		it("ヤサイマシマシニンニクアブラカラメ", () => {
			expect(parseCall("ヤサイマシマシニンニクアブラカラメ")).toEqual({
				toppings: [
					{ topping: "ヤサイ", modifier: "マシマシ", level: 3 },
					{ topping: "ニンニク", modifier: "普通", level: 1 },
					{ topping: "アブラ", modifier: "マシ", level: 2 },
					{ topping: "カラメ", modifier: "普通", level: 1 },
				],
			});
		});

		it("ニンニクヤサイアブラ", () => {
			expect(parseCall("ニンニクヤサイアブラ")).toEqual({
				toppings: [
					{ topping: "ニンニク", modifier: "普通", level: 1 },
					{ topping: "ヤサイ", modifier: "マシ", level: 2 },
					{ topping: "アブラ", modifier: "マシ", level: 2 },
				],
			});
		});

		it("ヤサイマシニンニクアブラマシマシカラメ", () => {
			expect(parseCall("ヤサイマシニンニクアブラマシマシカラメ")).toEqual({
				toppings: [
					{ topping: "ヤサイ", modifier: "マシ", level: 2 },
					{ topping: "ニンニク", modifier: "普通", level: 1 },
					{ topping: "アブラ", modifier: "マシマシ", level: 3 },
					{ topping: "カラメ", modifier: "普通", level: 1 },
				],
			});
		});
	});

	describe("カラメの曖昧性解消", () => {
		it("ヤサイカラメ → 2つの別々のトッピング", () => {
			expect(parseCall("ヤサイカラメ")).toEqual({
				toppings: [
					{ topping: "ヤサイ", modifier: "マシ", level: 2 },
					{ topping: "カラメ", modifier: "普通", level: 1 },
				],
			});
		});
	});

	describe("エイリアス", () => {
		it("野菜 → ヤサイ", () => {
			expect(parseCall("野菜マシ")).toEqual({
				toppings: [{ topping: "ヤサイ", modifier: "マシ", level: 2 }],
			});
		});

		it("脂 → アブラ", () => {
			expect(parseCall("脂多め")).toEqual({
				toppings: [{ topping: "アブラ", modifier: "マシ", level: 2 }],
			});
		});

		it("生姜 → ショウガ", () => {
			expect(parseCall("生姜マシ")).toEqual({
				toppings: [{ topping: "ショウガ", modifier: "マシ", level: 2 }],
			});
		});

		it("抜き → ナシ", () => {
			expect(parseCall("ニンニク抜き")).toEqual({
				toppings: [{ topping: "ニンニク", modifier: "ナシ", level: 0 }],
			});
		});

		it("なし → ナシ", () => {
			expect(parseCall("ニンニクなし")).toEqual({
				toppings: [{ topping: "ニンニク", modifier: "ナシ", level: 0 }],
			});
		});

		it("ダブル → マシマシ", () => {
			expect(parseCall("ヤサイダブル")).toEqual({
				toppings: [{ topping: "ヤサイ", modifier: "マシマシ", level: 3 }],
			});
		});

		it("増し増し → マシマシ", () => {
			expect(parseCall("ヤサイ増し増し")).toEqual({
				toppings: [{ topping: "ヤサイ", modifier: "マシマシ", level: 3 }],
			});
		});

		it("増し → マシ", () => {
			expect(parseCall("ヤサイ増し")).toEqual({
				toppings: [{ topping: "ヤサイ", modifier: "マシ", level: 2 }],
			});
		});

		it("スクナメ → 少なめ", () => {
			expect(parseCall("ヤサイスクナメ")).toEqual({
				toppings: [{ topping: "ヤサイ", modifier: "少なめ", level: 0.5 }],
			});
		});

		it("少し → 少なめ", () => {
			expect(parseCall("アブラ少し")).toEqual({
				toppings: [{ topping: "アブラ", modifier: "少なめ", level: 0.5 }],
			});
		});

		it("ちょっと → 少なめ", () => {
			expect(parseCall("アブラちょっと")).toEqual({
				toppings: [{ topping: "アブラ", modifier: "少なめ", level: 0.5 }],
			});
		});
	});

	describe("全マシ系（集約モディファイア）", () => {
		const allMashi = {
			toppings: [
				{ topping: "ニンニク", modifier: "マシ", level: 2 },
				{ topping: "ヤサイ", modifier: "マシ", level: 2 },
				{ topping: "アブラ", modifier: "マシ", level: 2 },
				{ topping: "カラメ", modifier: "マシ", level: 2 },
			],
		};

		const allMashiMashi = {
			toppings: [
				{ topping: "ニンニク", modifier: "マシマシ", level: 3 },
				{ topping: "ヤサイ", modifier: "マシマシ", level: 3 },
				{ topping: "アブラ", modifier: "マシマシ", level: 3 },
				{ topping: "カラメ", modifier: "マシマシ", level: 3 },
			],
		};

		it("全マシ", () => {
			expect(parseCall("全マシ")).toEqual(allMashi);
		});

		it("全部マシ", () => {
			expect(parseCall("全部マシ")).toEqual(allMashi);
		});

		it("全マシマシ", () => {
			expect(parseCall("全マシマシ")).toEqual(allMashiMashi);
		});

		it("全部マシマシ", () => {
			expect(parseCall("全部マシマシ")).toEqual(allMashiMashi);
		});
	});

	describe("そのままで", () => {
		it("そのままで → 空のトッピング", () => {
			expect(parseCall("そのままで")).toEqual({ toppings: [] });
		});
	});

	describe("デリミタ対応", () => {
		it("読点区切り", () => {
			expect(parseCall("ヤサイマシ、ニンニク")).toEqual({
				toppings: [
					{ topping: "ヤサイ", modifier: "マシ", level: 2 },
					{ topping: "ニンニク", modifier: "普通", level: 1 },
				],
			});
		});

		it("半角スペース区切り", () => {
			expect(parseCall("ヤサイマシ ニンニク")).toEqual({
				toppings: [
					{ topping: "ヤサイ", modifier: "マシ", level: 2 },
					{ topping: "ニンニク", modifier: "普通", level: 1 },
				],
			});
		});

		it("全角スペース区切り", () => {
			expect(parseCall("ヤサイマシ\u3000ニンニク")).toEqual({
				toppings: [
					{ topping: "ヤサイ", modifier: "マシ", level: 2 },
					{ topping: "ニンニク", modifier: "普通", level: 1 },
				],
			});
		});

		it("カンマ区切り", () => {
			expect(parseCall("ヤサイマシ,ニンニク")).toEqual({
				toppings: [
					{ topping: "ヤサイ", modifier: "マシ", level: 2 },
					{ topping: "ニンニク", modifier: "普通", level: 1 },
				],
			});
		});
	});


	describe("拡張トッピング", () => {
		it("ショウガ", () => {
			expect(parseCall("ショウガ")).toEqual({
				toppings: [{ topping: "ショウガ", modifier: "普通", level: 1 }],
			});
		});

		it("辛揚げマシ", () => {
			expect(parseCall("辛揚げマシ")).toEqual({
				toppings: [{ topping: "辛揚げ", modifier: "マシ", level: 2 }],
			});
		});

		it("ガリマヨ", () => {
			expect(parseCall("ガリマヨ")).toEqual({
				toppings: [{ topping: "ガリマヨ", modifier: "普通", level: 1 }],
			});
		});
	});

	describe("空入力・トリム", () => {
		it("空文字列", () => {
			expect(parseCall("")).toEqual({ toppings: [] });
		});

		it("前後の空白をトリム", () => {
			expect(parseCall("  ヤサイマシ  ")).toEqual({
				toppings: [{ topping: "ヤサイ", modifier: "マシ", level: 2 }],
			});
		});
	});
});
