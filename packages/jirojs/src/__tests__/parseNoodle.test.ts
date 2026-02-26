import { describe, expect, it } from "vitest";
import { parseNoodle } from "../index";

describe("parseNoodle", () => {
	it("麺少なめ", () => {
		expect(parseNoodle("麺少なめ")).toEqual({ option: "少なめ" });
	});

	it("麺半分", () => {
		expect(parseNoodle("麺半分")).toEqual({ option: "半分" });
	});

	it("麺硬め", () => {
		expect(parseNoodle("麺硬め")).toEqual({ option: "硬め" });
	});

	it("不一致で null", () => {
		expect(parseNoodle("ヤサイマシ")).toBeNull();
	});

	it("空文字列で null", () => {
		expect(parseNoodle("")).toBeNull();
	});
});
