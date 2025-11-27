import { Message } from '../models/Message';
import { User } from '../models/User';
import { MessageResponseDto, SendMessageDto } from '../dtos/MessageDto';
import { LoginDto } from '../dtos/AuthDto';
import { WebSocketService } from './WebSocketService';

/**
 * Chat Service
 * Gère la logique métier du chat
 */
export class ChatService {
    private webSocketService: WebSocketService;
    private currentUser: User | null = null;
    private messages: Message[] = [];

    // Callbacks pour l'UI
    private onNewMessageCallback: ((message: Message) => void) | null = null;
    private onConnectionStatusCallback: ((connected: boolean) => void) | null = null;
    private onErrorCallback: ((error: string) => void) | null = null;

    constructor(serverUrl: string) {
        this.webSocketService = new WebSocketService(serverUrl);
        this.setupWebSocketListeners();
    }

    /**
     * Connecte l'utilisateur au chat
     */
    public async login(accessToken: string, pseudo: string): Promise<void> {
        try {
            const loginDto: LoginDto = {
                accessToken,
                pseudo
            };

            await this.webSocketService.connect(loginDto);

            // Crée l'utilisateur actuel
            this.currentUser = new User(
                this.generateUserId(),
                pseudo,
                accessToken
            );

        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Erreur de connexion';
            if (this.onErrorCallback) {
                this.onErrorCallback(errorMsg);
            }
            throw error;
        }
    }

    /**
     * Envoie un message dans le chat
     */
    public sendMessage(content: string): void {
        if (!this.currentUser) {
            throw new Error('Utilisateur non connecté');
        }

        if (!content.trim()) {
            throw new Error('Le message ne peut pas être vide');
        }

        const messageDto: SendMessageDto = {
            pseudo: this.currentUser.pseudo,
            message: content
        };

        this.webSocketService.sendMessage(messageDto);
    }

    /**
     * Déconnecte l'utilisateur du chat
     */
    public logout(): void {
        this.webSocketService.disconnect();
        this.currentUser = null;
        this.messages = [];
    }

    /**
     * Récupère l'utilisateur actuel
     */
    public getCurrentUser(): User | null {
        return this.currentUser;
    }

    /**
     * Récupère tous les messages
     */
    public getMessages(): Message[] {
        return [...this.messages];
    }

    /**
     * Vérifie si l'utilisateur est connecté
     */
    public isConnected(): boolean {
        return this.webSocketService.isConnected() && this.currentUser !== null;
    }

    /**
     * Enregistre le callback pour les nouveaux messages
     */
    public onNewMessage(callback: (message: Message) => void): void {
        this.onNewMessageCallback = callback;
    }

    /**
     * Enregistre le callback pour le statut de connexion
     */
    public onConnectionStatus(callback: (connected: boolean) => void): void {
        this.onConnectionStatusCallback = callback;
    }

    /**
     * Enregistre le callback pour les erreurs
     */
    public onError(callback: (error: string) => void): void {
        this.onErrorCallback = callback;
    }

    /**
     * Configure les listeners du WebSocketService
     */
    private setupWebSocketListeners(): void {
        this.webSocketService.onMessage((messageDto: MessageResponseDto) => {
            const message = this.convertDtoToMessage(messageDto);
            this.messages.push(message);

            if (this.onNewMessageCallback) {
                this.onNewMessageCallback(message);
            }
        });

        this.webSocketService.onConnected(() => {
            if (this.onConnectionStatusCallback) {
                this.onConnectionStatusCallback(true);
            }
        });

        this.webSocketService.onDisconnected(() => {
            if (this.onConnectionStatusCallback) {
                this.onConnectionStatusCallback(false);
            }
        });

        this.webSocketService.onError((error: string) => {
            if (this.onErrorCallback) {
                this.onErrorCallback(error);
            }
        });
    }

    /**
     * Convertit un DTO en modèle Message
     */
    private convertDtoToMessage(dto: MessageResponseDto): Message {
        return new Message(
            dto.id,
            dto.pseudo,
            dto.message,
            dto.timestamp ? new Date(dto.timestamp) : new Date(),
            dto.userId
        );
    }

    /**
     * Génère un ID utilisateur temporaire
     */
    private generateUserId(): string {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}

