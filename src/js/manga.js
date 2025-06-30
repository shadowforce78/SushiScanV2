async function fetchMangaDetails(encodedTitle) {
    const homepageDiv = document.getElementsByClassName('homepage')[0];
    const infoDiv = document.getElementsByClassName('info')[0];

    const response = await fetch(`${API_URL}/scans/manga/info?manga_name=${encodedTitle}`)
    const data = await response.json();
    if (!data || !data.manga) {
        infoDiv.innerHTML = '<p>Manga details not found.</p>';
        return;
    }
    return data.manga; // Assuming the API returns an object with a 'manga' property
}


function displayMangaDetails(manga) {
    const homepageDiv = document.getElementsByClassName('homepage')[0];
    const infoDiv = document.getElementsByClassName('info')[0];
    homepageDiv.innerHTML = ''; // Clear the homepage content
    infoDiv.innerHTML = `
            <button class="back-button" onclick="window.location.reload()">Back to Homepage</button>
                <h2>${manga.title}</h2>
                <img src="${manga.image_url}" alt="${manga.title} cover" class="manga-cover">
            `;
    // Check if manga has scans property and it's an array
    if (manga.scan_chapters && Array.isArray(manga.scan_chapters)) {
        manga.scan_chapters.forEach(scan => {
            const scanDiv = document.createElement('div');
            scanDiv.className = 'scan-chapter';
            scanDiv.innerHTML = `
                <h3>${scan.name}</h3>
                <p>Total Chapters: ${scan.total_chapters}</p>
            `;


            for (let i = 1; i <= scan.total_chapters; i++) {
                const chapterButton = document.createElement('button');
                chapterButton.className = 'chapter-button';
                chapterButton.innerText = `Chapter ${i}`;
                chapterButton.onclick = async () => {
                    const encodedTitle = encodeURIComponent(manga.title);
                    const encodedScansType = encodeURIComponent(scan.name);
                    const pages = await fetchScansPage(encodedTitle, encodedScansType, i);
                    displayScans(pages);
                }

                scanDiv.appendChild(chapterButton);
            }

            infoDiv.appendChild(scanDiv);
        });
    } else {
        // If no scans data, show a message
        const noScansDiv = document.createElement('div');
        noScansDiv.innerHTML = '<p>No scan data available for this manga.</p>';
        infoDiv.appendChild(noScansDiv);
    }
}