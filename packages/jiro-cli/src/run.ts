import { HELP_TEXT, parse } from "./args";
import { format } from "./output";
import { readStdin } from "./stdin";

const VERSION = "0.1.0";

export async function run(argv: string[]): Promise<number> {
	const args = parse(argv);

	if (args.help) {
		console.log(HELP_TEXT);
		return 0;
	}

	if (args.version) {
		console.log(VERSION);
		return 0;
	}

	const inputs = args.inputs.length > 0 ? args.inputs : await readStdin();

	if (inputs.length === 0) {
		console.error("エラー: コール文字列を指定してください（-h でヘルプ表示）");
		return 1;
	}

	for (const input of inputs) {
		console.log(format(input, args.mode));
	}

	return 0;
}
