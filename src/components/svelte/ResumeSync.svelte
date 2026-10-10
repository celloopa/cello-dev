<script>
  // Dev-only: import a resume exported from Ghosted (its JSON button) into
  // cv.json, then regenerate the PDF. Talks to src/integrations/resumeSync.ts.
  import { onMount } from "svelte";

  let fileInput = $state();
  let exported = $state(null);
  let fileName = $state("");
  let preview = $state(null);
  let message = $state("");
  let busy = $state(false);

  async function post(path, body) {
    const res = await fetch(`/__resume-sync/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  }

  async function choose(event) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    message = "";
    preview = null;
    try {
      exported = JSON.parse(await file.text());
      fileName = file.name;
      preview = await post("preview", exported);
    } catch (err) {
      exported = null;
      message = err instanceof SyntaxError ? "That file isn't valid JSON." : err.message;
    }
  }

  async function apply() {
    busy = true;
    try {
      await post("apply", exported);
      preview = null;
      // Saving cv.json reloads the page; the status check on load picks it up from there.
      watchPdf();
    } catch (err) {
      message = err.message;
      busy = false;
    }
  }

  function cancel() {
    preview = null;
    exported = null;
  }

  async function watchPdf() {
    busy = true;
    message = "Saved cv.json. Regenerating the PDF…";
    for (;;) {
      const job = await fetch("/__resume-sync/status").then((r) => r.json());
      if (job.state === "done") message = "Saved cv.json and regenerated the PDF.";
      if (job.state === "error") message = `Saved cv.json, but the PDF failed: ${job.error}`;
      if (job.state !== "printing") break;
      await new Promise((r) => setTimeout(r, 1000));
    }
    busy = false;
  }

  onMount(async () => {
    const job = await fetch("/__resume-sync/status").then((r) => r.json());
    const recent = job.finishedAt && Date.now() - job.finishedAt < 60_000;
    if (job.state === "printing" || recent) watchPdf();
  });
</script>

<div class="resume-sync no-print">
  <div class="row">
    <span class="tag">Dev only</span>
    <button type="button" disabled={busy} onclick={() => fileInput.click()}>Import from Ghosted</button>
    <input bind:this={fileInput} type="file" accept="application/json,.json" hidden onchange={choose} />
    {#if message}<p class="message" role="status">{message}</p>{/if}
  </div>

  {#if preview}
    <div class="preview">
      {#if preview.changes.length}
        <p><strong>{fileName}</strong> changes {preview.changes.length} thing{preview.changes.length === 1 ? "" : "s"} in cv.json:</p>
        <ul>
          {#each preview.changes as change}<li>{change}</li>{/each}
        </ul>
      {:else}
        <p>cv.json already matches <strong>{fileName}</strong>.</p>
      {/if}
      {#if preview.notes.length}
        <details>
          <summary>Kept as-is ({preview.notes.length})</summary>
          <ul>
            {#each preview.notes as note}<li>{note}</li>{/each}
          </ul>
        </details>
      {/if}
      <div class="row">
        {#if preview.changes.length}
          <button type="button" class="primary" disabled={busy} onclick={apply}>Apply and regenerate PDF</button>
        {/if}
        <button type="button" onclick={cancel}>{preview.changes.length ? "Cancel" : "Close"}</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .resume-sync {
    display: grid;
    gap: 1rem;
    margin-top: 1.25rem;
    padding: 1rem;
    border: 2px dashed rgba(var(--color-text-rgb), 0.35);
    font-size: 0.85rem;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
  }

  .tag {
    padding: 0.15rem 0.5rem;
    border: 2px solid var(--color-accent);
    color: var(--color-accent);
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  button {
    padding: 0.5rem 1rem;
    background: transparent;
    color: var(--color-text);
    border: 2px solid var(--color-text);
    font: inherit;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  button:hover:not(:disabled),
  button.primary {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: var(--color-background);
  }

  button:disabled {
    opacity: 0.5;
    cursor: wait;
  }

  .message {
    margin: 0;
  }

  .preview {
    display: grid;
    gap: 0.75rem;
  }

  .preview p,
  .preview ul {
    margin: 0;
  }

  .preview ul {
    padding-left: 1.25rem;
    font-family: "Geist Mono", monospace;
    font-size: 0.8rem;
  }

  summary {
    cursor: pointer;
  }
</style>
