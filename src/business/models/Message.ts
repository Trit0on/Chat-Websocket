/**
 * Message Model
 * Représente un message dans le chat
 */
export class Message {
    public id: string;
    public pseudo: string;
    public content: string;
    public timestamp: Date;
    public userId?: string;

    constructor(
        id: string,
        pseudo: string,
        content: string,
        timestamp: Date = new Date(),
        userId?: string
    ) {
        this.id = id;
        this.pseudo = pseudo;
        this.content = content;
        this.timestamp = timestamp;
        this.userId = userId;
    }

    /**
     * Formatte le message pour l'affichage
     */
    public format(): string {
        const timeStr = this.timestamp.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        return `[${timeStr}] ${this.pseudo}: ${this.content}`;
    }
}

