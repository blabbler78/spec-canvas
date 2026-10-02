#!/usr/bin/env node
import { main } from '../skills/spec-canvas/scripts/cli.mjs';
main().catch(error => { console.error(`spec-canvas: ${error.message}`); process.exitCode = 1; });
