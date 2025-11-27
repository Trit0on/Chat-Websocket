import { ChatService } from './business/services/ChatService';
import { AuthPage } from './ui/AuthPage';
import { ChatPage } from './ui/ChatPage';
import { config } from './config';

/**
 * Point d'entrée de l'application
 */
class App {
    private chatService: ChatService;
    private authPage: AuthPage;
    private chatPage: ChatPage;
    private container: HTMLElement;

    constructor() {
        // Configuration du serveur WebSocket depuis config.ts
        console.log(`🔌 WebSocket: ${config.wsServerUrl}`);

        this.container = document.getElementById('app') as HTMLElement;

        if (!this.container) {
            throw new Error('Element #app non trouvé dans le DOM');
        }

        this.chatService = new ChatService(config.wsServerUrl);
        this.authPage = new AuthPage(this.chatService, this.container);
        this.chatPage = new ChatPage(this.chatService, this.container);

        this.setupListeners();
        this.init();
    }

    /**
     * Initialise l'application
     */
    private init(): void {
        // Affiche la page de connexion au démarrage
        this.showAuthPage();
    }

    /**
     * Configure les listeners globaux
     */
    private setupListeners(): void {
        // Écoute les changements de statut de connexion
        this.chatService.onConnectionStatus((connected) => {
            if (connected && this.chatService.getCurrentUser()) {
                this.showChatPage();
            } else {
                this.showAuthPage();
            }
        });

        // Écoute les erreurs
        this.chatService.onError((error) => {
            console.error('Erreur ChatService:', error);
        });
    }

    /**
     * Affiche la page d'authentification
     */
    private showAuthPage(): void {
        this.authPage.render();
    }

    /**
     * Affiche la page de chat
     */
    private showChatPage(): void {
        this.chatPage.render();
    }
}

// Initialise l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

