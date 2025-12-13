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
 * DTO pour l'envoi d'un message (pattern WebSocket basique)
 */
export interface SendMessageDto {
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

