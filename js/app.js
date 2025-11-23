/**
 * API Client para el Sistema de Gestión de Bebidas
 * Maneja todas las comunicaciones con el servidor backend
 */

class ApiClient {
    constructor(baseUrl = 'http://localhost:3000/api') {
        this.baseUrl = baseUrl;
        this.token = localStorage.getItem('authToken');
    }

    // Configurar headers para las peticiones
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    // Manejar errores de respuesta
    handleResponse(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    // ===== AUTENTICACIÓN =====
    async login(username, password) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ username, password })
            });
            
            const data = await this.handleResponse(response);
            
            if (data.success) {
                this.token = data.token;
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
            }
            
            return data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    async logout() {
        try {
            const response = await fetch(`${this.baseUrl}/auth/logout`, {
                method: 'POST',
                headers: this.getHeaders()
            });
            
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            this.token = null;
            
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error en logout:', error);
            throw error;
        }
    }

    // ===== ARTÍCULOS =====
    async getArticles() {
        try {
            const response = await fetch(`${this.baseUrl}/articles`, {
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo artículos:', error);
            throw error;
        }
    }

    async getArticle(id) {
        try {
            const response = await fetch(`${this.baseUrl}/articles/${id}`, {
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo artículo:', error);
            throw error;
        }
    }

    async createArticle(articleData) {
        try {
            const response = await fetch(`${this.baseUrl}/articles`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(articleData)
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error creando artículo:', error);
            throw error;
        }
    }

    async updateArticle(id, articleData) {
        try {
            const response = await fetch(`${this.baseUrl}/articles/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(articleData)
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error actualizando artículo:', error);
            throw error;
        }
    }

    async deleteArticle(id) {
        try {
            const response = await fetch(`${this.baseUrl}/articles/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error eliminando artículo:', error);
            throw error;
        }
    }

    // ===== PROVEEDORES =====
    async getProviders() {
        try {
            const response = await fetch(`${this.baseUrl}/providers`, {
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo proveedores:', error);
            throw error;
        }
    }

    async getProvider(id) {
        try {
            const response = await fetch(`${this.baseUrl}/providers/${id}`, {
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo proveedor:', error);
            throw error;
        }
    }

    async createProvider(providerData) {
        try {
            const response = await fetch(`${this.baseUrl}/providers`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(providerData)
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error creando proveedor:', error);
            throw error;
        }
    }

    async updateProvider(id, providerData) {
        try {
            const response = await fetch(`${this.baseUrl}/providers/${id}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(providerData)
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error actualizando proveedor:', error);
            throw error;
        }
    }

    async deleteProvider(id) {
        try {
            const response = await fetch(`${this.baseUrl}/providers/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error eliminando proveedor:', error);
            throw error;
        }
    }

    // ===== VENTAS =====
    async getSales() {
        try {
            const response = await fetch(`${this.baseUrl}/sales`, {
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo ventas:', error);
            throw error;
        }
    }

    async createSale(saleData) {
        try {
            const response = await fetch(`${this.baseUrl}/sales`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(saleData)
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error creando venta:', error);
            throw error;
        }
    }

    async deleteSale(id) {
        try {
            const response = await fetch(`${this.baseUrl}/sales/${id}`, {
                method: 'DELETE',
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error eliminando venta:', error);
            throw error;
        }
    }

    // ===== STOCK =====
    async getStock() {
        try {
            const response = await fetch(`${this.baseUrl}/stock`, {
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo stock:', error);
            throw error;
        }
    }

    async getStockMovements() {
        try {
            const response = await fetch(`${this.baseUrl}/stock/movements`, {
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo movimientos de stock:', error);
            throw error;
        }
    }

    async createStockMovement(movementData) {
        try {
            const response = await fetch(`${this.baseUrl}/stock/movements`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(movementData)
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error creando movimiento de stock:', error);
            throw error;
        }
    }

    // ===== REPORTES =====
    async getSalesReport(params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`${this.baseUrl}/reports/sales?${queryString}`, {
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo reporte de ventas:', error);
            throw error;
        }
    }

    async getDashboardStats() {
        try {
            const response = await fetch(`${this.baseUrl}/dashboard/stats`, {
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo estadísticas del dashboard:', error);
            throw error;
        }
    }

    // ===== SHAREPOINT =====
    async getSharePointArticles() {
        try {
            const response = await fetch(`${this.baseUrl}/sharepoint/articles`, {
                headers: this.getHeaders()
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo artículos de SharePoint:', error);
            throw error;
        }
    }

    async createSharePointArticle(articleData) {
        try {
            const response = await fetch(`${this.baseUrl}/sharepoint/articles`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(articleData)
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error creando artículo en SharePoint:', error);
            throw error;
        }
    }

    // ===== UTILIDADES =====
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error en health check:', error);
            throw error;
        }
    }

    // Exportar datos a CSV
    exportToCSV(data, filename) {
        if (!data || data.length === 0) {
            console.error('No hay datos para exportar');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row => headers.map(header => `"${row[header]}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Crear instancia global del cliente API
const apiClient = new ApiClient();

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiClient;
}

// Funciones auxiliares para notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Función para manejar errores de API
function handleApiError(error) {
    console.error('Error de API:', error);
    showNotification('Error de conexión con el servidor', 'error');
}

// Función para mostrar indicador de carga
function showLoading() {
    const loading = document.createElement('div');
    loading.id = 'api-loading';
    loading.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    loading.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Cargando...';
    
    document.body.appendChild(loading);
}

function hideLoading() {
    const loading = document.getElementById('api-loading');
    if (loading) {
        loading.remove();
    }
}