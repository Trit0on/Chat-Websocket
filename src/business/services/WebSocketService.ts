import { MessageResponseDto, SendMessageDto } from '../dtos/MessageDto.js';
import { LoginDto } from '../dtos/AuthDto.js';

/**
 * WebSocket Service
 * Gère la communication WebSocket avec le backend
 */
export class WebSocketService {
    private ws: WebSocket | null = null;
    private accessToken: string | null = null;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectDelay: number = 3000;

    // Callbacks
    private onMessageCallback: ((message: MessageResponseDto) => void) | null = null;
    private onConnectedCallback: (() => void) | null = null;
    private onDisconnectedCallback: (() => void) | null = null;
    private onErrorCallback: ((error: string) => void) | null = null;

    constructor(private readonly serverUrl: string) {}

    /**
     * Connecte au serveur WebSocket avec un token d'accès
     */
    public connect(loginDto: LoginDto): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.accessToken = loginDto.accessToken;

                // Ajout du token dans l'URL ou les headers (selon votre backend .NET)
                const url = `${this.serverUrl}?token=${encodeURIComponent(loginDto.accessToken)}`;
                this.ws = new WebSocket(url);

                this.ws.onopen = () => {
                    console.log('WebSocket connecté');
                    this.reconnectAttempts = 0;

                    // Envoie les informations de login
                    this.send({
                        type: 'login',
                        pseudo: loginDto.pseudo,
                        accessToken: loginDto.accessToken
                    });

                    if (this.onConnectedCallback) {
                        this.onConnectedCallback();
                    }
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    this.handleMessage(event.data);
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket erreur:', error);
                    const errorMsg = 'Erreur de connexion WebSocket';
                    if (this.onErrorCallback) {
                        this.onErrorCallback(errorMsg);
                    }
                    reject(new Error(errorMsg));
                };

                this.ws.onclose = () => {
                    console.log('WebSocket déconnecté');
                    if (this.onDisconnectedCallback) {
                        this.onDisconnectedCallback();
                    }
                    this.attemptReconnect(loginDto);
                };

            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Envoie un message via WebSocket
     */
    public sendMessage(messageDto: SendMessageDto): void {
        if (!this.isConnected()) {
            throw new Error('WebSocket non connecté');
        }

        const payload = {
            type: 'message',
            ...messageDto
        };

        this.send(payload);
    }

    /**
     * Déconnecte du serveur WebSocket
     */
    public disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.accessToken = null;
        this.reconnectAttempts = this.maxReconnectAttempts; // Empêche la reconnexion
    }

    /**
     * Vérifie si le WebSocket est connecté
     */
    public isConnected(): boolean {
        return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
    }

    /**
     * Enregistre le callback pour les nouveaux messages
     */
    public onMessage(callback: (message: MessageResponseDto) => void): void {
        this.onMessageCallback = callback;
    }

    /**
     * Enregistre le callback pour la connexion
     */
    public onConnected(callback: () => void): void {
        this.onConnectedCallback = callback;
    }

    /**
     * Enregistre le callback pour la déconnexion
     */
    public onDisconnected(callback: () => void): void {
        this.onDisconnectedCallback = callback;
    }

    /**
     * Enregistre le callback pour les erreurs
     */
    public onError(callback: (error: string) => void): void {
        this.onErrorCallback = callback;
    }

    /**
     * Gère les messages reçus du serveur
     */
    private handleMessage(data: string): void {
        try {
            const message: MessageResponseDto = JSON.parse(data);

            if (this.onMessageCallback) {
                this.onMessageCallback(message);
            }
        } catch (error) {
            console.error('Erreur lors du parsing du message:', error);
        }
    }

    /**
     * Envoie des données via WebSocket
     */
    private send(data: any): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }

    /**
     * Tente une reconnexion automatique
     */
    private attemptReconnect(loginDto: LoginDto): void {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);

            setTimeout(() => {
                this.connect(loginDto).catch(error => {
                    console.error('Échec de la reconnexion:', error);
                });
            }, this.reconnectDelay);
        }
    }
}

