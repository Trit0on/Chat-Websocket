import { ChatService } from '../business/services/ChatService';
import { Message } from '../business/models/Message';

/**
 * Chat Page
 * Gère l'interface de chat
 */
export class ChatPage {
    private chatService: ChatService;
    private container: HTMLElement;

    constructor(chatService: ChatService, container: HTMLElement) {
        this.chatService = chatService;
        this.container = container;
    }

    /**
     * Affiche la page de chat
     */
    public render(): void {
        const user = this.chatService.getCurrentUser();
        const pseudo = user ? user.pseudo : 'Utilisateur';

        this.container.innerHTML = `
            <div class="row h-100">
                <div class="col-md-12 d-flex flex-column h-100">
                    <!-- Header -->
                    <div class="bg-primary text-white p-3 rounded-top">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h4 class="mb-0">Chat WebSocket</h4>
                                <small>Connecté en tant que <strong>${pseudo}</strong></small>
                            </div>
                            <div>
                                <span id="connectionStatus" class="badge bg-success">Connecté</span>
                                <button class="btn btn-sm btn-light ms-2" id="logoutButton">
                                    Déconnexion
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Chat Box -->
                    <div class="flex-grow-1 overflow-auto bg-light p-3" style="min-height: 0;">
                        <div id="chatbox" class="h-100"></div>
                    </div>

                    <!-- Message Input -->
                    <div class="bg-white p-3 border-top">
                        <form id="messageForm" class="d-flex gap-2">
                            <input 
                                type="text" 
                                class="form-control rounded-pill" 
                                id="messageInput" 
                                placeholder="Écrivez votre message..."
                                required
                            >
                            <button 
                                type="submit" 
                                class="btn btn-primary rounded-pill px-4"
                                id="sendButton"
                            >
                                Envoyer
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
        this.loadExistingMessages();
    }

    /**
     * Attache les event listeners
     */
    private attachEventListeners(): void {
        const messageForm = document.getElementById('messageForm') as HTMLFormElement;
        const messageInput = document.getElementById('messageInput') as HTMLInputElement;
        const logoutButton = document.getElementById('logoutButton') as HTMLButtonElement;

        // Envoi de message
        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const content = messageInput.value.trim();

            if (!content) return;

            try {
                this.chatService.sendMessage(content);
                messageInput.value = '';
            } catch (error) {
                console.error('Erreur lors de l\'envoi du message:', error);
                alert(error instanceof Error ? error.message : 'Erreur lors de l\'envoi');
            }
        });

        // Déconnexion
        logoutButton.addEventListener('click', () => {
            if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
                this.chatService.logout();
            }
        });

        // Écoute des nouveaux messages
        this.chatService.onNewMessage((message) => {
            this.appendMessage(message);
        });

        // Écoute du statut de connexion
        this.chatService.onConnectionStatus((connected) => {
            this.updateConnectionStatus(connected);
        });
    }

    /**
     * Charge les messages existants
     */
    private loadExistingMessages(): void {
        const messages = this.chatService.getMessages();
        messages.forEach(message => this.appendMessage(message));
    }

    /**
     * Ajoute un message au chat
     */
    private appendMessage(message: Message): void {
        const chatbox = document.getElementById('chatbox');
        if (!chatbox) return;

        const currentUser = this.chatService.getCurrentUser();
        const isOwnMessage = currentUser && message.pseudo === currentUser.pseudo;

        const messageDiv = document.createElement('div');
        messageDiv.className = `mb-3 ${isOwnMessage ? 'text-end' : ''}`;

        const timeStr = message.timestamp.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        messageDiv.innerHTML = `
            <div class="d-inline-block ${isOwnMessage ? 'bg-primary text-white' : 'bg-white'} rounded-3 p-3 shadow-sm" 
                 style="max-width: 70%;">
                <div class="fw-bold small ${isOwnMessage ? 'text-white' : 'text-primary'} mb-1">
                    ${message.pseudo}
                </div>
                <div class="${isOwnMessage ? 'text-white' : 'text-dark'}">
                    ${this.escapeHtml(message.content)}
                </div>
                <div class="small ${isOwnMessage ? 'text-white-50' : 'text-muted'} mt-1">
                    ${timeStr}
                </div>
            </div>
        `;

        chatbox.appendChild(messageDiv);
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    /**
     * Met à jour le statut de connexion
     */
    private updateConnectionStatus(connected: boolean): void {
        const statusBadge = document.getElementById('connectionStatus');
        if (!statusBadge) return;

        if (connected) {
            statusBadge.className = 'badge bg-success';
            statusBadge.textContent = 'Connecté';
        } else {
            statusBadge.className = 'badge bg-danger';
            statusBadge.textContent = 'Déconnecté';
        }
    }

    /**
     * Échappe les caractères HTML pour éviter les injections XSS
     */
    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

