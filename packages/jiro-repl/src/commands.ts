export const COMMANDS: Record<string, { description: string }> = {
	".help": { description: "コマンド一覧を表示" },
	".toppings": { description: "利用可能なトッピング一覧" },
	".modifiers": { description: "モディファイア一覧" },
	".examples": { description: "入力例を表示" },
	".clear": { description: "画面をクリア" },
	".exit": { description: "終了" },
};

export function helpText(): string {
	const lines = ["コマンド:"];
	for (const [cmd, { description }] of Object.entries(COMMANDS)) {
		lines.push(`  ${cmd.padEnd(14)} ${description}`);
	}
	return lines.join("\n");
}

export function toppingsText(): string {
	return [
		"コアトッピング (直系):",
		"  ニンニク    ヤサイ(野菜)    アブラ(脂)    カラメ",
		"",
		"拡張トッピング (インスパイア):",
		"  ショウガ(生姜)  辛揚げ  辛玉  ガリマヨ  一味  削り節  ラー油",
	].join("\n");
}

export function modifiersText(): string {
	return [
		"モディファイア (少 → 多):",
		"  ナシ(抜き,なし)       0   除去",
		"  少なめ(スクナメ,少し) 0.5 少なめ",
		"  普通                  1   標準",
		"  ちょいマシ            1.5 やや多め",
		"  マシ(多め,増し)       2   多め",
		"  マシマシ(ダブル)      3   かなり多め",
		"",
		"集約:",
		"  全マシ / 全部マシ         コア全部マシ",
		"  全マシマシ / 全部マシマシ コア全部マシマシ",
		"  そのままで               トッピングなし",
	].join("\n");
}

export function examplesText(): string {
	return [
		"入力例:",
		"  ニンニク                  → ニンニク普通",
		"  ヤサイマシマシニンニク    → ヤサイ多め + ニンニク",
		"  野菜増し増し脂多め       → エイリアスを正規化",
		"  全マシ                    → コア4種全てマシ",
		"  そのままで                → トッピングなし",
	].join("\n");
}
