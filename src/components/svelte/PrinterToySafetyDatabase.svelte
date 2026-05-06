<script lang="ts">
  import { onMount } from "svelte";
  import type {
    CandidateStatus,
    ColorMechanism,
    EnclosureType,
    PriceTier,
    PrinterCandidate,
    Source,
    UnderThreePosture,
    WasteProfile,
  } from "@/data/printerToySafety";

  export let printers: PrinterCandidate[] = [];
  export let sources: Source[] = [];

  type SortKey =
    | "overall"
    | "underThreeSafety"
    | "ease"
    | "price"
    | "buildSize"
    | "includedColors"
    | "maxColors"
    | "lowWasteColor"
    | "reliabilityConfidence"
    | "toyValue";

  type ViewMode = "cards" | "table" | "pinned";

  const statusLabels: Record<CandidateStatus, string> = {
    recommended: "Recommended",
    viable: "Viable",
    caution: "Caution",
    watchlist: "Watchlist",
    "unavailable-us": "Unavailable US",
    excluded: "Excluded",
  };

  const priceTierLabels: Record<PriceTier, string> = {
    budget: "Budget",
    mainstream: "Mainstream",
    stretch: "Stretch",
    reach: "Reach",
    pro: "Pro",
    "industrial-watchlist": "Industrial watchlist",
  };

  const postureLabels: Record<UnderThreePosture, string> = {
    "avoid-direct-access": "Avoid direct access",
    "large-supervised-prints-only": "Large supervised prints only",
    "not-for-under-three": "Not for under 3",
  };

  const enclosureLabels: Record<EnclosureType, string> = {
    open: "Open",
    partial: "Partial",
    enclosed: "Enclosed",
    optional: "Optional",
  };

  const mechanismLabels: Record<ColorMechanism, string> = {
    "single-nozzle-filament-switcher": "Single-nozzle switching",
    "dual-nozzle-plus-filament-switcher": "Dual nozzle + switching",
    "independent-toolheads": "Independent toolheads",
    "mmu-add-on": "MMU add-on",
    toolchanger: "Toolchanger",
    "unknown-auto-multicolor": "Verify mechanism",
  };

  const wasteLabels: Record<WasteProfile, string> = {
    "high-purge": "High purge",
    "moderate-purge": "Moderate purge",
    "low-purge": "Low purge",
    "near-zero-purge": "Near-zero purge",
    unknown: "Verify waste",
  };

  const statusOptions: CandidateStatus[] = [
    "recommended",
    "viable",
    "caution",
    "watchlist",
    "unavailable-us",
    "excluded",
  ];

  const priceTierOptions: PriceTier[] = [
    "budget",
    "mainstream",
    "stretch",
    "reach",
    "pro",
    "industrial-watchlist",
  ];

  const mechanismOptions: ColorMechanism[] = [
    "single-nozzle-filament-switcher",
    "dual-nozzle-plus-filament-switcher",
    "independent-toolheads",
    "mmu-add-on",
    "toolchanger",
    "unknown-auto-multicolor",
  ];

  const defaultStatuses: CandidateStatus[] = ["recommended", "viable", "caution"];
  const defaultPriceTiers: PriceTier[] = [
    "budget",
    "mainstream",
    "stretch",
    "reach",
    "pro",
  ];

  let sortKey: SortKey = "overall";
  let viewMode: ViewMode = "cards";
  let selectedStatuses = [...defaultStatuses];
  let selectedPriceTiers = [...defaultPriceTiers];
  let selectedMechanisms: ColorMechanism[] = [];
  let priceMax = "2500";
  let enclosureFilter = "hide-open";
  let includedColorMin = 0;
  let maxColorMin = 0;
  let wasteFilter = "any";
  let postureFilter = "any";
  let sizeFilter = "any";
  let confidenceFilter = "hide-low";
  let searchQuery = "";
  let pinnedIds: string[] = [];
  let shareStatus = "Filtered views can be copied as a URL.";
  let mounted = false;

  $: filteredPrinters = sortPrinters(
    printers.filter((printer) => {
      const maxPrice = getComparablePrice(printer);
      const includedColors = printer.colorCapability.includedAutomaticColors ?? 0;
      const maxColors = printer.colorCapability.maxExpandableColors ?? 0;
      const searchText = [
        printer.name,
        printer.brand,
        printer.verdict,
        printer.colorCapability.includedColorLabel,
        printer.colorCapability.maxExpandableLabel,
      ]
        .join(" ")
        .toLowerCase();

      return (
        selectedStatuses.includes(printer.status) &&
        selectedPriceTiers.includes(printer.priceTier) &&
        (!selectedMechanisms.length ||
          selectedMechanisms.includes(printer.colorCapability.mechanism)) &&
        (priceMax === "any" || (maxPrice !== null && maxPrice <= Number(priceMax))) &&
        (enclosureFilter === "any" ||
          (enclosureFilter === "enclosed" && printer.enclosure === "enclosed") ||
          (enclosureFilter === "hide-open" && printer.enclosure !== "open")) &&
        includedColors >= includedColorMin &&
        maxColors >= maxColorMin &&
        (wasteFilter === "any" ||
          (wasteFilter === "hide-high" &&
            printer.colorCapability.wasteProfile !== "high-purge") ||
          (wasteFilter === "low-first" &&
            ["low-purge", "near-zero-purge"].includes(
              printer.colorCapability.wasteProfile,
            ))) &&
        (postureFilter === "any" || printer.underThreePosture === postureFilter) &&
        (sizeFilter === "any" ||
          (sizeFilter === "standard" && (printer.buildVolume.liters ?? 0) < 25) ||
          (sizeFilter === "large" &&
            (printer.buildVolume.liters ?? 0) >= 25 &&
            (printer.buildVolume.liters ?? 0) < 50) ||
          (sizeFilter === "extra-large" && (printer.buildVolume.liters ?? 0) >= 50)) &&
        (confidenceFilter === "any" ||
          (confidenceFilter === "hide-low" && printer.scores.reliabilityConfidence >= 40)) &&
        (!searchQuery || searchText.includes(searchQuery.toLowerCase()))
      );
    }),
  );

  $: pinnedPrinters = pinnedIds
    .map((id) => printers.find((printer) => printer.id === id))
    .filter(Boolean) as PrinterCandidate[];

  $: resultSummary = `${filteredPrinters.length} of ${printers.length} printers`;

  onMount(() => {
    mounted = true;
    readUrlState();
  });

  $: if (mounted) {
    writeUrlState();
  }

  function sortPrinters(items: PrinterCandidate[]) {
    return [...items].sort((a, b) => {
      if (sortKey === "price") {
        return (a.priceMin ?? Number.MAX_SAFE_INTEGER) - (b.priceMin ?? Number.MAX_SAFE_INTEGER);
      }

      if (sortKey === "includedColors") {
        return (
          (b.colorCapability.includedAutomaticColors ?? 0) -
          (a.colorCapability.includedAutomaticColors ?? 0)
        );
      }

      if (sortKey === "maxColors") {
        return (
          (b.colorCapability.maxExpandableColors ?? 0) -
          (a.colorCapability.maxExpandableColors ?? 0)
        );
      }

      if (sortKey === "buildSize") {
        return (b.buildVolume.liters ?? 0) - (a.buildVolume.liters ?? 0);
      }

      return b.scores[sortKey] - a.scores[sortKey];
    });
  }

  function getComparablePrice(printer: PrinterCandidate) {
    return printer.priceMax ?? printer.priceMin;
  }

  function toggleFromList<T extends string>(list: T[], value: T) {
    return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
  }

  function toggleStatus(status: CandidateStatus) {
    selectedStatuses = toggleFromList(selectedStatuses, status);
  }

  function togglePriceTier(priceTier: PriceTier) {
    selectedPriceTiers = toggleFromList(selectedPriceTiers, priceTier);
  }

  function toggleMechanism(mechanism: ColorMechanism) {
    selectedMechanisms = toggleFromList(selectedMechanisms, mechanism);
  }

  function togglePin(id: string) {
    if (pinnedIds.includes(id)) {
      pinnedIds = pinnedIds.filter((pin) => pin !== id);
      shareStatus = "Removed from pinned comparison.";
      return;
    }

    if (pinnedIds.length >= 5) {
      shareStatus = "Pinned comparison is limited to five printers.";
      return;
    }

    pinnedIds = [...pinnedIds, id];
    shareStatus = "Added to pinned comparison.";
  }

  function resetFilters() {
    sortKey = "overall";
    viewMode = "cards";
    selectedStatuses = [...defaultStatuses];
    selectedPriceTiers = [...defaultPriceTiers];
    selectedMechanisms = [];
    priceMax = "2500";
    enclosureFilter = "hide-open";
    includedColorMin = 0;
    maxColorMin = 0;
    wasteFilter = "any";
    postureFilter = "any";
    sizeFilter = "any";
    confidenceFilter = "hide-low";
    searchQuery = "";
    shareStatus = "Filters reset.";
  }

  function applyPreset(
    preset: "household" | "budget" | "lowWaste" | "all",
  ) {
    if (preset === "household") {
      selectedStatuses = ["recommended", "viable", "caution"];
      selectedPriceTiers = ["budget", "mainstream", "stretch", "reach", "pro"];
      selectedMechanisms = [];
      priceMax = "2500";
      enclosureFilter = "hide-open";
      includedColorMin = 4;
      maxColorMin = 0;
      wasteFilter = "any";
      postureFilter = "avoid-direct-access";
      sizeFilter = "any";
      confidenceFilter = "hide-low";
      sortKey = "underThreeSafety";
      shareStatus = "Showing the safer household shortlist.";
      return;
    }

    if (preset === "budget") {
      selectedStatuses = ["recommended", "viable", "caution"];
      selectedPriceTiers = ["budget", "mainstream"];
      selectedMechanisms = [];
      priceMax = "1000";
      enclosureFilter = "any";
      includedColorMin = 4;
      maxColorMin = 0;
      wasteFilter = "any";
      postureFilter = "any";
      sizeFilter = "any";
      confidenceFilter = "hide-low";
      sortKey = "toyValue";
      shareStatus = "Showing budget automatic-color options.";
      return;
    }

    if (preset === "lowWaste") {
      selectedStatuses = ["recommended", "viable", "watchlist"];
      selectedPriceTiers = ["mainstream", "stretch", "reach", "pro"];
      selectedMechanisms = ["dual-nozzle-plus-filament-switcher", "independent-toolheads", "toolchanger"];
      priceMax = "any";
      enclosureFilter = "any";
      includedColorMin = 0;
      maxColorMin = 0;
      wasteFilter = "low-first";
      postureFilter = "any";
      sizeFilter = "any";
      confidenceFilter = "any";
      sortKey = "lowWasteColor";
      shareStatus = "Showing lower-purge color systems.";
      return;
    }

    selectedStatuses = [...statusOptions];
    selectedPriceTiers = [...priceTierOptions];
    selectedMechanisms = [];
    priceMax = "any";
    enclosureFilter = "any";
    includedColorMin = 0;
    maxColorMin = 0;
    wasteFilter = "any";
    postureFilter = "any";
    sizeFilter = "any";
    confidenceFilter = "any";
    sortKey = "overall";
    shareStatus = "Showing the full database, including watchlist and low-confidence entries.";
  }

  async function shareView() {
    const url = window.location.href;
    const title = "3D Printer Toy Safety Database";
    const text = "Filterable under-3 safety comparison for automatic multicolor FDM printers.";

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        shareStatus = "Share sheet opened.";
        return;
      }

      await navigator.clipboard.writeText(url);
      shareStatus = "Filtered view link copied.";
    } catch {
      shareStatus = "Could not copy automatically. Copy the browser URL manually.";
    }
  }

  async function copyShortlist() {
    const topThree = filteredPrinters
      .slice(0, 3)
      .map(
        (printer, index) =>
          `${index + 1}. ${printer.name} - ${printer.priceLabel}; ${printer.colorCapability.includedColorLabel}; ${postureLabels[printer.underThreePosture]}`,
      )
      .join("\n");

    try {
      await navigator.clipboard.writeText(`${topThree}\n\n${window.location.href}`);
      shareStatus = "Top shortlist copied.";
    } catch {
      shareStatus = "Could not copy shortlist automatically.";
    }
  }

  function writeUrlState() {
    const params = new URLSearchParams();

    params.set("sort", sortKey);
    params.set("view", viewMode);
    params.set("status", selectedStatuses.join(","));
    params.set("tier", selectedPriceTiers.join(","));
    params.set("price", priceMax);
    params.set("enclosure", enclosureFilter);
    params.set("includedColors", String(includedColorMin));
    params.set("maxColors", String(maxColorMin));
    params.set("mechanism", selectedMechanisms.join(","));
    params.set("waste", wasteFilter);
    params.set("posture", postureFilter);
    params.set("size", sizeFilter);
    params.set("confidence", confidenceFilter);

    if (searchQuery) params.set("q", searchQuery);
    if (pinnedIds.length) params.set("pins", pinnedIds.join(","));

    const nextUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", nextUrl);
  }

  function readUrlState() {
    const params = new URLSearchParams(window.location.search);
    const validSorts: SortKey[] = [
      "overall",
      "underThreeSafety",
      "ease",
      "price",
      "buildSize",
      "includedColors",
      "maxColors",
      "lowWasteColor",
      "reliabilityConfidence",
      "toyValue",
    ];
    const validViews: ViewMode[] = ["cards", "table", "pinned"];

    const paramSort = params.get("sort") as SortKey | null;
    const paramView = params.get("view") as ViewMode | null;

    if (paramSort && validSorts.includes(paramSort)) sortKey = paramSort;
    if (paramView && validViews.includes(paramView)) viewMode = paramView;

    selectedStatuses = parseList(params.get("status"), statusOptions, defaultStatuses);
    selectedPriceTiers = parseList(params.get("tier"), priceTierOptions, defaultPriceTiers);
    selectedMechanisms = parseList(params.get("mechanism"), mechanismOptions, []);

    priceMax = params.get("price") ?? priceMax;
    enclosureFilter = params.get("enclosure") ?? enclosureFilter;
    includedColorMin = Number(params.get("includedColors") ?? includedColorMin);
    maxColorMin = Number(params.get("maxColors") ?? maxColorMin);
    wasteFilter = params.get("waste") ?? wasteFilter;
    postureFilter = params.get("posture") ?? postureFilter;
    sizeFilter = params.get("size") ?? sizeFilter;
    confidenceFilter = params.get("confidence") ?? confidenceFilter;
    searchQuery = params.get("q") ?? "";

    const validIds = new Set(printers.map((printer) => printer.id));
    pinnedIds = (params.get("pins") ?? "")
      .split(",")
      .filter((id) => validIds.has(id))
      .slice(0, 5);
  }

  function parseList<T extends string>(value: string | null, valid: T[], fallback: T[]) {
    if (!value) return [...fallback];
    const parsed = value.split(",").filter((item): item is T => valid.includes(item as T));
    return parsed.length ? parsed : [...fallback];
  }

  function sourceLinks(ids: string[]) {
    const byId = new Map(sources.map((source) => [source.id, source]));
    return ids.map((id) => byId.get(id)).filter(Boolean) as Source[];
  }
