# KyotoTrip

A travel planning application built with React and Vite.

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher recommended)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` (if available) or create a `.env` file.
   - Add your API keys (e.g., `GEMINI_API_KEY`).

### Development
Start the development server:
```bash
npm run dev
```

### Build
Build for production:
```bash
npm run build
```

## 📦 Deployment
This project is configured for automated deployment to GitHub Pages via GitHub Actions.

1. Push your changes to the `main` branch.
2. The `Deploy to GitHub Pages` workflow will automatically build and deploy.
3. Ensure "GitHub Pages" is enabled in your repository settings (Settings -> Pages -> Build and deployment -> Source: GitHub Actions).

## 🛠 Tech Stack
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (inferred from components)
- **Icons**: Lucide React
- **AI**: Google GenAI
