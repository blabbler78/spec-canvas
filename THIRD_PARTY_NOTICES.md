# Third-party tools and attribution

Spec Canvas v0.1.0 has **zero third-party runtime dependencies**. Its CLI, renderer,
installer, templates and skill instructions are authored for this repository.
No private Flux code, OM skill collection, upstream package archive, fonts or
customer examples are redistributed.

The design was informed by [Nico Bailon's original visual-explainer](https://github.com/nicobailon/visual-explainer),
which is [MIT licensed](https://github.com/nicobailon/visual-explainer/blob/main/LICENSE).
Spec Canvas does not install or bundle that project or an unidentified extension
fork. Its optional quick renderer, MCP/Pi integrations and PPTX dependencies are
not dependencies of this package. Do not infer their licensing from our MIT license.
If upstream code is incorporated later, preserve its copyright/license notices.

| Tool | Role here | Required? | License / terms |
| --- | --- | --- | --- |
| Claude Code / Codex / another file-capable agent | Reads the project and writes documentation using the skill | An agent is required for AI-assisted generation | Separately obtained; provider terms and costs apply |
| Node.js 20+ | Optional installer and deterministic HTML/SVG renderer | No for the manual skill; yes for the CLI | Node.js has its own licenses; not bundled |
| pnpm | Optional way to run the CLI | No; direct Node execution also works | MIT; not bundled |
| A browser | Opens HTML; can print PDF or export a screenshot | Optional for creation; recommended for visual review | Browser terms; not bundled |
| Mermaid | Alternative agent-selected renderer | Not installed, not required, not integrated in v0.1.0 | MIT upstream; review the exact package tree before adding it |
| visual-explainer | Design reference and separately usable skill | No | MIT upstream; not bundled |

Node's built-in modules produce the deterministic diagrams. SVG/HTML can also be
authored by the agent without any script runtime. PNG/PDF/PPTX are not silently
available: only use an export tool installed in the user's environment. A future
integration must document its version, dependency tree and redistribution notices.
