# 📚 ReadVault

A modern, self-hosted personal reading and comic tracking platform built with Next.js. Track your Manga, Manhwa, Manhua, and Light Novels with chapter progress tracking, visual completion bars, personal reviews, and auto-fetched metadata from AniList.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## ✨ Features

- 📖 **Multi-Format Support** — Dedicated categories for **Manga (Japan)**, **Manhwa (Korea)**, **Manhua (China)**, and **Light Novels**.
- 🔍 **Instant Metadata via AniList** — Powered by the public [AniList GraphQL API](https://anilist.co/) with **zero API key required**. Search and auto-fill official cover art, total chapters, synopsis, genres, and release status instantly.
- ⚡ **Chapter Progress Tracker** — Track current chapter and volume with an interactive progress bar and a quick **+1 Chapter** button directly on each card.
- 🏷️ **Publishing Status Badges** — Monitor series status whether *Ongoing (Releasing)*, *Finished*, or on *Hiatus*.
- 📝 **Lore & Power System Notes** — Markdown-enabled notes for logging magic systems, cultivation stages, character builds, and favorite story arcs.
- 📊 **Statistics Dashboard** — Overview metrics for total titles, completed series, total chapters read, and average rating.
- 💾 **JSON Backup & Restore** — Export and import your entire reading library as a portable JSON file.
- ☁️ **Cloud-Ready** — Free deployment to [Vercel](https://vercel.com/) with zero configuration.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS v4 + Lucide Icons |
| Data Storage | Browser LocalStorage (portable JSON backup) |
| Metadata API | AniList Public GraphQL API (no key needed) |
| Deployment | Vercel (free tier) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/read-vault.git
cd read-vault

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment

Deploy instantly to Vercel:

1. Push this repository to your GitHub account.
2. Go to [vercel.com](https://vercel.com/) → **Add New Project** → Import your repo.
3. Click **Deploy**. Done!

---

## 📄 License

MIT License — free to use, modify, and distribute.
