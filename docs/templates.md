# Project-local templates

A template is ordinary Markdown. It controls the document structure, not the
programming language being documented. You can add several templates and tell your
agent which one to use for the current task.

The installer copies the default to `.spec-canvas/templates/spec.md`. This is your
file; updates to the skill do not silently replace it. A configured template path
is relative to the project root. The CLI refuses paths outside the project or via
symlinks. The agent should honor your requested output format.

Supported scaffold substitutions:

- `{{title}}`: title passed to the scaffold command.
- `{{date}}`: current UTC date in YYYY-MM-DD format.

Other content is preserved for the agent to fill. There is no executable template
language. Do not embed secrets in templates. An example team template:

```markdown
# {{title}}

Date: {{date}}

## Reader and decision

## Confirmed behavior and source links

## Proposed changes (if requested)

## Diagram and alternatives

## Acceptance criteria

## Unknowns and validation
```

Save it as `docs/templates/team-spec.md` and either set `documentTemplate` in
`.spec-canvas.json` or pass `--template docs/templates/team-spec.md` to `scaffold`.
The skill can read that same file without Node.js. Tell the agent: “Use my team
spec template; document the current storage flow and keep proposals separate.”

For HTML styling, the manual `assets/page.html` is a starting point that your agent
can adapt. CLI rendering intentionally accepts structured diagram data, not custom
JavaScript, CSS plugins or executable HTML templates. Rich custom page design belongs
to manual authoring; inspect the result and keep evidence labels explicit.

## Rich HTML templates

`assets/overview-page.html`, `assets/editorial-page.html` and
`assets/blueprint-page.html` supply complete agent-authored page shells. Copy one to
your own project, customize it, and ask the agent to use it for presentation.

- Choose **overview/cards** for a compact system brief, review handoff or
  dashboard-like scan of responsibilities, states, risks and evidence. It defaults
  to white; set `<html data-theme="dark">` for the explicit dark treatment.
- Choose **editorial** for a long-form white document with contents navigation and
  a reading-first hierarchy.
- Choose **blueprint** for a dense, explicitly dark technical document.

These templates are used by the agent, not the deterministic CLI. Cards summarize
facts; use a real flow, sequence, state, architecture or dependency diagram when
direction and relationships matter. Synthetic diagrams and text are placeholders
that must be replaced with project evidence.
