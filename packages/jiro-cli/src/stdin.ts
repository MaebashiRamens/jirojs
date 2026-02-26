import { stdin } from "node:process";
import { createInterface } from "node:readline";

export async function readStdin(): Promise<string[]> {
	const lines: string[] = [];
	const rl = createInterface({ input: stdin });
	for await (const line of rl) {
		const trimmed = line.trim();
		if (trimmed.length > 0) {
			lines.push(trimmed);
		}
	}
	return lines;
}
