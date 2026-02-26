import { parseArgs } from "node:util";

export type OutputMode = "pretty" | "json" | "normalize" | "tokens";

export interface CliArgs {
	mode: OutputMode;
	inputs: string[];
	help: boolean;
	version: boolean;
}

export function parse(argv: string[]): CliArgs {
	const { values, positionals } = parseArgs({
		args: argv.slice(2),
		options: {
			json: { type: "boolean", short: "j", default: false },
			normalize: { type: "boolean", short: "n", default: false },
			tokens: { type: "boolean", short: "t", default: false },
			help: { type: "boolean", short: "h", default: false },
			version: { type: "boolean", short: "v", default: false },
		},
		allowPositionals: true,
	});

	let mode: OutputMode = "pretty";
	if (values.json) mode = "json";
	else if (values.normalize) mode = "normalize";
	else if (values.tokens) mode = "tokens";

	return {
		mode,
		inputs: positionals,
		help: values.help ?? false,
		version: values.version ?? false,
	};
}

export const HELP_TEXT = `jiro - ラーメン二郎コール文字列 CLI

Usage: jiro [options] [call...]

Arguments:
  call                 コール文字列（省略時は stdin から読み込み）

Options:
  -j, --json           JSON で出力
  -n, --normalize      正規形で出力
  -t, --tokens         トークン列を出力
  -h, --help           ヘルプを表示
  -v, --version        バージョンを表示

Examples:
  jiro ヤサイマシマシニンニク
  jiro --json 全マシ
  jiro -n 野菜増し増し
  echo ヤサイマシ | jiro --json`;
