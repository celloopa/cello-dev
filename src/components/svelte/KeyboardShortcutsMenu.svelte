<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { toggleTheme as toggleThemeUtil } from "@/utils/themeToggle.js";

  // Props from cv.json
  let { socialProfiles = [], email = "" } = $props();

  let isVisible = $state(false);
  let activeShortcut = $state(null);
  let selectedCategoryIndex = $state(0);
  let selectedShortcutIndex = $state(0);
  let dialogElement = $state();
  let overlayElement = $state();
  let returnFocus;

  // Map network names to shortcut keys
  const networkKeyMap = {
    github: "g",
    linkedin: "l",
    bsky: "s",
    bluesky: "s",
    twitter: "x",
  };

  // Build social shortcuts from props
  const socialShortcuts = socialProfiles.map((profile) => ({
    key: networkKeyMap[profile.network.toLowerCase()] || profile.network.charAt(0).toLowerCase(),
    label: profile.network === "Bsky" ? "Bluesky" : profile.network,
    action: () => window.open(profile.url, "_blank"),
  }));

  const shortcutCategories = [
    {
      title: "NAVIGATION",
      shortcuts: [
        { key: "h", label: "Home", action: () => navigate("/") },
        { key: "c", label: "Case Studies", action: () => navigate("/projects") },
        { key: "a", label: "About", action: () => navigate("/about") },
        { key: "r", label: "Resume", action: () => navigate("/resume") },
        { key: "w", label: "Writing", action: () => navigate("/blog") },
      ],
    },
    {
      title: "ACTIONS",
      shortcuts: [
        { key: "d", label: "Download Resume", action: () => downloadResume() },
        // scene pages hold one grade; the switch is for the other pages
        ...(document.documentElement.classList.contains("scene-page") ? [] : [{ key: "t", label: "Switch Day / Dusk", action: toggleTheme }]),
      ],
    },
    {
      title: "CONTACT",
      shortcuts: [
        {
          key: "e",
          label: "Email",
          action: () => (window.location.href = `mailto:${email}`),
        },
      ],
    },
    {
      title: "SOCIAL MEDIA",
      shortcuts: socialShortcuts,
    },
  ];

  function toggleMenu() {
    if (!isVisible) returnFocus = document.activeElement;
    isVisible = !isVisible;
    updateFooterButton();
    if (isVisible) {
      setTimeout(() => dialogElement?.focus(), 0);
    } else {
      requestAnimationFrame(() => { if (returnFocus?.isConnected) returnFocus.focus(); });
    }
  }

  function updateFooterButton() {
    window.dispatchEvent(
      new CustomEvent("menuVisibilityChanged", { detail: { isVisible } }),
    );
  }

  function handleKeydown(event) {
    if (event.defaultPrevented) return;
    if (isVisible && event.key === "Tab") {
      const controls = [...dialogElement.querySelectorAll("button:not([disabled]), a[href], [tabindex='0']")];
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogElement)) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogElement)) {
        event.preventDefault(); first?.focus();
      }
      return;
    }
    if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      toggleMenu();
    } else if (event.key === "Escape" && isVisible) {
      toggleMenu();
    } else if (isVisible) {
      event.preventDefault();
      const key = event.key.toLowerCase();
      const shortcut = shortcutCategories
        .flatMap((category) => category.shortcuts)
        .find((s) => s.key === key);

      if (shortcut) {
        executeShortcut(shortcut);
      } else {
        switch (key) {
          case "arrowup":
            if (selectedShortcutIndex > 0) {
              selectedShortcutIndex--;
            } else if (selectedCategoryIndex > 0) {
              selectedCategoryIndex--;
              selectedShortcutIndex =
                shortcutCategories[selectedCategoryIndex].shortcuts.length - 1;
            }
            break;
          case "arrowdown":
            if (
              selectedShortcutIndex <
              shortcutCategories[selectedCategoryIndex].shortcuts.length - 1
            ) {
              selectedShortcutIndex++;
            } else if (selectedCategoryIndex < shortcutCategories.length - 1) {
              selectedCategoryIndex++;
              selectedShortcutIndex = 0;
            }
            break;
          case "enter":
            const selectedCategory = shortcutCategories[selectedCategoryIndex];
            if (selectedCategory && selectedCategory.shortcuts.length > 0) {
              executeShortcut(
                selectedCategory.shortcuts[selectedShortcutIndex],
              );
            }
            break;
        }
      }
    }
  }

  function executeShortcut(shortcut) {
    activeShortcut = shortcut.key;

    if (shortcut.action.toString().includes("window.open")) {
      shortcut.action();
      setTimeout(() => {
        activeShortcut = null;
        if (isVisible) toggleMenu();
      }, 100);
    } else {
      shortcut.action();
      setTimeout(() => {
        activeShortcut = null;
        if (isVisible) toggleMenu();
      }, 300);
    }
  }

  function navigate(path) {
    window.location.href = path;
    toggleMenu();
  }

  function toggleTheme() {
    toggleThemeUtil();

    isVisible = false;
    setTimeout(() => {
      isVisible = true;
    }, 0);
  }

  function downloadResume() {
    const link = document.createElement("a");
    link.href = "/files/marcelo_rondon-resume.pdf";
    link.download = "marcelo_rondon-resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleOverlayKeydown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      toggleMenu();
    }
  }

  onMount(() => {
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("toggleKeyboardMenu", toggleMenu);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("toggleKeyboardMenu", toggleMenu);
    };
  });
