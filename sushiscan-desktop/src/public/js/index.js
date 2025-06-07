function minimizeWindow() {
    // Code to minimize the window
    if (window.electronAPI) {
        window.electronAPI.minimizeWindow();
    } else {
        console.error('Electron API not ready. Please ensure the preload script is properly configured.');
    }
}

function closeWindow() {
    // Code to close the window
    if (window.electronAPI) {
        window.electronAPI.closeWindow();
    } else {
        console.error('Electron API not ready. Please ensure the preload script is properly configured.');
    }
}

async function getScansHomepage() {
    const API = 'https://api.saumondeluxe.com/scans/homepage';
    
    // Show loading state
    showLoadingState();
    
    try {
        const response = await fetch(API);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Scans Homepage Data:', data);
        
        // Clear loading state
        clearLoadingState();
        
        // Create cards for each category asynchronously
        const promises = [];
        if (data.trending) {
            promises.push(createCardsForCategory('trendingList', data.trending));
        }
        if (data.popular) {
            promises.push(createCardsForCategory('popularList', data.popular));
        }
        if (data.recommended) {
            promises.push(createCardsForCategory('recommendedList', data.recommended));
        }
        
        // Wait for all categories to finish loading
        await Promise.all(promises);
        
    } catch (error) {
        console.error('Error fetching scans homepage:', error);
        showErrorState(error.message);
    }
}

function showLoadingState() {
    const containers = ['trendingList', 'popularList', 'recommendedList'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '<div class="loading">Loading...</div>';
        }
    });
}

function clearLoadingState() {
    const containers = ['trendingList', 'popularList', 'recommendedList'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
        }
    });
}

function showErrorState(errorMessage) {
    const containers = ['trendingList', 'popularList', 'recommendedList'];
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `<div class="error">Error loading data: ${errorMessage}</div>`;
        }
    });
}

async function createCardsForCategory(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id '${containerId}' not found`);
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    if (!items || items.length === 0) {
        container.innerHTML = '<div class="loading">No items available</div>';
        return;
    }
    
    // Create cards with images asynchronously
    for (const item of items) {
        const card = await createScanCard(item);
        container.appendChild(card);
    }
}

async function fetchMangaDetails(title) {
    try {
        // Encode the title for URL
        const encodedTitle = encodeURIComponent(title);
        const response = await fetch(`https://api.saumondeluxe.com/scans/manga/${encodedTitle}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const mangaDetails = await response.json();
        return mangaDetails;
    } catch (error) {
        console.error(`Error fetching manga details for "${title}":`, error);
        return null;
    }
}

async function createScanCard(scan) {
    const card = document.createElement('div');
    card.className = 'scanCard';
    
    // Create image container with loading placeholder
    const imageContainer = document.createElement('div');
    imageContainer.className = 'scanCard-image-container';
    
    const image = document.createElement('img');
    image.className = 'scanCard-image';
    image.src = './img/placeholder.png'; // Placeholder image
    image.alt = scan.title || 'Manga cover';
    
    // Add loading spinner
    const imageLoader = document.createElement('div');
    imageLoader.className = 'image-loader';
    imageLoader.innerHTML = '⏳';
    
    imageContainer.appendChild(image);
    imageContainer.appendChild(imageLoader);
    
    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'scanCard-content';
    
    // Create title
    const title = document.createElement('h3');
    title.className = 'scanCard-title';
    title.textContent = scan.title || 'Untitled';
    
    // Create genres container
    const genresContainer = document.createElement('div');
    genresContainer.className = 'scanCard-genres';
    
    if (scan.genres && Array.isArray(scan.genres)) {
        scan.genres.forEach(genre => {
            const genreTag = document.createElement('span');
            genreTag.className = 'genre-tag';
            genreTag.textContent = genre;
            genresContainer.appendChild(genreTag);
        });
    }
    
    // Create meta container (type and popularity)
    const metaContainer = document.createElement('div');
    metaContainer.className = 'scanCard-meta';
    
    // Create type badge
    const typeBadge = document.createElement('span');
    typeBadge.className = 'scanCard-type';
    typeBadge.textContent = scan.type || 'Unknown';
    
    // Create popularity indicator
    const popularity = document.createElement('span');
    popularity.className = 'scanCard-popularity';
    popularity.textContent = `👁️ ${scan.popularity || 0}`;
    
    metaContainer.appendChild(typeBadge);
    metaContainer.appendChild(popularity);
    
    // Assemble the content
    contentContainer.appendChild(title);
    contentContainer.appendChild(genresContainer);
    contentContainer.appendChild(metaContainer);
    
    // Assemble the card
    card.appendChild(imageContainer);
    card.appendChild(contentContainer);
    
    // Add click event for future functionality
    card.addEventListener('click', () => {
        console.log('Clicked on scan:', scan);
        // You can add navigation or modal functionality here
    });
      // Fetch manga details for image asynchronously
    if (scan.title) {
        fetchMangaDetails(scan.title).then(mangaDetails => {
            if (mangaDetails && mangaDetails.image_url) {
                image.onload = () => {
                    imageLoader.style.display = 'none';
                    image.style.opacity = '1';
                    image.classList.add('loaded');
                };
                image.onerror = () => {
                    imageLoader.innerHTML = '📖';
                    imageLoader.style.color = 'var(--text-muted)';
                    imageLoader.style.fontSize = '32px';
                };
                image.src = mangaDetails.image_url;
            } else {
                imageLoader.innerHTML = '📖';
                imageLoader.style.color = 'var(--text-muted)';
                imageLoader.style.fontSize = '32px';
            }
        }).catch(error => {
            console.error('Error loading image for', scan.title, ':', error);
            imageLoader.innerHTML = '📖';
            imageLoader.style.color = 'var(--text-muted)';
            imageLoader.style.fontSize = '32px';
        });
    } else {
        imageLoader.innerHTML = '📖';
        imageLoader.style.color = 'var(--text-muted)';
        imageLoader.style.fontSize = '32px';
    }
    
    return card;
}


