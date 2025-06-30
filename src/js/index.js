const API_URL = 'https://api.saumondeluxe.com';

async function tempHomepage() {
    const response = await fetch(`${API_URL}/scans/mangaList`);
    const data = await response.json();
    console.log(data);
    return data.mangas; // Assuming the API returns an object with a 'mangas'
}

window.onload = async () => {
    const mainDiv = document.getElementsByClassName('main')[0];
    const mangaList = await tempHomepage();
    if (!mangaList || mangaList.length === 0) {
        mainDiv.innerHTML = '<p>No mangas found.</p>';
        return;
    }
    mangaList.forEach(manga => {
        const mangaDiv = document.createElement('div');
        mangaDiv.className = `manga-${encodeURIComponent(manga.title)}`;
        mangaDiv.innerHTML = `
            <button class="manga-button" onclick="fetchMangaDetails('${encodeURIComponent(manga.title)}')">${manga.title}</button>
        `;
        mainDiv.appendChild(mangaDiv);
    });
}