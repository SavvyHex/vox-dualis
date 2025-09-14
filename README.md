# 🏛 Vox Dualis

An interactive platform where Large Language Models (LLMs) debate ethical, social, and philosophical topics. The system generates structured for and against arguments, allowing users to witness the debate and come to their own conclusions.

Built in 16 hours at a hackathon 🏆

## ✨ Features

🎤 **AI vs AI Debates** → Two roles (FOR and AGAINST) argue across multiple rounds.

🧠 **Structured Format** → Opening → Rebuttals → Conclusion.

📝 **Neutral Summary** → Arena generates a recap at the end.

👨‍⚖️ **User as Judge** → Vote for the more convincing side.

⚡ **Real-time UI** → Chat-like debate viewer built with Next + Tailwind.

🌐 **Full-stack** → Frontend on Vercel, backend on Render powered by Google Gemini API.

## 🛠️ Tech Stack

### Frontend

React + Vite

TailwindCSS

Deployed on Vercel

### Backend

FastAPI + Flask

Google Gemini API (for argument generation)

Deployed on Render

## 📂 Project Structure

```
ethical-debate-arena/
│
├── frontend/              # React + Tailwind (Vercel)
│   ├── src/
│   │   ├── components/    # UI components (DebateViewer, Header, etc.)
│   │   ├── pages/         # App pages
│   │   └── api.js         # API calls to backend
│
├── backend/               # Node/Express or FastAPI (Render)
│   ├── routes/
│   │   └── debate.js      # Debate generation endpoints
│   └── server.js          # Entry point
│
└── README.md
```

## 🚀 Getting Started

1️⃣ Clone the Repo
```
git clone https://github.com/your-username/ethical-debate-arena.git
cd ethical-debate-arena
```

2️⃣ Backend Setup
```
cd backend
pip install -r requirements.txt
```

3️⃣ Frontend Setup
```
cd frontend
npm install
```

## 🌍 Deployment

Frontend → Deploy to Vercel

Backend → Deploy to Render

Make sure to enable CORS and use HTTPS Render URL

## 🎯 Usage

Enter a topic (e.g., “Should AI replace teachers?”).

Watch as FOR and AGAINST sides argue across 2–3 rounds.

Read the debate summary at the end.

Cast your vote on which side was more convincing.

## 🔮 Future Improvements

Multi-agent debates with >2 perspectives.

User-submitted arguments that AI responds to.

Leaderboard of most engaging debates.

Export debates as sharable links.

## 👥 Team

Frontend: React + Tailwind (UI/UX)

Backend: API + Gemini integration

Ideation & Prompt Design: Ethical frameworks, debate structure