# 💬 Chatwoot Frontend - SmarterOS

**Custom UI for Chatwoot messaging platform**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://chatwoot.smarterbot.cl)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org)

---

## 🎯 Overview

Este repositorio contiene el **frontend customizado** para la plataforma Chatwoot de SmarterOS. Actúa como capa de presentación sobre el backend Chatwoot desplegado en Docker.

### Arquitectura

```
┌─────────────────────────────────────────────────┐
│   chatwoot.smarterbot.cl (Vercel)              │
│   Frontend Next.js 15 + TypeScript              │
│   ├─ Custom UI/UX                               │
│   ├─ Multi-tenant branding                      │
│   ├─ Enhanced inbox management                  │
│   └─ Real-time message sync                     │
└─────────────────────────────────────────────────┘
                      ↓ API REST
┌─────────────────────────────────────────────────┐
│   Chatwoot Backend (VPS Docker)                 │
│   https://api.chatwoot.smarterbot.cl            │
│   ├─ PostgreSQL (conversations, contacts)       │
│   ├─ Redis (real-time, cache)                   │
│   ├─ Sidekiq (background jobs)                  │
│   └─ WhatsApp/Email/Web channels                │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Features

### ✅ Implemented
- **Multi-channel Inbox**: WhatsApp, Email, Web Chat
- **Real-time Conversations**: WebSocket sync
- **Contact Management**: Search, filter, tag contacts
- **Agent Dashboard**: Conversation assignment, quick replies
- **Custom Branding**: SmarterOS theme integration

### 🔜 Roadmap
- **AI-Powered Responses**: Gemini integration for auto-replies
- **Analytics Dashboard**: Conversation metrics, response times
- **Multi-tenant Support**: Isolated workspaces per client
- **Shopify Integration**: Order tracking in conversations
- **N8N Workflow Triggers**: Automation from chat events

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3 + shadcn/ui |
| **State** | React Context + Hooks |
| **API Client** | Fetch API (custom client) |
| **Auth** | Clerk (inherited from app.smarterbot.cl) |
| **Deployment** | Vercel (Edge Runtime) |
| **Backend** | Chatwoot 2.10.1 (Docker) |

---

## 📦 Installation

### Prerequisites
- Node.js 20+
- pnpm 9+
- Chatwoot backend running (see `dkcompose/README-CHATWOOT.md`)

### Setup

```bash
# Clone repository
git clone https://github.com/SmarterCL/chatwoot.smarterbot.cl.git
cd chatwoot.smarterbot.cl

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env.local

# Edit .env.local with your Chatwoot credentials
# CHATWOOT_API_URL=https://api.chatwoot.smarterbot.cl
# CHATWOOT_ACCOUNT_ID=1
# CHATWOOT_ACCESS_TOKEN=your_token_here

# Run development server
pnpm dev

# Open http://localhost:3000
```

---

## 🔧 Configuration

### Environment Variables

```bash
# Chatwoot Backend
CHATWOOT_API_URL=https://api.chatwoot.smarterbot.cl
CHATWOOT_ACCOUNT_ID=1
CHATWOOT_ACCESS_TOKEN=your_chatwoot_access_token

# Clerk Authentication (optional, for agent login)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Application
NEXT_PUBLIC_APP_URL=https://chatwoot.smarterbot.cl
NODE_ENV=production
```

### Chatwoot API Token

Para obtener el token de acceso:

1. Acceder al backend Chatwoot: `https://api.chatwoot.smarterbot.cl`
2. Login como admin
3. Settings → Profile Settings → Access Token
4. Copy token y agregarlo a `.env.local`

---

## 📁 Project Structure

