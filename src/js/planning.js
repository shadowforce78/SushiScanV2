/**
 * Planning Module for Manga Release Schedule - Simple Weekly Schedule
 */

const API_URL = 'https://api.saumondeluxe.com';

class PlanningManager {
    constructor() {
        this.planningData = [];
        this.initializeElements();
        this.loadPlanning();
    }

    initializeElements() {
        this.planningContainer = document.querySelector('.main');
        
        // Debug: Log which elements are found
        console.log('Planning elements initialized:', {
            planningContainer: !!this.planningContainer
        });
    }

    async loadPlanning() {
        try {
            this.showLoading();
            let data;
            try {
                data = await this.fetchPlanning();
            } catch (apiError) {
                console.warn('API not available, using mock data:', apiError);
                data = this.getMockPlanningData();
            }
            this.planningData = data || [];
            this.renderWeeklySchedule();
        } catch (error) {
            console.error('Error loading planning:', error);
            this.showError('Impossible de charger le planning');
        }
    }

    getMockPlanningData() {
        const mockData = [];
        
        const mangaNames = [
            'One Piece', 'Naruto', 'Demon Slayer', 'Attack on Titan', 
            'My Hero Academia', 'Dragon Ball Super', 'Jujutsu Kaisen', 
            'Chainsaw Man', 'Tokyo Ghoul', 'Death Note'
        ];

        const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche', 'Autres'];
        
        // Créer des données de test pour chaque jour
        for (let i = 0; i < mangaNames.length; i++) {
            mockData.push({
                name: mangaNames[i],
                chapter: Math.floor(Math.random() * 50) + 100,
                image: '/img/no-cover.png',
                day: days[i % days.length],
                status: 'active',
                time: `${Math.floor(Math.random() * 12) + 8}:00`,
                language: 'FR'
            });
        }
        
        console.log('Mock planning data generated:', mockData);
        return mockData;
    }

    async fetchPlanning() {
        const response = await fetch(`${API_URL}/scans/planning`);
        if (!response.ok) {
            throw new Error('Failed to fetch planning data');
        }
        const data = await response.json();
        return data.planning;
    }

    renderWeeklySchedule() {
        if (!this.planningContainer) {
            console.warn('Planning container not found');
            return;
        }

        console.log('Rendering weekly schedule with data:', this.planningData.length, 'items');
        
        const groupedData = this.groupDataByDay(this.planningData);
        const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche', 'Autres'];
        
        let scheduleHTML = `
            <div class="planning-header">
                <h2>📅 Planning des Sorties Manga</h2>
            </div>
            <div class="weekly-schedule">
        `;

        days.forEach(day => {
            const dayReleases = groupedData[day] || [];
            scheduleHTML += this.renderDaySection(day, dayReleases);
        });

        scheduleHTML += '</div>';
        this.planningContainer.innerHTML = scheduleHTML;
    }

    renderDaySection(day, releases) {
        return `
            <div class="day-section">
                <div class="day-header">
                    <h3>${day}</h3>
                    <span class="release-count">${releases.length} sortie${releases.length !== 1 ? 's' : ''}</span>
                </div>
                <div class="day-content">
                    ${releases.length > 0 ? 
                        releases.map(release => this.renderReleaseCard(release)).join('') :
                        '<div class="no-releases">Aucune sortie prévue</div>'
                    }
                </div>
            </div>
        `;
    }

    renderReleaseCard(release) {
        return `
            <div class="release-card" onclick="planningManager.openMangaDetails('${release.name}')">
                <div class="release-image">
                    <img src="${release.image || '/img/no-cover.png'}" 
                         alt="${release.name}" 
                         onerror="this.src='/img/no-cover.png'">
                </div>
                <div class="release-info">
                    <h4>${release.name}</h4>
                    <div class="release-details">
                        <span class="chapter">Chapitre ${release.chapter || 'TBD'}</span>
                        ${release.time ? `<span class="time">${release.time}</span>` : ''}
                        ${release.language ? `<span class="language">${release.language}</span>` : ''}
                    </div>
                    <div class="release-status status-${release.status}">${release.status}</div>
                </div>
            </div>
        `;
    }

    groupDataByDay(planningData) {
        return planningData.reduce((acc, item) => {
            const day = item.day || 'Autre';
            if (!acc[day]) {
                acc[day] = [];
            }
            acc[day].push(item);
            return acc;
        }, {});
    }

    openMangaDetails(mangaName) {
        window.location.href = `index.html?manga=${encodeURIComponent(mangaName)}`;
    }

    showLoading() {
        if (this.planningContainer) {
            this.planningContainer.innerHTML = `
                <div class="planning-header">
                    <h2>📅 Planning des Sorties Manga</h2>
                </div>
                <div class="loading-container">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Chargement du planning...</div>
                </div>
            `;
        }
    }

    showError(message) {
        if (this.planningContainer) {
            this.planningContainer.innerHTML = `
                <div class="planning-header">
                    <h2>📅 Planning des Sorties Manga</h2>
                </div>
                <div class="error-container">
                    <div style="color: #ff6b35; font-size: 1.2rem;">❌ Erreur</div>
                    <div class="error-text">${message}</div>
                </div>
            `;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Planning Manager...');
    window.planningManager = new PlanningManager();
});
