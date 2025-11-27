# Chat WebSocket - Frontend de Test

Frontend TypeScript minimal pour tester l'authentification WebSocket avec JWT.

## Structure

```
src/
├── business/
│   ├── dtos/           # Data Transfer Objects
│   ├── mappers/        # Conversion DTO <-> Model
│   ├── models/         # Modèles métier
│   └── services/       # Services (ChatService, WebSocketService)
├── ui/                 # Composants UI
├── config.ts           # Configuration serveur
└── main.ts             # Point d'entrée
```

## Installation & Lancement

```bash
npm install
npm run build
# Ouvrir login.html dans le navigateur
```

Pour le développement avec auto-compilation :
```bash
npm run dev
```

## Configuration

Modifier l'URL du serveur WebSocket dans `src/config.ts` :

```typescript
export const config = {
    wsServerUrl: 'ws://localhost:5290'
};
```

## Utilisation

1. Ouvrir `login.html`
2. Entrer un pseudo et le JWT token
3. Le token est envoyé via l'URL WebSocket (`?token=...`) et dans le message de login

## Format des Messages

### Connexion
```json
{ "type": "login", "pseudo": "...", "accessToken": "..." }
```

### Envoi de message
```json
{ "type": "message", "pseudo": "...", "message": "..." }
```

### Réception
```json
{ "id": "...", "pseudo": "...", "message": "...", "timestamp": "...", "type": "message" }
```


