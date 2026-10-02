# Writing a specification

Use the smallest structure that covers the request:

1. Purpose, scope, source revision and method.
2. Confirmed current behavior, with entry points and source links.
3. Inputs, context, stored data and external dependencies.
4. Happy path, asynchronous boundaries, errors and operator decisions.
5. Proposed behavior, only for a design request, separated from current behavior.
6. Unknowns, assumptions and concrete questions that evidence did not resolve.
7. Diagram links, validation performed and limits.

For proposals add alternatives, acceptance criteria and a bounded implementation
outline when useful. Existing-system documentation does not need invented features
or a roadmap. Preserve domain terminology; choose sections to suit the system.

Link relative to the saved document, for example `../../src/service.cpp#L42`.
Line anchors are GitHub navigation hints; verify line bounds locally. If no Git
revision exists, state that rather than requiring a commit before documenting.
Runtime observations need their own evidence and date. A queued task is not completed
work, an SMTP acknowledgement is not final delivery, and instructions to a model
are not enforcement. Mark conditional dependencies and rollout-dependent paths.
