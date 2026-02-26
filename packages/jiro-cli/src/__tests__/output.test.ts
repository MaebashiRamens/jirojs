import { describe, expect, it } from "vitest";
import { format } from "../output";

describe("format", () => {
	describe("pretty", () => {
		it("トッピング+モディファイアを整形表示", () => {
			const result = format("ヤサイマシマシ", "pretty");
			expect(result).toContain("ヤサイ");
			expect(result).toContain("マシマシ");
			expect(result).toContain("3");
		});

		it("トッピングなし", () => {
			expect(format("そのままで", "pretty")).toBe("(トッピングなし)");
		});

		it("ナシ表示", () => {
			const result = format("ニンニクナシ", "pretty");
			expect(result).toContain("ニンニク");
			expect(result).toContain("ナシ");
		});
	});

	describe("json", () => {
		it("JSON出力", () => {
			const result = format("ヤサイマシ", "json");
			const parsed = JSON.parse(result);
			expect(parsed.toppings).toHaveLength(1);
			expect(parsed.toppings[0].topping).toBe("ヤサイ");
			expect(parsed.toppings[0].modifier).toBe("マシ");
		});
	});

	describe("normalize", () => {
		it("正規形出力", () => {
			expect(format("野菜増し増し", "normalize")).toBe("ヤサイマシマシ");
		});

		it("既に正規形", () => {
			expect(format("ヤサイマシ", "normalize")).toBe("ヤサイマシ");
		});
	});

	describe("tokens", () => {
		it("トークン列出力", () => {
			const result = format("ヤサイマシマシニンニク", "tokens");
			expect(result).toBe("topping:ヤサイ modifier:マシマシ topping:ニンニク");
		});

		it("デリミタはrawで表示", () => {
			const result = format("ヤサイ、ニンニク", "tokens");
			expect(result).toContain("delimiter:、");
		});
	});
});
