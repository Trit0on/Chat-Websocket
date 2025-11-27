/**
 * Authentication DTOs
 * Utilisés pour l'authentification et la gestion des tokens
 */

/**
 * DTO pour la connexion
 */
export interface LoginDto {
    accessToken: string;
    pseudo: string;
}

/**
 * DTO pour la réponse de connexion
 */
export interface LoginResponseDto {
    success: boolean;
    userId?: string;
    pseudo?: string;
    message?: string;
}

/**
 * DTO pour la déconnexion
 */
export interface LogoutDto {
    userId: string;
    reason?: string;
}

