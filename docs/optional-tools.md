# Using other tools alongside Spec Canvas

The default package is deliberately small. It does not install every renderer,
agent or export format just because a user wants a Markdown specification.

## Original visual-explainer

[Nico Bailon's original visual-explainer](https://github.com/nicobailon/visual-explainer)
is a separately maintained agent skill for polished HTML explanations and other
visual formats. It is MIT licensed. To use it together with Spec Canvas, install
it using its own upstream instructions, then ask your agent:

> Use Spec Canvas for the evidence-backed document and diagram selection. Use my
> installed visual-explainer skill to polish the HTML presentation. Keep source
> links, unknowns, proposed/current labels and a white background.

Your agent must actually load the installed upstream skill before claiming to use
it. Spec Canvas does not impersonate that skill or identify an unspecified fork as
the original. The upstream full guidance is agent-authored HTML, while its quick
renderer and export scripts have their own runtime requirements. Installing the
whole upstream npm package also installs its own dependency tree. Those dependencies
keep their licenses; our MIT license does not replace them.

## Mermaid

[Mermaid](https://github.com/mermaid-js/mermaid) is a separate MIT-licensed diagram
renderer using text definitions. It can be useful for established diagram syntax
or GitHub-native Markdown diagrams. It is not installed or called by our v0.1 CLI.
If already available, an agent may choose it for an explicit request and retain
its source definition alongside the document. Its Node CLI needs Node.js; Mermaid
rendered by GitHub does not require Node.js on the viewer's computer. Review exact
versions and transitive dependency licenses when integrating it into a distribution.

## Browser exports

An existing browser can view HTML and print PDF. An independently installed browser
automation tool can capture PNGs. No browser is silently downloaded by the installer.
Do not claim PNG/PDF export has occurred unless the file was generated and inspected.

## Adding an integration

Keep optional integrations opt-in, document their runtime and model costs, pin the
versions used, retain upstream notices and test absence of the integration. A C++
project should still be able to use the manual skill without adding Node.js to its
build. No integration should copy private application code into this public repository.
