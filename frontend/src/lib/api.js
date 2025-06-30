const BASE_URL = 'https://api.saumondeluxe.com';

export async function getMangas() {
    const res = await fetch(`${BASE_URL}/scans/mangaList`);
    return await res.json();
}
