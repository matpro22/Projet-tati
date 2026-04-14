// ============================================================
// BACKZO FRONTEND - API CLIENT
// Ajoutez ce code dans votre fichier HTML (dans la section <script>)
// ============================================================

// Configuration de l'API
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://projet-tati.vercel.app:3000/api' 
  : '/api';

// ============================================================
// FONCTIONS PAIEMENT STRIPE
// ============================================================

async function placeOrderWithBackend() {
  const fn = document.getElementById('coFn').value.trim();
  const ln = document.getElementById('coLn').value.trim();
  const email = document.getElementById('coEmail').value.trim();
  const addr = document.getElementById('coAddr').value.trim();
  const city = document.getElementById('coCity').value.trim();
  const zip = document.getElementById('coZip').value.trim();
  
  if(!fn||!ln||!email||!addr||!city||!zip) { 
    showToast('Veuillez remplir tous les champs obligatoires', true); 
    return; 
  }
  
  const total = getCartTotal(); 
  const shipping = total >= state.settings.freeShippingFrom ? 0 : state.settings.shipping;
  const finalTotal = total + shipping;
  
  const btn = document.getElementById('coOrderBtn');
  btn.disabled = true;
  btn.textContent = 'Traitement en cours...';
  
  try {
    // Étape 1 : Créer un PaymentIntent sur le backend
    const intentResponse = await fetch(`${API_URL}/create-payment-intent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: finalTotal,
        currency: 'eur',
        metadata: {
          customer_name: `${fn} ${ln}`,
          customer_email: email
        }
      })
    });
    
    if (!intentResponse.ok) {
      throw new Error('Erreur création PaymentIntent');
    }
    
    const { clientSecret, paymentIntentId } = await intentResponse.json();
    
    // Étape 2 : Confirmer le paiement avec Stripe
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${fn} ${ln}`,
          email: email,
          address: {
            line1: addr,
            city: city,
            postal_code: zip
          }
        }
      }
    });
    
    if (error) {
      showToast(error.message, true);
      btn.disabled = false;
      btn.textContent = 'Confirmer & Payer';
      return;
    }
    
    // Étape 3 : Confirmer la commande sur le backend
    const orderResponse = await fetch(`${API_URL}/confirm-payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paymentIntentId: paymentIntent.id,
        orderData: {
          customer: {
            firstName: fn,
            lastName: ln,
            email: email,
            address: addr,
            city: city,
            zip: zip
          },
          items: state.cart,
          total: finalTotal,
          shipping: shipping
        }
      })
    });
    
    if (!orderResponse.ok) {
      throw new Error('Erreur confirmation commande');
    }
    
    const { order } = await orderResponse.json();
    
    // Succès !
    showToast('✓ Paiement confirmé !');
    
    // Vider le panier
    state.cart = [];
    saveCart();
    updateCartBadge();
    closeCheckout();
    
    // Afficher le succès
    document.getElementById('successTxt').textContent = 
      `Merci ${fn} ! Votre commande ${order.id} a été confirmée et payée. Un email de confirmation vous a été envoyé.`;
    document.getElementById('successOv').classList.add('open');
    
    // Recharger les stats admin si connecté
    if (state.adminAuth) {
      loadOrdersFromBackend();
    }
    
  } catch (err) {
    console.error('Erreur paiement:', err);
    showToast('Erreur lors du paiement. Veuillez réessayer.', true);
    btn.disabled = false;
    btn.textContent = 'Confirmer & Payer';
  }
}

// ============================================================
// FONCTIONS PRODUITS
// ============================================================

// Charger les produits depuis le backend
async function loadProductsFromBackend() {
  try {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) throw new Error('Erreur chargement produits');
    
    const products = await response.json();
    
    // Mettre à jour la variable PRODUCTS globale
    window.PRODUCTS = products;
    
    // Rafraîchir l'affichage si on est sur la page boutique
    const grid = document.getElementById('productsGrid');
    if (grid) {
      renderProducts('all');
    }
    
    return products;
  } catch (error) {
    console.error('Erreur chargement produits:', error);
    showToast('Erreur chargement des produits', true);
    return [];
  }
}

// Ajouter un produit (admin)
async function addProductToBackend(productData) {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) throw new Error('Erreur ajout produit');
    
    const { product } = await response.json();
    
    showToast('✓ Produit ajouté avec succès !');
    
    // Recharger les produits
    await loadProductsFromBackend();
    
    return product;
  } catch (error) {
    console.error('Erreur ajout produit:', error);
    showToast('Erreur lors de l\'ajout du produit', true);
    return null;
  }
}

// Modifier un produit (admin)
async function updateProductOnBackend(productId, updates) {
  try {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) throw new Error('Erreur modification produit');
    
    const { product } = await response.json();
    
    showToast('✓ Produit modifié avec succès !');
    
    // Recharger les produits
    await loadProductsFromBackend();
    
    return product;
  } catch (error) {
    console.error('Erreur modification produit:', error);
    showToast('Erreur lors de la modification', true);
    return null;
  }
}

// Supprimer un produit (admin)
async function deleteProductFromBackend(productId) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    return;
  }
  
  try {
    const response = await fetch(`${API_URL}/products/${productId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) throw new Error('Erreur suppression produit');
    
    showToast('✓ Produit supprimé avec succès !');
    
    // Recharger les produits
    await loadProductsFromBackend();
    
  } catch (error) {
    console.error('Erreur suppression produit:', error);
    showToast('Erreur lors de la suppression', true);
  }
}

