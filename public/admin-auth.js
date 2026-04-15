// ============================================================
// SYSTÈME D'AUTHENTIFICATION ADMIN SÉCURISÉ
// ============================================================

class AdminAuth {
  constructor() {
    this.token = localStorage.getItem('adminToken');
    this.tokenExpiry = localStorage.getItem('adminTokenExpiry');
  }

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated() {
    if (!this.token || !this.tokenExpiry) {
      return false;
    }

    // Vérifier si le token n'est pas expiré
    const now = Date.now();
    if (now > parseInt(this.tokenExpiry)) {
      this.logout();
      return false;
    }

    return true;
  }

  // Connexion admin
  async login(username, password) {
    try {
      const response = await fetch(`${API_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur de connexion');
      }

      // Stocker le token et sa date d'expiration
      this.token = data.token;
      const expiryTime = Date.now() + (data.expiresIn * 1000);
      this.tokenExpiry = expiryTime.toString();

      localStorage.setItem('adminToken', this.token);
      localStorage.setItem('adminTokenExpiry', this.tokenExpiry);

      return { success: true };

    } catch (error) {
      console.error('Erreur login:', error);
      return { success: false, error: error.message };
    }
  }

  // Déconnexion
  logout() {
    this.token = null;
    this.tokenExpiry = null;
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTokenExpiry');
  }

  // Obtenir le token pour les requêtes API
  getToken() {
    return this.token;
  }

  // Vérifier le token auprès du serveur
  async verifyToken() {
    if (!this.token) {
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        this.logout();
        return false;
      }

      return true;

    } catch (error) {
      console.error('Erreur vérification token:', error);
      this.logout();
      return false;
    }
  }

  // Faire une requête API authentifiée
  async authenticatedFetch(url, options = {}) {
    if (!this.isAuthenticated()) {
      throw new Error('Non authentifié');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${this.token}`
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    // Si le token est invalide, déconnecter
    if (response.status === 401 || response.status === 403) {
      this.logout();
      throw new Error('Session expirée, veuillez vous reconnecter');
    }

    return response;
  }
}

// Instance globale
const adminAuth = new AdminAuth();
