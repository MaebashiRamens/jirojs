import { describe, expect, it } from "vitest";
import { completer } from "../completer";

describe("completer", () => {
	it("空文字で全候補を返さない", () => {
		const [hits] = completer("");
		expect(hits.length).toBeGreaterThan(0);
	});

	it("ヤ で始まる候補", () => {
		const [hits] = completer("ヤ");
		expect(hits).toContain("ヤサイ");
	});

	it("マシ で始まる候補", () => {
		const [hits] = completer("マシ");
		expect(hits).toContain("マシ");
		expect(hits).toContain("マシマシ");
	});

	it(". で始まるコマンド候補", () => {
		const [hits] = completer(".");
		expect(hits).toContain(".help");
		expect(hits).toContain(".exit");
	});

	it("一致なしで空配列", () => {
		const [hits] = completer("xyz");
		expect(hits).toEqual([]);
	});
});
