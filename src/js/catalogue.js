const API_BASE = "https://api.saumondeluxe.com";

async function fetchCatalogue() {
    const mangaCount = await fetch(`${API_BASE}/scans/manga/count`);
    if (!mangaCount.ok) {
        throw new Error("Failed to fetch catalogue data");
    }
    const data = await mangaCount.json();

    const totalMangas = data.count; // Assuming the API returns an object with a 'count' property
    const limit = 20; // Fetch by 20 mangas at a time
    const skip = 0; // Start from the beginning
    const manga = []; // Array to hold all fetched mangas

    // Fetch the manga list with pagination
    for (let i = 0; i < Math.ceil(totalMangas / limit); i++) {
        const skip = i * limit;
        const mangaList = await fetch(
            `${API_BASE}/scans/mangaList?limit=${limit}&skip=${skip}`
        );
        if (!mangaList.ok) {
            throw new Error("Failed to fetch manga list");
        }
        const mangaData = await mangaList.json();
        manga.push(...mangaData.mangas); // Assuming the API returns an object with a 'mangas' property
        if (!mangaData || !mangaData.mangas || mangaData.mangas.length === 0) {
            console.warn("No mangas found in this batch");
            continue;
        }
    }

    console.log(`Fetched ${data.count} mangas from the catalogue.`);
    return manga;

    // (552) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, …]
    // [0 … 99]
    // [100 … 199]
    // [200 … 299]
    // [300 … 399]
    // [400 … 499]
    // [500 … 551]
    // length:552
}

window.onload = async () => {
    const catalogue = await fetchCatalogue();
    const catalogueDiv = document.getElementsByClassName("catalogue")[0];

    if (!catalogue || catalogue.length === 0) {
        catalogueDiv.innerHTML = "<p>No mangas found in the catalogue.</p>";
        return;
    }

    // Create the filter section with letter buttons
    const filterSection = document.createElement("div");
    filterSection.className = "filter-section";
    filterSection.innerHTML = "<h2>Filter by Letter</h2>";

    const letters = [
        "All",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "0-9",
        "Other",
    ];

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "letter-buttons";

    letters.forEach((letter) => {
        const letterButton = document.createElement("button");
        letterButton.className = "letter-filter-button";
        letterButton.textContent = letter;
        letterButton.onclick = () => filterMangasByLetter(letter, catalogue);
        buttonContainer.appendChild(letterButton);
    });

    filterSection.appendChild(buttonContainer);
    catalogueDiv.appendChild(filterSection);

    // Create the results section
    const resultsSection = document.createElement("div");
    resultsSection.className = "results-section";
    resultsSection.id = "manga-results";
    catalogueDiv.appendChild(resultsSection);

    // Initially show all manga
    displayMangaResults(catalogue);
};

function filterMangasByLetter(selectedLetter, catalogue) {
    let filteredManga = catalogue;

    if (selectedLetter !== "All") {
        filteredManga = catalogue.filter((manga) => {
            const firstLetter = manga.title.charAt(0).toUpperCase();

            if (selectedLetter === "0-9") {
                return /[0-9]/.test(firstLetter);
            } else if (selectedLetter === "Other") {
                const letters = [
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "F",
                    "G",
                    "H",
                    "I",
                    "J",
                    "K",
                    "L",
                    "M",
                    "N",
                    "O",
                    "P",
                    "Q",
                    "R",
                    "S",
                    "T",
                    "U",
                    "V",
                    "W",
                    "X",
                    "Y",
                    "Z",
                ];
                return !letters.includes(firstLetter) && !/[0-9]/.test(firstLetter);
            } else {
                return firstLetter === selectedLetter;
            }
        });
    }

    displayMangaResults(filteredManga);
}

function displayMangaResults(mangaList) {
    const resultsSection = document.getElementById("manga-results");
    resultsSection.innerHTML = "";

    if (!mangaList || mangaList.length === 0) {
        resultsSection.innerHTML = "<p>No manga found for this filter.</p>";
        return;
    }

    const mangaGrid = document.createElement("div");
    mangaGrid.className = "manga-grid";

    mangaList.forEach((manga) => {
        const mangaDiv = document.createElement("div");
        mangaDiv.className = "manga-item";
        mangaDiv.innerHTML = `
        <a href="index.html?manga=${manga.title}" class="manga-button">
        <img src="${manga.image_url}" alt="${manga.title} cover" class="manga-cover">
        </a>
        <p class="manga-title">${manga.title}</p>

        `;
        mangaGrid.appendChild(mangaDiv);
    });

    resultsSection.appendChild(mangaGrid);
}
