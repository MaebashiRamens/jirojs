import { describe, expect, it } from "vitest";
import { parse } from "../args";

const argv = (args: string) => ["node", "jiro", ...args.split(" ").filter(Boolean)];

describe("parse", () => {
	it("位置引数をinputsに格納", () => {
		const result = parse(argv("ヤサイマシ"));
		expect(result.inputs).toEqual(["ヤサイマシ"]);
		expect(result.mode).toBe("pretty");
	});

	it("複数の位置引数", () => {
		const result = parse(argv("ヤサイマシ 全マシ"));
		expect(result.inputs).toEqual(["ヤサイマシ", "全マシ"]);
	});

	it("--json で json モード", () => {
		const result = parse(argv("--json ヤサイマシ"));
		expect(result.mode).toBe("json");
	});

	it("-j 短縮形", () => {
		const result = parse(argv("-j ヤサイマシ"));
		expect(result.mode).toBe("json");
	});

	it("--normalize", () => {
		const result = parse(argv("--normalize ヤサイマシ"));
		expect(result.mode).toBe("normalize");
	});

	it("-n 短縮形", () => {
		const result = parse(argv("-n ヤサイマシ"));
		expect(result.mode).toBe("normalize");
	});

	it("--tokens", () => {
		const result = parse(argv("--tokens ヤサイマシ"));
		expect(result.mode).toBe("tokens");
	});

	it("--help", () => {
		const result = parse(argv("--help"));
		expect(result.help).toBe(true);
	});

	it("--version", () => {
		const result = parse(argv("--version"));
		expect(result.version).toBe(true);
	});

	it("引数なし", () => {
		const result = parse(argv(""));
		expect(result.inputs).toEqual([]);
		expect(result.mode).toBe("pretty");
	});
});
