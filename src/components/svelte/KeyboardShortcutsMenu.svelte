<script>
  console.log("KeyboardShortcutsMenu loaded");
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { toggleTheme as toggleThemeUtil } from "@/utils/themeToggle.js";

  let isVisible = false;
  let activeShortcut = null;
  let selectedCategoryIndex = 0;
  let selectedShortcutIndex = 0;
  let dialogElement;
  let overlayElement;

  const shortcutCategories = [
    {
      title: "NAVIGATION",
      shortcuts: [
        { key: "h", label: "Home", action: () => navigate("/") },
        { key: "p", label: "Projects", action: () => navigate("/projects") },
        { key: "r", label: "Resume", action: () => navigate("/resume") },
        {
          key: "b",
          label: "Blog (Coming Soon)",
          action: () => navigate("/blog"),
        },
      ],
    },
    {
      title: "ACTIONS",
      shortcuts: [
        { key: "d", label: "Download Resume", action: () => downloadResume() },
        { key: "t", label: "Toggle Theme", action: toggleTheme },
      ],
    },
    {
      title: "CONTACT",
      shortcuts: [
        {
          key: "e",
          label: "Email",
          action: () => (window.location.href = "mailto:cello@cello.design"),
        },
      ],
    },
    {
      title: "SOCIAL MEDIA",
      shortcuts: [
        {
          key: "g",
          label: "GitHub",
          action: () => window.open("https://github.com/laztaxon", "_blank"),
        },
        {
          key: "l",
          label: "LinkedIn",
          action: () =>
            window.open("https://www.linkedin.com/in/marcelorondon/", "_blank"),
        },
        {
          key: "x",
          label: "X (Twitter)",
          action: () => window.open("https://twitter.com/cello_dev", "_blank"),
        },
      ],
    },
  ];

  function toggleMenu() {
    isVisible = !isVisible;
    updateFooterButton();
    if (isVisible) {
      setTimeout(() => dialogElement.focus(), 0);
    }
  }

  function updateFooterButton() {
    window.dispatchEvent(
      new CustomEvent("menuVisibilityChanged", { detail: { isVisible } }),
    );
  }

  function handleKeydown(event) {
    if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      toggleMenu();
    } else if (event.key === "Escape" && isVisible) {
      toggleMenu();
    } else if (isVisible) {
      event.preventDefault();
      const key = event.key.toLowerCase();
      console.log("Key pressed:", key); // Debug log
      const shortcut = shortcutCategories
        .flatMap((category) => category.shortcuts)
        .find((s) => s.key === key);

      if (shortcut) {
        console.log("Shortcut found:", shortcut); // Debug log
        executeShortcut(shortcut);
      } else {
        switch (key) {
          case "ArrowUp":
            if (selectedShortcutIndex > 0) {
              selectedShortcutIndex--;
            } else if (selectedCategoryIndex > 0) {
              selectedCategoryIndex--;
              selectedShortcutIndex =
                shortcutCategories[selectedCategoryIndex].shortcuts.length - 1;
            }
            break;
          case "ArrowDown":
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
          case "Enter":
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
    console.log("Executing shortcut:", shortcut);
    activeShortcut = shortcut.key;
    
    // Check if the action is an outbound link
    if (shortcut.action.toString().includes('window.open')) {
      console.log("Executing outbound link action");
      shortcut.action();
      // Close the menu after a short delay for outbound links
      setTimeout(() => {
        console.log("Closing menu after outbound link");
        activeShortcut = null;
        toggleMenu();
      }, 100);
    } else {
      // For other actions, keep the current behavior
      console.log("Executing non-outbound link action");
      shortcut.action();
      setTimeout(() => {
        console.log("Closing menu after non-outbound link action");
        activeShortcut = null;
        toggleMenu();
      }, 300);
    }
  }

  function navigate(path) {
    window.location.href = path;
    toggleMenu();
  }

  function toggleTheme() {
    console.log("Toggling theme from KeyboardShortcutsMenu");
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "dark";
    console.log("Current theme before toggle:", currentTheme);

    toggleThemeUtil();

    const newTheme = document.documentElement.getAttribute("data-theme");
    console.log("New theme after toggle:", newTheme);

    // Force a re-render of the component
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
      toggleMenu();
    }
  }

  onMount(() => {
    console.log("Attaching event listeners");
    window.addEventListener("keydown", handleKeydown);
    window.addEventListener("toggleKeyboardMenu", toggleMenu);
    return () => {
      console.log("Removing event listeners");
      window.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("toggleKeyboardMenu", toggleMenu);
    };
  });
</script>

{#if isVisible}
  <div
    bind:this={overlayElement}
    class="overlay"
    transition:fade={{ duration: 150 }}
    on:click={toggleMenu}
    on:keydown={handleOverlayKeydown}
    tabindex="0"
    role="button"
    aria-label="Close keyboard shortcuts menu"
  >
    <div
      bind:this={dialogElement}
      class="menu"
      role="presentation"
      aria-labelledby="dialog-title"
      on:click|stopPropagation
      tabindex="-1"
    >
      <h2 id="dialog-title" class="sr-only">Keyboard Shortcuts Menu</h2>
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
                  on:click={() => executeShortcut(shortcut)}
                  on:keydown={(e) => {
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
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(4px);
  }

  .menu {
    background-color: var(--color-background);
    border: 4px solid var(--color-text);
    padding: 1.5rem;
    width: 420px;
    max-width: calc(90% - 16px);
    color: var(--color-text);
    position: relative;
    animation: menuSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .menu::before {
    content: "";
    position: absolute;
    top: 8px;
    left: 8px;
    right: -8px;
    bottom: -8px;
    border: 4px solid var(--color-accent);
    z-index: -1;
    pointer-events: none;
  }

  @media (max-width: 480px) {
    .menu {
      padding: 0.75rem;
      max-width: calc(100% - 2rem);
      max-height: calc(100vh - 3rem);
      overflow-y: auto;
    }

    .menu::before {
      top: 4px;
      left: 4px;
      right: -4px;
      bottom: -4px;
    }

    section {
      margin-bottom: 0.5rem;
    }

    h3 {
      font-size: 0.65rem;
      margin-bottom: 0.25rem;
    }

    li {
      margin-bottom: 0.125rem;
    }

    button {
      padding: 0.35rem 0.5rem;
    }

    .key {
      font-size: 0.7rem;
      padding: 0.15rem 0.35rem;
      margin-right: 0.5rem;
    }

    .label {
      font-size: 0.75rem;
    }

    hr {
      margin: 0.5rem 0;
    }
  }

  @keyframes menuSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  section {
    margin-bottom: 1rem;
  }

  section:last-of-type {
    margin-bottom: 0;
  }

  h3 {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--color-accent);
    margin: 0 0 0.5rem 0;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  h3::after {
    content: "";
    flex: 1;
    height: 2px;
    background: var(--color-accent);
    opacity: 0.3;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 0.25rem;
  }

  button {
    display: flex;
    align-items: center;
    width: 100%;
    text-align: left;
    background: transparent;
    border: 2px solid transparent;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    color: inherit;
    font: inherit;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }

  button:hover,
  button.active,
  button.selected {
    background-color: var(--color-accent);
    border-color: var(--color-accent);
  }

  .key {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.5rem;
    background-color: var(--color-text);
    color: var(--color-background);
    font-weight: 700;
    font-size: 0.8rem;
    padding: 0.25rem 0.5rem;
    margin-right: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.2s ease;
  }

  .label {
    color: var(--color-text);
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
    transition: color 0.2s ease;
  }

  button:hover .key,
  button.active .key,
  button.selected .key {
    background-color: var(--color-background);
    color: var(--color-accent);
  }

  button:hover .label,
  button.active .label,
  button.selected .label {
    color: var(--color-background);
  }

  hr {
    border: none;
    border-top: 2px solid var(--color-text);
    opacity: 0.15;
    margin: 1rem 0;
  }
</style>
