const API_URL = 'https://api.saumondeluxe.com'; 

async function fetchPlanning(){
    const response = await fetch(`${API_URL}/scans/planning`);
    if (!response.ok) {
        throw new Error('Failed to fetch planning data');
    }
    const data = await response.json();
    return data.planning; // Assuming the API returns an object with a 'planning' property
}


window.onload = async () => {
    const planningDiv = document.getElementsByClassName('planning')[0];
    const planningData = await fetchPlanning();
    if (!planningData || planningData.length === 0) {
        planningDiv.innerHTML = '<p>No planning data available.</p>';
        return;
    }
    planningData.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'planning-item';
        itemDiv.innerHTML = `
            <h3>${item.name}</h3>
            <p>Day: ${item.day}</p> <!-- Can be 'Lundi', 'Mardi',  or 'Autre' -->
            <p>URL: <a href="${item.url}">${item.url}</a></p>
            <p>Image: <img src="${item.image}" alt="${item.name}"></p>
            <p>Time: ${item.time}</p>
            <p>Status: ${item.status}</p>
            <p>Language: ${item.language}</p>
            <p>Updated At: ${item.updated_at.$date}</p>
        `;
        planningDiv.appendChild(itemDiv);
    });
}