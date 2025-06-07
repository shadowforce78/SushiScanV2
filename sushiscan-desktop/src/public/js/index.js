
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

function getScansHomepage() {
    const API = 'https://api.saumondeluxe.com/scans/homepage';
    
    // Show loading state
    showLoadingState();
    
    fetch(API)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Scans Homepage Data:', data);
            
            // Clear loading state
            clearLoadingState();
            
            // Create cards for each category
            if (data.trending) {
                createCardsForCategory('trendingList', data.trending);
            }
            if (data.popular) {
                createCardsForCategory('popularList', data.popular);
            }
            if (data.recommended) {
                createCardsForCategory('recommendedList', data.recommended);
            }
        })
        .catch(error => {
            console.error('Error fetching scans homepage:', error);
            showErrorState(error.message);
        });
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

function createCardsForCategory(containerId, items) {
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
    
    items.forEach(item => {
        const card = createScanCard(item);
        container.appendChild(card);
    });
}

function createScanCard(scan) {
    const card = document.createElement('div');
    card.className = 'scanCard';
    
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
    
    // Assemble the card
    card.appendChild(title);
    card.appendChild(genresContainer);
    card.appendChild(metaContainer);
    
    // Add click event for future functionality
    card.addEventListener('click', () => {
        console.log('Clicked on scan:', scan);
        // You can add navigation or modal functionality here
    });
    
    return card;
}


window.onload = function () {
    getScansHomepage();
};