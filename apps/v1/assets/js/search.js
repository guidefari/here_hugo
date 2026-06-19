document.addEventListener("DOMContentLoaded", () => {
  const searchModal = document.getElementById("search-modal");
  const searchInput = document.getElementById("search-input");
  const searchResults = document.getElementById("search-results");
  const searchToggle = document.getElementById("search-toggle");

  let pagefind;

  async function initPagefind() {
    if (!pagefind) {
      console.log("Initializing Pagefind...");
      try {
        const pagefindPath =
          searchModal.getAttribute("data-pagefind-path") ||
          "/pagefind/pagefind.js";
        console.log("Loading Pagefind from:", pagefindPath);

        pagefind = await import(pagefindPath);
        await pagefind.options({
          excerptLength: 20,
        });
        console.log("Pagefind loaded successfully");
      } catch (e) {
        console.error("Failed to load Pagefind", e);
        searchResults.innerHTML = `<div class="p-4 text-center text-red-500 uppercase text-[10px] tracking-widest">Search failed to load. Check console.</div>`;
      }
    }
  }

  let selectedIndex = -1;
  let resultsList = [];

  function openModal() {
    searchModal.showModal();
    initPagefind();
    selectedIndex = -1;
    setTimeout(() => searchInput.focus(), 100);
  }

  function closeModal() {
    searchModal.close();
    selectedIndex = -1;
  }

  if (searchToggle) {
    searchToggle.addEventListener("click", openModal);
  }

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      searchModal.open ? closeModal() : openModal();
      return;
    }

    if (!searchModal.open) return;

    if (e.key === "Escape") {
      closeModal();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, resultsList.length - 1);
      updateSelection();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      updateSelection();
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && resultsList[selectedIndex]) {
        window.location.href = resultsList[selectedIndex].url;
      }
    }
  });

  searchModal.addEventListener("click", (e) => {
    if (e.target === searchModal) closeModal();
  });

  let debounceTimer;
  searchInput.addEventListener("input", (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const query = e.target.value.trim();
      if (query.length > 1 && pagefind) {
        const search = await pagefind.search(query);
        resultsList = await Promise.all(
          search.results.slice(0, 10).map((r) => r.data()),
        );
        renderResults(resultsList);
        selectedIndex = resultsList.length > 0 ? 0 : -1;
        updateSelection();
      } else {
        resultsList = [];
        searchResults.innerHTML = "";
        selectedIndex = -1;
      }
    }, 150);
  });

  function updateSelection() {
    const items = searchResults.querySelectorAll("a");
    items.forEach((item, index) => {
      const title = item.querySelector(".result-title");
      if (index === selectedIndex) {
        item.classList.add("bg-zinc-800", "border-l-highlight");
        item.classList.remove("border-l-transparent");
        if (title) title.classList.add("text-highlight");
        if (title) title.classList.remove("text-zinc-100");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("bg-zinc-800", "border-l-highlight");
        item.classList.add("border-l-transparent");
        if (title) title.classList.remove("text-highlight");
        if (title) title.classList.add("text-zinc-100");
      }
    });
  }

  function renderResults(results) {
    if (results.length === 0) {
      searchResults.innerHTML =
        '<div class="p-4 text-center text-zinc-600 uppercase text-[10px] tracking-[0.2em]">No results found</div>';
      return;
    }

    searchResults.innerHTML = results
      .map((result, index) => {
        const tags = result.meta.tags
          ? result.meta.tags.split(",").map((tag) => tag.trim())
          : [];
        const tagsHtml =
          tags.length > 0
            ? `
                <div class="flex flex-wrap gap-2 mt-3">
                    ${tags.map((tag) => `<span class="text-[9px] font-bold text-zinc-600 uppercase bg-zinc-950 px-1.5 py-0.5 border border-zinc-800">${tag.startsWith("#") ? tag : "#" + tag}</span>`).join("")}
                </div>
            `
            : "";

        return `
                <a href="${result.url}" class="block p-4 border-l-4 border-l-transparent border-b border-zinc-800/50 transition-all group">
                    <div class="result-title font-bold text-zinc-100 uppercase tracking-tight transition-colors">${result.meta.title}</div>
                    <div class="text-[11px] text-zinc-500 mt-2 line-clamp-2 leading-relaxed">${result.excerpt}</div>
                    ${tagsHtml}
                </a>
            `;
      })
      .join("");
  }
});
