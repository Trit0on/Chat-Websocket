/**
 * GUIDE D'INTÉGRATION - EXEMPLES
 *
 * Ce fichier montre comment ajouter vos propres DTOs et Modèles
 * pour coller à votre structure backend .NET
 */

// ============================================================================
// EXEMPLE 1 : Ajouter un nouveau DTO
// ============================================================================

// Créez un fichier : src/business/dtos/AuctionDto.ts
/*
export interface AuctionDto {
    id: string;
    title: string;
    description: string;
    startingPrice: number;
    currentPrice: number;
    startDate: string;      // ISO date string from .NET
    endDate: string;        // ISO date string from .NET
    sellerId: string;
}

export interface BidDto {
    auctionId: string;
    bidderId: string;
    amount: number;
    timestamp: string;
}

export interface CreateAuctionDto {
    title: string;
    description: string;
    startingPrice: number;
    duration: number;       // en heures
}
*/

// ============================================================================
// EXEMPLE 2 : Ajouter un nouveau Modèle
// ============================================================================

// Créez un fichier : src/business/models/Auction.ts
/*
export class Auction {
    public id: string;
    public title: string;
    public description: string;
    public startingPrice: number;
    public currentPrice: number;
    public startDate: Date;
    public endDate: Date;
    public sellerId: string;

    constructor(
        id: string,
        title: string,
        description: string,
        startingPrice: number,
        currentPrice: number,
        startDate: Date,
        endDate: Date,
        sellerId: string
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startingPrice = startingPrice;
        this.currentPrice = currentPrice;
        this.startDate = startDate;
        this.endDate = endDate;
        this.sellerId = sellerId;
    }

    // Méthodes métier
    public isActive(): boolean {
        const now = new Date();
        return now >= this.startDate && now <= this.endDate;
    }

    public timeRemaining(): number {
        const now = new Date();
        return Math.max(0, this.endDate.getTime() - now.getTime());
    }

    public canBid(amount: number): boolean {
        return this.isActive() && amount > this.currentPrice;
    }
}
*/

// ============================================================================
// EXEMPLE 3 : Créer un Service pour gérer les enchères
// ============================================================================

// Créez un fichier : src/business/services/AuctionService.ts
/*
import { Auction } from '../models/Auction';
import { AuctionDto, BidDto, CreateAuctionDto } from '../dtos/AuctionDto';

export class AuctionService {
    private auctions: Auction[] = [];
    private apiBaseUrl: string;

    constructor(apiBaseUrl: string) {
        this.apiBaseUrl = apiBaseUrl;
    }

    // Récupère toutes les enchères
    public async fetchAuctions(): Promise<Auction[]> {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/auctions`, {
                headers: {
                    'Authorization': `Bearer ${this.getAccessToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des enchères');
            }

            const auctionsDto: AuctionDto[] = await response.json();
            this.auctions = auctionsDto.map(dto => this.convertDtoToAuction(dto));
            return this.auctions;
        } catch (error) {
            console.error('Erreur fetchAuctions:', error);
            throw error;
        }
    }

    // Crée une nouvelle enchère
    public async createAuction(createDto: CreateAuctionDto): Promise<Auction> {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/auctions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAccessToken()}`
                },
                body: JSON.stringify(createDto)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création de l\'enchère');
            }

            const auctionDto: AuctionDto = await response.json();
            const auction = this.convertDtoToAuction(auctionDto);
            this.auctions.push(auction);
            return auction;
        } catch (error) {
            console.error('Erreur createAuction:', error);
            throw error;
        }
    }

    // Place une enchère
    public async placeBid(bidDto: BidDto): Promise<void> {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/bids`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.getAccessToken()}`
                },
                body: JSON.stringify(bidDto)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de l\'enchère');
            }
        } catch (error) {
            console.error('Erreur placeBid:', error);
            throw error;
        }
    }

    // Convertit un DTO en modèle
    private convertDtoToAuction(dto: AuctionDto): Auction {
        return new Auction(
            dto.id,
            dto.title,
            dto.description,
            dto.startingPrice,
            dto.currentPrice,
            new Date(dto.startDate),
            new Date(dto.endDate),
            dto.sellerId
        );
    }

    // Récupère le token d'accès (à adapter selon votre implémentation)
    private getAccessToken(): string {
        return localStorage.getItem('accessToken') || '';
    }
}
*/

// ============================================================================
// EXEMPLE 4 : Utiliser le service dans votre code
// ============================================================================

/*
// Dans main.ts ou dans votre composant
import { AuctionService } from './business/services/AuctionService';

const auctionService = new AuctionService('https://votre-backend.azurewebsites.net');

// Récupérer les enchères
const auctions = await auctionService.fetchAuctions();
console.log('Enchères actives:', auctions.filter(a => a.isActive()));

// Créer une enchère
const newAuction = await auctionService.createAuction({
    title: 'iPhone 15 Pro',
    description: 'État neuf, jamais utilisé',
    startingPrice: 500,
    duration: 24
});

// Placer une enchère
await auctionService.placeBid({
    auctionId: newAuction.id,
    bidderId: 'current-user-id',
    amount: 550,
    timestamp: new Date().toISOString()
});
*/

// ============================================================================
// EXEMPLE 5 : Intégration WebSocket pour les enchères en temps réel
// ============================================================================

/*
// Étendre WebSocketService pour gérer les mises à jour d'enchères
// Dans WebSocketService.ts, ajoutez :

private onAuctionUpdateCallback: ((auction: AuctionDto) => void) | null = null;

public onAuctionUpdate(callback: (auction: AuctionDto) => void): void {
    this.onAuctionUpdateCallback = callback;
}

// Dans handleMessage, ajoutez :
if (message.type === 'auction_update') {
    if (this.onAuctionUpdateCallback) {
        this.onAuctionUpdateCallback(message.data);
    }
}

// Utilisation :
webSocketService.onAuctionUpdate((auctionDto) => {
    console.log('Enchère mise à jour:', auctionDto);
    // Mettre à jour l'UI
});
*/

// ============================================================================
// NOTES IMPORTANTES
// ============================================================================

/*
1. TYPES .NET -> TypeScript :
   - string (C#) -> string (TS)
   - int/long (C#) -> number (TS)
   - bool (C#) -> boolean (TS)
   - DateTime (C#) -> string (TS, format ISO) puis convertir en Date
   - List<T> (C#) -> T[] (TS)
   - Dictionary<K,V> (C#) -> Record<K,V> ou Map<K,V> (TS)

2. CONVENTIONS DE NOMMAGE :
   - Gardez les mêmes noms de propriétés que votre backend .NET
   - Utilisez PascalCase en C# mais camelCase en TypeScript est standard
   - Utilisez des outils comme json2ts.com pour convertir vos DTOs .NET en interfaces TS

3. GESTION DES DATES :
   - .NET sérialise DateTime en ISO 8601 string
   - Toujours convertir en Date en TypeScript : new Date(dateString)

4. AUTHENTIFICATION :
   - Le token Bearer est déjà géré dans WebSocketService
   - Pour les appels REST API, ajoutez : 'Authorization': `Bearer ${token}`

5. VALIDATION :
   - Utilisez class-validator si besoin de validation avancée
   - Ou implémentez vos propres méthodes de validation dans les modèles

6. ERREURS :
   - Gérez toujours les erreurs avec try/catch dans les services
   - Propagez les erreurs avec des messages clairs pour l'UI
*/

