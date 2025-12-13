import { MessageResponseDto, SendMessageDto } from '../dtos/MessageDto.js';
import { WsTicketResponseDto } from '../dtos/AuthDto.js';
import { AuthService } from './AuthService';

/**
 * WebSocket Service
 * Gère la communication WebSocket avec le backend
 */
export class WebSocketService {
    private ws: WebSocket | null = null;

    // Callbacks
    private onMessageCallback: ((message: MessageResponseDto) => void) | null = null;
    private onConnectedCallback: (() => void) | null = null;
    private onErrorCallback: ((error: string) => void) | null = null;

    constructor(private readonly serverUrl: string) {}

    /**
     * Connecte au serveur WebSocket avec un token d'accès
     * Utilise le pattern ticket pour une sécurité renforcée
     */
    public async connect(): Promise<void> {
        try {

            const accessToken = AuthService.getToken();

            // Étape 1 : Récupération du ticket temporaire
            const ticket = await this.fetchWebSocketTicket(accessToken!);

            // Étape 2 : Connexion WebSocket avec le ticket
            await this.connectWithTicket(ticket);

        } catch (error) {
            console.error('Erreur lors de la connexion WebSocket:', error);
            if (this.onErrorCallback) {
                this.onErrorCallback(error instanceof Error ? error.message : 'Erreur de connexion');
            }
            throw error;
        }
    }

    /**
     * Étape 1 : Récupère un ticket temporaire pour la connexion WebSocket
     */
    private async fetchWebSocketTicket(accessToken: string): Promise<string> {
        try {
            const response = await fetch(`${this.serverUrl}/public/ws-ticket`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    throw new Error('Authentication failed. Please login again.');
                }
                throw new Error(`Failed to fetch WebSocket ticket: ${response.status} ${response.statusText}`);
            }

            const data: WsTicketResponseDto = await response.json();

            if (!data.ticket) {
                throw new Error('Invalid ticket response: missing ticket property');
            }

            console.log('Ticket WebSocket récupéré avec succès');
            return data.ticket;

        } catch (error) {
            console.error('Erreur lors de la récupération du ticket:', error);
            throw error;
        }
    }

    /**
     * Étape 2 : Établit la connexion WebSocket avec le ticket
     */
    private connectWithTicket(ticket: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const url = `${this.serverUrl}/messaging-hub?ticket=${encodeURIComponent(ticket)}`;
                console.log('Connexion WebSocket avec ticket...');

                this.ws = new WebSocket(url);

                this.ws.onopen = () => {
                    console.log('WebSocket connecté avec succès');

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

                this.ws.onclose = (event) => {
                    console.log('WebSocket déconnecté', event.code, event.reason);
                    this.connect()

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
            console.log('Message reçu (brut):', data);

            // Essayer de parser le JSON
            const message: MessageResponseDto = JSON.parse(data);

            if (this.onMessageCallback) {
                this.onMessageCallback(message);
            }
        } catch (error) {
            console.error('Erreur lors du parsing du message:', error);
            console.error('Données reçues:', data);
            console.error('Type de données:', typeof data);
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

}

