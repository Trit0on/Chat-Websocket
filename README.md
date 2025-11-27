# Chat WebSocket - Frontend TypeScript

## Architecture du Projet

Ce projet frontend est structuré de manière professionnelle pour faciliter l'intégration avec votre backend .NET.

### Structure des Dossiers

```
src/
├── business/
│   ├── models/          # Modèles métier (Message, User)
│   ├── dtos/           # Data Transfer Objects (pour la communication avec le backend)
│   └── services/       # Services métier (ChatService, WebSocketService)
└── ui/                 # Composants d'interface utilisateur
    ├── AuthPage.ts     # Page de connexion avec AccessToken
    └── ChatPage.ts     # Interface de chat
```

## Installation

```bash
npm install
```

## Compilation TypeScript

```bash
# Compilation unique
npm run build

# Compilation en mode watch (développement)
npm run watch
```

## Configuration

### URL du Serveur WebSocket

Dans `src/main.ts`, modifiez la constante `WS_SERVER_URL` pour pointer vers votre backend .NET :

```typescript
const WS_SERVER_URL = 'ws://localhost:5000/chat'; // Votre URL backend
```

## Utilisation

1. Ouvrez `login.html` dans votre navigateur
2. Entrez votre pseudo et votre AccessToken
3. Le token sera automatiquement envoyé en paramètre dans la connexion WebSocket
4. Une fois connecté, vous accédez à l'interface de chat

## Intégration avec votre Backend .NET

### Format des Messages

Le frontend envoie et attend des messages au format JSON :

#### Connexion (Login)
```json
{
  "type": "login",
  "pseudo": "NomUtilisateur",
  "accessToken": "votre_token_ici"
}
```

#### Envoi de Message
```json
{
  "type": "message",
  "pseudo": "NomUtilisateur",
  "message": "Contenu du message"
}
```

#### Réception de Message
```json
{
  "id": "message_id",
  "pseudo": "NomUtilisateur",
  "message": "Contenu du message",
  "timestamp": "2025-11-27T10:30:00Z",
  "userId": "user_id",
  "type": "message"
}
```

## Ajout de vos DTOs et Modèles .NET

### Pour ajouter un nouveau DTO :

1. Créez un fichier dans `src/business/dtos/` :
```typescript
// src/business/dtos/VotreDto.ts
export interface VotreDto {
    propriete1: string;
    propriete2: number;
    // Correspond à vos DTOs .NET
}
```

### Pour ajouter un nouveau Modèle :

1. Créez un fichier dans `src/business/models/` :
```typescript
// src/business/models/VotreModele.ts
export class VotreModele {
    constructor(
        public propriete1: string,
        public propriete2: number
    ) {}
}
```

### Pour modifier le service :

Le `ChatService` et le `WebSocketService` peuvent être étendus pour supporter vos nouveaux DTOs et endpoints.

## Authentification Bearer Token

Le token est envoyé de deux manières :

1. **Dans l'URL WebSocket** : `ws://votre-serveur/chat?token=VOTRE_TOKEN`
2. **Dans le premier message** : Un message de type "login" avec le token

Vous pouvez adapter cela dans `src/business/services/WebSocketService.ts` selon les besoins de votre backend .NET.

## Fonctionnalités

- ✅ Authentification par AccessToken
- ✅ Architecture TypeScript propre et modulaire
- ✅ Séparation Models / DTOs / Services
- ✅ Reconnexion automatique
- ✅ Interface responsive Bootstrap
- ✅ Gestion des erreurs
- ✅ Messages horodatés
- ✅ Distinction messages propres/autres utilisateurs

## Personnalisation

### Changer le style
Modifiez `styles.css` pour personnaliser l'apparence.

### Ajouter des fonctionnalités
- Étendez `ChatService` pour ajouter de la logique métier
- Créez de nouveaux DTOs dans `business/dtos/`
- Ajoutez des modèles dans `business/models/`

## Développement

Le code est conçu pour être facilement maintenable et extensible. Chaque composant a une responsabilité unique :

- **Models** : Représentation métier des données
- **DTOs** : Format de communication avec le backend
- **Services** : Logique métier et communication
- **UI** : Composants d'interface purs

Cette séparation facilite les tests et l'évolution du code.

