# Diagram choices and rendering

| View | Question | What the picture must show |
| --- | --- | --- |
| Flow | What happens next, under which condition? | Directed actions, decisions and labelled branches |
| Sequence | Who calls whom, and in what order? | Lifelines, ordered messages, replies and conditional calls |
| State | What changes this entity's state? | One entity, persisted states, events/guards and loops |
| Architecture | Which components depend on each other? | Components, boundaries and labelled relationships |
| Dependency | Which prerequisites unblock something? | Directed prerequisites, with direction explained |

Architecture and dependency use the graph primitive, but their meaning is defined
by your labels and accompanying text. The CLI does not infer architecture from code.
For before/after, create two matching views and a comparison document. For ER diagrams,
complex swimlanes or UML, manually author SVG or use an independently installed tool;
the v0.1 CLI does not claim to support those specialized layouts.

## Optional CLI JSON

Graph views use explicit top-left node positions. Each node is 220 × 70 SVG units.
The canvas is white unless `theme` is `dark`. Keep labels short, leave room for edge
labels, and inspect the output. The simple renderer does not automatically route
crossing edges or optimize layout. Default viewport: 1000 × 600; valid width 400–4000,
height 200–4000. Keep nodes within the canvas. No HTML is accepted in labels.

```json
{
  "title": "Request flow",
  "view": "flow",
  "width": 1000,
  "height": 400,
  "nodes": [
    {"id": "in", "label": "Request", "x": 40, "y": 160},
    {"id": "out", "label": "Queued job", "x": 700, "y": 160}
  ],
  "edges": [{"from": "in", "to": "out", "label": "Accepted"}]
}
```

Sequence views use 2–12 uniquely named lanes and 1–60 ordered messages. `return: true`
marks a dashed reply. A message to the same lane is a self-call. Conditional behavior
can be labelled `Optional: ...`; the CLI does not generate UML opt/alt frames. For
complex branch frames and richer annotations, manually author SVG using the skill.

```json
{
  "title": "Queue acknowledgement",
  "view": "sequence",
  "lanes": [{"id":"ui","label":"Client"},{"id":"api","label":"API"}],
  "messages": [
    {"from":"ui","to":"api","label":"Submit job"},
    {"from":"api","to":"ui","label":"202 Accepted","return":true}
  ]
}
```

Generate using a local installed skill path, for example:

```sh
node .agents/skills/spec-canvas/scripts/cli.mjs render \
  --input .ai/specs/job.flow.json --output .ai/specs/job.flow.html
node .agents/skills/spec-canvas/scripts/cli.mjs check \
  --meta .ai/specs/job.flow.meta.json
```

Change `.agents` to `.claude` for a Claude-only installation. The skill works without
these commands by authoring HTML/SVG directly. Metadata only checks diagram inputs
and output freshness, not whether your JSON represents the real source code.

The CLI defaults to a white background independent of OS theme. Dark is opt-in via
`--theme dark` or JSON `"theme":"dark"`. Export screenshots/PDF with a local browser
when available; do not automatically install one. SVG remains scalable and portable.
