const axios = require('axios');
const moment = require('moment'); 

class PudoTokenManager {
    static instance = null;

    #accessToken = null;
    #expiresAt = null; 
    
    #EXPIRATION_BUFFER = 300;

    #AUTH_URL = process.env.NODE_ENV === 'production' 
        ? 'https://ecommerceapipudo.azurewebsites.net/api/token' 
        : 'https://ecommerceapipudo-sandbox.azurewebsites.net/api/token';

    constructor() {
        if (PudoTokenManager.instance) {
            return PudoTokenManager.instance;
        }
        PudoTokenManager.instance = this;
    }

    #isTokenExpiredOrNearingExpiration() {
        if (!this.#accessToken || !this.#expiresAt) {
            return true;
        }

        const checkTime = moment().add(this.#EXPIRATION_BUFFER, 'seconds');
        
        return this.#expiresAt.isBefore(checkTime);
    }

    async #fetchNewToken() {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', process.env.PUDO_CLIENT_ID);
        params.append('client_secret', process.env.PUDO_CLIENT_SECRET);
        
        try {
            const response = await axios.post(
                this.#AUTH_URL,
                params, 
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
            );

            const { access_token, expires_in } = response.data;

            this.#accessToken = access_token;
            this.#expiresAt = moment().add(expires_in, 'seconds');

            return access_token;
        } catch (err) {
            console.error('❌ ERROR al obtener token de PUDO:', err.response?.data || err.message);
            throw new Error('PUDO Auth Failed'); 
        }
    }

    async getValidToken() {
        if (this.#isTokenExpiredOrNearingExpiration()) {
            await this.#fetchNewToken();
        }
        
        return this.#accessToken;
    }
}

module.exports = new PudoTokenManager();