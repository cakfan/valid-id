import { $ } from "bun";

await $`rm -rf dist`;
await $`bun build src/index.ts --outdir dist --target node`;
await $`bun build src/cli/cli-entry.ts --outdir dist --target node`;
await $`bun x tsc --declaration --emitDeclarationOnly --outDir dist`;
