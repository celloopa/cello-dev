<script>
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
        {
          key: "p",
          label: "Projects (COMING SOON)",
          action: () => handleProjects(),
        },
        {
          key: "b",
          label: "Blog (COMING SOON)",
          action: () => navigate("/blog"),
        },
      ],
    },
    {
      title: "ACTIONS",
      shortcuts: [
        { key: "r", label: "Print Resume", action: () => window.print() },
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
    activeShortcut = shortcut.key;
    shortcut.action();
    setTimeout(() => {
      activeShortcut = null;
      toggleMenu();
    }, 300);
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

  function handleProjects() {
    alert("Sorry, this is still being built");
    navigate("/");
  }
  function handleOverlayKeydown(event) {
    if (event.key === "Escape") {
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
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .menu {
    background-color: var(--color-background);
    border-radius: 8px;
    padding: 20px;
    width: 400px;
    max-width: 90%;
    border: none;
    color: var(--color-text);
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

  h3 {
    font-size: 0.8rem;
    color: var(--color-accent);
    margin-top: 15px;
    margin-bottom: 5px;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    margin-bottom: 5px;
  }

  button {
    display: flex;
    align-items: center;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    padding: 5px;
    border-radius: 4px;
    cursor: pointer;
    color: inherit;
    font: inherit;
  }

  button:hover,
  button.active {
    background-color: var(--color-accent);
  }

  .key {
    display: inline-block;
    background-color: var(--color-text);
    color: var(--color-background);
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 3px;
    margin-right: 10px;
  }

  .label {
    color: var(--color-text);
  }

  button:hover .key,
  button.active .key {
    background-color: var(--color-background);
    color: var(--color-accent);
  }

  button:hover .label,
  button.active .label {
    color: var(--color-background);
  }

  hr {
    border: none;
    border-top: 1px solid var(--color-text);
    opacity: 0.2;
    margin: 10px 0;
  }
</style>
