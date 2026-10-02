# Installation and runtime requirements

## Manual: no script runtime

Download the skill ZIP and extract its `spec-canvas` folder. Copy that complete
folder into `.claude/skills/` for Claude Code or `.agents/skills/` for Codex in your
project. For repository ZIP downloads, use `skills/spec-canvas/`. On Windows you
can use File Explorer; macOS/Linux can use a file manager or `cp -R`.

This path requires no Node.js, Python, pnpm, Git or application dependencies. The
agent must have tools to read/write project files. Open generated HTML/SVG in a
browser. No scripts run unless you or your agent choose to run them.

For configuration without an installer, create `.spec-canvas.json` using the example
in the README. It is optional: default output is `.ai/specs/`, English, white theme.
Copy `assets/spec.md` to your chosen project template directory if desired.

Claude's [project skill location](https://code.claude.com/docs/en/skills) is
`.claude/skills/`. Codex uses [repository skills](https://developers.openai.com/codex/skills/)
from `.agents/skills/`. Other agents may use different discovery paths; reading
SKILL.md manually is the portable fallback. Skill invocation/discovery depends on
agent version; this package does not install or launch the agents themselves.

## Optional CLI

Node.js 20+ is the only runtime needed by the bundled scripts. No external modules,
agent credentials or model APIs are used. pnpm is optional for the one-command GitHub
installer; direct `node` execution works from a downloaded repository without pnpm.
The GitHub-package route can require Git and internet access to fetch the repository.
It is not an npm-registry publication.

The interactive installer asks for agent and output directory. In a noninteractive
shell use `--agent` and `--yes`; omitted agent defaults to both. Installation is
project-local and avoids modifying the user's global agent directories.

An existing installation is not overwritten, including local edits. To update,
compare your installed skill to the new release, back up local edits, and replace
only that skill folder deliberately. Keep your project-local template/config.
To uninstall, remove the selected `spec-canvas` skill folder(s); optionally remove
`.spec-canvas.json` and `.spec-canvas/`. Keep generated documents unless you want to
remove them separately. There is no automatic destructive uninstall command.

## Optional exports

The core package does not install a browser or export PNG/PDF/PPTX. Use a browser's
print-to-PDF feature or an available screenshot tool. The release examples were
captured using a separately installed browser automation tool. Lack of that tool
does not block Markdown or HTML/SVG generation. Offline rendering is supported once
the package is downloaded; the existing AI agent may have its own network needs.

The CLI is tested on Linux in CI and locally on macOS. Manual copying is portable;
Windows CLI behavior is not claimed as tested in the initial release.
