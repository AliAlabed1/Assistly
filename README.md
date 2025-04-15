# Assistly

**Assistly** is an AI-powered chatbot platform with a **Next.js 13** + **TypeScript** frontend and a **Django** backend.  
It allows users to chat with custom-trained bots and receive instant, context-aware responses powered by OpenRouter's AI models.

---

## 🚀 Features

- **Custom Chatbots**: Create and configure chatbots with unique characteristics.
- **Real-time Messaging**: Engage in live chat with AI responses.
- **Session Management**: Track individual user chat sessions.
- **Form Validation**: Built-in validation using Zod and React Hook Form.
- **AI Streaming (Planned)**: Support for streamed responses.
- **Responsive UI**: Tailored for both mobile and desktop users.
- **Django Backend**: Robust backend built with Django for session and message handling.
- **Frontend + API Separation**: Clear separation of concerns between frontend and backend.

---

## 🛠️ Tech Stack

### Frontend:
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Forms**: React Hook Form + Zod
- **Notifications**: Sonner
- **Users**: Clerk

### Backend:
- **Framework**: Django
- **Database**: (e.g., PostgreSQL – check `settings.py` for actual setup)
- **API**: Django REST Framework or custom views (depends on implementation)

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/AliAlabed1/Assistly.git
cd Assistly  
```

### 2. Install Frontend Dependencies

```bash
npm install
# or
yarn install
```

### 3. Setup Environment Variables
Create a .env.local file in the root directory and add:
```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run the Frontend Development Server 
```bash
npm run dev
# or
yarn dev
```

### Project Structure
Assistly/  
├── app/                 # Next.js frontend (App Router)  
├── components/          # Reusable React components  
├── lib/                 # Utility functions and API handlers  
├── public/              # Static assets like icons and images  
├── types/               # Shared TypeScript types and interfaces  
├── .env.local           # Environment variables for frontend  
└── README.md            # This documentation file  

### 🌐 Live Demo
Check out the live deployed version of Assistly:
🔗 https://assistly-five.vercel.app

### 🤝 Contributing
Contributions are welcome and appreciated!

To contribute:

1. Fork the repository

2. Create a new feature branch (git checkout -b feature-name)

3. Commit your changes (git commit -m 'Add feature')

4. Push to your fork (git push origin feature-name)

5. Create a Pull Request describing your changes





