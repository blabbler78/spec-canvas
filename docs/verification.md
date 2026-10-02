# Initial release verification

Checked locally on macOS with Node.js 22 on 2026-10-02. This is tooling evidence,
not a claim about the fictional Job Service in the examples.

- `node --test`: 19 tests passed. Covers both-agent installation, installed CLI
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