window.onload = function () {
    getScansHomepage();
    initializeSearchBar();
}

// ========== SEARCH FUNCTIONALITY ========== 

async function searchManga(query) {
    if (!query || query.trim().length < 2) {
        return [];
    }
    
    try {
        const encodedQuery = encodeURIComponent(query.trim());
        const response = await fetch(`https://api.saumondeluxe.com/scans/manga/search?title=${encodedQuery}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const searchResults = await response.json();
        return searchResults;
    } catch (error) {
        console.error('Error searching manga:', error);
        return [];
    }
}

function initializeSearchBar() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    
    if (!searchInput || !searchButton) {
        console.error('Search elements not found');
        return;
    }
    
    // Handle search button click
    searchButton.addEventListener('click', handleSearch);
    
    // Handle Enter key press
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Handle real-time search (debounced)
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length === 0) {
            hideSearchResults();
            showHomepageContent();
            return;
        }
        
        if (query.length >= 2) {
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300); // 300ms debounce
        }
    });
}

async function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim();
    
    if (query.length < 2) {
        alert('Veuillez entrer au moins 2 caractères pour la recherche');
        return;
    }
    
    await performSearch(query);
}

async function performSearch(query) {
    console.log('Searching for:', query);
    
    // Show loading state
    showSearchLoading();
    
    try {
        const results = await searchManga(query);
        displaySearchResults(results, query);
    } catch (error) {
        console.error('Search error:', error);
        showSearchError('Erreur lors de la recherche');
    }
}

function showSearchLoading() {
    hideHomepageContent();
    
    // Create or get search results container
    let searchContainer = document.getElementById('searchResults');
    if (!searchContainer) {
        searchContainer = document.createElement('div');
        searchContainer.id = 'searchResults';
        searchContainer.className = 'section';
        
        // Insert after search bar section
        const searchBarSection = document.querySelector('.section');
        searchBarSection.parentNode.insertBefore(searchContainer, searchBarSection.nextSibling);
    }
    
    searchContainer.innerHTML = `
        <h2 class="section-title">🔍 Résultats de recherche</h2>
        <div class="scanList">
            <div class="loading">Recherche en cours...</div>
        </div>
    `;
    searchContainer.style.display = 'block';
}

async function displaySearchResults(results, query) {
    let searchContainer = document.getElementById('searchResults');
    
    if (!searchContainer) {
        searchContainer = document.createElement('div');
        searchContainer.id = 'searchResults';
        searchContainer.className = 'section';
        
        // Insert after search bar section
        const searchBarSection = document.querySelector('.section');
        searchBarSection.parentNode.insertBefore(searchContainer, searchBarSection.nextSibling);
    }
    
    const resultCount = results.length;
    const titleText = resultCount > 0 
        ? `🔍 Résultats pour "${query}" (${resultCount})`
        : `🔍 Aucun résultat pour "${query}"`;
    
    searchContainer.innerHTML = `
        <div class="search-header">
            <h2 class="section-title">${titleText}</h2>
            <button class="back-to-home-btn" onclick="clearSearchAndShowHome()">
                🏠 Retour à l'accueil
            </button>
        </div>
        <div class="scanList" id="searchResultsList"></div>
    `;
    
    const resultsContainer = document.getElementById('searchResultsList');
    
    if (resultCount === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <div class="no-results-icon">📚</div>
                <div class="no-results-text">Aucun manga trouvé</div>
                <div class="no-results-suggestion">Essayez avec d'autres mots-clés</div>
            </div>
        `;
        return;
    }
    
    // Create cards for search results
    for (const result of results) {
        const card = await createSearchResultCard(result);
        resultsContainer.appendChild(card);
    }
    
    searchContainer.style.display = 'block';
}

async function createSearchResultCard(manga) {
    const card = document.createElement('div');
    card.className = 'scanCard search-result-card';
    
    // Create image container with loading placeholder
    const imageContainer = document.createElement('div');
    imageContainer.className = 'scanCard-image-container';
    
    const image = document.createElement('img');
    image.className = 'scanCard-image';
    image.alt = manga.title || 'Manga cover';
    
    // Add loading spinner
    const imageLoader = document.createElement('div');
    imageLoader.className = 'image-loader';
    imageLoader.innerHTML = '⏳';
    
    imageContainer.appendChild(image);
    imageContainer.appendChild(imageLoader);
    
    // Create content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'scanCard-content';
    
    // Create title
    const title = document.createElement('h3');
    title.className = 'scanCard-title';
    title.textContent = manga.title || 'Untitled';
    
    // Create genres container
    const genresContainer = document.createElement('div');
    genresContainer.className = 'scanCard-genres';
    
    if (manga.genres && Array.isArray(manga.genres)) {
        manga.genres.forEach(genre => {
            const genreTag = document.createElement('span');
            genreTag.className = 'genre-tag';
            genreTag.textContent = genre;
            genresContainer.appendChild(genreTag);
        });
    }
    
    // Create meta container (just type for search results)
    const metaContainer = document.createElement('div');
    metaContainer.className = 'scanCard-meta';
    
    // Create type badge
    const typeBadge = document.createElement('span');
    typeBadge.className = 'scanCard-type';
    typeBadge.textContent = manga.type || 'Unknown';
    
    // Create search indicator
    const searchIndicator = document.createElement('span');
    searchIndicator.className = 'search-indicator';
    searchIndicator.textContent = '🔍';
    
    metaContainer.appendChild(typeBadge);
    metaContainer.appendChild(searchIndicator);
    
    // Assemble the content
    contentContainer.appendChild(title);
    contentContainer.appendChild(genresContainer);
    contentContainer.appendChild(metaContainer);
    
    // Assemble the card
    card.appendChild(imageContainer);
    card.appendChild(contentContainer);
    
    // Add click event
    card.addEventListener('click', () => {
        console.log('Clicked on search result:', manga);
        // You can add navigation functionality here
    });
    
    // Fetch manga details for image
    if (manga.title) {
        fetchMangaDetails(manga.title).then(mangaDetails => {
            if (mangaDetails && mangaDetails.image_url) {
                image.onload = () => {
                    imageLoader.style.display = 'none';
                    image.style.opacity = '1';
                    image.classList.add('loaded');
                };
                image.onerror = () => {
                    imageLoader.innerHTML = '📖';
                    imageLoader.style.color = 'var(--text-muted)';
                    imageLoader.style.fontSize = '32px';
                };
                image.src = mangaDetails.image_url;
            } else {
                imageLoader.innerHTML = '📖';
                imageLoader.style.color = 'var(--text-muted)';
                imageLoader.style.fontSize = '32px';
            }
        }).catch(error => {
            console.error('Error loading image for', manga.title, ':', error);
            imageLoader.innerHTML = '📖';
            imageLoader.style.color = 'var(--text-muted)';
            imageLoader.style.fontSize = '32px';
        });
    } else {
        imageLoader.innerHTML = '📖';
        imageLoader.style.color = 'var(--text-muted)';
        imageLoader.style.fontSize = '32px';
    }
    
    return card;
}

function showSearchError(message) {
    let searchContainer = document.getElementById('searchResults');
    
    if (!searchContainer) {
        searchContainer = document.createElement('div');
        searchContainer.id = 'searchResults';
        searchContainer.className = 'section';
        
        const searchBarSection = document.querySelector('.section');
        searchBarSection.parentNode.insertBefore(searchContainer, searchBarSection.nextSibling);
    }
    
    searchContainer.innerHTML = `
        <h2 class="section-title">🔍 Recherche</h2>
        <div class="scanList">
            <div class="error">${message}</div>
        </div>
    `;
    searchContainer.style.display = 'block';
}

function hideSearchResults() {
    const searchContainer = document.getElementById('searchResults');
    if (searchContainer) {
        searchContainer.style.display = 'none';
    }
}

function hideHomepageContent() {
    const sections = document.querySelectorAll('.section:not(:first-child):not(#searchResults)');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}

function showHomepageContent() {
    const sections = document.querySelectorAll('.section:not(:first-child):not(#searchResults)');
    sections.forEach(section => {
        section.style.display = 'block';
    });
}

function clearSearchAndShowHome() {
    // Clear search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Hide search results
    hideSearchResults();
    
    // Show homepage content
    showHomepageContent();
}