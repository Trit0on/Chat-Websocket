# 🚀 Guide de Démarrage Rapide

## Installation

```bash
npm install
```

## Compilation

```bash
# Compilation unique
npm run build

# Mode watch (développement)
npm run watch
```

## Configuration du Backend

Avant de démarrer, modifiez l'URL de votre backend .NET dans `src/main.ts` :

```typescript
const WS_SERVER_URL = 'ws://localhost:5000/chat'; // ⬅️ Changez ceci
```

## Utilisation

1. **Ouvrez `login.html`** dans votre navigateur
2. **Entrez vos identifiants** :
   - Pseudo : votre nom d'utilisateur
   - AccessToken : votre token JWT depuis votre backend .NET
3. **Cliquez sur "Se connecter"**
4. **Profitez du chat !**

## Structure du Projet

```
Chat-Websocket/
├── src/
│   ├── business/              # Logique métier
│   │   ├── models/           # Modèles (Message, User)
│   │   ├── dtos/             # DTOs pour communication backend
│   │   └── services/         # Services (ChatService, WebSocketService)
│   ├── ui/                   # Composants UI
│   │   ├── AuthPage.ts      # Page de connexion
│   │   └── ChatPage.ts      # Interface de chat
│   └── main.ts              # Point d'entrée
├── dist/                     # Code compilé (généré)
├── login.html               # Page principale
├── styles.css               # Styles CSS
└── tsconfig.json            # Configuration TypeScript
```

## Personnalisation

### Ajouter vos propres DTOs

Créez un fichier dans `src/business/dtos/` :

```typescript
// src/business/dtos/VotreDto.ts
export interface VotreDto {
    id: string;
    nom: string;
    // Propriétés correspondant à votre backend .NET
}
```

### Ajouter vos propres Modèles

Créez un fichier dans `src/business/models/` :

```typescript
// src/business/models/VotreModele.ts
export class VotreModele {
    constructor(
        public id: string,
        public nom: string
    ) {}
    
    // Méthodes métier
}
```

### Ajouter vos propres Services

Créez un fichier dans `src/business/services/` :

```typescript
// src/business/services/VotreService.ts
export class VotreService {
    // Logique métier
}
```

## Format des Messages WebSocket

### Connexion
```json
{
  "type": "login",
  "pseudo": "VotrePseudo",
  "accessToken": "votre-token"
}
```

### Envoi de message
```json
{
  "type": "message",
  "pseudo": "VotrePseudo",
  "message": "Votre message"
}
```

### Réception de message
```json
{
  "id": "message-id",
  "pseudo": "Expéditeur",
  "message": "Contenu",
  "timestamp": "2025-11-27T10:00:00Z",
  "userId": "user-id",
  "type": "message"
}
```

## Fonctionnalités Incluses

✅ Authentification par AccessToken (Bearer)  
✅ Architecture TypeScript modulaire  
✅ Séparation Models / DTOs / Services  
✅ Reconnexion automatique  
✅ Interface Bootstrap responsive  
✅ Gestion des erreurs  
✅ Messages horodatés  
✅ Distinction visuelle des messages

## Aide & Support

- 📖 Consultez `INTEGRATION_GUIDE.ts` pour des exemples détaillés
- 📝 Lisez `README.md` pour la documentation complète
- 🐛 Vérifiez la console du navigateur pour les erreurs

## Développement

Mode watch pour compilation automatique :

```bash
npm run watch
```

Le code sera recompilé automatiquement à chaque modification.

## Notes Importantes

- Le token est envoyé en paramètre dans l'URL WebSocket ET dans le premier message
- Adaptez `WebSocketService.ts` selon les besoins de votre backend .NET
- Les dates .NET (DateTime) sont automatiquement converties en Date TypeScript
- Le projet utilise ES2020, compatible avec tous les navigateurs modernes

Bon développement ! 🎉

