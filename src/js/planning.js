const API_URL = 'https://api.saumondeluxe.com'; 

async function fetchPlanning(){
    const response = await fetch(`${API_URL}/scans/planning`);
    if (!response.ok) {
        throw new Error('Failed to fetch planning data');
    }
    const data = await response.json();
    return data.planning; // Assuming the API returns an object with a 'planning' property
}
// Old code snippet for displaying planning data
            // <h3>${item.name}</h3>
            // <p>Day: ${item.day}</p> <!-- Can be 'Lundi', 'Mardi',  or 'Autre' -->
            // <p>URL: <a href="${item.url}">${item.url}</a></p>
            // <p>Image: <img src="${item.image}" alt="${item.name}"></p>
            // <p>Time: ${item.time}</p>
            // <p>Status: ${item.status}</p>
            // <p>Language: ${item.language}</p>
            // <p>Updated At: ${item.updated_at.$date}</p>

function groupDataByDay(planningData) {
    return planningData.reduce((acc, item) => {
        const day = item.day || 'Autre'; // Default to 'Autre' if day is not specified
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(item);
        return acc;
    }, {});
}

window.onload = async () => {
    const planningDiv = document.getElementsByClassName('planning')[0];
    const planningData = await fetchPlanning();
    if (!planningData || planningData.length === 0) {
        planningDiv.innerHTML = '<p>No planning data available.</p>';
        return;
    }
    const groupedData = groupDataByDay(planningData);
    for (const [day, items] of Object.entries(groupedData)) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'planning-day';
        dayDiv.innerHTML = `<h2>${day}</h2>`;
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'planning-item';
            itemDiv.innerHTML = `
                <a class="manga-button" href="index.html?manga=${encodeURIComponent(item.name)}">
                    <img src="${item.image}" alt="${item.name}" class="manga-cover">
                </a>
                <div class="planning-info">
                    <h3>${item.name}</h3>
                    <p>Day: ${item.day}</p>
                    <p>Time: ${item.time}</p>
                    <p>Status: ${item.status}</p>
                    <p>Language: ${item.language}</p>
                    <p>Updated At: ${item.updated_at.$date}</p>
                </div>
            `;
            dayDiv.appendChild(itemDiv);
        });
        planningDiv.appendChild(dayDiv);
    }
}
