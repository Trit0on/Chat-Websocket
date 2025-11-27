/**
 * Message DTO
 * Utilisé pour la communication avec le backend
 */
export interface MessageDto {
    id?: string;
    pseudo: string;
    message: string;
    timestamp?: string;
    userId?: string;
}

/**
 * DTO pour l'envoi d'un message
 */
export interface SendMessageDto {
    pseudo: string;
    message: string;
}

/**
 * DTO pour la réponse du serveur
 */
export interface MessageResponseDto {
    id: string;
    pseudo: string;
    message: string;
    timestamp: string;
    userId?: string;
    type?: 'message' | 'system' | 'welcome' | 'leave';
}

