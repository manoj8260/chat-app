# ConnectSphere - Real-time Chat Application

A modern React TypeScript chat application with FastAPI backend integration, built with Lovable.

## Project info

**URL**: https://lovable.dev/projects/e57f49f2-e338-495d-8db1-793da4547f94

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e57f49f2-e338-495d-8db1-793da4547f94) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

**Frontend:**
- **React 18** with TypeScript
- **Vite** for development and building
- **Tailwind CSS** for styling with custom design system
- **shadcn-ui** for UI components
- **Lucide React** for icons
- **Custom hooks** for WebSocket management
- **Context API** for state management

**Backend Integration:**
- **FastAPI** backend connection
- **WebSocket** for real-time messaging
- **REST API** for room management

## Chat Application Features

- 🚀 **Real-time messaging** with WebSocket connections
- 🏠 **Multiple chat rooms** with room creation/joining
- 👥 **User management** with online status
- 📱 **Responsive design** for mobile and desktop
- 🎨 **Modern UI** with glassmorphism effects and dark theme
- 🔄 **Auto-reconnection** with connection status indicators
- 📬 **Unread message indicators** and message history
- 🔐 **Frontend Authentication** with login, register, and logout
- ⚡ **Quick Chat** mode for guest users
- 🎯 **Beautiful landing page** with feature highlights

## Authentication Features

### Frontend Authentication System
- **Login Form**: Username/password authentication
- **Registration Form**: Create new accounts with username, email, password
- **Logout Functionality**: Secure logout with confirmation dialog
- **Quick Chat**: Guest mode for instant messaging without registration
- **Session Management**: Persistent login state with localStorage
- **Password Visibility Toggle**: Enhanced UX for password fields
- **Form Validation**: Client-side validation with error messages

### User Management
- **User Context**: Global authentication state management
- **Auth Guards**: Route protection and redirection
- **User Badge**: Display current user info in chat header
- **Guest Mode**: Special handling for anonymous users

## FastAPI Backend Integration

### Required Endpoints

Your FastAPI backend should provide:

**WebSocket Endpoint:**
```
ws://localhost:8003/ws/{username}?room_id={room_id}
```

**HTTP API Endpoints:**
```
GET http://localhost:8003/api/rooms
```

**Message Format:**
```json
{
  "username": "string",
  "message": "string", 
  "timestamp": "string",
  "message_type": "message" | "system" | "user_join" | "user_leave",
  "room_id": "string"
}
```

### Configuration

Update the backend configuration in `src/config/backend.ts`:

```typescript
export const BACKEND_CONFIG = {
  host: "localhost:8003", // Your FastAPI server address
  maxReconnectAttempts: 5,
  reconnectDelay: 3000,
  connectionTimeout: 10000
};
```

## Getting Started with Chat

1. **Start your FastAPI backend** on `localhost:8003`
2. **Install dependencies**: `npm install`
3. **Start the React app**: `npm run dev`
4. **Open browser** to `http://localhost:5173`

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e57f49f2-e338-495d-8db1-793da4547f94) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
