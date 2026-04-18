# 🚀 AI-Powered Learning Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js ^18](https://img.shields.io/badge/Node.js-%5E18-green.svg)](https://nodejs.org/)
[![React ^19](https://img.shields.io/badge/React-%5E19-blue.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-green.svg)](https://www.mongodb.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-orange.svg)](https://ai.google.dev/)
[![Express ^5.2](https://img.shields.io/badge/Express-%5E5.2-red.svg)](https://expressjs.com/)
[![TailwindCSS ^4](https://img.shields.io/badge/TailwindCSS-%5E4-purple.svg)](https://tailwindcss.com/)
[![Vite ^7](https://img.shields.io/badge/Vite-%5E7-brightgreen.svg)](https://vitejs.dev/)

## 📖 Overview

**AI-Powered Learning Assistant** is a cutting-edge full-stack web application that transforms your PDF study materials into interactive, AI-driven learning experiences powered by Google's Gemini AI. 

**Key Capabilities:**
- Upload & parse PDF documents
- Generate smart flashcards, quizzes, and summaries
- Contextual chat with document content
- Personalized progress tracking & analytics
- Responsive, modern UI

Built for students, educators, and professionals seeking efficient learning tools.

<div align=\"center\">
  <img alt=\"AI Learning Assistant Demo\" src=\"https://via.placeholder.com/1200x600/4F46E5/FFFFFF?text=AI+Powered+Learning+Assistant&fontsize=40&font=source-sans-pro\" width=\"90%\">
  <p><em>📊 Modern dashboard with AI study tools, progress tracking, and quick actions</em></p>
</div>

## ✨ Features

<div align=\"center\">
  <table>
    <tr>
      <td width=\"50%\">
        <ul>
          <li><b>📚 Document Management</b><br>Upload PDFs, auto-parse text, chunking</li>
          <li><b>🧠 AI Flashcards</b><br>Generate flashcards with difficulty levels & spaced repetition</li>
          <li><b>📝 Adaptive Quizzes</b><br>AI-generated questions with detailed scoring</li>
          <li><b>💬 Smart Chat</b><br>Contextual Q&A on document content</li>
        </ul>
      </td>
      <td width=\"50%\">
        <ul>
          <li><b>📊 Learning Analytics</b><br>Progress dashboard, stats, weak areas</li>
          <li><b>⭐ Review System</b><br>Star/review flashcards, track mastery</li>
          <li><b>🔐 Secure Auth</b><br>JWT tokens, profile management, password reset</li>
          <li><b>📱 Responsive Design</b><br>Mobile-first, dark mode ready</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

## 🛠️ Tech Stack

| Category | Key Technologies |
|----------|------------------|
| **Backend** | Node.js 18+, Express.js 5.2.1, Mongoose 9.1.5, Multer 2.0.2, bcryptjs 3.0.3 |
| **Database** | MongoDB (Local/Atlas) |
| **AI Integration** | @google/generative-ai 1.42.0 (Gemini 2.5 Flash) |
| **Frontend** | React 19.2.0, Vite 7.2.4, TailwindCSS 4.1.18, React Router 7.13.0 |
| **UI/UX** | Lucide React 0.563.0, react-hot-toast 2.6.0, react-markdown 10.1.0 |
| **Utils** | pdf-parse 1.1.1, Axios 1.13.4, express-validator 7.3.1 |
| **Dev Tools** | nodemon 1.0.2, ESLint 9.39.1 |

## 📁 Folder Structure

```
AI-Powered-LearningPath/
├── backend/                    # REST API Server
│   ├── config/                 # Database & Multer config
│   ├── controllers/            # Request handlers
│   ├── middleware/             # Auth, error handling
│   ├── models/                 # Mongoose schemas (User, Document, Quiz, etc.)
│   ├── routes/                 # Express routes (/api/auth, /documents...)
│   ├── utils/                  # PDF parser, Gemini service, text chunker
│   ├── uploads/documents/      # User-uploaded PDFs
│   ├── server.js              # App entry
│   └── package.json
├── frontend/ai-learning-assistant/  # React SPA
│   ├── public/
│   ├── src/
│   │   ├── components/        # UI components (Layout, Chat, Cards...)
│   │   ├── context/           # AuthContext, ThemeContext
│   │   ├── pages/             # Dashboard, Documents, Quizzes, Profile
│   │   ├── services/          # API service wrappers
│   │   └── utils/             # Axios instance, API paths
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- [Node.js 18+](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (local or [Atlas free tier](https://www.mongodb.com/atlas))
- [Gemini API Key](https://aistudio.google.com/app/apikey) (free tier available)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ai-powered-learningpath.git
cd AI-Powered-LearningPath
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy & configure .env
cat > .env << EOF
MONGO_URI=mongodb://127.0.0.1:27017/ai_learning_assistant
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET=your-64-character-super-secret-jwt-key-here
PORT=5000
EOF

npm run dev
```
> Backend API: `http://localhost:5000/api`

### 3. Frontend Setup
```bash
cd ../frontend/ai-learning-assistant
npm install
npm run dev
```
> Frontend App: `http://localhost:5173`

## 🔌 Environment Configuration

### Backend `.env` (Required)
```
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=AIzaSy... (from Google AI Studio)
JWT_SECRET=minimum-32-characters-super-secure-random-string
PORT=5000
```

### Frontend `.env` (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

## 🌐 API Documentation

**Base URL**: `http://localhost:5000/api`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Create account | ❌ |
| `POST` | `/auth/login` | User login | ❌ |
| `POST` | `/documents/upload` | Upload PDF document | ✅ |
| `GET` | `/documents` | List user documents | ✅ |
| `DELETE` | `/documents/:id` | Delete document | ✅ |
| `POST` | `/ai/generate-flashcards` | AI flashcards from doc | ✅ |
| `POST` | `/ai/generate-quiz` | Generate quiz questions | ✅ |
| `POST` | `/quizzes/:id/submit` | Submit quiz answers | ✅ |
| `GET` | `/progress/dashboard` | Learning statistics | ✅ |

### cURL Examples
```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H \"Content-Type: application/json\" \
  -d '{\"email\":\"user@example.com\", \"password\":\"password123\"}'

# 2. Upload Document (use JWT from login)
curl -X POST http://localhost:5000/api/documents/upload \
  -H \"Authorization: Bearer eyJhbGciOiJIUzI1NiIs...\" \
  -F \"file=@\"path/to/your/study.pdf\"\" 

# 3. Generate Flashcards
curl -X POST http://localhost:5000/api/ai/generate-flashcards \
  -H \"Authorization: Bearer YOUR_JWT\" \
  -H \"Content-Type: application/json\" \
  -d '{\"documentId\":\"64f...\", \"count\":15}'
```

## 📱 Screenshots & Demo

<div align=\"center\">
  <table>
    <tr>
      <td><img src="./image/DashBoard.png" alt=\"Dashboard\" style=\"border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.1);\" width=\"48%\" /></td>
      <td><img src=\"https://via.placeholder.com/500x350/7C3AED/FFFFFF?text=🧠+AI+Flashcards+Generator\" alt=\"Flashcards\" style=\"border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.1);\" width=\"48%\" /></td>
    </tr>
    <tr>
      <td><img src=\"https://via.placeholder.com/500x350/F97316/FFFFFF?text=📝+Quiz+Results+&+Analytics\" alt=\"Quizzes\" style=\"border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.1);\" width=\"48%\" /></td>
      <td><img src=\"https://via.placeholder.com/500x350/10B981/FFFFFF?text=💬+Document+Chatbot\" alt=\"Chat\" style=\"border-radius:12px;box-shadow:0 8px 32px rgba(0,0,0,0.1);\" width=\"48%\" /></td>
    </tr>
  </table>
</div>



## ☁️ Production Deployment

### Recommended Stack
1. **Frontend**: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
   ```bash
   cd frontend/ai-learning-assistant
   npm run build
   # Deploy dist/ folder
   ```

2. **Backend**: [Railway](https://railway.app), [Render](https://render.com), or [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
   - Connect GitHub repo
   - Set environment variables in dashboard
   - Auto-deploys on push

3. **Database**: [MongoDB Atlas](https://mongodb.com/atlas) Free M0 Cluster

4. **AI**: Gemini API (Generous free tier)

**Total Cost**: $0/month (free tiers for <100 users)

## 🗺️ Roadmap

✅ **Completed:**
- PDF upload & intelligent parsing
- Gemini AI integrations (flashcards, quizzes, chat)
- Full authentication & authorization
- Responsive dashboard & analytics

🔄 **In Progress:**
- Advanced spaced repetition algorithms
- Multi-format support (DOCX, images via OCR)

⏳ **Planned:**
- PWA offline support
- Anki export
- Multi-language UI (10+ languages)
- Voice-to-text study notes
- Collaborative study groups

## 🔧 Available Scripts

### Backend (`backend/package.json`)
```bash
npm run dev     # Development with nodemon
npm start       # Production mode
```

### Frontend (`frontend/ai-learning-assistant/package.json`)
```bash
npm run dev     # Vite dev server (localhost:5173)
npm run build   # Production build
npm run lint    # ESLint code quality
npm run preview # Preview production build
```

## 🧪 Testing & Quality

- **Backend**: Ready for Jest + Supertest (add `npm i -D jest supertest`)
- **Frontend**: Vitest + React Testing Library (pre-configured ESLint)
- **Code Style**: ESLint 9.39.1 + React Hooks rules

## 🤝 Contributing Guidelines

1. **Fork** the repository
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'feat: add amazing feature'`
4. **Push**: `git push origin feature/amazing-feature`
5. **Open Pull Request** 🎉

**Commit Format**: Conventional Commits (`feat:`, `fix:`, `docs:`)

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙌 Acknowledgments

- **Google Gemini Team** for the powerful AI API
- **TailwindCSS & Vite** for lightning-fast development
- **React Community** for React 19 innovations
- **Open Source Contributors** (welcome!)

<div align=\"center\">
  
![Stars](https://img.shields.io/github/stars/YOUR_USERNAME/ai-powered-learningpath?style=social)
![Forks](https://img.shields.io/github/forks/YOUR_USERNAME/ai-powered-learningpath?style=social)
  
**⭐ Star us on GitHub if this helps your learning journey!**  
**Built with ❤️ using cutting-edge AI & Web Technologies**
  
</div>
