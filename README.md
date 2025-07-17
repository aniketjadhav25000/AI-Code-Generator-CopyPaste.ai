# 🚀 CopyPaste.ai – Your AI Coding Assistant 💡

**CopyPaste.ai** is a full-stack, ChatGPT-style AI assistant built for developers. It enables you to generate, debug, and explore code through an intuitive chat interface powered by OpenAI.

---

## 🖼️ Demo

👉 [Live Site](https://your-netlify-link.com)

---

## 📦 Tech Stack

| Layer        | Technology                  |
|--------------|------------------------------|
| Frontend     | React, Tailwind CSS, Framer Motion |
| Backend      | FastAPI, OpenAI SDK          |
| Auth API     | Node.js, Express, JWT        |
| Database     | MongoDB (for chat history)   |
| Deployment   | Netlify (frontend), Render (backends) |

---

## ✨ Features

- 💬 **Chat-style AI UI** with markdown, code formatting, and syntax highlighting  
- 🗃️ **Save, search, rename, and favorite** your chats  
- 🔒 **Authentication** (JWT-based login/signup)  
- 🧠 **OpenAI integration** for code generation  
- 🎤 **Voice-to-text** prompts (Web Speech API)  
- 📱 **Fully responsive** (mobile + desktop optimized)  
- 🎨 **Modern UI** with glassmorphism and animations

---

## 🚀 Local Setup

### Prerequisites
- Node.js
- Python 3.9+
- MongoDB (local or cloud)
- OpenAI API Key

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/CopyPaste.ai.git
cd CopyPaste.ai
```


## 🌐 Deployment

### Frontend → Netlify

- Deploy by dragging the `frontend/` folder into Netlify  
**OR**  
- Link the GitHub repo and configure:
  - **Build Command:** `npm run build`
  - **Publish Directory:** `dist`

### Backend + Auth → Render

- **Auth Backend** (`authbackend/`):
  - Deploy as a **Node.js** server
  - Connects to **MongoDB Atlas**
  - Requires environment variables like `MONGO_URI`, `JWT_SECRET`

- **AI Backend** (`backend/`):
  - Deploy as a **FastAPI** server
  - Requires `OPENAI_API_KEY` in the `.env`

---

## 🧠 Future Plans

- 🧩 Prompt templates & reusable code snippets  
- 🔗 Shareable chat links (like GitHub Gists)  
- 💾 Offline drafts (localStorage + PWA)  
- 💼 Pro Mode (GPT-4 + extra developer tools)  
- 🌍 Multi-language code generation

---

## 🙌 Contributing

Want to contribute ideas, code, or fix bugs? PRs are welcome!  
Just fork the repo, create a branch, and open a pull request.

---

## 📄 License

MIT License © 2025 [Your Name]
