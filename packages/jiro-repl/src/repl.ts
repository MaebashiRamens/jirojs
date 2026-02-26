import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import { decode, parseCall, tokenize } from "jirojs";
import {
	examplesText,
	helpText,
	modifiersText,
	toppingsText,
} from "./commands";
import { completer } from "./completer";
import { formatResult } from "./format";

function handleCommand(line: string): boolean {
	switch (line) {
		case ".help":
			console.log(helpText());
			return true;
		case ".toppings":
			console.log(toppingsText());
			return true;
		case ".modifiers":
			console.log(modifiersText());
			return true;
		case ".examples":
			console.log(examplesText());
			return true;
		case ".clear":
			console.clear();
			return true;
		default:
			return false;
	}
}

function evaluateLine(line: string): void {
	const tokens = tokenize(line);
	if (tokens.length === 0) {
		return;
	}

	const result = parseCall(line);
	const canonical = decode(result);
	const formatted = formatResult(result);

	if (canonical && canonical !== line) {
		console.log(`正規形: ${canonical}`);
	}
	console.log(formatted);
}

export async function startRepl(): Promise<void> {
	const rl = createInterface({
		input,
		output,
		prompt: "二郎> ",
		completer,
	});

	console.log("ラーメン二郎コール インタプリタ");
	console.log(".help でコマンド一覧を表示\n");

	rl.prompt();

	for await (const line of rl) {
		const trimmed = line.trim();

		if (trimmed === ".exit") {
			break;
		}

		if (trimmed.startsWith(".")) {
			if (!handleCommand(trimmed)) {
				console.log(`不明なコマンド: ${trimmed} (.help で一覧表示)`);
			}
		} else if (trimmed.length > 0) {
			evaluateLine(trimmed);
		}

		rl.prompt();
	}

	rl.close();
}
