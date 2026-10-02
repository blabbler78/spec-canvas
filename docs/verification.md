# Initial release verification

Checked locally on macOS with Node.js 22 on 2026-10-02. This is tooling evidence,
not a claim about the fictional Job Service in the examples.

- `node --test`: 23 tests passed. Covers both-agent installation, installed CLI
  portability, existing-file protection, path traversal/symlink refusal, custom
  templates, supported views, escaped labels and freshness detection.
- Skill frontmatter validator: passed.
- Ten SVG examples: XML parsing and input/output hashes checked.
- Browser: flow, state, architecture and dependency examples in both themes had
  no page overflow or SVG text outside canvas at 1200px. White canvas is
  `rgb(255,255,255)`; opt-in dark is `rgb(17,24,39)`.
- Sequence light/dark screenshots captured at 1200 × 1250. Representative flow,
  state, sequence and complete document screenshots visually inspected.
- Complete document: three inline diagrams, no remote resource requests, no page
  overflow at 1200px or 390px. Mobile diagrams scroll within their containers.
- Screenshots captured with a separately installed agent-browser tool. It is not
  installed by Spec Canvas and is not a runtime dependency.

Release packaging, independent review, remote installation and CI results are
recorded in the release notes after those checks complete. Windows runtime and an
end-to-end session in each third-party agent are not claimed as tested. The manual
skill's compatibility uses their documented skill-folder formats.

## Review fixes and full presentation examples

Independent review found companion output symlink writes, last-lane self-call label
clipping and literal-title substitution errors. All three were corrected with four
additional regression tests; 23/23 tests pass. Companion paths are checked before any
write, self-call labels remain inside the canvas, and template values are literal.

Rich editorial/blueprint documents: three inline diagrams each, no remote resources,
no overflow at 1440px; blueprint also checked at 390px with all navigation targets
valid. Both screenshots visually inspected. They are original self-contained HTML
templates; no upstream visual-explainer code or third-party image was copied.

## Remote evidence

- GitHub CI for `f55935de6e6efc38308c4d82ea193b79d2a64dd9`: Node20 and22 green,
  [run36982368067](https://github.com/blabbler78/spec-canvas/actions/runs/36982368067).
- `pnpm dlx github:blabbler78/spec-canvas#main init --agent both --yes` against
  a temporary project: passed, both skill folders and configuration created.
- Ruleset24353256: active; restrict main updates, block deletion/force pushes, require
  code-owner review. Admin bypass remains the owner's maintenance control. Collaborator
  inventory contains only `blabbler78` (admin); auto-merge disabled.
- Independent scoped re-review: approve for code413f973,23 tests and66 self-call
  geometry cases. Subsequent template/layout edits were browser-checked locally.
