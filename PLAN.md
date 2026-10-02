# Initial release plan

Goal: ship a public, English, language-agnostic agent skill with an optional simple
installer and graphical documentation, owned solely by @blabbler78.

Scope: manual runtime-free skill, Node-only optional CLI without dependencies,
flow/state/sequence/architecture/dependency SVG, source-grounded writing, examples,
tests, attribution, public repository and owner-only contribution policy.

No provider API client, hosted service, private project source, compulsory model,
Mermaid dependency or automatic export/browser install is included.

## Progress

- [x] Portable skill and optional installer/renderer
- [x] English docs and synthetic examples
- [x] Tests, visual verification and independent review
- [x] Public repository, source/skill download and ownership rules

## Evidence

Public repository: https://github.com/blabbler78/spec-canvas. Active main ruleset
24353256 requires owner review and restricts updates to the administrator role;
only @blabbler78 currently has privileged access. Auto-merge is disabled.

Independent review approved the fixes in code candidate413f973; subsequent changes
add rich presentation assets and correct composed SVG IDs. 23 tests pass. CI for
f55935d passes on Node20/22; remote pnpm installation from main succeeds. Release
publication/download verification is the final step.

Completed: release [v0.1.1](https://github.com/blabbler78/spec-canvas/releases/tag/v0.1.1).
Pinned GitHub install, installed scaffold output and anonymous ZIP SHA256 verified.
Final canonical-path review approved code9cdd3e4;24 tests and releaseCI20/22 pass.
