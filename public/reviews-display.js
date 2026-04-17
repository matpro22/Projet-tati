// Affichage des avis clients sur la page d'accueil
(function() {
    'use strict';

    // Déterminer l'URL de l'API backend
    const API_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000'
        : 'https://projet-tati.vercel.app';
    
    console.log('🔗 Reviews API URL:', API_URL);

    // Créer la section des avis
    function createReviewsSection() {
        const reviewsHTML = `
            <section id="reviews-section" class="reviews-section" style="background: var(--deep); padding: 6rem 4rem;">
                <div class="reviews-wrap" style="max-width: 1400px; margin: 0 auto;">
                    <h2 class="section-title reveal" style="text-align: center; font-family: 'Bebas Neue', sans-serif; font-size: 3rem; letter-spacing: 0.05em; margin-bottom: 1rem;">
                        ILS NOUS FONT<br/><span style="color: var(--green);">CONFIANCE</span>
                    </h2>
                    <p class="section-subtitle reveal" style="text-align: center; color: var(--gray); font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4rem;">
                        Les avis de nos clients
                    </p>
                    
                    <div id="reviews-container" class="reviews-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem;">
                        <!-- Les avis seront chargés ici -->
                    </div>
                    
                    <div id="reviews-loading" style="text-align: center; padding: 3rem; color: var(--gray);">
                        <div class="spinner" style="border: 3px solid var(--lg); border-top: 3px solid var(--green); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto;"></div>
                        <p style="margin-top: 1rem; font-family: 'Barlow Condensed', sans-serif; letter-spacing: 0.1em; text-transform: uppercase;">Chargement des avis...</p>
                    </div>
                    
                    <div id="reviews-empty" style="display: none; text-align: center; padding: 3rem; color: var(--gray);">
                        <p style="font-family: 'Barlow Condensed', sans-serif; font-size: 1.1rem; letter-spacing: 0.1em; text-transform: uppercase;">Aucun avis pour le moment</p>
                    </div>
                </div>
            </section>
        `;
        
        return reviewsHTML;
    }

    // Créer une carte d'avis
    function createReviewCard(review) {
        const stars = '⭐'.repeat(review.rating);
        const date = new Date(review.createdAt).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        return `
            <div class="review-card reveal" style="background: var(--card); border: 1px solid var(--lg); border-radius: 8px; padding: 2rem; transition: all 0.3s; position: relative; overflow: hidden;">
                <div class="review-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div>
                        <div class="review-stars" style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #ffd700;">
                            ${stars}
                        </div>
                        <div class="review-author" style="font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--white);">
                            ${escapeHtml(review.customerName)}
                        </div>
                    </div>
                    <div class="review-date" style="font-size: 0.75rem; color: var(--gray); font-family: 'Barlow Condensed', sans-serif; letter-spacing: 0.05em;">
                        ${date}
                    </div>
                </div>
                
                ${review.comment ? `
                    <div class="review-comment" style="color: var(--gray); line-height: 1.6; font-size: 0.95rem; margin-top: 1rem; font-family: 'Barlow', sans-serif;">
                        "${escapeHtml(review.comment)}"
                    </div>
                ` : ''}
                
                <div class="review-verified" style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--lg); font-size: 0.75rem; color: var(--green); font-family: 'Barlow Condensed', sans-serif; letter-spacing: 0.08em; text-transform: uppercase;">
                    ✓ Achat vérifié
                </div>
            </div>
        `;
    }

    // Échapper le HTML pour éviter les injections XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Charger et afficher les avis
    async function loadReviews() {
        const container = document.getElementById('reviews-container');
        const loading = document.getElementById('reviews-loading');
        const empty = document.getElementById('reviews-empty');
        
        if (!container) return;
        
        try {
            const response = await fetch(`${API_URL}/api/reviews`);
            
            if (!response.ok) {
                throw new Error('Erreur lors du chargement des avis');
            }
            
            const reviews = await response.json();
            
            loading.style.display = 'none';
            
            if (reviews.length === 0) {
                empty.style.display = 'block';
                return;
            }
            
            // Limiter à 6 avis maximum
            const displayReviews = reviews.slice(0, 6);
            
            container.innerHTML = displayReviews.map(review => createReviewCard(review)).join('');
            
            // Animer les cartes
            setTimeout(() => {
                const cards = container.querySelectorAll('.review-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        card.style.transition = 'all 0.5s ease';
                        
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    }, index * 100);
                });
            }, 100);
            
        } catch (error) {
            console.error('Erreur chargement avis:', error);
            loading.style.display = 'none';
            empty.style.display = 'block';
            empty.innerHTML = '<p style="font-family: \'Barlow Condensed\', sans-serif; font-size: 1rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray);">Erreur lors du chargement des avis</p>';
        }
    }

    // Injecter la section des avis avant le footer
    function injectReviewsSection() {
        const footer = document.querySelector('footer');
        
        if (footer) {
            const reviewsSection = document.createElement('div');
            reviewsSection.innerHTML = createReviewsSection();
            footer.parentNode.insertBefore(reviewsSection.firstElementChild, footer);
            
            // Charger les avis
            loadReviews();
        }
    }

    // Initialiser quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectReviewsSection);
    } else {
        injectReviewsSection();
    }

    // Ajouter les styles pour l'animation du spinner
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .review-card:hover {
            transform: translateY(-5px);
            border-color: var(--green);
            box-shadow: 0 10px 30px rgba(184, 255, 87, 0.1);
        }
    `;
    document.head.appendChild(style);

})();
