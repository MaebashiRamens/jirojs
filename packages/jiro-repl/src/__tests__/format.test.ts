import { describe, expect, it } from "vitest";
import { formatResult } from "../format";
import type { CallResult } from "jirojs";

describe("formatResult", () => {
	it("トッピングなし", () => {
		const result: CallResult = { toppings: [] };
		expect(formatResult(result)).toBe("  (トッピングなし)");
	});

	it("普通のトッピング", () => {
		const result: CallResult = {
			toppings: [{ topping: "ニンニク", modifier: "普通", level: 1 }],
		};
		const output = formatResult(result);
		expect(output).toContain("ニンニク");
		expect(output).toContain("1");
	});

	it("ナシは別表示", () => {
		const result: CallResult = {
			toppings: [{ topping: "ニンニク", modifier: "ナシ", level: 0 }],
		};
		const output = formatResult(result);
		expect(output).toContain("ニンニク");
		expect(output).toContain("ナシ");
	});

	it("複数トッピング", () => {
		const result: CallResult = {
			toppings: [
				{ topping: "ヤサイ", modifier: "マシマシ", level: 3 },
				{ topping: "ニンニク", modifier: "普通", level: 1 },
			],
		};
		const output = formatResult(result);
		const lines = output.split("\n");
		expect(lines).toHaveLength(2);
		expect(lines[0]).toContain("ヤサイ");
		expect(lines[0]).toContain("マシマシ");
		expect(lines[1]).toContain("ニンニク");
	});
});