</script>

{#if isVisible}
  <div
    bind:this={overlayElement}
    class="overlay"
    role="presentation"
    transition:fade={{ duration: 150 }}
    onclick={toggleMenu}
    onkeydown={handleOverlayKeydown}
  >
    <div
      bind:this={dialogElement}
      class="menu"
      id="keyboard-shortcuts-menu"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      onclick={(event) => event.stopPropagation()}
      onkeydown={handleOverlayKeydown}
      tabindex="-1"
    >
      <header class="menu-head"><h2 id="dialog-title">Menu</h2><button class="close-menu" aria-label="Close menu" onclick={toggleMenu} onkeydown={(event) => { if (event.key === "Enter" || event.key === " ") event.stopPropagation(); }}>×</button></header>
      {#each shortcutCategories as category, categoryIndex}
        <section>
          <h3>{category.title}</h3>
          <ul>
            {#each category.shortcuts as shortcut, index}
              <li>
                <button
                  class:active={activeShortcut === shortcut.key}
                  class:selected={selectedCategoryIndex === categoryIndex &&
                    selectedShortcutIndex === index}
                  onclick={() => executeShortcut(shortcut)}
                  onkeydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      executeShortcut(shortcut);
                    }
                  }}
                >
                  <span class="key">{shortcut.key}</span>
                  <span class="label">{shortcut.label}</span>
                </button>
              </li>
            {/each}
          </ul>
        </section>
        {#if categoryIndex < shortcutCategories.length - 1}
          <hr />
        {/if}
      {/each}
      <p class="menu-hint">Esc to close · ↑↓ to move · Enter to open</p>
    </div>
  </div>
{/if}

<style>
  .overlay { position: fixed; inset: 0; background: var(--scrim); display: flex; justify-content: center; align-items: center; z-index: 1000; }
  .menu { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-24); position: relative; width: min(var(--layout-measure), calc(100% - var(--space-32))); max-height: calc(100svh - var(--space-32)); overflow-y: auto; padding: var(--space-24); background: var(--bg-canvas); color: var(--text-primary); border: var(--stroke-control) solid var(--border-strong); box-shadow: var(--space-8) var(--space-8) 0 var(--accent-ground); animation: enter-fade var(--motion-ui) var(--ease-out); }
  .menu-head { grid-column: 1 / -1; display: flex; align-items: center; justify-content: space-between; gap: var(--space-24); margin-bottom: 0; }
  h2 { margin: 0; font-family: var(--font-title); font-size: var(--type-section-title); line-height: var(--leading-tight); }
  section { margin: 0; }
  section:first-of-type { grid-row: span 3; }
  h3 { margin: 0 0 var(--space-8); color: var(--text-muted); font-size: var(--type-label); font-weight: var(--weight-bold); letter-spacing: var(--track-wide); }
  ul { list-style: none; margin: 0; padding: 0; }
  button { display: flex; align-items: center; width: 100%; min-height: var(--touch-target); padding: var(--space-8) var(--space-12); gap: var(--space-24); color: inherit; background: transparent; border: 0; border-left: var(--stroke-frame) solid transparent; text-align: left; cursor: pointer; font: inherit; transition: background-color var(--motion-ui) var(--ease-out), border-color var(--motion-ui) var(--ease-out); }
  button:hover, button.selected, button.active { background: var(--bg-muted); border-left-color: var(--action-primary); }
  .label { order: 0; font-size: var(--type-ui); font-weight: var(--weight-semibold); }
  .key { order: 1; margin-left: auto; display: inline-flex; align-items: center; justify-content: center; min-width: var(--space-24); padding: var(--space-4); border: var(--stroke-control) solid var(--border-muted); color: var(--text-muted); font-size: var(--type-label); text-transform: uppercase; }
  button.selected .key, button:hover .key { color: var(--action-primary); border-color: var(--action-primary); }
  .close-menu { flex: none; width: var(--touch-target); height: var(--touch-target); padding: 0; justify-content: center; border: var(--stroke-control) solid var(--border-muted); font-size: var(--type-heading); }
  hr { display: none; border: 0; border-top: var(--stroke-control) solid var(--border-muted); margin: var(--space-16) 0; }
  .menu-hint { grid-column: 1 / -1; margin: 0; color: var(--text-muted); font-size: var(--type-label); line-height: var(--leading-small); }
  @media (width <= 700px) { .menu { grid-template-columns: 1fr; padding: var(--space-16); gap: var(--space-16); } section:first-of-type { grid-row: auto; } .menu-head { margin-bottom: 0; } h2 { font-size: var(--type-heading); } }
  @media (hover: none) { .menu-hint { display: none; } }
</style>
