import { readFile, writeFile } from 'node:fs/promises';

const template = await readFile('skills/spec-canvas/assets/overview-page.html', 'utf8');
const styles = template.match(/<style>([\s\S]*?)<\/style>/)?.[1];
if (!styles) throw new Error('overview template has no embedded styles');

const content = `<main>
<header>
  <div class="doc-mark">Proposed system / Job Service</div>
  <h1>Durable work, visible outcomes</h1>
  <p class="lede">A compact operating brief for accepting background jobs, processing them safely and returning durable results without tying the design to a language, framework or queue product.</p>
  <p class="scope"><strong>Evidence boundary:</strong> this is a synthetic proposed design. No deployed service, customer workload or runtime metric was inspected.</p>
</header>
<div class="sections">
  <section class="section">
    <div class="section-head"><div><h2>The service in one page</h2><p>The API acknowledges durable acceptance. Workers own execution. The job store remains the source clients can inspect.</p></div><span class="section-number">01</span></div>
    <div class="cards">
      <article class="card wide" data-tone="accent"><span class="label">PRIMARY RESPONSIBILITY</span><h3>Turn an accepted request into an inspectable result</h3><p>Validate the submission, create a stable job identifier, make work available to a worker and persist the final state before reporting completion.</p><div class="facts"><div class="fact"><b>Stable identity</b><span>One durable job ID</span></div><div class="fact"><b>Visible state</b><span>Queued through terminal</span></div><div class="fact"><b>Stored result</b><span>Readable after completion</span></div></div></article>
      <article class="card" data-tone="signal"><span class="label">BOUNDARY</span><h3>Acceptance is not completion</h3><p>An HTTP 202 response confirms that the request entered the durable workflow. It says nothing about when execution will finish.</p></article>
      <article class="card full"><span class="label">PERSISTED LIFECYCLE</span><h3>Every status answers a different operational question</h3><div class="state-rack"><div class="state" data-tone="accent"><strong>QUEUED</strong><span>Was the job accepted?</span></div><div class="state"><strong>RUNNING</strong><span>Has a worker claimed it?</span></div><div class="state" data-tone="good"><strong>COMPLETED</strong><span>Is the result stored?</span></div><div class="state" data-tone="bad"><strong>FAILED</strong><span>Does recovery need a decision?</span></div></div></article>
    </div>
  </section>

  <section class="section" data-tone="signal">
    <div class="section-head"><div><h2>Responsibilities and hand-offs</h2><p>Each component owns a narrow contract. Product choices can change without changing the responsibility map.</p></div><span class="section-number">02</span></div>
    <div class="cards">
      <article class="card" data-tone="accent"><span class="label">CLIENT EDGE</span><h3>API service</h3><p>Authenticates, validates, assigns the job ID and exposes status. It never presents queued work as finished work.</p></article>
      <article class="card"><span class="label">DELIVERY</span><h3>Durable queue</h3><p>Makes accepted work available and supports bounded redelivery when a worker disappears.</p></article>
      <article class="card"><span class="label">EXECUTION</span><h3>Worker service</h3><p>Claims one job, records RUNNING and performs the operation under an explicit idempotency policy.</p></article>
      <article class="card wide" data-tone="good"><span class="label">SYSTEM OF RECORD</span><h3>Job store</h3><p>Holds the request identity, current status, attempt information and final result or failure summary. Client reads resolve here.</p></article>
      <article class="card" data-tone="signal"><span class="label">RECOVERY GAP</span><h3>Commit versus publish</h3><p>Database commit and queue publication are separate boundaries. Use an outbox or equivalent recovery mechanism.</p></article>
    </div>
    <div class="band"><strong>Need direction or timing?</strong><p>Open the companion <a href="architecture-light.html">architecture</a>, <a href="sequence-light.html">sequence</a> and <a href="state-light.html">state</a> diagrams. This overview summarizes them; it does not replace their graph semantics.</p></div>
  </section>

  <section class="section">
    <div class="section-head"><div><h2>Safe operating rules</h2><p>The design becomes implementable when retries, terminal writes and client promises have testable boundaries.</p></div><span class="section-number">03</span></div>
    <div class="cards">
      <article class="card half" data-tone="good"><span class="label">COMPLETION RULE</span><h3>Persist the result first</h3><p>A worker stores the result before it marks the job COMPLETED. A completed status must never point to a missing result.</p></article>
      <article class="card half" data-tone="signal"><span class="label">RETRY RULE</span><h3>Repeat only when safe</h3><p>A retry returns FAILED work to QUEUED only when the operation is idempotent or protected by a stable deduplication key.</p></article>
      <article class="card"><h3>Invalid input</h3><p>Reject before runnable work exists. Return a useful client error without allocating worker capacity.</p></article>
      <article class="card"><h3>Worker loss</h3><p>Expire the claim, record the attempt and redeliver within a bounded policy.</p></article>
      <article class="card" data-tone="bad"><h3>Unknown side effect</h3><p>Stop automatic retry when the external outcome cannot be reconciled safely.</p></article>
    </div>
  </section>

  <section class="section" data-tone="signal">
    <div class="section-head"><div><h2>Decisions still required</h2><p>These choices are deliberately open. They depend on workload, risk and operating environment.</p></div><span class="section-number">04</span></div>
    <div class="cards">
      <article class="card"><span class="label">TECHNOLOGY</span><h3>Queue and store</h3><p>Select products only after defining durability, ordering and recovery needs.</p></article>
      <article class="card"><span class="label">POLICY</span><h3>Attempts and backoff</h3><p>Set limits per operation class and define which failures require human reconciliation.</p></article>
      <article class="card"><span class="label">DATA</span><h3>Retention and tenancy</h3><p>Define authorization, deletion and result-size constraints before implementation.</p></article>
    </div>
    <div class="evidence"><article><h3>Example basis</h3><code>examples/full-document.md · synthetic Job Service proposal</code></article><article><h3>Verification boundary</h3><code>Layout and links can be checked; runtime behavior remains unverified.</code></article></div>
  </section>
</div>
</main>`;

for (const theme of ['light', 'dark']) {
  const label = theme === 'light' ? 'light overview' : 'dark overview';
  const html = `<!doctype html><html lang="en" data-theme="${theme}"><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Job Service — ${label}</title><style>${styles}</style></head><body>${content}</body></html>`;
  await writeFile(`examples/overview-document-${theme}.html`, html);
}
