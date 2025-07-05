/**
 * Planning Module for Manga Release Schedule
 */

const API_URL = 'https://api.saumondeluxe.com';

class PlanningManager {
    constructor() {
        this.currentDate = new Date();
        this.currentView = 'week';
        this.planningData = [];
        this.initializeElements();
        this.bindEvents();
        this.loadPlanning();
    }

    initializeElements() {
        this.calendarGrid = document.getElementById('calendarGrid');
        this.currentDateElement = document.getElementById('currentDate');
        this.releasesListElement = document.getElementById('releasesList');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.viewToggleButtons = document.querySelectorAll('.view-toggle');
        
        // Debug: Log which elements are found
        console.log('Planning elements initialized:', {
            calendarGrid: !!this.calendarGrid,
            currentDateElement: !!this.currentDateElement,
            releasesListElement: !!this.releasesListElement,
            prevBtn: !!this.prevBtn,
            nextBtn: !!this.nextBtn,
            viewToggleButtons: this.viewToggleButtons.length
        });
    }

    bindEvents() {
        // Navigation buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.navigateDate(-1));
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.navigateDate(1));
        }

        // View toggle buttons
        this.viewToggleButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentView = e.target.dataset.view;
                this.updateViewToggle();
                this.renderCalendar();
            });
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
                // Utiliser des données de test si l'API n'est pas disponible
                data = this.getMockPlanningData();
            }
            this.planningData = data || [];
            this.renderCalendar();
            this.renderUpcomingReleases();
        } catch (error) {
            console.error('Error loading planning:', error);
            this.showError('Impossible de charger le planning');
        } finally {
            this.hideLoading();
        }
    }

    getMockPlanningData() {
        const today = new Date();
        const mockData = [];
        
        // Créer quelques sorties de test pour les prochains jours
        for (let i = 0; i < 10; i++) {
            const releaseDate = new Date(today);
            releaseDate.setDate(today.getDate() + Math.floor(Math.random() * 14)); // Dans les 2 prochaines semaines
            
            mockData.push({
                name: `Manga Test ${i + 1}`,
                chapter: Math.floor(Math.random() * 100) + 1,
                date: releaseDate.toISOString(),
                image: '/img/no-cover.png',
                day: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'][releaseDate.getDay()],
                status: 'active'
            });
        }
        
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

    renderCalendar() {
        if (!this.calendarGrid) {
            console.warn('Calendar grid element not found');
            return;
        }

        this.updateCurrentDateDisplay();
        
        if (this.currentView === 'week') {
            this.renderWeekView();
        } else {
            this.renderMonthView();
        }
    }

    renderWeekView() {
        const startOfWeek = this.getStartOfWeek(this.currentDate);
        const days = [];
        
        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push(day);
        }

        this.calendarGrid.innerHTML = days.map(day => this.renderDay(day)).join('');
    }

    renderMonthView() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = this.getStartOfWeek(firstDay);
        
        const days = [];
        const totalDays = 42; // 6 weeks * 7 days
        
        for (let i = 0; i < totalDays; i++) {
            const day = new Date(startDate);
            day.setDate(startDate.getDate() + i);
            days.push(day);
        }

        this.calendarGrid.innerHTML = days.map(day => this.renderDay(day, month)).join('');
    }

    renderDay(date, currentMonth = null) {
        const isToday = this.isToday(date);
        const isOtherMonth = currentMonth !== null && date.getMonth() !== currentMonth;
        const dayReleases = this.getReleasesByDate(date);

        return `
            <div class="calendar-day ${isToday ? 'today' : ''} ${isOtherMonth ? 'other-month' : ''}">
                <div class="day-number">${date.getDate()}</div>
                ${dayReleases.map(release => this.renderReleaseItem(release)).join('')}
            </div>
        `;
    }

    renderReleaseItem(release) {
        return `
            <div class="release-item" onclick="planningManager.openMangaDetails('${release.name}')">
                <span class="release-title">${release.name}</span>
                <span class="release-chapter">Ch. ${release.chapter || 'TBD'}</span>
            </div>
        `;
    }

    renderUpcomingReleases() {
        if (!this.releasesListElement) {
            console.warn('Releases list element not found');
            return;
        }

        const upcomingReleases = this.getUpcomingReleases();
        
        if (upcomingReleases.length === 0) {
            this.releasesListElement.innerHTML = `
                <div class="planning-empty">
                    <h3>Aucune sortie prévue</h3>
                    <p>Aucune nouvelle sortie dans les prochains jours</p>
                </div>
            `;
            return;
        }

        this.releasesListElement.innerHTML = upcomingReleases.map(release => `
            <div class="upcoming-release" onclick="planningManager.openMangaDetails('${release.name}')">
                <div class="release-info">
                    <img src="${release.image || '/img/no-cover.png'}" 
                         alt="${release.name}" 
                         class="release-cover"
                         onerror="this.src='/img/no-cover.png'">
                    <div class="release-details">
                        <h4>${release.name}</h4>
                        <div class="release-chapter-info">Chapitre ${release.chapter || 'TBD'}</div>
                        <div class="release-date">${this.formatDate(release.date)}</div>
                    </div>
                </div>
                <div class="release-countdown">
                    ${this.getCountdown(release.date)}
                </div>
            </div>
        `).join('');
    }

    // Helper methods
    getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
        return new Date(d.setDate(diff));
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    getReleasesByDate(date) {
        return this.planningData.filter(release => {
            if (!release.date) return false;
            const releaseDate = new Date(release.date);
            return releaseDate.toDateString() === date.toDateString();
        });
    }

    getUpcomingReleases() {
        const now = new Date();
        const weekFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
        
        return this.planningData
            .filter(release => {
                if (!release.date) return false;
                const releaseDate = new Date(release.date);
                return releaseDate >= now && releaseDate <= weekFromNow;
            })
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 6); // Limit to 6 releases
    }

    navigateDate(direction) {
        if (this.currentView === 'week') {
            this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
        } else {
            this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        }
        this.renderCalendar();
    }

    updateCurrentDateDisplay() {
        if (!this.currentDateElement) return;

        const options = { 
            year: 'numeric', 
            month: 'long',
            ...(this.currentView === 'week' ? { day: 'numeric' } : {})
        };
        
        this.currentDateElement.textContent = this.currentDate.toLocaleDateString('fr-FR', options);
    }

    updateViewToggle() {
        this.viewToggleButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === this.currentView);
        });
    }

    formatDate(dateString) {
        if (!dateString) return 'Date inconnue';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    getCountdown(dateString) {
        if (!dateString) return 'Date inconnue';
        
        const releaseDate = new Date(dateString);
        const now = new Date();
        const diff = releaseDate - now;
        
        if (diff < 0) return 'Disponible';
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        
        if (days > 0) {
            return `Dans ${days} jour${days > 1 ? 's' : ''}`;
        } else if (hours > 0) {
            return `Dans ${hours} heure${hours > 1 ? 's' : ''}`;
        } else {
            return 'Bientôt disponible';
        }
    }

    openMangaDetails(mangaName) {
        // Navigate to manga details page
        window.location.href = `index.html?manga=${encodeURIComponent(mangaName)}`;
    }

    showLoading() {
        if (this.calendarGrid) {
            this.calendarGrid.innerHTML = `
                <div class="calendar-loading">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Chargement du planning...</div>
                </div>
            `;
        }
        
        if (this.releasesListElement) {
            this.releasesListElement.innerHTML = `
                <div class="calendar-loading">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">Chargement des sorties...</div>
                </div>
            `;
        }
    }

    hideLoading() {
        // Loading will be hidden when content is rendered
    }

    showError(message) {
        if (this.calendarGrid) {
            this.calendarGrid.innerHTML = `
                <div class="calendar-loading">
                    <div style="color: #ff6b35; font-size: 1.2rem;">❌ Erreur</div>
                    <div class="loading-text">${message}</div>
                </div>
            `;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier que nous sommes sur la page de planning
    const planningHeader = document.querySelector('.planning-header');
    if (planningHeader) {
        console.log('Initializing Planning Manager...');
        window.planningManager = new PlanningManager();
    } else {
        console.log('Planning elements not found - not on planning page');
    }
});

// Legacy function for compatibility
async function fetchPlanning() {
    const response = await fetch(`${API_URL}/scans/planning`);
    if (!response.ok) {
        throw new Error('Failed to fetch planning data');
    }
    const data = await response.json();
    return data.planning;
}
