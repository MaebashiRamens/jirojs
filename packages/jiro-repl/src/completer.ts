import type { CompleterResult } from "node:readline";

const COMPLETIONS = [
	"ニンニク",
	"ヤサイ",
	"アブラ",
	"カラメ",
	"ショウガ",
	"辛揚げ",
	"辛玉",
	"ガリマヨ",
	"一味",
	"削り節",
	"ラー油",
	"マシ",
	"マシマシ",
	"ナシ",
	"少なめ",
	"ちょいマシ",
	"全マシ",
	"全マシマシ",
	"そのままで",
	".help",
	".toppings",
	".modifiers",
	".examples",
	".clear",
	".exit",
];

export function completer(line: string): CompleterResult {
	const hits = COMPLETIONS.filter((c) => c.startsWith(line));
	return [hits.length ? hits : [], line];
}