```
chatwoot.smarterbot.cl/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── dashboard/           # Main dashboard
│   ├── inbox/               # Inbox views
│   ├── contacts/            # Contact management
│   └── settings/            # Configuration
├── components/
│   ├── inbox/               # Inbox components
│   ├── conversations/       # Chat thread components
│   ├── contacts/            # Contact list components
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── chatwoot-client.ts   # API client
│   ├── websocket.ts         # Real-time sync
│   └── utils.ts             # Utilities
├── contexts/
│   └── chatwoot-context.tsx # Global state
├── hooks/
│   ├── use-conversations.ts # Conversations hook
│   └── use-contacts.ts      # Contacts hook
└── public/
    └── assets/              # Static assets
```

---

## 🔌 API Integration

### Chatwoot REST API

El cliente TypeScript (`lib/chatwoot-client.ts`) provee métodos para:

```typescript
// Inboxes
client.getInboxes()
client.getInbox(inboxId)

// Conversations
client.getConversations({ status: 'open', inboxId: 1 })
client.getConversation(conversationId)
client.toggleConversationStatus(conversationId, 'resolved')

// Messages
client.getMessages(conversationId)
client.sendMessage(conversationId, 'Hello!')

// Contacts
client.getContacts()
client.searchContacts('juan@example.com')
client.createContact({ name: 'Juan', email: '...' })
```

### WebSocket (Real-time)

```typescript
import { useChatwootWebSocket } from '@/hooks/use-chatwoot-websocket'

const { isConnected, lastMessage } = useChatwootWebSocket({
  accountId: 1,
  onMessage: (message) => {
    console.log('New message:', message)
  }
})
```

---

## 🎨 Customization

### Branding

Editar `tailwind.config.ts`:

```typescript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',      // SmarterOS purple
        secondary: '#10B981',    // Green accent
        accent: '#F59E0B',       // Orange alerts
      }
    }
  }
}
```

### Multi-tenant

Cada cliente puede tener su propia configuración:

```typescript
// contexts/tenant-context.tsx
const tenants = {
  'tenant-1': {
    chatwootAccountId: 1,
    branding: { logo: '/logos/tenant1.png', primaryColor: '#4F46E5' }
  },
  'tenant-2': {
    chatwootAccountId: 2,
    branding: { logo: '/logos/tenant2.png', primaryColor: '#EF4444' }
  }
}
```

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Connect to Vercel
vercel link

# Add environment variables
vercel env add CHATWOOT_API_URL
vercel env add CHATWOOT_ACCOUNT_ID
vercel env add CHATWOOT_ACCESS_TOKEN

# Deploy to production
vercel --prod
```

### Docker (Alternative)

```bash
# Build image
docker build -t chatwoot-frontend .

# Run container
docker run -p 3000:3000 \
  -e CHATWOOT_API_URL=https://api.chatwoot.smarterbot.cl \
  -e CHATWOOT_ACCOUNT_ID=1 \
  -e CHATWOOT_ACCESS_TOKEN=your_token \
  chatwoot-frontend
```

---

## 🔗 Related Repositories

- **[SmarterOS](https://github.com/SmarterCL/SmarterOS)** - Main monorepo
- **[app.smarterbot.cl](https://github.com/SmarterCL/app.smarterbot.cl)** - Main dashboard (embeds this UI)
- **[smarteros-specs](https://github.com/SmarterCL/smarteros-specs)** - Specifications & infrastructure

---

## 📖 Documentation

- **[Chatwoot Configuration](../dkcompose/README-CHATWOOT.md)** - Backend setup guide
- **[API Reference](./docs/API.md)** - Complete API documentation
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Production deployment

---

## 🤝 Contributing

Este proyecto es parte de SmarterOS y sigue las mismas convenciones:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

Proprietary - SmarterCL © 2025

---

## 🆘 Support

- **Documentation**: [CONVERGENCE-PLAN.md](../docs/CONVERGENCE-PLAN.md)
- **Issues**: [GitHub Issues](https://github.com/SmarterCL/chatwoot.smarterbot.cl/issues)
- **Email**: support@smarterbot.cl

---

**Built with ❤️ by SmarterCL Team**