// ============================================================
// FONCTIONS COMMANDES
// ============================================================

// Charger les commandes depuis le backend (admin)
async function loadOrdersFromBackend() {
  try {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) throw new Error('Erreur chargement commandes');
    
    const orders = await response.json();
    
    // Mettre à jour le state
    state.orders = orders;
    
    // Rafraîchir le dashboard
    renderAdminDashboard();
    
    return orders;
  } catch (error) {
    console.error('Erreur chargement commandes:', error);
    showToast('Erreur chargement des commandes', true);
    return [];
  }
}

// Mettre à jour le statut d'une commande (admin)
async function updateOrderStatusOnBackend(orderId, newStatus) {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    
    if (!response.ok) throw new Error('Erreur mise à jour statut');
    
    showToast('✓ Statut mis à jour');
    
    // Recharger les commandes
    await loadOrdersFromBackend();
    
  } catch (error) {
    console.error('Erreur mise à jour statut:', error);
    showToast('Erreur lors de la mise à jour', true);
  }
}

// ============================================================
// FONCTIONS STATS
// ============================================================

// Charger les statistiques (admin)
async function loadStatsFromBackend() {
  try {
    const response = await fetch(`${API_URL}/stats`);
    if (!response.ok) throw new Error('Erreur chargement stats');
    
    const stats = await response.json();
    
    // Mettre à jour le dashboard
    const scRevenue = document.getElementById('scRevenue');
    if (scRevenue) scRevenue.textContent = stats.totalRevenue.toFixed(2).replace('.', ',') + ' €';
    
    const scOrders = document.getElementById('scOrders');
    if (scOrders) scOrders.textContent = stats.totalOrders;
    
    return stats;
  } catch (error) {
    console.error('Erreur chargement stats:', error);
    return null;
  }
}

// ============================================================
// MODAL AJOUT PRODUIT
// ============================================================

function showAddProductModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-ov open';
  modal.innerHTML = `
    <div class="modal-box">
      <div class="modal-head">
        <div class="modal-tit">AJOUTER UN <span>PRODUIT</span></div>
        <button class="modal-cls" onclick="this.closest('.modal-ov').remove()">✕</button>
      </div>
      <div class="modal-body">
        <div style="display:flex;flex-direction:column;gap:1rem">
          <div>
            <label class="bz-lbl" for="newProdName">Nom du produit *</label>
            <input class="bz-inp" id="newProdName" type="text" placeholder="Ex: Pack Club 30 patchs" required/>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
            <div>
              <label class="bz-lbl" for="newProdPrice">Prix (€) *</label>
              <input class="bz-inp" id="newProdPrice" type="number" step="0.01" placeholder="12.00" required/>
            </div>
            <div>
              <label class="bz-lbl" for="newProdStock">Stock</label>
              <input class="bz-inp" id="newProdStock" type="number" placeholder="100"/>
            </div>
          </div>
          <div>
            <label class="bz-lbl" for="newProdCategory">Catégorie *</label>
            <select class="bz-sel" id="newProdCategory">
              <option value="particuliers">Particuliers</option>
              <option value="clubs">Clubs</option>
            </select>
          </div>
          <div>
            <label class="bz-lbl" for="newProdDesc">Description</label>
            <textarea class="bz-inp" id="newProdDesc" style="min-height:80px;resize:vertical" placeholder="Description du produit..."></textarea>
          </div>
          <button class="save-btn" onclick="submitNewProduct()">Ajouter le produit →</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

async function submitNewProduct() {
  const name = document.getElementById('newProdName').value.trim();
  const price = parseFloat(document.getElementById('newProdPrice').value);
  const stock = parseInt(document.getElementById('newProdStock').value) || 0;
  const category = document.getElementById('newProdCategory').value;
  const desc = document.getElementById('newProdDesc').value.trim();
  
  if (!name || !price || !category) {
    showToast('Veuillez remplir tous les champs obligatoires', true);
    return;
  }
  
  const product = await addProductToBackend({
    name,
    price,
    stock,
    category,
    desc
  });
  
  if (product) {
    document.querySelector('.modal-ov').remove();
    renderProductsTable();
  }
}

// ============================================================
// INITIALISATION
// ============================================================

// Charger les données au démarrage si admin connecté
document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si le backend est accessible
  fetch(`${API_URL}/health`)
    .then(res => res.json())
    .then(data => {
      console.log('✓ Backend connecté:', data);
    })
    .catch(err => {
      console.warn('⚠️ Backend non accessible. Mode local activé.');
    });
});
