async function fetchScansPage(encodedTitle, encoded_scans_type, chapter) {
    const response = await fetch(`${API_URL}/scans/chapter/pages?manga_name=${encodedTitle}&scans_type=${encoded_scans_type}&chapter=${chapter}`);
    const pages = await response.json();
    return pages.pages;
}

function displayScans(pages) {
    const homepageDiv = document.getElementsByClassName('homepage')[0];
    const infoDiv = document.getElementsByClassName('info')[0];
    const scansDiv = document.getElementsByClassName('viewer')[0];
    scansDiv.innerHTML = ''; // Clear previous content
    homepageDiv.style.display = 'none'; // Hide homepage
    infoDiv.style.display = 'none'; // Hide info section
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
        infoDiv.style.display = 'block'; // Show info section
        homepageDiv.style.display = 'block'; // Show homepage
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