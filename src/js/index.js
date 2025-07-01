const API_URL = 'https://api.saumondeluxe.com';

async function tempHomepage() {
    const response = await fetch(`${API_URL}/scans/mangaList`);
    const data = await response.json();
    return data.mangas; // Assuming the API returns an object with a 'mangas'
}

async function handleMangaClick(encodedTitle) {
    const manga = await fetchMangaDetails(encodedTitle);
    if (manga) {
        displayMangaDetails(manga);
    }
}

window.onload = async () => {
    // Check for URL parameters after all scripts are loaded
    const URL_PARAM = new URLSearchParams(window.location.search);
    const mangaQuery = URL_PARAM.get('manga');

    if (mangaQuery) {
        // If a manga query is present in the URL, fetch and display its details
        const manga = await fetchMangaDetails(mangaQuery);
        if (manga) {
            displayMangaDetails(manga);
        }
        return; // Exit early if displaying manga details
    }

    const homepageDiv = document.getElementsByClassName('homepage')[0];
    const infoDiv = document.getElementsByClassName('info')[0];
    const mangaList = await tempHomepage();
    if (!mangaList || mangaList.length === 0) {
        homepageDiv.innerHTML = '<p>No mangas found.</p>';
        return;
    }
    mangaList.forEach(manga => {
        const mangaDiv = document.createElement('div');
        mangaDiv.className = `manga-${encodeURIComponent(manga.title)}`;
        mangaDiv.innerHTML = `
            <button class="manga-button" onclick="handleMangaClick('${encodeURIComponent(manga.title)}')">
            <img src="${manga.image_url}" alt="${manga.title} cover" class="manga-cover">
            </button>
            <div class="manga-title">${manga.title}</div>
        `;
        homepageDiv.appendChild(mangaDiv);
    });
}

async function searchManga(query) {
    const response = await fetch(`${API_URL}/scans/manga?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.results; // Assuming the API returns an object with a 'results' property
}

function searchMangaHandler() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    if (query) {
        searchManga(query).then(results => {
            const homepageDiv = document.getElementsByClassName('homepage')[0];
            homepageDiv.innerHTML = ''; // Clear previous results
            if (results && results.length > 0) {
                results.forEach(manga => {
                    const mangaDiv = document.createElement('div');
                    mangaDiv.className = `manga-${encodeURIComponent(manga.title)}`;
                    mangaDiv.innerHTML = `
                        <button class="manga-button" onclick="handleMangaClick('${encodeURIComponent(manga.title)}')">
                        <img src="${manga.image_url}" alt="${manga.title} cover" class="manga-cover">
                        </button>
                        <div class="manga-title">${manga.title}</div>
                    `;
                    homepageDiv.appendChild(mangaDiv);
                });
            } else {
                homepageDiv.innerHTML = '<p>No results found.</p>';
            }
        });
    }
}