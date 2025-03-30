// Select DOM elements
const searchInputEl = document.getElementById("searchInput");
const searchResultsEl = document.getElementById("searchResults");
const spinnerEl = document.getElementById("spinner");
const suggestionsEl = document.getElementById("suggestions");
const clearButtonEl = document.getElementById("clearButton");

// Fetch Suggestions and Display Autocomplete
searchInputEl.addEventListener("input", () => {
    const query = searchInputEl.value.trim();
    if (query) {
        fetchSuggestions(query);
    } else {
        hideSuggestions();
    }
});

const fetchSuggestions = async (query) => {
    try {
        const response = await fetch(`https://apis.ccbp.in/wiki-search?search=${query}`);
        const {
            search_results
        } = await response.json();
        renderSuggestions(search_results.slice(0, 5)); // Limit to top 5 suggestions
    } catch (error) {
        console.error("Error fetching suggestions:", error);
    }
};

const renderSuggestions = (suggestions) => {
    suggestionsEl.innerHTML = ""; // Clear previous suggestions
    suggestions.forEach((result) => {
        const suggestionItem = document.createElement("div");
        suggestionItem.className = "suggestion-item";
        suggestionItem.textContent = result.title;
        suggestionItem.addEventListener("click", () => {
            searchInputEl.value = result.title;
            hideSuggestions();
            performSearch(); // Trigger search for selected suggestion
        });
        suggestionsEl.appendChild(suggestionItem);
    });
    suggestionsEl.style.display = "block"; // Show suggestions
};

const hideSuggestions = () => {
    suggestionsEl.style.display = "none";
};

// Clear Search Input and Results
clearButtonEl.addEventListener("click", () => {
    searchInputEl.value = "";
    searchResultsEl.innerHTML = "";
    hideSuggestions();
});

// Search Wikipedia and Display Results
const performSearch = async () => {
    const query = searchInputEl.value.trim();
    if (!query) return;
    showSpinner();
    searchResultsEl.innerHTML = ""; // Clear previous results
    try {
        const response = await fetch(`https://apis.ccbp.in/wiki-search?search=${query}`);
        const {
            search_results
        } = await response.json();
        displayResults(search_results);
    } catch (error) {
        console.error("Error fetching search results:", error);
        showErrorMessage("Failed to fetch results. Please try again later.");
    } finally {
        hideSpinner();
    }
};

// Display Search Results
const displayResults = (results) => {
    if (results.length === 0) {
        showErrorMessage("No results found. Try a different query.");
        return;
    }
    results.forEach((result) => {
        const resultItemEl = document.createElement("div");
        resultItemEl.className = "result-item";
        const titleEl = document.createElement("a");
        titleEl.href = result.link;
        titleEl.target = "_blank";
        titleEl.className = "result-title";
        titleEl.textContent = result.title;
        const descriptionEl = document.createElement("p");
        descriptionEl.className = "result-description";
        descriptionEl.textContent = result.description;
        const linkEl = document.createElement("a");
        linkEl.href = result.link;
        linkEl.target = "_blank";
        linkEl.className = "result-url";
        linkEl.textContent = result.link;
        resultItemEl.append(titleEl, descriptionEl, linkEl);
        searchResultsEl.appendChild(resultItemEl);
    });
};

// Utility Functions
const showSpinner = () => spinnerEl.classList.remove("d-none");
const hideSpinner = () => spinnerEl.classList.add("d-none");
const showErrorMessage = (message) => {
    searchResultsEl.innerHTML = `<p class="error-message">${message}</p>`;
};

// Add Event Listener for Enter Key
searchInputEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        performSearch();
        hideSuggestions();
    }
});
