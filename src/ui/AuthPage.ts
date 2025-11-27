import { ChatService } from '../business/services/ChatService';

/**
 * Auth Page
 * Gère la page de connexion avec l'AccessToken
 */
export class AuthPage {
    private chatService: ChatService;
    private container: HTMLElement;

    constructor(chatService: ChatService, container: HTMLElement) {
        this.chatService = chatService;
        this.container = container;
    }

    /**
     * Affiche la page de connexion
     */
    public render(): void {
        this.container.innerHTML = `
            <div class="row justify-content-center align-items-center" style="min-height: 100vh;">
                <div class="col-md-6 col-lg-4">
                    <div class="card shadow-lg">
                        <div class="card-body p-5">
                            <h2 class="text-center mb-4">Chat WebSocket</h2>
                            <p class="text-center text-muted mb-4">Connectez-vous avec votre AccessToken</p>
                            
                            <form id="loginForm">
                                <div class="mb-3">
                                    <label for="pseudoInput" class="form-label">Pseudo</label>
                                    <input 
                                        type="text" 
                                        class="form-control" 
                                        id="pseudoInput" 
                                        placeholder="Entrez votre pseudo"
                                        required
                                    >
                                </div>
                                
                                <div class="mb-4">
                                    <label for="tokenInput" class="form-label">Access Token</label>
                                    <textarea 
                                        class="form-control" 
                                        id="tokenInput" 
                                        rows="3"
                                        placeholder="Collez votre token d'accès ici"
                                        required
                                    ></textarea>
                                    <small class="form-text text-muted">
                                        Le token sera envoyé en Bearer dans la requête WebSocket
                                    </small>
                                </div>
                                
                                <div id="errorMessage" class="alert alert-danger d-none" role="alert"></div>
                                
                                <button 
                                    type="submit" 
                                    class="btn btn-primary w-100 rounded-pill"
                                    id="loginButton"
                                >
                                    Se connecter
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    /**
     * Attache les event listeners
     */
    private attachEventListeners(): void {
        const form = document.getElementById('loginForm') as HTMLFormElement;
        const pseudoInput = document.getElementById('pseudoInput') as HTMLInputElement;
        const tokenInput = document.getElementById('tokenInput') as HTMLTextAreaElement;
        const loginButton = document.getElementById('loginButton') as HTMLButtonElement;
        const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const pseudo = pseudoInput.value.trim();
            const token = tokenInput.value.trim();

            if (!pseudo || !token) {
                this.showError('Veuillez remplir tous les champs');
                return;
            }

            try {
                loginButton.disabled = true;
                loginButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Connexion...';
                errorMessage.classList.add('d-none');

                await this.chatService.login(token, pseudo);

                // La connexion réussie sera gérée par le callback dans main.ts
            } catch (error) {
                this.showError(error instanceof Error ? error.message : 'Erreur de connexion');
                loginButton.disabled = false;
                loginButton.textContent = 'Se connecter';
            }
        });
    }

    /**
     * Affiche un message d'erreur
     */
    private showError(message: string): void {
        const errorMessage = document.getElementById('errorMessage') as HTMLDivElement;
        errorMessage.textContent = message;
        errorMessage.classList.remove('d-none');
    }
}