</script>

<section class="database-shell" aria-label="3D printer safety database">
  <div class="controls">
    <div class="control-topline">
      <div>
        <span class="panel-kicker">Database</span>
        <h2>{resultSummary}</h2>
      </div>
      <div class="actions">
        <button type="button" on:click={shareView}>Share View</button>
        <button type="button" on:click={copyShortlist}>Copy Shortlist</button>
        <button type="button" on:click={resetFilters}>Reset</button>
      </div>
    </div>

    <p class="share-status" aria-live="polite">{shareStatus}</p>

    <div class="preset-panel" aria-label="Quick filter presets">
      <span>Start with</span>
      <div class="preset-actions">
        <button type="button" on:click={() => applyPreset("household")}>Safer household shortlist</button>
        <button type="button" on:click={() => applyPreset("budget")}>Budget color printers</button>
        <button type="button" on:click={() => applyPreset("lowWaste")}>Lower purge systems</button>
        <button type="button" on:click={() => applyPreset("all")}>Show everything</button>
      </div>
    </div>

    <div class="filter-board">
      <label class="search-control">
        Search
        <input bind:value={searchQuery} type="search" placeholder="Bambu, toolchanger, enclosed..." />
      </label>

      <div class="filter-grid">
        <label>
          Sort
          <select bind:value={sortKey}>
            <option value="overall">Best overall</option>
            <option value="underThreeSafety">Under-3 safety</option>
            <option value="ease">Ease of use</option>
            <option value="price">Lowest price</option>
            <option value="buildSize">Largest build volume</option>
            <option value="includedColors">Most included colors</option>
            <option value="maxColors">Most expandable colors</option>
            <option value="lowWasteColor">Lowest purge waste</option>
            <option value="reliabilityConfidence">Highest confidence</option>
            <option value="toyValue">Best toy value</option>
          </select>
        </label>

        <label>
          Price ceiling
          <select bind:value={priceMax}>
            <option value="500">$500</option>
            <option value="1000">$1,000</option>
            <option value="1500">$1,500</option>
            <option value="2500">$2,500</option>
            <option value="5000">$5,000</option>
            <option value="any">No cap</option>
          </select>
        </label>

        <label>
          Enclosure
          <select bind:value={enclosureFilter}>
            <option value="hide-open">Hide open-frame</option>
            <option value="enclosed">Enclosed only</option>
            <option value="any">Any</option>
          </select>
        </label>

        <label>
          Included colors
          <select bind:value={includedColorMin}>
            <option value={0}>Any</option>
            <option value={4}>4+</option>
            <option value={5}>5+</option>
            <option value={8}>8+</option>
            <option value={16}>16+</option>
          </select>
        </label>

        <label>
          Expandable max
          <select bind:value={maxColorMin}>
            <option value={0}>Any</option>
            <option value={4}>4+</option>
            <option value={8}>8+</option>
            <option value={16}>16+</option>
            <option value={20}>20+</option>
          </select>
        </label>

        <label>
          Waste
          <select bind:value={wasteFilter}>
            <option value="any">Any</option>
            <option value="hide-high">Hide high purge</option>
            <option value="low-first">Low / near-zero only</option>
          </select>
        </label>

        <label>
          Under-3 posture
          <select bind:value={postureFilter}>
            <option value="any">Any</option>
            <option value="avoid-direct-access">Avoid direct access</option>
            <option value="large-supervised-prints-only">Large supervised prints only</option>
            <option value="not-for-under-three">Not for under 3</option>
          </select>
        </label>

        <label>
          Build size
          <select bind:value={sizeFilter}>
            <option value="any">Any</option>
            <option value="standard">Standard</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra large</option>
          </select>
        </label>

        <label>
          Confidence
          <select bind:value={confidenceFilter}>
          <option value="hide-low">Hide unverified entries</option>
          <option value="any">Show all confidence levels</option>
        </select>
        </label>
      </div>
    </div>

    <details class="advanced-filters">
      <summary>Advanced filters</summary>
      <div class="advanced-grid">
        <fieldset>
          <legend>Listing status</legend>
          <div class="chips">
            {#each statusOptions as status}
              <button
                type="button"
                class:active={selectedStatuses.includes(status)}
                on:click={() => toggleStatus(status)}
              >
                {statusLabels[status]}
              </button>
            {/each}
          </div>
        </fieldset>

        <fieldset>
          <legend>Price tier</legend>
          <div class="chips">
            {#each priceTierOptions as tier}
              <button
                type="button"
                class:active={selectedPriceTiers.includes(tier)}
                on:click={() => togglePriceTier(tier)}
              >
                {priceTierLabels[tier]}
              </button>
            {/each}
          </div>
        </fieldset>

        <fieldset>
          <legend>Color mechanism</legend>
          <div class="chips">
            {#each mechanismOptions as mechanism}
              <button
                type="button"
                class:active={selectedMechanisms.includes(mechanism)}
                on:click={() => toggleMechanism(mechanism)}
              >
                {mechanismLabels[mechanism]}
              </button>
            {/each}
          </div>
        </fieldset>
      </div>
    </details>
  </div>

  <div class="view-tabs" aria-label="View mode">
    <button type="button" class:active={viewMode === "cards"} on:click={() => (viewMode = "cards")}>
      Cards
    </button>
    <button type="button" class:active={viewMode === "table"} on:click={() => (viewMode = "table")}>
      Table
    </button>
    <button type="button" class:active={viewMode === "pinned"} on:click={() => (viewMode = "pinned")}>
      Pinned ({pinnedIds.length})
    </button>
  </div>

  {#if filteredPrinters.length === 0}
    <div class="empty-state">
      <h2>No printers match those filters.</h2>
      <p>Open the status, confidence, or price filters to bring the database back.</p>
      <button type="button" on:click={resetFilters}>Reset Filters</button>
    </div>
  {:else if viewMode === "table"}
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Printer</th>
            <th>Status</th>
            <th>Price</th>
            <th>Build volume</th>
            <th>Included colors</th>
            <th>Expandable max</th>
            <th>Color system</th>
            <th>Waste</th>
            <th>Enclosure</th>
            <th>Under-3 posture</th>
            <th>Watchout</th>
          </tr>
        </thead>
        <tbody>
          {#each filteredPrinters as printer}
            <tr>
              <td><strong>{printer.name}</strong></td>
              <td>{statusLabels[printer.status]}</td>
              <td>{printer.priceLabel}</td>
              <td>{printer.buildVolume.label}</td>
              <td>{printer.colorCapability.includedColorLabel}</td>
              <td>{printer.colorCapability.maxExpandableLabel}</td>
              <td>{mechanismLabels[printer.colorCapability.mechanism]}</td>
              <td>{wasteLabels[printer.colorCapability.wasteProfile]}</td>
              <td>{enclosureLabels[printer.enclosure]}</td>
              <td>{postureLabels[printer.underThreePosture]}</td>
              <td>{printer.watchouts[0]}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {:else if viewMode === "pinned"}
    {@render PinnedComparison(pinnedPrinters)}
  {:else}
    <div class="cards">
      {#each filteredPrinters as printer, index}
        <article class="printer-card" data-status={printer.status}>
          <div class="card-head">
            <div>
              <div class="card-meta">
                <span class="rank">#{index + 1}</span>
                <span class="status-pill">{statusLabels[printer.status]}</span>
              </div>
              <h3>{printer.name}</h3>
              <p>{printer.verdict}</p>
            </div>
            <button type="button" class:active={pinnedIds.includes(printer.id)} on:click={() => togglePin(printer.id)}>
              {pinnedIds.includes(printer.id) ? "Pinned" : "Pin"}
            </button>
          </div>

          <div class="metric-strip">
            <span>{printer.colorCapability.includedColorLabel}</span>
            <span>{printer.colorCapability.maxExpandableLabel}</span>
            <span>{enclosureLabels[printer.enclosure]}</span>
            <span>{wasteLabels[printer.colorCapability.wasteProfile]}</span>
          </div>

          <div class="score-grid">
            {@render Score("Overall", printer.scores.overall)}
            {@render Score("Under-3", printer.scores.underThreeSafety)}
            {@render Score("Toy value", printer.scores.toyValue)}
            {@render Score("Confidence", printer.scores.reliabilityConfidence)}
          </div>

          <dl class="spec-list">
            <div><dt>Status</dt><dd>{statusLabels[printer.status]}</dd></div>
            <div><dt>Price</dt><dd>{printer.priceLabel}</dd></div>
            <div><dt>Build volume</dt><dd>{printer.buildVolume.label}</dd></div>
            <div><dt>Color system</dt><dd>{mechanismLabels[printer.colorCapability.mechanism]}</dd></div>
            <div><dt>Under-3 posture</dt><dd>{postureLabels[printer.underThreePosture]}</dd></div>
          </dl>

          <div class="two-column">
            <div>
              <h4>Reasons to buy</h4>
              <ul>
                {#each printer.strengths as item}
                  <li>{item}</li>
                {/each}
              </ul>
            </div>
            <div>
              <h4>Watchouts</h4>
              <ul>
                {#each printer.watchouts as item}
                  <li>{item}</li>
                {/each}
              </ul>
            </div>
          </div>

          <details>
            <summary>Sources</summary>
            <ul class="sources">
              {#each sourceLinks(printer.sourceIds) as source}
                <li><a href={source.url} target="_blank" rel="noreferrer">{source.publisher}: {source.title}</a></li>
              {/each}
            </ul>
          </details>
        </article>
      {/each}
    </div>
  {/if}
</section>

{#snippet Score(label: string, value: number)}
  <div class="score">
    <div><span>{label}</span><strong>{value}</strong></div>
    <meter min="0" max="100" value={value}>{value}</meter>
  </div>
{/snippet}

{#snippet PinnedComparison(printers: PrinterCandidate[])}
  {#if printers.length === 0}
    <div class="empty-state">
      <h2>No pinned printers yet.</h2>
      <p>Pin up to five candidates from the card view to compare the exact same attributes.</p>
    </div>
  {:else}
    <div class="table-wrap pinned-table">
      <table>
        <thead>
          <tr>
            <th>Attribute</th>
            {#each printers as printer}
              <th>{printer.name}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          <tr><th>Price</th>{#each printers as printer}<td>{printer.priceLabel}</td>{/each}</tr>
          <tr><th>Build volume</th>{#each printers as printer}<td>{printer.buildVolume.label}</td>{/each}</tr>
          <tr><th>Included colors</th>{#each printers as printer}<td>{printer.colorCapability.includedColorLabel}</td>{/each}</tr>
          <tr><th>Expandable max</th>{#each printers as printer}<td>{printer.colorCapability.maxExpandableLabel}</td>{/each}</tr>
          <tr><th>Color system</th>{#each printers as printer}<td>{mechanismLabels[printer.colorCapability.mechanism]}</td>{/each}</tr>
          <tr><th>Waste profile</th>{#each printers as printer}<td>{wasteLabels[printer.colorCapability.wasteProfile]}</td>{/each}</tr>
          <tr><th>Enclosure</th>{#each printers as printer}<td>{enclosureLabels[printer.enclosure]}</td>{/each}</tr>
          <tr><th>Under-3 posture</th>{#each printers as printer}<td>{postureLabels[printer.underThreePosture]}</td>{/each}</tr>
          <tr><th>Buy reason</th>{#each printers as printer}<td>{printer.strengths[0]}</td>{/each}</tr>
          <tr><th>Avoid reason</th>{#each printers as printer}<td>{printer.watchouts[0]}</td>{/each}</tr>
        </tbody>
      </table>
    </div>
  {/if}
{/snippet}

<style>
  .database-shell {
    display: grid;
    gap: clamp(1rem, 3vw, 2rem);
  }

  .safety-panel {
    display: grid;
    grid-template-columns: minmax(210px, 0.65fr) minmax(280px, 1.35fr) auto;
    gap: clamp(1rem, 3vw, 2rem);
    align-items: center;
    padding: clamp(1rem, 2.5vw, 1.4rem);
    border: 3px solid var(--color-text);
    background:
      repeating-linear-gradient(
        -45deg,
        color-mix(in srgb, var(--color-accent) 18%, transparent) 0 10px,
        transparent 10px 20px
      ),
      color-mix(in srgb, var(--color-background) 92%, var(--color-text));
  }

  .safety-panel h2,
  .controls h2 {
    margin: 0;
    color: var(--color-accent);
    font-size: clamp(1.6rem, 4vw, 3rem);
    line-height: 0.95;
    text-transform: uppercase;
  }

  .safety-panel p,
  .share-status,
  .printer-card p {
    max-width: 68ch;
    color: var(--color-text);
    opacity: 0.86;
    margin: 0;
    line-height: 1.55;
  }

  .safety-panel a {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--color-accent);
    padding: 0.75rem 1rem;
    color: var(--color-accent);
    font-weight: 800;
    text-transform: uppercase;
  }

  .panel-kicker,
  legend,
  label,
  dt,
  h4,
  .rank,
  .status-pill {
    color: var(--color-accent);
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .controls {
    display: grid;
    gap: clamp(0.75rem, 2vw, 1.25rem);
    padding: clamp(1rem, 2.5vw, 1.5rem);
    border: 3px solid var(--color-text);
    background: color-mix(in srgb, var(--color-background) 96%, var(--color-text));
  }

  .control-topline {
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    align-items: start;
  }

  .actions,
  .view-tabs,
  .chips,
  .preset-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .preset-panel {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 0.75rem;
    align-items: center;
    padding: 0.75rem;
    border: 2px solid color-mix(in srgb, var(--color-text) 28%, transparent);
    background: color-mix(in srgb, var(--color-text) 6%, transparent);
  }

  .preset-panel > span {
    color: var(--color-accent);
    font-size: 0.78rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .preset-actions button {
    min-height: 40px;
    font-size: 0.78rem;
  }

  button,
  input,
  select {
    min-height: 44px;
    border: 2px solid var(--color-text);
    border-radius: 0;
    background: var(--color-background);
    color: var(--color-text);
    font: inherit;
    font-weight: 800;
    transition:
      background-color 0.18s cubic-bezier(0.16, 1, 0.3, 1),
      border-color 0.18s cubic-bezier(0.16, 1, 0.3, 1),
      color 0.18s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
  }

  button {
    padding: 0 0.8rem;
    text-transform: uppercase;
  }

  button.active,
  button:hover,
  button:focus-visible {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: var(--color-background);
  }

  button:hover,
  button:focus-visible {
    transform: translateY(-1px);
  }

  input,
  select {
    width: 100%;
    padding: 0 0.65rem;
  }

  .filter-board {
    display: grid;
    grid-template-columns: minmax(220px, 0.55fr) minmax(0, 1.45fr);
    gap: 0.75rem;
    align-items: end;
  }

  .filter-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
  }

  label {
    display: grid;
    gap: 0.35rem;
  }

  fieldset {
    border: 0;
    border-top: 2px solid color-mix(in srgb, var(--color-text) 24%, transparent);
    padding: 0.85rem 0 0;
  }

  legend {
    padding: 0 0.35rem;
  }

  .advanced-filters {
    border-top: 2px solid color-mix(in srgb, var(--color-text) 28%, transparent);
    padding-top: 0.75rem;
  }

  .advanced-filters > summary {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    color: var(--color-accent);
    font-size: 0.84rem;
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .advanced-grid {
    display: grid;
    gap: 0.85rem;
    padding-top: 0.5rem;
  }

  .cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: clamp(0.9rem, 2vw, 1.25rem);
  }

  .printer-card {
    position: relative;
    display: grid;
    gap: 1rem;
    padding: clamp(1rem, 2.4vw, 1.25rem);
    border: 2px solid var(--color-text);
    background: color-mix(in srgb, var(--color-background) 96%, var(--color-text));
    transition:
      border-color 0.2s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
      box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .printer-card[data-status="recommended"] {
    border-color: var(--color-accent);
    box-shadow: 8px 8px 0 color-mix(in srgb, var(--color-accent) 70%, var(--color-text));
  }

  .printer-card:hover {
    transform: translateY(-2px);
  }

  .card-head {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: start;
  }

  .card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    min-height: 1.7rem;
    padding: 0 0.45rem;
    border: 2px solid currentColor;
    color: var(--color-text);
  }

  .card-head h3 {
    max-width: 15ch;
    margin: 0.45rem 0 0.55rem;
    font-size: clamp(1.45rem, 3vw, 2.15rem);
    line-height: 0.98;
    text-transform: uppercase;
    text-wrap: balance;
  }

  .metric-strip {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0;
    border: 2px solid var(--color-text);
  }

  .metric-strip span {
    min-height: 44px;
    border: 0;
    border-bottom: 1px solid color-mix(in srgb, var(--color-text) 30%, transparent);
    padding: 0.55rem 0.65rem;
    font-size: 0.88rem;
    font-weight: 800;
    line-height: 1.25;
  }

  .metric-strip span:nth-child(odd) {
    border-right: 1px solid color-mix(in srgb, var(--color-text) 30%, transparent);
  }

  .metric-strip span:nth-last-child(-n + 2) {
    border-bottom: 0;
  }

  .score-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.65rem;
  }

  .score {
    display: grid;
    gap: 0.3rem;
    padding: 0.65rem;
    background: color-mix(in srgb, var(--color-text) 7%, transparent);
  }

  .score div {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    font-size: 0.85rem;
    font-variant-numeric: tabular-nums;
  }

  meter {
    width: 100%;
    height: 0.8rem;
    accent-color: var(--color-accent);
  }

  .spec-list {
    display: grid;
    gap: 0;
    margin: 0;
    border-top: 2px solid color-mix(in srgb, var(--color-text) 28%, transparent);
  }

  .spec-list div {
    display: grid;
    grid-template-columns: 9rem minmax(0, 1fr);
    gap: 0.75rem;
    border-bottom: 1px solid color-mix(in srgb, var(--color-text) 20%, transparent);
    padding: 0.55rem 0;
  }

  dd {
    margin: 0;
  }

  .two-column {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }

  h4 {
    margin: 0 0 0.4rem;
  }

  ul {
    display: grid;
    gap: 0.35rem;
    padding-left: 1.1rem;
    list-style: square;
  }

  details {
    border-top: 2px solid color-mix(in srgb, var(--color-text) 25%, transparent);
    padding-top: 0.75rem;
  }

  summary {
    min-height: 44px;
    color: var(--color-accent);
    font-weight: 900;
    text-transform: uppercase;
  }

  .sources a {
    text-decoration: underline;
    text-underline-offset: 0.2em;
  }

  .table-wrap {
    overflow-x: auto;
    border: 2px solid var(--color-text);
  }

  table {
    width: 100%;
    min-width: 1120px;
    border-collapse: collapse;
    background: var(--color-background);
  }

  th,
  td {
    border-bottom: 1px solid color-mix(in srgb, var(--color-text) 25%, transparent);
    padding: 0.75rem;
    text-align: left;
    vertical-align: top;
    line-height: 1.45;
  }

  th {
    color: var(--color-accent);
    font-size: 0.78rem;
    text-transform: uppercase;
  }

  .pinned-table th:first-child {
    min-width: 160px;
  }

  .empty-state {
    padding: 2rem;
  }

  .empty-state h2 {
    margin: 0 0 0.5rem;
    color: var(--color-accent);
    text-transform: uppercase;
  }

  @media (max-width: 900px) {
    .safety-panel,
    .control-topline,
    .filter-board,
    .two-column {
      grid-template-columns: 1fr;
    }

    .control-topline {
      display: grid;
    }

    .preset-panel {
      grid-template-columns: 1fr;
      align-items: start;
    }
  }

  @media (max-width: 560px) {
    .cards {
      grid-template-columns: 1fr;
    }

    .metric-strip,
    .score-grid,
    .spec-list div {
      grid-template-columns: 1fr;
    }

    .actions button,
    .view-tabs button,
    .preset-actions button {
      flex: 1 1 100%;
    }

    .metric-strip span:nth-child(odd) {
      border-right: 0;
    }

    .metric-strip span:nth-last-child(-n + 2) {
      border-bottom: 1px solid color-mix(in srgb, var(--color-text) 30%, transparent);
    }

    .metric-strip span:last-child {
      border-bottom: 0;
    }
  }
</style>
