
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
};