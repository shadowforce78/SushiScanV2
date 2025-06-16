// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 SushiScan application initialized');
});

// ===========================
// WINDOW CONTROLS
// ===========================

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

// ===========================
// API FUNCTIONS
// ===========================

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
    card.appendChild(contentContainer);    // Add click event for future functionality
    card.addEventListener('click', () => {
        console.log('Clicked on scan:', scan);
        // Show manga details
        if (scan.title) {
            showMangaDetails(scan.title);
        }
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
        const searchBarSection = document.querySelector('.search-section');
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
        const searchBarSection = document.querySelector('.search-section');
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
    card.appendChild(contentContainer);    // Add click event
    card.addEventListener('click', () => {
        console.log('Clicked on search result:', manga);
        // Show manga details
        if (manga.title) {
            showMangaDetails(manga.title);
        }
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

        const searchBarSection = document.querySelector('.search-section');
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
    // Hide all sections except search section and search results
    const sections = document.querySelectorAll('.section:not(.search-section):not(#searchResults)');
    sections.forEach(section => {
        section.style.display = 'none';
    });
}

function showHomepageContent() {
    // Show all sections except search results (keep search section visible)
    const sections = document.querySelectorAll('.section:not(.search-section):not(#searchResults)');
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

// ========== MANGA DETAILS FUNCTIONALITY ========== 

async function showMangaDetails(title) {
    console.log('Showing details for:', title);

    // Hide all other content
    hideAllContent();

    // Show loading state
    showMangaDetailsLoading();

    try {
        const mangaDetails = await fetchMangaDetails(title);
        if (mangaDetails) {
            displayMangaDetails(mangaDetails);
        } else {
            showMangaDetailsError('Impossible de charger les détails du manga');
        }
    } catch (error) {
        console.error('Error showing manga details:', error);
        showMangaDetailsError('Erreur lors du chargement des détails');
    }
}

function hideAllContent() {
    // Hide search section, homepage content, and search results
    const searchSection = document.querySelector('.search-section');
    const searchResults = document.getElementById('searchResults');
    const homepageSections = document.querySelectorAll('.section:not(.search-section):not(#searchResults)');
    const mangaDetails = document.getElementById('mangaDetails');

    if (searchSection) searchSection.style.display = 'none';
    if (searchResults) searchResults.style.display = 'none';
    if (mangaDetails) mangaDetails.style.display = 'none';
    homepageSections.forEach(section => {
        section.style.display = 'none';
    });
}

function showAllContent() {
    // Show search section and homepage content, hide manga details
    const searchSection = document.querySelector('.search-section');
    const mangaDetails = document.getElementById('mangaDetails');
    const homepageSections = document.querySelectorAll('.section:not(.search-section):not(#searchResults)');
    const searchResults = document.getElementById('searchResults');

    if (searchSection) searchSection.style.display = 'block';
    if (mangaDetails) mangaDetails.style.display = 'none';
    if (searchResults) searchResults.style.display = 'none';
    homepageSections.forEach(section => {
        section.style.display = 'block';
    });
}

function showMangaDetailsLoading() {
    const mangaDetails = document.getElementById('mangaDetails');
    if (!mangaDetails) return;

    mangaDetails.innerHTML = `
        <div class="manga-details-header">
            <h1 class="manga-details-title">📖 Chargement...</h1>
            <button class="back-btn" onclick="backToHome()">
                ⬅️ Retour
            </button>
        </div>
        <div class="manga-content">
            <div class="loading">Chargement des détails...</div>
        </div>
    `;
    mangaDetails.style.display = 'block';
}

function displayMangaDetails(manga) {
    const mangaDetails = document.getElementById('mangaDetails');
    if (!mangaDetails) return;

    // Format the updated date
    const updatedDate = manga.updated_at ?
        new Date(manga.updated_at).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : 'Date inconnue';

    mangaDetails.innerHTML = `
        <div class="manga-details-header">
            <div class="manga-titles">
                <h1 class="manga-details-title">${manga.title || 'Titre inconnu'}</h1>
                ${manga.alt_title ? `<p class="manga-alt-title">${manga.alt_title}</p>` : ''}
            </div>
            <button class="back-btn" onclick="backToHome()">
                ⬅️ Retour
            </button>
        </div>
        
        <div class="manga-content">
            <div class="manga-image-section">
                <div class="manga-image-loader">⏳</div>
                <img class="manga-main-image" alt="${manga.title || 'Manga cover'}" style="opacity: 0;">
            </div>
            
            <div class="manga-info-section">
                <div class="manga-meta-grid">
                    <div class="meta-item">
                        <div class="meta-label">Chapitres</div>
                        <div class="meta-value">${manga.total_chapters || 'Non spécifié'}</div>
                    </div>
                    
                    <div class="meta-item">
                        <div class="meta-label">Types</div>
                        <div class="meta-value">${manga.type ? (Array.isArray(manga.type) ? manga.type.join(', ') : manga.type) : 'Non spécifié'}</div>
                    </div>
                    
                    <div class="meta-item">
                        <div class="meta-label">Dernière MAJ</div>
                        <div class="meta-value updated-date">${updatedDate}</div>
                    </div>
                </div>
                
                <div class="meta-item">
                    <div class="meta-label">Genres</div>
                    <div class="manga-genres-detailed">
                        ${manga.genres && Array.isArray(manga.genres) && manga.genres.length > 0 ?
            manga.genres.map(genre => `<span class="genre-tag-detailed">${genre}</span>`).join('') :
            '<span class="meta-value">Aucun genre spécifié</span>'}
                    </div>
                </div>
                
                <div class="meta-item">
                    <div class="meta-label">Langues disponibles</div>
                    <div class="manga-languages">
                        ${manga.language && Array.isArray(manga.language) && manga.language.length > 0 ?
            manga.language.map(lang => `<span class="language-tag">${lang}</span>`).join('') :
            '<span class="meta-value">Non spécifié</span>'}
                    </div>
                </div>
                
                ${manga.scan_types && Array.isArray(manga.scan_types) && manga.scan_types.length > 0 ? `
                <div class="manga-scan-types">
                    <div class="scan-types-header">
                        📚 Types de scans disponibles
                    </div>
                    ${manga.scan_types.map(scanType => `
                        <div class="scan-type-item" onclick="openScanType('${scanType.url || '#'}')">
                            <span class="scan-type-name">${scanType.name || 'Type inconnu'}</span>
                            <span class="scan-type-arrow">→</span>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        </div>
    `;

    // Load the manga image
    const imageLoader = mangaDetails.querySelector('.manga-image-loader');
    const image = mangaDetails.querySelector('.manga-main-image');

    if (manga.image_url) {
        image.onload = () => {
            imageLoader.style.display = 'none';
            image.style.opacity = '1';
        };
        image.onerror = () => {
            imageLoader.innerHTML = '📖';
            imageLoader.style.fontSize = '64px';
            imageLoader.style.color = 'var(--text-muted)';
        };
        image.src = manga.image_url;
    } else {
        imageLoader.innerHTML = '📖';
        imageLoader.style.fontSize = '64px';
        imageLoader.style.color = 'var(--text-muted)';
    }

    mangaDetails.style.display = 'block';
}

function showMangaDetailsError(message) {
    const mangaDetails = document.getElementById('mangaDetails');
    if (!mangaDetails) return;

    mangaDetails.innerHTML = `
        <div class="manga-details-header">
            <h1 class="manga-details-title">❌ Erreur</h1>
            <button class="back-btn" onclick="backToHome()">
                ⬅️ Retour
            </button>
        </div>
        <div class="manga-content">
            <div class="error">${message}</div>
        </div>
    `;
    mangaDetails.style.display = 'block';
}

function backToHome() {
    // Hide manga details
    const mangaDetails = document.getElementById('mangaDetails');
    if (mangaDetails) {
        mangaDetails.style.display = 'none';
    }

    // Show all content
    showAllContent();

    // Clear search if any
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }

    // Hide search results
    hideSearchResults();
}

async function openScanType(url) {
    console.log('Opening scan type URL:', url);

    try {
        const urlObj = new URL(url);

        // Check if it's a SushiScan API URL
        if (urlObj.hostname === 'api.saumondeluxe.com' && urlObj.pathname === '/scans/chapter') {
            const title = urlObj.searchParams.get('title');
            const scanName = urlObj.searchParams.get('scan_name');
            const chapterNumber = urlObj.searchParams.get('chapter_number');

            if (title && scanName && chapterNumber) {
                showChapterViewer(title, scanName, chapterNumber);
                return;
            }
        }

        // For other URLs, try to extract manga info and scan type info from current context
        const mangaDetailsElement = document.getElementById('mangaDetails');
        if (mangaDetailsElement && mangaDetailsElement.style.display === 'block') {
            const titleElement = mangaDetailsElement.querySelector('.manga-details-title');
            const mangaTitle = titleElement ? titleElement.textContent : null;

            if (mangaTitle) {
                // Try to find the scan type that was clicked
                const scanTypeItems = mangaDetailsElement.querySelectorAll('.scan-type-item');
                let clickedScanType = null;

                scanTypeItems.forEach(item => {
                    const scanTypeUrl = item.getAttribute('onclick');
                    if (scanTypeUrl && scanTypeUrl.includes(url)) {
                        const scanNameElement = item.querySelector('.scan-type-name');
                        if (scanNameElement) {
                            clickedScanType = scanNameElement.textContent;
                        }
                    }
                });

                if (clickedScanType) {
                    console.log('Attempting to load chapter for:', {
                        title: mangaTitle,
                        scanName: clickedScanType
                    });                    // Try to load chapter 1 by default
                    await showChapterViewer(mangaTitle, clickedScanType, '1', 20);
                    return;
                }
            }
        }

        // Fallback: open external URL
        console.log('Opening external URL:', url);
        if (window.electronAPI && window.electronAPI.openExternal) {
            window.electronAPI.openExternal(url);
        } else {
            window.open(url, '_blank');
        }

    } catch (error) {
        console.error('Error parsing URL:', error);
        alert('Erreur lors de l\'ouverture du lien');
    }
}

// ========== CHAPTER VIEWER FUNCTIONALITY ========== 

async function showChapterViewer(title, scanName, chapterNumber, totalPages = 20) {
    console.log('Showing chapter:', { title, scanName, chapterNumber, totalPages });

    // Hide all other content
    hideAllContentIncludingManga();

    // Show loading state
    showChapterLoading();

    try {
        // Create chapter data object directly without API call
        const chapterData = {
            title: `Chapitre ${chapterNumber}`,
            number: chapterNumber,
            manga_title: title,
            scan_name: scanName,
            page_count: totalPages,
            added_at: new Date().toISOString(),
            image_urls: [] // Will be generated dynamically
        };

        displayChapter(chapterData);
    } catch (error) {
        console.error('Error showing chapter:', error);
        showChapterError('Erreur lors du chargement du chapitre');
    }
}

function hideAllContentIncludingManga() {
    // Hide all content including manga details
    const searchSection = document.querySelector('.search-section');
    const searchResults = document.getElementById('searchResults');
    const mangaDetails = document.getElementById('mangaDetails');
    const homepageSections = document.querySelectorAll('.section:not(.search-section):not(#searchResults)');

    if (searchSection) searchSection.style.display = 'none';
    if (searchResults) searchResults.style.display = 'none';
    if (mangaDetails) mangaDetails.style.display = 'none';
    homepageSections.forEach(section => {
        section.style.display = 'none';
    });
}

function showChapterLoading() {
    const chapterViewer = document.getElementById('chapterViewer');
    if (!chapterViewer) return;

    chapterViewer.innerHTML = `
        <div class="chapter-header">
            <div class="chapter-info">
                <h1 class="chapter-title">📖 Chargement du chapitre...</h1>
            </div>
            <div class="chapter-navigation">
                <button class="nav-btn back-to-manga-btn" onclick="backToMangaFromChapter()">
                    ⬅️ Retour aux détails
                </button>
            </div>
        </div>
        <div class="chapter-loading">
            Chargement des pages...
        </div>
    `;
    chapterViewer.style.display = 'block';
}

async function displayChapter(chapterData) {
    const chapterViewer = document.getElementById('chapterViewer');
    if (!chapterViewer) return;

    // Get current chapter info for navigation
    const currentChapter = parseInt(chapterData.number) || 1;
    const title = chapterData.manga_title;
    const scanName = chapterData.scan_name;

    // Format chapter date
    const addedDate = chapterData.added_at ?
        new Date(chapterData.added_at).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : 'Date inconnue';

    chapterViewer.innerHTML = `
        <div class="chapter-header">
            <div class="chapter-info">
                <h1 class="chapter-title">${chapterData.title || `Chapitre ${chapterData.number || 'Inconnu'}`}</h1>
                <div class="chapter-meta">
                    <div class="chapter-meta-item">
                        📚 ${chapterData.manga_title || 'Manga inconnu'}
                    </div>
                    <div class="chapter-meta-item">
                        🏷️ ${chapterData.scan_name || 'Scan inconnu'}
                    </div>                    <div class="chapter-meta-item">
                        📄 ${chapterData.page_count || chapterData.image_urls?.length || 0} pages
                    </div>
                    <div class="chapter-meta-item">
                        📅 ${addedDate}
                    </div>
                </div>
            </div>        <div class="chapter-navigation">
            <button class="nav-btn ${currentChapter <= 1 ? 'disabled' : ''}" 
                    onclick="${currentChapter > 1 ? `navigateToChapter('prev', '${title}', '${scanName}', '${currentChapter}', ${chapterData.page_count || 20})` : ''}"
                    ${currentChapter <= 1 ? 'disabled' : ''}>
                ⬅️ Chapitre précédent
            </button>
            <button class="nav-btn back-to-manga-btn" onclick="backToMangaFromChapter()">
                📖 Retour aux détails
            </button>
            <button class="nav-btn" onclick="navigateToChapter('next', '${title}', '${scanName}', '${currentChapter}', ${chapterData.page_count || 20})">
                Chapitre suivant ➡️
            </button>
        </div>
        </div>
        <div class="chapter-progress" id="chapterProgress">
            <div class="chapter-progress-bar">
                <div class="chapter-progress-fill" id="chapterProgressFill"></div>
            </div>
            <div class="chapter-progress-text" id="chapterProgressText">0/${chapterData.page_count || 0}</div>
        </div>
        <div class="chapter-pages" id="chapterPages">
            <!-- Pages will be loaded here -->
        </div>
    `;    // Load chapter pages
    if (chapterData.page_count > 0) {
        // Generate anime-sama URLs directly
        const animeSamaMangaName = formatMangaNameForAnimeSama(chapterData.manga_title);
        const animeSamaUrls = generateAnimeSamaUrls(animeSamaMangaName, chapterData.number, chapterData.page_count);
        await loadChapterPages(animeSamaUrls, chapterData);
    } else {
        showChapterError('Aucune page disponible pour ce chapitre');
    }

    chapterViewer.style.display = 'block';
}

async function navigateToChapter(direction, currentTitle, currentScanName, currentChapterNumber, currentTotalPages = 20) {
    const currentChapter = parseInt(currentChapterNumber);
    const newChapterNumber = direction === 'next' ? currentChapter + 1 : currentChapter - 1;

    if (newChapterNumber < 1) {
        alert('Vous êtes déjà au premier chapitre');
        return;
    }

    console.log(`Navigating to chapter ${newChapterNumber}`);
    await showChapterViewer(currentTitle, currentScanName, newChapterNumber.toString(), currentTotalPages);
}

function showChapterError(message) {
    const chapterViewer = document.getElementById('chapterViewer');
    if (!chapterViewer) return;

    chapterViewer.innerHTML = `
        <div class="chapter-header">
            <div class="chapter-info">
                <h1 class="chapter-title">❌ Erreur</h1>
            </div>
            <div class="chapter-navigation">
                <button class="nav-btn back-to-manga-btn" onclick="backToMangaFromChapter()">
                    ⬅️ Retour aux détails
                </button>
            </div>
        </div>
        <div class="chapter-error">
            ${message}
        </div>
    `;
    chapterViewer.style.display = 'block';
}

function backToMangaFromChapter() {
    // Hide chapter viewer
    const chapterViewer = document.getElementById('chapterViewer');
    if (chapterViewer) {
        chapterViewer.style.display = 'none';
    }

    // Show manga details
    const mangaDetails = document.getElementById('mangaDetails');
    if (mangaDetails) {
        mangaDetails.style.display = 'block';
    }
}

// ========== PAGE LOADING AND RENDERING ========== 

/**
 * Génère les URLs des pages d'un chapitre basé sur le format anime-sama.fr
 * @param {string} mangaName - Le nom du manga (au format utilisé dans les URLs anime-sama)
 * @param {string|number} chapterNumber - Le numéro du chapitre
 * @param {number} totalPages - Le nombre total de pages du chapitre
 * @returns {Array<string>} - Tableau des URLs complètes des pages
 */
function generateAnimeSamaUrls(mangaName, chapterNumber, totalPages) {
    const baseUrl = 'https://anime-sama.fr/s2/scans';
    const urls = [];
    
    // Nettoyer et encoder correctement le nom du manga
    let cleanMangaName = mangaName.trim();
    
    // Vérifier si le nom est déjà encodé et le décoder si nécessaire
    try {
        if (cleanMangaName.includes('%')) {
            cleanMangaName = decodeURIComponent(cleanMangaName);
            console.log(`🔄 Decoded manga name: ${cleanMangaName}`);
        }
    } catch (e) {
        console.log('Could not decode manga name, using as-is');
    }
    
    // Encoder proprement pour l'URL
    const encodedMangaName = encodeURIComponent(cleanMangaName);
    
    // Nettoyer et formater le numéro de chapitre
    const cleanChapterNumber = chapterNumber.toString().trim();
    
    console.log(`🔗 Generating anime-sama URLs for: "${cleanMangaName}" (encoded: "${encodedMangaName}"), Chapter: ${cleanChapterNumber}, Pages: ${totalPages}`);
    
    // Générer les URLs pour chaque page
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        const url = `${baseUrl}/${encodedMangaName}/${cleanChapterNumber}/${pageNumber}.jpg`;
        urls.push(url);
    }
    
    console.log(`✅ Generated ${urls.length} anime-sama URLs`);
    console.log(`📋 Sample URL: ${urls[0]}`); // Log pour vérifier le format
    return urls;
}

/**
 * Génère les URLs des pages d'un chapitre avec gestion des variantes d'extension
 * @param {string} mangaName - Le nom du manga
 * @param {string|number} chapterNumber - Le numéro du chapitre
 * @param {number} totalPages - Le nombre total de pages
 * @param {Array<string>} extensions - Extensions à essayer (par défaut: ['jpg', 'jpeg', 'png', 'webp'])
 * @returns {Array<Array<string>>} - Tableau de tableaux d'URLs avec différentes extensions
 */
function generateAnimeSamaUrlsWithFallbacks(mangaName, chapterNumber, totalPages, extensions = ['jpg', 'jpeg', 'png', 'webp']) {
    const baseUrl = 'https://anime-sama.fr/s2/scans';
    
    // Nettoyer et encoder correctement le nom du manga
    let cleanMangaName = mangaName.trim();
    
    // Vérifier si le nom est déjà encodé et le décoder si nécessaire
    try {
        if (cleanMangaName.includes('%')) {
            cleanMangaName = decodeURIComponent(cleanMangaName);
        }
    } catch (e) {
        console.log('Could not decode manga name, using as-is');
    }
    
    const encodedMangaName = encodeURIComponent(cleanMangaName);
    const cleanChapterNumber = chapterNumber.toString().trim();
    
    console.log(`🔗 Generating anime-sama URLs with fallbacks for: "${cleanMangaName}" (encoded: "${encodedMangaName}"), Chapter: ${cleanChapterNumber}, Pages: ${totalPages}`);
    
    const urlsWithFallbacks = [];
    
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        const pageUrls = extensions.map(ext => 
            `${baseUrl}/${encodedMangaName}/${cleanChapterNumber}/${pageNumber}.${ext}`
        );
        urlsWithFallbacks.push(pageUrls);
    }
    
    console.log(`✅ Generated ${urlsWithFallbacks.length} pages with ${extensions.length} fallback URLs each`);
    return urlsWithFallbacks;
}

async function loadChapterPages(imageUrls, chapterData) {
    const pagesContainer = document.getElementById('chapterPages');
    const progressFill = document.getElementById('chapterProgressFill');
    const progressText = document.getElementById('chapterProgressText');

    if (!pagesContainer) return;

    const totalPages = imageUrls.length;
    let loadedPages = 0;

    // Extract chapter metadata for logging
    const mangaTitle = chapterData?.manga_title || 'Unknown';
    const scanName = chapterData?.scan_name || 'Unknown';
    const chapterNumber = chapterData?.number || '1';

    console.log(`📖 Loading chapter ${chapterNumber} of ${mangaTitle} (${scanName}) - ${totalPages} pages`);
    console.log(`� Using anime-sama.fr URLs directly`);

    // Update progress function
    const updateProgress = () => {
        const progressPercent = (loadedPages / totalPages) * 100;
        if (progressFill) progressFill.style.width = `${progressPercent}%`;
        if (progressText) progressText.textContent = `${loadedPages}/${totalPages}`;

        // Hide progress bar when all pages are loaded/failed
        if (loadedPages === totalPages) {
            setTimeout(() => {
                const progressContainer = document.getElementById('chapterProgress');
                if (progressContainer) {
                    progressContainer.style.display = 'none';
                }
            }, 1000);
        }
    };    // Function to load a page with direct URL from anime-sama
    function loadPage(index, imageUrl) {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'chapter-page';
        pageDiv.innerHTML = `
            <div class="chapter-page-loader">⏳</div>
            <img class="chapter-page-image" 
                 alt="Page ${index + 1}" 
                 style="opacity: 0; display: none;">
            <div class="chapter-page-number">${index + 1}</div>
        `;

        const image = pageDiv.querySelector('.chapter-page-image');
        const loader = pageDiv.querySelector('.chapter-page-loader');

        console.log(`🔄 Loading page ${index + 1} with URL:`, imageUrl);

        // Set up image handlers
        image.onload = () => {
            console.log(`✅ Page ${index + 1} loaded successfully`);

            // Show the image
            loader.style.display = 'none';
            image.style.display = 'block';
            image.style.opacity = '1';
            loadedPages++;
            updateProgress();
        };

        image.onerror = () => {
            console.error(`❌ Failed to load page ${index + 1}`);
            loader.innerHTML = '❌';
            loader.style.color = 'var(--accent-red)';
            loader.title = 'Échec du chargement';
            loadedPages++;
            updateProgress();
        };

        // Load the image directly with anime-sama URL
        image.src = imageUrl;

        // Add page to container
        pagesContainer.appendChild(pageDiv);
    }

    // Load all pages
    imageUrls.forEach((imageUrl, index) => {
        loadPage(index, imageUrl);
    });
}

/**
 * Formate le nom du manga pour l'utiliser dans les URLs anime-sama
 * @param {string} mangaTitle - Le titre original du manga
 * @returns {string} - Le nom formaté pour anime-sama (avec encodage URL correct)
 */
function formatMangaNameForAnimeSama(mangaTitle) {
    // Décoder d'abord au cas où le titre serait déjà partiellement encodé
    let cleanTitle = mangaTitle.trim();
    
    try {
        // Essayer de décoder si c'est déjà encodé
        cleanTitle = decodeURIComponent(cleanTitle);
    } catch (e) {
        // Si le décodage échoue, utiliser le titre tel quel
        console.log('Title not encoded, using as-is:', cleanTitle);
    }
    
    // Encoder proprement pour l'URL
    return encodeURIComponent(cleanTitle);
}

// ===========================
// ENHANCED ERROR HANDLING
// ===========================

async function enhancedErrorHandler(promise, errorMessage) {
    try {
        await promise;
    } catch (error) {
        console.error(errorMessage, error);
        alert(`${errorMessage}\n\nDetails: ${error.message}`);
    }
}