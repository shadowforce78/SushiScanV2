async function fetchScansPage(encodedTitle, encoded_scans_type, chapter) {
    const response = await fetch(`${API_URL}/scans/chapter/pages?manga_name=${encodedTitle}&scans_type=${encoded_scans_type}&chapter=${chapter}`);
    const pages = await response.json();
    return pages.pages;
}

function displayScans(pages) {
    const homepageDiv = document.querySelector('.homepage');
    const infoDiv = document.querySelector('.info');
    const scansDiv = document.querySelector('.viewer');
    
    if (!scansDiv) {
        console.error('Viewer container not found');
        return;
    }
    
    scansDiv.innerHTML = ''; // Clear previous content
    if (homepageDiv) homepageDiv.style.display = 'none'; // Hide homepage
    if (infoDiv) infoDiv.style.display = 'none'; // Hide info section
    scansDiv.style.display = 'block'; // Show scans viewer

    if (!pages || pages.length === 0) {
        scansDiv.innerHTML = '<p>No pages found for this chapter.</p>';
        return;
    }

    // Back button to return to info section
    const backButton = document.createElement('button');
    backButton.className = 'back-button';
    backButton.innerText = 'Back to Info';
    backButton.onclick = () => {
        scansDiv.style.display = 'none'; // Hide scans viewer
        if (infoDiv) infoDiv.style.display = 'block'; // Show info section
        if (homepageDiv) homepageDiv.style.display = 'block'; // Show homepage
    };
    scansDiv.appendChild(backButton);
    

    pages.forEach(page => {
        const img = document.createElement('img');
        img.src = page;
        img.alt = 'Scan Page';
        img.className = 'scan-page';
        scansDiv.appendChild(img);
    });
}