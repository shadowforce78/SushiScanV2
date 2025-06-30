const BASE_URL = 'https://api.saumondeluxe.com';

export async function getMangas() {
    const res = await fetch(`${BASE_URL}/scans/mangaList`);
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
}
