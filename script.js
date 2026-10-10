const commands = [
  {
    name: "pwd",
    category: "Linux navigation",
    description: "Prints the full path of the directory you are currently in.",
    example: "pwd"
  },
  {
    name: "ls",
    category: "Linux navigation",
    description: "Lists files and folders in the current directory. The -la options also show hidden files and details.",
    example: "ls -la"
  },
  {
    name: "cd",
    category: "Linux navigation",
    description: "Changes your current directory. Use .. to move up one level.",
    example: "cd .."
  },
  {
    name: "tree",
    category: "Linux navigation",
    description: "Shows folders and files in a tree-like view. It may need to be installed on your system.",
    example: "tree -L 2"
  },
  {
    name: "cat",
    category: "File inspection",
    description: "Prints the contents of a text file directly in the terminal.",
    example: "cat notes.txt"
  },
  {
    name: "less",
    category: "File inspection",
    description: "Opens a text file for scrolling through its contents; press q to quit.",
    example: "less notes.txt"
  },
  {
    name: "head",
    category: "File inspection",
    description: "Displays the first lines of a file. Use -n to choose how many.",
    example: "head -n 10 notes.txt"
  },
  {
    name: "tail",
    category: "File inspection",
    description: "Displays the last lines of a file. Use -n to choose how many.",
    example: "tail -n 10 notes.txt"
  },
  {
    name: "wc",
    category: "File inspection",
    description: "Counts lines, words, and bytes in a file. The -l option shows just the line count.",
    example: "wc -l notes.txt"
  },
  {
    name: "file",
    category: "File inspection",
    description: "Identifies a file's type by inspecting its contents rather than relying on its name.",
    example: "file photo.jpg"
  },
  {
    name: "grep",
    category: "File inspection",
    description: "Searches text for a word or pattern. The -n option includes matching line numbers.",
    example: "grep -n 'error' app.log"
  },
  {
    name: "ip addr",
    category: "Networking",
    description: "Shows network interfaces and the IP addresses assigned to them.",
    example: "ip addr"
  },
  {
    name: "ip route",
    category: "Networking",
    description: "Displays the local system's network routing table.",
    example: "ip route"
  },
  {
    name: "ping",
    category: "Networking",
    description: "Checks whether a host responds over the network. This example sends four requests to a public example domain.",
    example: "ping -c 4 example.com"
  },
  {
    name: "ss",
    category: "Networking",
    description: "Displays network sockets. These options list listening TCP and UDP ports without changing anything.",
    example: "ss -tuln"
  },
  {
    name: "curl -I",
    category: "Networking",
    description: "Requests response headers from a website, without downloading its page body.",
    example: "curl -I https://example.com"
  }
];

const commandList = document.querySelector("#command-list");
const categoryFilters = document.querySelector("#category-filters");
const searchInput = document.querySelector("#command-search");
const emptyState = document.querySelector("#empty-state");
const resultCount = document.querySelector("#result-count");

let activeCategory = "All commands";

function renderCategoryFilters() {
  const categories = ["All commands", ...new Set(commands.map((command) => command.category))];

  categoryFilters.innerHTML = categories.map((category) => `
    <button
      class="filter-button"
      type="button"
      data-category="${category}"
      aria-pressed="${category === activeCategory}"
    >${category}</button>
  `).join("");
}

function renderCommands() {
  const query = searchInput.value.trim().toLowerCase();
  const filteredCommands = commands.filter((command) => {
    const matchesCategory = activeCategory === "All commands" || command.category === activeCategory;
    const searchableText = `${command.name} ${command.category} ${command.description} ${command.example}`.toLowerCase();
    return matchesCategory && searchableText.includes(query);
  });

  commandList.innerHTML = filteredCommands.map((command) => `
    <article class="command-card">
      <div class="card-topline">
        <code class="command-name">${command.name}</code>
        <span class="category-label">${command.category}</span>
      </div>
      <p class="command-description">${command.description}</p>
      <span class="example-label">Example</span>
      <div class="example-row">
        <code>${command.example}</code>
        <button class="copy-button" type="button" data-example="${command.example}" aria-label="Copy example: ${command.example}">
          <span aria-hidden="true">▢</span> Copy
        </button>
      </div>
      <p class="copy-status" aria-live="polite"></p>
    </article>
  `).join("");

  emptyState.hidden = filteredCommands.length > 0;
  resultCount.textContent = `${filteredCommands.length} ${filteredCommands.length === 1 ? "command" : "commands"}`;
}

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;
  renderCategoryFilters();
  renderCommands();
});

searchInput.addEventListener("input", renderCommands);

commandList.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-example]");
  if (!button) return;

  const status = button.closest(".command-card").querySelector(".copy-status");
  try {
    await navigator.clipboard.writeText(button.dataset.example);
    status.textContent = "Copied to clipboard.";
    status.dataset.error = "false";
  } catch (error) {
    status.textContent = "Copy failed. Check clipboard permissions and try again.";
    status.dataset.error = "true";
    console.error("Unable to copy command example to the clipboard.", error);
  }
});

renderCategoryFilters();
renderCommands();
