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
    pages.forEach(page => {
        const img = document.createElement('img');
        img.src = page;
        img.alt = 'Scan Page';
        img.className = 'scan-page';
        scansDiv.appendChild(img);
    });
}