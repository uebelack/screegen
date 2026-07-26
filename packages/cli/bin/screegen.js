#!/usr/bin/env node
// Importing the entry module runs the CLI via its `isMainModule` guard (argv[1]
// ends with `screegen.js`). Do NOT also call `runCli()` here — that would run
// the whole command twice (two dev servers, duplicate spinners, doubled work).
import "../dist/index.mjs";
