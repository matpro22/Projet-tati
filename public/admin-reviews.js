// ============================================================
// GESTION DES AVIS CLIENTS - ADMIN
// ============================================================

// Charger les avis
async function refreshReviews() {
    showToast('🔄 Chargement des avis...');
    
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            showToast('Session expirée', true);
            adminLogout();
            return;
        }
        
        const response = await fetch('/api/admin/reviews', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des avis');
        }
        
        const reviews = await response.json();
        
        // Mettre à jour les statistiques
        updateReviewsStats(reviews);
        
        // Afficher les avis dans le tableau
        displayReviewsTable(reviews);
        
        showToast(`✓ ${reviews.length} avis chargés`);
        
    } catch (error) {
        console.error('Erreur chargement avis:', error);
        showToast('Erreur lors du chargement des avis', true);
    }
}

// Mettre à jour les statistiques des avis
function updateReviewsStats(reviews) {
    const total = reviews.length;
    const pending = reviews.filter(r => !r.approved).length;
    const approved = reviews.filter(r => r.approved).length;
    
    // Calculer la note moyenne
    let average = '—';
    if (approved > 0) {
        const sum = reviews.filter(r => r.approved).reduce((acc, r) => acc + r.rating, 0);
        average = (sum / approved).toFixed(1) + ' ⭐';
    }
    
    document.getElementById('reviewsTotal').textContent = total;
    document.getElementById('reviewsPending').textContent = pending;
    document.getElementById('reviewsApproved').textContent = approved;
    document.getElementById('reviewsAverage').textContent = average;
}

// Afficher les avis dans le tableau
function displayReviewsTable(reviews) {
    const tbody = document.getElementById('reviewsTableBody');
    
    if (reviews.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="color:var(--gray);text-align:center;padding:2rem">Aucun avis pour le moment</td></tr>';
        return;
    }
    
    tbody.innerHTML = reviews.map(review => {
        const date = new Date(review.createdAt).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        const stars = '⭐'.repeat(review.rating);
        const statusBadge = review.approved 
            ? '<span style="color:var(--green);font-weight:700">✓ Approuvé</span>'
            : '<span style="color:var(--orange);font-weight:700">⏳ En attente</span>';
        
        const comment = review.comment 
            ? (review.comment.length > 50 ? review.comment.substring(0, 50) + '...' : review.comment)
            : '<em style="color:var(--gray)">Pas de commentaire</em>';
        
        return `
            <tr>
                <td style="font-weight:600">${escapeHtml(review.customerName)}</td>
                <td style="font-size:1.2rem">${stars}</td>
                <td style="max-width:300px">${comment}</td>
                <td style="font-family:monospace;font-size:0.85rem">${review.orderId}</td>
                <td style="color:var(--gray);font-size:0.85rem">${date}</td>
                <td>${statusBadge}</td>
                <td>
                    <div style="display:flex;gap:0.5rem">
                        ${!review.approved ? `
                            <button class="admin-action-btn" onclick="approveReview('${review.id}')" style="background:var(--green);color:var(--black)" title="Approuver">
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                            </button>
                        ` : ''}
                        <button class="admin-action-btn" onclick="deleteReview('${review.id}')" style="background:var(--red)" title="Supprimer">
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Approuver un avis
async function approveReview(reviewId) {
    if (!confirm('Approuver cet avis ? Il sera visible sur la page d\'accueil.')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            showToast('Session expirée', true);
            adminLogout();
            return;
        }
        
        const response = await fetch(`/api/admin/reviews/${reviewId}/approve`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de l\'approbation');
        }
        
        showToast('✓ Avis approuvé avec succès');
        refreshReviews();
        
    } catch (error) {
        console.error('Erreur approbation avis:', error);
        showToast('Erreur lors de l\'approbation', true);
    }
}

// Supprimer un avis
async function deleteReview(reviewId) {
    if (!confirm('Supprimer définitivement cet avis ?')) {
        return;
    }
    
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            showToast('Session expirée', true);
            adminLogout();
            return;
        }
        
        const response = await fetch(`/api/admin/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression');
        }
        
        showToast('✓ Avis supprimé avec succès');
        refreshReviews();
        
    } catch (error) {
        console.error('Erreur suppression avis:', error);
        showToast('Erreur lors de la suppression', true);
    }
}

// Charger les paramètres des avis
async function loadReviewSettings() {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) return;
        
        const response = await fetch('/api/admin/reviews/settings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des paramètres');
        }
        
        const settings = await response.json();
        
        // Appliquer les paramètres aux contrôles
        document.getElementById('togReviewAutoApprove').checked = settings.autoApprove || false;
        document.getElementById('togReviewShowHome').checked = settings.showOnHomepage !== false;
        document.getElementById('togReviewRequireOrder').checked = settings.requireOrder !== false;
        document.getElementById('reviewMinRating').value = settings.minRating || 1;
        document.getElementById('reviewMaxReviews').value = settings.maxReviews || 50;
        
    } catch (error) {
        console.error('Erreur chargement paramètres avis:', error);
    }
}

// Sauvegarder les paramètres des avis
async function saveReviewSettings() {
    try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            showToast('Session expirée', true);
            adminLogout();
            return;
        }
        
        const settings = {
            autoApprove: document.getElementById('togReviewAutoApprove').checked,
            showOnHomepage: document.getElementById('togReviewShowHome').checked,
            requireOrder: document.getElementById('togReviewRequireOrder').checked,
            minRating: parseInt(document.getElementById('reviewMinRating').value),
            maxReviews: parseInt(document.getElementById('reviewMaxReviews').value)
        };
        
        const response = await fetch('/api/admin/reviews/settings', {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(settings)
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la sauvegarde');
        }
        
        showToast('✓ Paramètres sauvegardés avec succès');
        
    } catch (error) {
        console.error('Erreur sauvegarde paramètres:', error);
        showToast('Erreur lors de la sauvegarde', true);
    }
}

// Échapper le HTML pour éviter les injections XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Charger les avis quand l'onglet est activé
document.addEventListener('DOMContentLoaded', function() {
    // Observer les changements d'onglet
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.id === 'tab-reviews' && mutation.target.style.display !== 'none') {
                refreshReviews();
                loadReviewSettings();
            }
        });
    });
    
    const reviewsTab = document.getElementById('tab-reviews');
    if (reviewsTab) {
        observer.observe(reviewsTab, { attributes: true, attributeFilter: ['style'] });
    }
});
