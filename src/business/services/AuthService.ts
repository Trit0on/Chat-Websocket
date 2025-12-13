/**
 * Auth Service
 * Gère l'authentification et la persistance du token JWT
 */
export class AuthService {

    private static readonly TOKEN_KEY = 'jwt_access_token';

    /**
     * Sauvegarde le token JWT dans le localStorage
     */
    public saveToken(token: string): void {
        try {
            localStorage.setItem(AuthService.TOKEN_KEY, token);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du token:', error);
            throw new Error('Impossible de sauvegarder le token');
        }
    }

    /**
     * Supprime le token JWT du localStorage
     */
    public clearToken(): void {
        try {
            localStorage.removeItem(AuthService.TOKEN_KEY);
        } catch (error) {
            console.error('Erreur lors de la suppression du token:', error);
        }
    }

    static getToken() {
        return localStorage.getItem(AuthService.TOKEN_KEY);
    }
}