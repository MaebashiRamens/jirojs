import { describe, expect, it } from "vitest";
import {
	examplesText,
	helpText,
	modifiersText,
	toppingsText,
} from "../commands";

describe("commands", () => {
	it("helpText にコマンド一覧が含まれる", () => {
		const text = helpText();
		expect(text).toContain(".help");
		expect(text).toContain(".toppings");
		expect(text).toContain(".exit");
	});

	it("toppingsText にコアトッピングが含まれる", () => {
		const text = toppingsText();
		expect(text).toContain("ニンニク");
		expect(text).toContain("ヤサイ");
		expect(text).toContain("アブラ");
		expect(text).toContain("カラメ");
	});

	it("modifiersText にモディファイアが含まれる", () => {
		const text = modifiersText();
		expect(text).toContain("ナシ");
		expect(text).toContain("マシマシ");
		expect(text).toContain("全マシ");
	});

	it("examplesText に入力例が含まれる", () => {
		const text = examplesText();
		expect(text).toContain("ニンニク");
		expect(text).toContain("全マシ");
	});
});
