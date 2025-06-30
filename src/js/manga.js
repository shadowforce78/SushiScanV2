function fetchMangaDetails(encodedTitle) {
    fetch(`${API_URL}/scans/manga/info?manga_name=${encodedTitle}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error('Error fetching manga details:', error));
}