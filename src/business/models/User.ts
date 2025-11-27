/**
 * User Model
 * Représente un utilisateur connecté
 */
export class User {
    public id: string;
    public pseudo: string;
    public accessToken: string;
    public connectedAt: Date;

    constructor(
        id: string,
        pseudo: string,
        accessToken: string,
        connectedAt: Date = new Date()
    ) {
        this.id = id;
        this.pseudo = pseudo;
        this.accessToken = accessToken;
        this.connectedAt = connectedAt;
    }

    /**
     * Vérifie si le token est valide (peut être étendu avec une logique métier)
     */
    public hasValidToken(): boolean {
        return !!(this.accessToken && this.accessToken.length > 0);
    }
}

