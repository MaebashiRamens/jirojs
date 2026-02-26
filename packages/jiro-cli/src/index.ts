import { run } from "./run";

const code = await run(process.argv);
process.exit(code);
